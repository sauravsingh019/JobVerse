import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@/lib/auth";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";
import { useEffect } from "react";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    if (user?.id) {
      fnCreatedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div>
      {loadingCreatedJobs ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobAction={fnCreatedJobs}
                  isMyJob
                />
              );
            })
          ) : (
            <div className="col-span-full rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-slate-300 backdrop-blur-xl">
              No roles posted yet. Publish your first opportunity and start attracting candidates.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
