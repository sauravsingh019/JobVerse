import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";
import { buildPortalMeta } from "@/lib/job-insights";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or add a company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
  seniority: z.string().min(1, { message: "Select experience level" }),
  workMode: z.string().min(1, { message: "Select work mode" }),
  department: z.string().min(1, { message: "Select department" }),
  salaryRange: z.string().min(1, { message: "Add salary range" }),
  skills: z.string().min(1, { message: "Add skill keywords" }),
});

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
      seniority: "",
      workMode: "",
      department: "",
      salaryRange: "",
      skills: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    const portalMeta = buildPortalMeta({
      seniority: data.seniority,
      workMode: data.workMode,
      department: data.department,
      salaryRange: data.salaryRange,
      skills: data.skills,
    });

    fnCreateJob({
      title: data.title,
      description: data.description,
      location: data.location,
      company_id: data.company_id,
      requirements: `${data.requirements}${portalMeta}`,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) navigate("/jobs");
  }, [dataCreateJob, navigate]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/onboarding?mode=recruiter" />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="rounded-[36px] border border-white/10 bg-slate-950/75 p-8 backdrop-blur-xl">
          <h1 className="gradient-title pb-4 text-5xl font-extrabold sm:text-7xl">
            Post a premium job
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-300">
            Structure your job with cleaner metadata so candidates can filter it better and
            understand the opportunity faster.
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold">What strong listings include</h2>
          <div className="space-y-3 text-sm leading-7 text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              Clear title and high-signal description focused on responsibilities and outcomes.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              Work mode, salary range, seniority, and skill signals for better matching.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              Requirements written in bullets so candidates can scan quickly.
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 rounded-[36px] border border-white/10 bg-slate-950/75 p-6 backdrop-blur-xl"
      >
        <Input
          placeholder="Job Title"
          className="border-white/10 bg-white/5"
          {...register("title")}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea
          placeholder="Job Description"
          className="min-h-32 border-white/10 bg-white/5"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={String(id)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <AddCompanyDrawer fetchCompanies={fnCompanies} />
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            name="seniority"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Intern">Intern</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="workMode"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {errors.seniority && <p className="text-red-500">{errors.seniority.message}</p>}
        {errors.workMode && <p className="text-red-500">{errors.workMode.message}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-white/10 bg-white/5">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Data">Data</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Input
            placeholder="Salary Range (e.g. 18-24 LPA)"
            className="border-white/10 bg-white/5"
            {...register("salaryRange")}
          />
        </div>
        {errors.department && <p className="text-red-500">{errors.department.message}</p>}
        {errors.salaryRange && <p className="text-red-500">{errors.salaryRange.message}</p>}

        <Input
          placeholder="Top skills (comma separated)"
          className="border-white/10 bg-white/5"
          {...register("skills")}
        />
        {errors.skills && <p className="text-red-500">{errors.skills.message}</p>}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2 rounded-full">
          Publish job
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
