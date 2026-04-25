import CreatedApplications from "@/components/created-applications";
import CandidateSavedJobs from "@/components/candidate-saved-jobs";
import CreatedJobs from "@/components/created-jobs";
import { useUser } from "@/lib/auth";
import { BarLoader } from "react-spinners";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-white/10 bg-slate-950/75 p-8 text-center backdrop-blur-xl">
        <h1 className="gradient-title pb-4 text-5xl font-extrabold sm:text-7xl">
          {user?.unsafeMetadata?.role === "candidate"
            ? "My Applications"
            : "My Workspace"}
        </h1>
        <p className="mx-auto max-w-2xl text-slate-300">
          {user?.unsafeMetadata?.role === "candidate"
            ? "Track every application, status update, and next step from one dashboard."
            : "Review posted jobs, saved roles, and application activity from one place."}
        </p>
      </section>
      <div className="space-y-10">
        {user?.unsafeMetadata?.role !== "candidate" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white">Posted Jobs</h2>
              <p className="mt-2 text-sm text-slate-400">
                Manage the roles you created and review hiring activity.
              </p>
            </div>
            <CreatedJobs />
          </section>
        )}
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-white">Applied Jobs</h2>
            <p className="mt-2 text-sm text-slate-400">
              Track every application, status update, and interview pipeline.
            </p>
          </div>
          <CreatedApplications />
        </section>
        <CandidateSavedJobs />
      </div>
    </div>
  );
};

export default MyJobs;
