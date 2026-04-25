import supabaseClient, { supabaseUrl } from "@/utils/supabase";
import { IS_DEMO_DATA } from "@/lib/demo-mode";
import {
  demoApplyToJob,
  demoGetApplications,
  demoUpdateApplicationStatus,
} from "@/data/demo-store";

export async function applyToJob(token, _, jobData) {
  if (IS_DEMO_DATA) {
    return demoApplyToJob(jobData);
  }

  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data;
}

export async function updateApplicationStatus(token, { application_id }, status) {
  if (IS_DEMO_DATA) {
    return demoUpdateApplicationStatus({ application_id }, status);
  }

  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", application_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  if (IS_DEMO_DATA) {
    return demoGetApplications({ user_id });
  }

  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
