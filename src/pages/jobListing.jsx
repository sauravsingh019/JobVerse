import { useEffect, useState } from "react";
import { useUser } from "@/lib/auth";
import { State } from "country-state-city";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import {
  BriefcaseBusiness,
  Building2,
  Filter,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";

import JobCard from "@/components/job-card";
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

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import { enrichJob } from "@/lib/job-insights";

const WORK_MODES = ["Remote", "Hybrid", "On-site"];
const SENIORITY_LEVELS = ["Intern", "Junior", "Mid", "Senior", "Lead"];
const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Data",
  "Marketing",
  "Sales",
  "Operations",
];

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [workMode, setWorkMode] = useState("all");
  const [seniority, setSeniority] = useState("all");
  const [department, setDepartment] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [onlyOpen, setOnlyOpen] = useState(true);

  const { isLoaded } = useUser();

  const { data: companies, fn: fnCompanies } = useFetch(getCompanies);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search-query");
    setSearchQuery(query || "");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setWorkMode("all");
    setSeniority("all");
    setDepartment("all");
    setSortBy("newest");
    setOnlyOpen(true);
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  const enhancedJobs = jobs?.map((job) => enrichJob(job)) || [];
  const filteredJobs = enhancedJobs
    .filter((job) => (onlyOpen ? job.isOpen : true))
    .filter((job) => (workMode === "all" ? true : job.insights.workMode === workMode))
    .filter((job) => (seniority === "all" ? true : job.insights.seniority === seniority))
    .filter((job) => (department === "all" ? true : job.insights.department === department))
    .sort((a, b) => {
      if (sortBy === "applicants") {
        return (b.applications?.length || 0) - (a.applications?.length || 0);
      }

      if (sortBy === "company") {
        return (a.company?.name || "").localeCompare(b.company?.name || "");
      }

      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const quickStats = [
    {
      label: "Open roles",
      value: enhancedJobs.filter((job) => job.isOpen).length,
      icon: BriefcaseBusiness,
    },
    { label: "Companies", value: companies?.length || 0, icon: Building2 },
    {
      label: "Locations",
      value: new Set(enhancedJobs.map((job) => job.location)).size,
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-white/10 bg-slate-950/75 p-6 backdrop-blur-xl sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles size={14} />
              Industry-grade job discovery
            </div>
            <h1 className="gradient-title text-5xl font-extrabold tracking-tight sm:text-7xl">
              Discover the right role, faster.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Search, shortlist, and filter jobs the way modern candidates expect:
              clear metadata, strong signals, and recruiter-ready detail pages.
            </p>
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                type="text"
                placeholder="Search by title, stack, or keyword"
                name="search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-full border-white/10 bg-white/5 px-6 text-base"
              />
              <Button type="submit" className="h-14 rounded-full px-8" variant="blue">
                Search jobs
              </Button>
            </form>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {quickStats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[28px] border border-white/10 bg-black/20 p-5"
              >
                <div className="mb-3 inline-flex rounded-2xl bg-white/5 p-3 text-cyan-300">
                  <Icon size={18} />
                </div>
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <Filter size={18} />
            Smart Filters
          </div>
          <Button
            className="rounded-full"
            variant="outline"
            onClick={clearFilters}
          >
            <X size={16} className="mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <Select value={location} onValueChange={(value) => setLocation(value)}>
            <SelectTrigger className="border-white/10 bg-black/20">
              <SelectValue placeholder="Filter by location" />
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

          <Select
            value={company_id}
            onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger className="border-white/10 bg-black/20">
              <SelectValue placeholder="Filter by company" />
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

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-white/10 bg-black/20">
              <SelectValue placeholder="Sort jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="applicants">Most applicants</SelectItem>
              <SelectItem value="company">Company name</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={onlyOpen ? "blue" : "outline"}
            className="rounded-xl"
            onClick={() => setOnlyOpen((value) => !value)}
          >
            {onlyOpen ? "Showing open roles" : "Include closed roles"}
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-2 text-sm text-slate-400">Work mode</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={workMode === "all" ? "blue" : "outline"}
                className="rounded-full"
                onClick={() => setWorkMode("all")}
              >
                All
              </Button>
              {WORK_MODES.map((item) => (
                <Button
                  key={item}
                  variant={workMode === item ? "blue" : "outline"}
                  className="rounded-full"
                  onClick={() => setWorkMode(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm text-slate-400">Seniority</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={seniority === "all" ? "blue" : "outline"}
                className="rounded-full"
                onClick={() => setSeniority("all")}
              >
                All
              </Button>
              {SENIORITY_LEVELS.map((item) => (
                <Button
                  key={item}
                  variant={seniority === item ? "blue" : "outline"}
                  className="rounded-full"
                  onClick={() => setSeniority(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm text-slate-400">Department</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={department === "all" ? "blue" : "outline"}
                className="rounded-full"
                onClick={() => setDepartment("all")}
              >
                All
              </Button>
              {DEPARTMENTS.map((item) => (
                <Button
                  key={item}
                  variant={department === item ? "blue" : "outline"}
                  className="rounded-full"
                  onClick={() => setDepartment(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs?.length ? (
            filteredJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div className="col-span-full rounded-[32px] border border-white/10 bg-white/5 p-12 text-center text-slate-300 backdrop-blur-xl">
              No jobs matched the current filters. Try resetting filters or a broader search query.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
