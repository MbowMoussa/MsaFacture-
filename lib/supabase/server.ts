import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/['"]/g, "");
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim().replace(/['"]/g, "");

  const validUrl = url.startsWith("http://") || url.startsWith("https://") 
    ? url 
    : "https://pdhwphcwqdoldhsayvzk.supabase.co";

  const validKey = key.length > 10 
    ? key 
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkaHdwaGN3cWRvbGRoc2F5dnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MDE4NjksImV4cCI6MjEwMjI3Nzg2OX0.EcJQef1osLCYeK7OWrhA97QoQWEMBx39Ih0j9w43iLE";

  return createServerClient(
    validUrl,
    validKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Appelé depuis un Server Component (lecture seule)
          }
        },
      },
    }
  );
}
