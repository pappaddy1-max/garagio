import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Lipsește NEXT_PUBLIC_SUPABASE_URL din .env.local"
    );
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "Lipsește NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY din .env.local"
    );
  }

  return createBrowserClient(
    supabaseUrl,
    supabasePublishableKey
  );
}