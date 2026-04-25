import { getSavedJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@/lib/auth";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";

const CandidateSavedJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs, {
    user_id: user?.id,
  });

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Saved Jobs</h2>
        <p className="mt-2 text-sm text-slate-400">
          Roles you shortlisted for later review.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {savedJobs?.length ? (
          savedJobs.map((saved) => (
            <JobCard
              key={saved.id}
              job={saved.job}
              onJobAction={fnSavedJobs}
              savedInit={true}
            />
          ))
        ) : (
          <div className="col-span-full rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-slate-300 backdrop-blur-xl">
            No saved jobs yet. Save roles from Explore Jobs and they will appear here.
          </div>
        )}
      </div>
    </section>
  );
};

export default CandidateSavedJobs;
