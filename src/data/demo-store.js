import companiesData from "./companies.json";

const companies = companiesData.map((company) => ({
  id: company.id,
  name: company.name[0].toUpperCase() + company.name.slice(1),
  logo_url: company.path,
}));

let nextCompanyId = companies.length + 1;
let nextJobId = 100;
let nextApplicationId = 1000;
let nextSavedId = 2000;

let savedJobs = [
  { id: 1, user_id: "demo-user", job_id: 1 },
  { id: 2, user_id: "demo-user", job_id: 3 },
];

let applications = [
  {
    id: 1,
    job_id: 1,
    candidate_id: "demo-user",
    name: "Demo User",
    experience: 3,
    skills: "React, Node.js, MongoDB",
    education: "Graduate",
    status: "interviewing",
    resume: "#",
    created_at: "2026-04-22T09:00:00.000Z",
  },
  {
    id: 2,
    job_id: 7,
    candidate_id: "candidate-2",
    name: "Aisha Khan",
    experience: 5,
    skills: "Product strategy, SQL, Research",
    education: "Post Graduate",
    status: "applied",
    resume: "#",
    created_at: "2026-04-24T07:20:00.000Z",
  },
];

let jobs = [
  {
    id: 1,
    title: "Senior MERN Stack Developer",
    description:
      "Build scalable hiring experiences across candidate discovery, recruiter dashboards, and real-time application workflows. Partner closely with product and design to ship high-ownership features.",
    requirements:
      "- 4+ years with React and Node.js\n- Strong MongoDB and API design skills\n- Experience shipping polished product UI\n\n<!-- portal-meta:seniority=Senior | workMode=Remote | department=Engineering | salaryRange=18-28 LPA | skills=React, Node.js, MongoDB -->",
    location: "Karnataka",
    company_id: 6,
    recruiter_id: "recruiter-1",
    isOpen: true,
    created_at: "2026-04-24T06:30:00.000Z",
  },
  {
    id: 2,
    title: "Product Designer",
    description:
      "Design a sharper end-to-end experience for job search, saved lists, recruiter workflows, and trust signals across the platform.",
    requirements:
      "- Strong UX and visual craft\n- Experience with design systems\n- Ability to work with product teams\n\n<!-- portal-meta:seniority=Mid | workMode=Hybrid | department=Design | salaryRange=12-18 LPA | skills=UX, UI, Design Systems -->",
    location: "Maharashtra",
    company_id: 5,
    recruiter_id: "recruiter-2",
    isOpen: true,
    created_at: "2026-04-23T10:30:00.000Z",
  },
  {
    id: 3,
    title: "Growth Product Manager",
    description:
      "Own activation, retention, and recruiter conversion metrics while driving experimentation across acquisition and onboarding surfaces.",
    requirements:
      "- 3+ years in product management\n- Strong analytics and experimentation\n- Great cross-functional communication\n\n<!-- portal-meta:seniority=Mid | workMode=Hybrid | department=Product | salaryRange=20-30 LPA | skills=Product Sense, Analytics, Stakeholder Management -->",
    location: "Delhi",
    company_id: 2,
    recruiter_id: "recruiter-3",
    isOpen: true,
    created_at: "2026-04-22T14:20:00.000Z",
  },
  {
    id: 4,
    title: "Talent Acquisition Specialist",
    description:
      "Drive full-cycle hiring, candidate quality, and recruiter experience improvements for high-volume roles.",
    requirements:
      "- Recruiting or talent ops experience\n- Strong stakeholder communication\n- Comfortable with dashboards and reporting\n\n<!-- portal-meta:seniority=Junior | workMode=On-site | department=Operations | salaryRange=6-10 LPA | skills=Hiring, Coordination, Reporting -->",
    location: "Telangana",
    company_id: 1,
    recruiter_id: "demo-user",
    isOpen: true,
    created_at: "2026-04-21T11:00:00.000Z",
  },
  {
    id: 5,
    title: "Data Analyst",
    description:
      "Translate product and marketplace trends into clear dashboards, hiring insights, and growth recommendations.",
    requirements:
      "- SQL and BI tools\n- Clear business storytelling\n- Metrics ownership experience\n\n<!-- portal-meta:seniority=Junior | workMode=Remote | department=Data | salaryRange=8-14 LPA | skills=SQL, Analytics, Dashboards -->",
    location: "Tamil Nadu",
    company_id: 4,
    recruiter_id: "recruiter-4",
    isOpen: false,
    created_at: "2026-04-20T15:30:00.000Z",
  },
  {
    id: 6,
    title: "Frontend Engineer",
    description:
      "Craft fast, premium interfaces with thoughtful motion, accessibility, and strong component architecture.",
    requirements:
      "- Advanced React skills\n- Tailwind or design system experience\n- Performance-first mindset\n\n<!-- portal-meta:seniority=Mid | workMode=Remote | department=Engineering | salaryRange=14-22 LPA | skills=React, Tailwind, Accessibility -->",
    location: "Karnataka",
    company_id: 3,
    recruiter_id: "demo-user",
    isOpen: true,
    created_at: "2026-04-24T04:10:00.000Z",
  },
  {
    id: 7,
    title: "Senior Product Manager",
    description:
      "Lead strategy for candidate discovery, recruiter productivity, and high-trust decision flows across the marketplace.",
    requirements:
      "- 5+ years product leadership\n- Strong experimentation and roadmap ownership\n- Great communication with engineering and design\n\n<!-- portal-meta:seniority=Senior | workMode=Hybrid | department=Product | salaryRange=28-40 LPA | skills=Strategy, Roadmaps, Analytics -->",
    location: "Maharashtra",
    company_id: 8,
    recruiter_id: "recruiter-5",
    isOpen: true,
    created_at: "2026-04-24T08:00:00.000Z",
  },
];

