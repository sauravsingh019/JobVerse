import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@/lib/auth";
import {
  BadgeDollarSign,
  Briefcase,
  DoorClosed,
  DoorOpen,
  Layers3,
  MapPinIcon,
  Sparkles,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import { enrichJob } from "@/lib/job-insights";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  const enrichedJob = enrichJob(job);

  return (
    <div className="mt-5 flex flex-col gap-8">
      <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                {enrichedJob.insights.department}
              </span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                {enrichedJob.insights.workMode}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
                {enrichedJob.insights.seniority}
              </span>
            </div>
            <h1 className="gradient-title pb-2 text-4xl font-extrabold sm:text-6xl">
              {enrichedJob?.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              {enrichedJob.insights.summary}
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
            <img
              src={enrichedJob?.company?.logo_url}
              className="h-14 w-14 rounded-2xl bg-white object-contain p-2"
              alt={enrichedJob?.title}
            />
            <div>
              <div className="text-sm text-slate-400">Hiring with</div>
              <div className="text-lg font-semibold text-white">
                {enrichedJob?.company?.name}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <MapPinIcon size={16} />
              Location
            </div>
            <div className="font-semibold text-white">{enrichedJob?.location}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <BadgeDollarSign size={16} />
              Salary range
            </div>
            <div className="font-semibold text-white">{enrichedJob.insights.salaryRange}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Layers3 size={16} />
              Experience
            </div>
            <div className="font-semibold text-white">{enrichedJob.insights.experience}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Briefcase size={16} />
              Applicants
            </div>
            <div className="font-semibold text-white">
              {enrichedJob?.applications?.length} candidates
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
          <Sparkles size={16} />
          {enrichedJob.insights.skills.join(" . ")}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full border-white/10 ${
              job?.isOpen ? "bg-emerald-950/50" : "bg-red-950/40"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-8">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">About the role</h2>
            <p className="text-base leading-8 text-slate-300 sm:text-lg">
              {enrichedJob?.description}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              What we are looking for
            </h2>
            <MDEditor.Markdown
              source={enrichedJob?.requirements}
              className="bg-transparent sm:text-lg"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-xl font-semibold">Why this role stands out</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Strong ownership with high visibility across the hiring team.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Clear skill expectations around {enrichedJob.insights.skills.join(", ")}.
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Built for {enrichedJob.insights.seniority.toLowerCase()} talent in a{" "}
                {enrichedJob.insights.workMode.toLowerCase()} setup.
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-xl font-semibold">Quick snapshot</h3>
            <div className="grid gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Team: {enrichedJob.insights.department}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Work model: {enrichedJob.insights.workMode}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Experience band: {enrichedJob.insights.experience}
              </div>
            </div>
          </div>
        </div>
      </div>
      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-4">
          <h2 className="mb-2 ml-1 text-xl font-bold">Applications</h2>
          {job?.applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobPage;
