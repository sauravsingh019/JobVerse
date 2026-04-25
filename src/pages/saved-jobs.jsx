import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@/lib/auth";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded, user } = useUser();

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
    <div className="space-y-8">
      <section className="rounded-[36px] border border-white/10 bg-slate-950/75 p-8 text-center backdrop-blur-xl">
        <h1 className="gradient-title pb-4 text-6xl font-extrabold sm:text-7xl">
          Saved Jobs
        </h1>
        <p className="mx-auto max-w-2xl text-slate-300">
          Keep a shortlist of roles that look promising and return when you are ready to apply.
        </p>
      </section>

      {loadingSavedJobs === false && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {savedJobs?.length ? (
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={fnSavedJobs}
                  savedInit={true}
                />
              );
            })
          ) : (
            <div className="col-span-full rounded-[32px] border border-white/10 bg-white/5 p-12 text-center text-slate-300 backdrop-blur-xl">
              No saved jobs yet. Tap the heart icon on a role to build your shortlist.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
