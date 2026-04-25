export const IS_DEMO_AUTH = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const IS_DEMO_DATA =
  import.meta.env.VITE_USE_DEMO_DATA === "true" ||
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY;
