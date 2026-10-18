import { isSupabaseConfigured } from "@/lib/supabase/config";

export const USE_MOCK_DATA =
  !isSupabaseConfigured() ||
  process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";
