import "server-only";
import { createClient } from "@supabase/supabase-js";

let client: any;

export const supabaseServer: any = new Proxy(
  {},
  {
    get(_, prop) {
      if (!client) {
        const url =
          process.env.SUPABASE_URL ||
          process.env.NEXT_PUBLIC_SUPABASE_URL;

        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
          console.error("Supabase ENV CHECK FAILED", {
            SUPABASE_URL: process.env.SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
            HAS_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          });

          throw new Error("Supabase env missing");
        }

        client = createClient(url, key, {
          auth: { persistSession: false },
        });
      }

      return client[prop as keyof typeof client];
    },
  }
);