const delay = (value) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), 120);
  });

const getCompanyById = (companyId) =>
  companies.find((company) => Number(company.id) === Number(companyId));

const attachRelations = (job, userId = "demo-user") => ({
  ...job,
  company: getCompanyById(job.company_id),
  saved: savedJobs
    .filter(
      (savedJob) =>
        Number(savedJob.job_id) === Number(job.id) && savedJob.user_id === userId
    )
    .map((savedJob) => ({ id: savedJob.id })),
});

export async function demoGetCompanies() {
  return delay([...companies]);
}

export async function demoAddCompany(companyData) {
  const company = {
    id: nextCompanyId++,
    name: companyData.name,
    logo_url: "/logo1.png",
  };
  companies.push(company);
  return delay([company]);
}

export async function demoGetJobs({ location, company_id, searchQuery, user_id = "demo-user" }) {
  let filteredJobs = [...jobs];

  if (location) {
    filteredJobs = filteredJobs.filter((job) => job.location === location);
  }

  if (company_id) {
    filteredJobs = filteredJobs.filter(
      (job) => String(job.company_id) === String(company_id)
    );
  }

  if (searchQuery) {
    const needle = searchQuery.toLowerCase();
    filteredJobs = filteredJobs.filter((job) =>
      `${job.title} ${job.description}`.toLowerCase().includes(needle)
    );
  }

  return delay(filteredJobs.map((job) => attachRelations(job, user_id)));
}

export async function demoGetSavedJobs({ user_id }) {
  return delay(
    savedJobs
      .filter((savedJob) => savedJob.user_id === user_id)
      .map((savedJob) => ({
        ...savedJob,
        job: attachRelations(
          jobs.find((job) => Number(job.id) === Number(savedJob.job_id)),
          user_id
        ),
      }))
  );
}

export async function demoGetSingleJob({ job_id, user_id = "demo-user" }) {
  const job = jobs.find((item) => Number(item.id) === Number(job_id));
  if (!job) return delay(null);

  return delay({
    ...attachRelations(job, user_id),
    applications: applications.filter(
      (application) => Number(application.job_id) === Number(job.id)
    ),
  });
}

export async function demoSaveJob(saveData) {
  const existing = savedJobs.find(
    (savedJob) =>
      Number(savedJob.job_id) === Number(saveData.job_id) &&
      savedJob.user_id === saveData.user_id
  );

  if (existing) {
    savedJobs = savedJobs.filter((savedJob) => savedJob.id !== existing.id);
    return delay([]);
  }

  const newSaved = {
    id: nextSavedId++,
    ...saveData,
  };
  savedJobs.push(newSaved);
  return delay([newSaved]);
}

export async function demoUpdateHiringStatus({ job_id }, isOpen) {
  jobs = jobs.map((job) =>
    Number(job.id) === Number(job_id) ? { ...job, isOpen } : job
  );
  return delay(jobs.filter((job) => Number(job.id) === Number(job_id)));
}

export async function demoGetMyJobs({ recruiter_id, user_id = "demo-user" }) {
  return delay(
    jobs
      .filter((job) => job.recruiter_id === recruiter_id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((job) => attachRelations(job, user_id))
  );
}

export async function demoDeleteJob({ job_id }) {
  const removed = jobs.filter((job) => Number(job.id) === Number(job_id));
  jobs = jobs.filter((job) => Number(job.id) !== Number(job_id));
  savedJobs = savedJobs.filter((savedJob) => Number(savedJob.job_id) !== Number(job_id));
  applications = applications.filter(
    (application) => Number(application.job_id) !== Number(job_id)
  );
  return delay(removed);
}

export async function demoAddNewJob(jobData) {
  const newJob = {
    id: nextJobId++,
    created_at: new Date().toISOString(),
    ...jobData,
  };
  jobs.unshift(newJob);
  return delay([newJob]);
}

export async function demoApplyToJob(jobData) {
  const newApplication = {
    id: nextApplicationId++,
    ...jobData,
    resume: "#",
    created_at: new Date().toISOString(),
  };
  applications.unshift(newApplication);
  return delay([newApplication]);
}

export async function demoUpdateApplicationStatus({ application_id }, status) {
  applications = applications.map((application) =>
    Number(application.id) === Number(application_id)
      ? { ...application, status }
      : application
  );
  return delay(
    applications.filter(
      (application) => Number(application.id) === Number(application_id)
    )
  );
}

export async function demoGetApplications({ user_id }) {
  return delay(
    applications
      .filter((application) => application.candidate_id === user_id)
      .map((application) => {
        const job = jobs.find((item) => Number(item.id) === Number(application.job_id));
        return {
          ...application,
          job: {
            title: job?.title,
            company: {
              name: getCompanyById(job?.company_id)?.name,
            },
          },
        };
      })
  );
}
