import supabaseClient from "@/utils/supabase";
import { IS_DEMO_DATA } from "@/lib/demo-mode";
import {
  demoAddNewJob,
  demoDeleteJob,
  demoGetJobs,
  demoGetMyJobs,
  demoGetSavedJobs,
  demoGetSingleJob,
  demoSaveJob,
  demoUpdateHiringStatus,
} from "@/data/demo-store";

export async function getJobs(token, { location, company_id, searchQuery }) {
  if (IS_DEMO_DATA) {
    return demoGetJobs({ location, company_id, searchQuery });
  }

  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

export async function getSavedJobs(token, { user_id }) {
  if (IS_DEMO_DATA) {
    return demoGetSavedJobs({ user_id });
  }

  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data?.filter((savedJob) => savedJob.user_id === user_id) || [];
}

export async function getSingleJob(token, { job_id }) {
  if (IS_DEMO_DATA) {
    return demoGetSingleJob({ job_id });
  }

  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url), applications: applications(*)")
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

export async function saveJob(token, _, saveData) {
  if (IS_DEMO_DATA) {
    return demoSaveJob(saveData);
  }

  const supabase = await supabaseClient(token);
  const { data: existingSavedJobs, error: fetchError } = await supabase
    .from("saved_jobs")
    .select("id")
    .eq("job_id", saveData.job_id)
    .eq("user_id", saveData.user_id);

  if (fetchError) {
    console.error("Error checking saved job:", fetchError);
    return null;
  }

  const alreadySaved = existingSavedJobs?.length > 0;

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id)
      .eq("user_id", saveData.user_id)
      .select();

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  }

  const { data, error: insertError } = await supabase
    .from("saved_jobs")
    .insert([saveData])
    .select();

  if (insertError) {
    console.error("Error saving job:", insertError);
    return data;
  }

  return data;
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
  if (IS_DEMO_DATA) {
    return demoUpdateHiringStatus({ job_id }, isOpen);
  }

  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

export async function getMyJobs(token, { recruiter_id }) {
  if (IS_DEMO_DATA) {
    return demoGetMyJobs({ recruiter_id });
  }

  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

export async function deleteJob(token, { job_id }) {
  if (IS_DEMO_DATA) {
    return demoDeleteJob({ job_id });
  }

  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}

export async function addNewJob(token, _, jobData) {
  if (IS_DEMO_DATA) {
    return demoAddNewJob(jobData);
  }

  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}
