"use client";

import { useEffect, useRef, useState } from "react";
import { useAutoPageView } from "@/lib/analytics/useAutoPageView";

import CategoryFeedCard from "./FeedCard";
import CategoryFeedSkeleton from "./FeedCardSkeleton";

import AdsSidebarMarquee from "@/components/ads/AdsSidebarMarquee";

import { CategoryKey, CATEGORY_MAP } from "@/lib/categories";
import { useChildModeStore } from "@/store/childModeStore";
import { useToast } from "@/components/ui/ToastProvider";

/* ---------------- TYPES ---------------- */

export type FeedItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  image_url: string | null;
  category: string;
  published_at: string | null;
  created_at?: string | null;
  is_child_safe: boolean;
};

/* ---------------- COMPONENT ---------------- */

export default function CategoryFeed({
  categoryKey,
  initialItems,
}: {
  categoryKey: CategoryKey;
  initialItems: FeedItem[];
}) {
  // 👇 KATEGORİ SAYFASI VIEW (STATIC)
  useAutoPageView();

  /* ================= STATE ================= */
  const [items, setItems] = useState(initialItems);
  const [offset, setOffset] = useState(initialItems.length);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);

  const childModeEnabled = useChildModeStore((s) => s.enabled);
  const { show } = useToast();

  /* ================= OBSERVER ================= */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldLoad(true);
      },
      { rootMargin: "1400px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!shouldLoad || !hasMore || lockRef.current) return;

    lockRef.current = true;
    setLoading(true);

    fetch(`/api/category-feed?key=${categoryKey}&offset=${offset}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data: FeedItem[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setHasMore(false);
          return;
        }

        setItems((prev) => [...prev, ...data]);
        setOffset((prev) => prev + data.length);
      })
      .finally(() => {
        lockRef.current = false;
        setLoading(false);
        setShouldLoad(false);
      });
  }, [shouldLoad, hasMore, offset, categoryKey]);

  function handleBlocked() {
    show("Bu içeriği görmek için çocuk modunu kapatın", "error");
  }

  /* ================= RENDER ================= */
  return (
    <main className="mx-auto w-full max-w-7xl lg:max-w-[100vw] py-3">

      {/* ===== DESKTOP: 3 KOLON | MOBİL: TEK KOLON ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_180px] gap-6">

        {/* ================= SOL REKLAM (DESKTOP) ================= */}
        <aside className="hidden lg:block w-[180px] shrink-0">
          <div className="sticky top-24">
            <AdsSidebarMarquee order="new" />
          </div>
        </aside>

        {/* ================= ANA İÇERİK ================= */}
        <section className="flex flex-col gap-6 min-w-0">

          <h1 className="text-[26px] md:text-[30px] font-extrabold tracking-tight text-black">
            {CATEGORY_MAP[categoryKey].label_tr}
          </h1>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
            {items.map((item, i) => (
              <CategoryFeedCard
                key={`${item.id}-${item.slug}-${i}`}
                item={item}
                categoryKey={categoryKey}
                blocked={childModeEnabled && item.is_child_safe === false}
                onBlocked={handleBlocked}
              />
            ))}

            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <CategoryFeedSkeleton key={`sk-${i}`} />
              ))}
          </div>

          <div ref={sentinelRef} className="h-24" />
        </section>

        {/* ================= SAĞ REKLAM (DESKTOP) ================= */}
        <aside className="hidden lg:block w-[180px] shrink-0">
          <div className="sticky top-24">
            <AdsSidebarMarquee order="old" />
          </div>
        </aside>

      </div>
    </main>
  );
}
