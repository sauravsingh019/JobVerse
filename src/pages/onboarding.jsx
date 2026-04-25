import { useUser } from "@/lib/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { BriefcaseBusiness, UserRoundSearch } from "lucide-react";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedMode = searchParams.get("mode");
  const forceRoleSelection = requestedMode === "recruiter";

  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  };

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        navigateUser(role);
      })
      .catch((err) => {
        console.error("Error updating role:", err);
      });
  };

  useEffect(() => {
    if (user?.unsafeMetadata?.role && !forceRoleSelection) {
      navigateUser(user.unsafeMetadata.role);
    }
  }, [forceRoleSelection, user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-[40px] border border-white/10 bg-slate-950/80 p-8 backdrop-blur-xl sm:mt-16 sm:p-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="gradient-title text-6xl font-extrabold tracking-tighter sm:text-8xl">
          Choose your path
        </h2>
        <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
          {forceRoleSelection
            ? "Switch to recruiter mode to create and manage job posts."
            : "Select how you want to use the platform. Candidates get discovery and tracking, recruiters get posting and hiring workflows."}
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <button
          type="button"
          className="group rounded-[32px] border border-white/10 bg-white/5 p-8 text-left transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/10"
          onClick={() => handleRoleSelection("candidate")}
        >
          <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-4 text-cyan-300">
            <UserRoundSearch size={28} />
          </div>
          <h3 className="text-3xl font-bold text-white">Candidate</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Discover roles, save the best matches, apply confidently, and track progress in one place.
          </p>
          <div className="mt-6 inline-flex rounded-full bg-blue-500 px-5 py-3 text-sm font-medium text-white">
            Continue as candidate
          </div>
        </button>

        <button
          type="button"
          className="group rounded-[32px] border border-white/10 bg-white/5 p-8 text-left transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-400/10"
          onClick={() => handleRoleSelection("recruiter")}
        >
          <div className="mb-5 inline-flex rounded-2xl bg-emerald-400/10 p-4 text-emerald-300">
            <BriefcaseBusiness size={28} />
          </div>
          <h3 className="text-3xl font-bold text-white">Recruiter</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Post jobs, surface strong applicants, and manage openings with a more premium workflow.
          </p>
          <div className="mt-6 inline-flex rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white">
            Continue as recruiter
          </div>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
