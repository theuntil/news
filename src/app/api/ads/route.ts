import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

const CACHE_SECONDS = 300; // 5 dk

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const order = searchParams.get("order"); // "new" | "old"

  const ascending = order === "old"; // old = asc, new = desc

  const { data, error } = await supabaseServer
    .from("reklamlar")
    .select("id, image_path, redirect_url")
    .order("created_at", { ascending })
    .limit(50);

  if (error) {
    return NextResponse.json([], {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json(data ?? [], {
    status: 200,
    headers: {
      "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS * 2}`,
    },
  });
}
