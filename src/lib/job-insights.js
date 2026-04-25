const EXPERIENCE_BY_LEVEL = {
  Intern: "0-1 years",
  Junior: "1-3 years",
  Mid: "3-5 years",
  Senior: "5-8 years",
  Lead: "8+ years",
};

const salaryByLevel = {
  Intern: "3-6 LPA",
  Junior: "6-12 LPA",
  Mid: "12-20 LPA",
  Senior: "20-35 LPA",
  Lead: "35+ LPA",
};

const departmentRules = [
  { label: "Engineering", keywords: ["developer", "engineer", "frontend", "backend", "full stack", "mern", "react", "node"] },
  { label: "Design", keywords: ["designer", "ux", "ui", "product design", "visual"] },
  { label: "Product", keywords: ["product manager", "product owner", "growth", "strategy"] },
  { label: "Data", keywords: ["data", "analyst", "machine learning", "ai", "scientist"] },
  { label: "Marketing", keywords: ["marketing", "seo", "brand", "content"] },
  { label: "Sales", keywords: ["sales", "business development", "account executive"] },
  { label: "Operations", keywords: ["operations", "support", "customer success", "hr", "talent"] },
];

const seniorityRules = [
  { label: "Lead", keywords: ["lead", "principal", "head", "director"] },
  { label: "Senior", keywords: ["senior", "sr", "staff"] },
  { label: "Mid", keywords: ["mid", "associate", "specialist"] },
  { label: "Junior", keywords: ["junior", "jr"] },
  { label: "Intern", keywords: ["intern", "trainee", "apprentice"] },
];

const workModeRules = [
  { label: "Remote", keywords: ["remote", "work from home", "distributed"] },
  { label: "Hybrid", keywords: ["hybrid", "flexible"] },
  { label: "On-site", keywords: ["onsite", "on-site", "office"] },
];

const tagRules = [
  { label: "React", keywords: ["react", "next.js", "frontend"] },
  { label: "Node.js", keywords: ["node", "express", "backend"] },
  { label: "MongoDB", keywords: ["mongo", "mongodb"] },
  { label: "Leadership", keywords: ["leadership", "mentor", "stakeholder"] },
  { label: "Analytics", keywords: ["analytics", "sql", "dashboard"] },
  { label: "Product Sense", keywords: ["product", "roadmap", "discovery"] },
];

const PORTAL_META_REGEX = /<!--\s*portal-meta:(.*?)-->/i;

function findLabel(rules, haystack, fallback) {
  const match = rules.find(({ keywords }) =>
    keywords.some((keyword) => haystack.includes(keyword))
  );

  return match?.label || fallback;
}

function parseMetaBlock(text = "") {
  const match = text.match(PORTAL_META_REGEX);
  if (!match?.[1]) return {};

  return match[1]
    .split("|")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, item) => {
      const [key, ...valueParts] = item.split("=");
      if (!key || valueParts.length === 0) return acc;
      acc[key.trim()] = valueParts.join("=").trim();
      return acc;
    }, {});
}

export function buildPortalMeta(meta) {
  const entries = Object.entries(meta)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${String(value).trim()}`);

  return entries.length ? `\n\n<!-- portal-meta:${entries.join(" | ")} -->` : "";
}

export function stripPortalMeta(text = "") {
  return text.replace(PORTAL_META_REGEX, "").trim();
}

export function enrichJob(job) {
  const description = stripPortalMeta(job?.description || "");
  const requirements = stripPortalMeta(job?.requirements || "");
  const sourceText = `${job?.title || ""} ${description} ${requirements}`.toLowerCase();
  const embeddedMeta = {
    ...parseMetaBlock(job?.description),
    ...parseMetaBlock(job?.requirements),
  };

  const seniority =
    embeddedMeta.seniority || findLabel(seniorityRules, sourceText, "Mid");
  const workMode =
    embeddedMeta.workMode || findLabel(workModeRules, sourceText, "On-site");
  const department =
    embeddedMeta.department || findLabel(departmentRules, sourceText, "Engineering");
  const salaryRange = embeddedMeta.salaryRange || salaryByLevel[seniority] || "Competitive";
  const experience = embeddedMeta.experience || EXPERIENCE_BY_LEVEL[seniority] || "3-5 years";
  const skills = embeddedMeta.skills
    ? embeddedMeta.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : tagRules
        .filter(({ keywords }) => keywords.some((keyword) => sourceText.includes(keyword)))
        .map(({ label }) => label)
        .slice(0, 3);

  const summarySentence =
    description.split(".").find((line) => line.trim().length > 20)?.trim() ||
    "High-impact role with strong ownership, speed, and collaboration expectations.";

  return {
    ...job,
    description,
    requirements,
    insights: {
      seniority,
      workMode,
      department,
      salaryRange,
      experience,
      skills: skills.length ? skills : ["Communication", "Execution"],
      summary: `${summarySentence}.`,
      postedLabel: job?.created_at
        ? new Date(job.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : "Recently posted",
    },
  };
}
