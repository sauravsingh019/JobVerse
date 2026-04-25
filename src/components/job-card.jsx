/* eslint-disable react/prop-types */
import {
  BriefcaseBusiness,
  Clock3,
  Heart,
  MapPinIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { enrichJob } from "@/lib/job-insights";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const enhancedJob = enrichJob(job);

  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-white/10 bg-slate-950/80 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_25px_80px_rgba(6,182,212,0.18)]">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-300">
              {enhancedJob.insights.department}
            </div>
            <CardTitle className="text-2xl font-semibold leading-tight text-white">
              {enhancedJob.title}
            </CardTitle>
            <div className="text-sm text-slate-300">
              {enhancedJob.company?.name || "Confidential company"}
            </div>
          </div>
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="cursor-pointer text-red-300"
              onClick={handleDeleteJob}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">
            {enhancedJob.insights.seniority}
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">
            {enhancedJob.insights.workMode}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">
            {enhancedJob.insights.salaryRange}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {enhancedJob.company && (
              <img
                src={enhancedJob.company.logo_url}
                className="h-10 w-10 rounded-xl bg-white object-contain p-1"
                alt={enhancedJob.company?.name}
              />
            )}
            <div className="space-y-1 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPinIcon size={15} />
                {enhancedJob.location}
              </div>
              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={15} />
                {enhancedJob.insights.experience}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock3 size={14} />
            {enhancedJob.insights.postedLabel}
          </div>
        </div>
        <p className="line-clamp-3 text-sm leading-7 text-slate-300">
          {enhancedJob.insights.summary}
        </p>
        <div className="flex flex-wrap gap-2">
          {enhancedJob.insights.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t border-white/10 pt-6">
        <Link to={`/job/${enhancedJob.id}`} className="flex-1">
          <Button
            variant="secondary"
            className="w-full rounded-full bg-white/10 text-white hover:bg-white/15"
          >
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-12 rounded-full border-white/10 bg-white/5 hover:bg-white/10"
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
