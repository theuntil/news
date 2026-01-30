"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type PageType =
  | "home"
  | "category"
  | "city"
  | "news"
  | "search"
  | "static"
  | "utility";

function detectPageType(path: string): PageType {
  if (path.startsWith("/admin")) return "static";
  if (path === "/") return "home";
  if (path.startsWith("/arama")) return "search";

  if (
    path.startsWith("/eczane") ||
    path.startsWith("/namaz") ||
    path.startsWith("/son-depremler") ||
    path.startsWith("/tarihte-bugun") ||
    path.startsWith("/piyasalar") ||
    path.startsWith("/iletisim") ||
    path.startsWith("/kunye") ||
    path.startsWith("/reklam")
    
  ) {
    return "utility";
  }


  const parts = path.split("/").filter(Boolean);

  if (parts.length === 2) return "news";
  if (parts.length === 1) return "category";
  if (parts[0] === "sehir") return "city";

  return "static";
}

export function useAutoPageView(pageId?: string | null) {
  const pathname = usePathname();
  const sentRef = useRef(false);

  useEffect(() => {
    if (!pathname) return;

    /* 🚫 admin */
    if (pathname.startsWith("/admin")) return;

    const page_type = detectPageType(pathname);

    /* ❗ NEWS AMA pageId YOK → BEKLE */
    if (page_type === "news" && !pageId) return;

    if (sentRef.current) return;
    sentRef.current = true;

    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_type,
        page_id: pageId ?? null,
        path: pathname,
      }),
    }).catch(() => {});
  }, [pathname, pageId]);
}
