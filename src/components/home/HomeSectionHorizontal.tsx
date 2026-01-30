"use client";

import FeedCard from "./FeedCard";
import { FeedItem } from "./HomePageClient";

type Props = {
  title: string;
  items: FeedItem[];   // 🔥 artık zorunlu
  lang: "tr" | "en";
};

export default function HomeSectionHorizontal({
  title,
  items,
  lang,
}: Props) {
  // veri yoksa section'ı hiç çizme
  if (!items || items.length === 0) return null;

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-[24px] md:text-[28px] font-extrabold">
        {title}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <div key={item.id} className="min-w-[260px]">
            <FeedCard item={item} lang={lang} />
          </div>
        ))}
      </div>
    </section>
  );
}
