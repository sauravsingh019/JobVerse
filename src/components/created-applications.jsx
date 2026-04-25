import { useUser } from "@/lib/auth";
import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    if (user?.id) {
      fnApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (!applications?.length) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-slate-300 backdrop-blur-xl">
        You have not applied anywhere yet. Start exploring jobs and build your pipeline.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications;
