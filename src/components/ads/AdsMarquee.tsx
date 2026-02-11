"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { AdItem } from "./types";

const SUPABASE_PUBLIC_BASE = "https://supabase.kuzeybatihaber.cloud";
const FALLBACK_IMAGE = "/1.jpg";

/* ----------------------------------
   SAFE URL BUILDER (ASLA PATLAMAZ)
---------------------------------- */
function buildPublicUrl(path?: string | null) {
  if (!path || typeof path !== "string") return FALLBACK_IMAGE;

  const clean = path
    .replace(/^\/+/, "")
    .replace(/^reklamlar\//, "");

  if (!clean) return FALLBACK_IMAGE;

  return `${SUPABASE_PUBLIC_BASE}/storage/v1/object/public/reklamlar/${clean}`;
}

/* ---------- KEYFRAMES (ONCE, SAFE) ---------- */
function injectKeyframes() {
  if (typeof document === "undefined") return;
  if (document.getElementById("ads-keyframes")) return;

  const style = document.createElement("style");
  style.id = "ads-keyframes";
  style.innerHTML = `
    @keyframes ads-marquee {
      from { transform: translate(0, -50%); }
      to   { transform: translate(-50%, -50%); }
    }
    @keyframes skeleton {
      from { background-position: 200% 0; }
      to   { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

export default function AdsMarquee() {
  const [ads, setAds] = useState<AdItem[] | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    injectKeyframes();

    fetch("/api/ads", { cache: "force-cache" })
      .then((r) => r.json())
      .then((d) => setAds(Array.isArray(d) ? d : []))
      .catch(() => setAds([]));
  }, []);

  const loopAds = useMemo(() => {
    if (!ads || ads.length === 0) return [];
    return [...ads, ...ads];
  }, [ads]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 90,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ---------- SKELETON ---------- */}
      {ads === null && (
        <div style={{ display: "flex", gap: 16, paddingLeft: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 180,
                height: 85,
                borderRadius: 12,
                background:
                  "linear-gradient(90deg,#e5e7eb,#f3f4f6,#e5e7eb)",
                backgroundSize: "200% 100%",
                animation: "skeleton 1.4s ease infinite",
              }}
            />
          ))}
        </div>
      )}

      {/* ---------- ADS ---------- */}
      {loopAds.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            display: "flex",
            transform: "translateY(-50%)",
            animation: "ads-marquee 45s linear infinite",
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
                style={{
                  margin: "0 16px",
                  flexShrink: 0,
                  display: "block",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 180,
                    height: 85,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "#e5e7eb",
                  }}
                >
                  <Image
                    src={buildPublicUrl(ad.image_path)}
                    alt="Reklam"
                    fill
                    sizes="180px"
                    priority={i < 4}
                    className="object-cover"
                  />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
