"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

/* ----------------------------------
   TYPES
---------------------------------- */
type AdItem = {
  id: string;
  image_path: string | null;
  redirect_url: string | null;
};

/* ----------------------------------
   CONSTANTS
---------------------------------- */
const SUPABASE_PUBLIC_BASE = "https://supabase.kuzeybatihaber.cloud";
const FALLBACK_IMAGE = "/1.jpg";

/* ----------------------------------
   SAFE URL BUILDER
---------------------------------- */
function buildPublicUrl(path?: string | null) {
  if (!path || typeof path !== "string") return FALLBACK_IMAGE;

  const clean = path
    .replace(/^\/+/, "")
    .replace(/^reklamlar\//, "");

  if (!clean) return FALLBACK_IMAGE;

  return `${SUPABASE_PUBLIC_BASE}/storage/v1/object/public/reklamlar/${clean}`;
}

/* ----------------------------------
   KEYFRAMES
---------------------------------- */
function injectKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById("ads-vertical-keyframes")) return;

  const style = document.createElement("style");
  style.id = "ads-vertical-keyframes";
  style.innerHTML = `
    @keyframes ads-vertical {
      from { transform: translateY(0); }
      to   { transform: translateY(-50%); }
    }
  `;
  document.head.appendChild(style);
}

/* ----------------------------------
   COMPONENT
---------------------------------- */
export default function AdsSidebarMarquee({
  order,
}: {
  order: "new" | "old";
}) {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    injectKeyframes();

    fetch(`/api/ads?order=${order}`, { cache: "force-cache" })
      .then((r) => r.json())
      .then((d) => setAds(Array.isArray(d) ? d : []))
      .catch(() => setAds([]));
  }, [order]);

  const loopAds = useMemo(() => {
    if (ads.length === 0) return [];
    return [...ads, ...ads];
  }, [ads]);

  if (loopAds.length === 0) return null;

  return (
    <div
      className="hidden lg:block relative overflow-hidden"
      style={{ height: 600 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          animation: "ads-vertical 35s linear infinite",
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {loopAds.map((ad, i) => {
          if (!ad?.redirect_url) return null;

          return (
            <a
              key={`${ad.id}-${i}`}
              href={ad.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4"
            >
              <div className="relative w-full h-[140px] rounded-xl overflow-hidden bg-gray-200">
                <Image
                  src={buildPublicUrl(ad.image_path)}
                  alt="Reklam"
                  fill
                  sizes="210px"
                  className="object-cover"
                />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
