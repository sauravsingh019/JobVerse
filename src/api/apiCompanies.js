import supabaseClient, { supabaseUrl } from "@/utils/supabase";
import { IS_DEMO_DATA } from "@/lib/demo-mode";
import { demoAddCompany, demoGetCompanies } from "@/data/demo-store";

export async function getCompanies(token) {
  if (IS_DEMO_DATA) {
    return demoGetCompanies();
  }

  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }

  return data;
}

export async function addNewCompany(token, _, companyData) {
  if (IS_DEMO_DATA) {
    return demoAddCompany(companyData);
  }

  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) throw new Error("Error uploading Company Logo");

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Companys");
  }

  return data;
}
