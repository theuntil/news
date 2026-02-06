"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

import { CATEGORY_MAP, CategoryKey } from "@/lib/categories";

const STORAGE_BASE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";

type VideoItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en: string | null;
  image_url: string | null;
  video_url: string | null;
  category: string;
};

function resolveMedia(src: string | null) {
  if (!src) return null;
  let s = src.trim();
  if (s.startsWith("https:/") && !s.startsWith("https://")) {
    s = s.replace(/^https:\//, "https://");
  }
  if (s.startsWith("http")) return s;
  return STORAGE_BASE + s.replace(/^\/+/, "");
}

function normTR(s: string) {
  return s.trim().toLocaleLowerCase("tr-TR");
}

function findCategoryKey(cat: string): CategoryKey | null {
  const keys = Object.keys(CATEGORY_MAP) as CategoryKey[];
  for (const k of keys) {
    if (normTR(CATEGORY_MAP[k].label_tr) === normTR(cat)) return k;
  }
  return null;
}

function buildHref(item: VideoItem, lang: "tr" | "en") {
  const key = findCategoryKey(item.category);

  // ❗ asla "#" dönme
  if (!key) {
    return lang === "en"
      ? `/en/haber/${item.slug}`
      : `/haber/${item.slug}`;
  }

  return lang === "en"
    ? `/en/${CATEGORY_MAP[key].en}/${item.slug}`
    : `/${CATEGORY_MAP[key].tr}/${item.slug}`;
}

export default function VideoCard({
  item,
  lang,
}: {
  item: VideoItem;
  lang: "tr" | "en";
}) {
  const img = resolveMedia(item.image_url);
  const vid = resolveMedia(item.video_url);

  const title =
    lang === "en"
      ? item.title_en ?? item.title_ai ?? item.title
      : item.title_ai ?? item.title;

  return (
    <Link href={buildHref(item, lang)} className="min-w-[260px] block">
      <div className="relative h-[170px] rounded-2xl overflow-hidden border border-white/10 bg-black">

        {/* 🔑 IMAGE VARSA */}
        {img && (
          <Image
            src={img}
            alt={title}
            fill
            sizes="260px"
            className="object-cover"
          />
        )}

        {/* 🔑 SADECE VIDEO VARSA → ARKAPLAN GİBİ OYNAR */}
        {!img && vid && (
          <video
            src={vid}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-red-600/90 p-3 rounded-full">
            <Play className="text-white" size={22} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[56px] p-3 text-white text-sm font-semibold flex items-end">
          <p className="leading-tight line-clamp-2">{title}</p>
        </div>
      </div>
    </Link>
  );
}
