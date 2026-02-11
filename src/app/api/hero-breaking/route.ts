import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/server/supabase";

const LIMIT = 10;

export async function GET() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("haberler")
    .select(
      `
      id,
      slug,
      title,
      title_ai,
      title_en,
      image_url,
      category,
      published_at,
      is_child_safe
      `
    )
    // 🔑 SADECE GÖRSELLİ HABERLER
    .not("image_url", "is", null)
    // 🔑 EN YENİLER
    .order("published_at", { ascending: false })
    .limit(LIMIT);

  if (error) {
    console.error("hero-breaking api error:", error);
    // UI kilitlenmesin
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(data ?? []);
}
