/* eslint-disable react/prop-types */
import {
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  CircleDashed,
  Download,
  School,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      application_id: application.id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status);
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="text-xl font-semibold">
              {isCandidate
                ? `${application?.job?.title} at ${application?.job?.company?.name}`
                : application?.name}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <CalendarDays size={14} />
                {new Date(application?.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 capitalize">
                <CircleDashed size={14} />
                {application.status}
              </span>
            </div>
          </div>
          <Download
            size={18}
            className="cursor-pointer rounded-full bg-white p-2 text-black"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
          <BriefcaseBusiness size={15} />
          {application?.experience} years of experience
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
          <School size={15} />
          {application?.education}
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200">
          <Boxes size={15} />
          Skills: {application?.skills}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
        {isCandidate ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold capitalize text-emerald-300">
            <BadgeCheck size={16} />
            Status: {application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-full border-white/10 bg-black/20 md:w-56">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
