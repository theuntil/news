import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/server/supabase";

export const runtime = "edge";

const FIELDS = `
  id, slug, title, title_ai, title_en,
  image_url, video_url,
  category, city,
  published_at, is_child_safe
`;

async function pick(col: "category" | "city", value: string) {
  const supabase = getSupabaseServer();

  const { data } = await supabase
    .from("haberler")
    .select(FIELDS)
    .eq(col, value)
    .order("published_at", { ascending: false })
    .limit(6);

  return data ?? [];
}

export async function GET() {
  const supabase = getSupabaseServer();

  const [
    politika,
    spor,
    asayis,
    ekonomi,
    saglik,
    istanbul,
    ankara,
    izmir,
    videos,
  ] = await Promise.all([
    pick("category", "POLİTİKA"),
    pick("category", "SPOR"),
    pick("category", "ASAYİŞ"),
    pick("category", "EKONOMİ"),
    pick("category", "SAĞLIK"),
    pick("city", "İSTANBUL"),
    pick("city", "ANKARA"),
    pick("city", "İZMİR"),
    supabase
      .from("haberler")
      .select(FIELDS)
      .not("video_url", "is", null)
      .neq("video_url", "")
      .order("published_at", { ascending: false })
      .limit(6)
      .then(r => r.data ?? []),
  ]);

  return NextResponse.json(
    {
      politika,
      videos,
      spor,
      asayis,
      ekonomi,
      saglik,
      istanbul,
      ankara,
      izmir,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    }
  );
}
