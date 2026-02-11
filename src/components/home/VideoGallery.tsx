"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import VideoCard from "./VideoCard";

type Props = {
  items: any[];
  lang: "tr" | "en";
};

export default function VideoGallery({ items, lang }: Props) {
  const videoItems = items?.filter((i) => i.video_url);
  if (!videoItems || videoItems.length === 0) return null;

  const rowRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: "l" | "r") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: dir === "l" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="p-10 rounded-3xl bg-black">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white text-xl font-bold">Video Haberler</h2>

        <div className="flex gap-2">
          <button onClick={() => scroll("l")} className="bg-white/10 p-2 rounded-full text-white">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("r")} className="bg-white/10 p-2 rounded-full text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div ref={rowRef} className="flex gap-4 overflow-x-auto">
        {videoItems.map((item) => (
          <VideoCard key={item.id} item={item} lang={lang} />
        ))}
      </div>
    </section>
  );
}
