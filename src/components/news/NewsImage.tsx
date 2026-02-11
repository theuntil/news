"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play, Images } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

/* ----------------------------------
   SABİTLER
---------------------------------- */
const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";
const PLACEHOLDER =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/images/1.jpg";

/* ----------------------------------
   HELPERS
---------------------------------- */
function resolveMedia(src: string) {
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

/* ----------------------------------
   TYPES
---------------------------------- */
type Props = {
  cover: string | null;
  images?: string[] | null;
  videoUrl?: string | null;
  alt: string;
};

/* ----------------------------------
   COMPONENT
---------------------------------- */
export default function NewsImage({
  cover,
  images,
  videoUrl,
  alt,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [startIndex, setStartIndex] = useState<number | null>(null);

  const swiperRef = useRef<any>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  /* ----------------------------------
     MEDIA
  ---------------------------------- */
  const media = useMemo(() => {
    const list: { type: "image" | "video"; src: string }[] = [];

    if (cover) list.push({ type: "image", src: resolveMedia(cover) });

    images?.forEach((img) =>
      list.push({ type: "image", src: resolveMedia(img) })
    );

    if (videoUrl) {
      list.push({ type: "video", src: resolveMedia(videoUrl) });
    }

    return list;
  }, [cover, images, videoUrl]);

  const hasCoverImage = Boolean(cover);
  const hasImages = Boolean(images && images.length > 0);
  const hasVideoOnly = !hasCoverImage && !hasImages && Boolean(videoUrl);
  const hasGallery = media.length > 1;

  /* ----------------------------------
     KEYBOARD CONTROLS
  ---------------------------------- */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") swiperRef.current?.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* ----------------------------------
     HELPERS
  ---------------------------------- */
  function openGallery() {
    setStartIndex(0);
    setOpen(true);
  }

  function closeGallery() {
    videoRefs.current.forEach((v) => v?.pause());
    setOpen(false);
    setActive(0);
    setStartIndex(null);
  }

  function handleSlideChange(index: number) {
    setActive(index);

    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (media[i]?.type === "video" && i === index) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }

  /* ----------------------------------
     SCROLL LOCK
  ---------------------------------- */
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const scrollY = window.scrollY;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <>
      {/* COVER */}
      <div
        onClick={() => {
          if (hasVideoOnly) {
            const videoIndex = media.findIndex((m) => m.type === "video");
            if (videoIndex !== -1) {
              setStartIndex(videoIndex);
              setOpen(true);
            }
          } else {
            openGallery();
          }
        }}
        className="relative aspect-16/9 rounded-2xl overflow-hidden bg-neutral-100
        cursor-zoom-in group opacity-0 scale-[1.02] animate-fade-in"
      >
        {/* COVER IMAGE */}
        {hasCoverImage && (
          <Image
            src={resolveMedia(cover!)}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* VIDEO ONLY – VIDEO PREVIEW */}
      {hasVideoOnly && (
  <video
    src={resolveMedia(videoUrl!)}
    muted
    autoPlay        // 🔑 KRİTİK
    loop            // 🔑 takılmadan dönsün
    playsInline
    preload="auto"
    className="absolute inset-0 w-full h-full object-cover"
  />
)}


        {/* PLAY ICON OVERLAY */}
        {hasVideoOnly && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 p-5 rounded-full text-white">
              <Play size={36} />
            </div>
          </div>
        )}

        {/* PLACEHOLDER – SADECE HİÇ MEDYA YOKSA */}
        {!hasCoverImage && !hasImages && !videoUrl && (
          <Image src={PLACEHOLDER} alt={alt} fill className="object-cover" />
        )}

        {/* GALERİ HINT */}
        {hasGallery && (
          <div className="absolute bottom-3 left-3 z-10">
            <div className="text-[9px] md:text-xs text-white/90 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">
              Haber galerisini görmek için tıkla
            </div>
          </div>
        )}

        {/* BADGE */}
        {(hasGallery || videoUrl) && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
            <Images size={14} />
            {videoUrl && <Play size={12} />}
            {media.length}
          </div>
        )}
      </div>

      {/* FULLSCREEN */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 z-[110] text-white p-2"
          >
            <X size={28} />
          </button>

          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] text-white p-3"
          >
            <ChevronLeft size={36} />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] text-white p-3"
          >
            <ChevronRight size={36} />
          </button>

          <Swiper
            modules={[Navigation]}
            onSwiper={(s) => {
              swiperRef.current = s;
              if (startIndex !== null) {
                s.slideTo(startIndex, 0);
                setActive(startIndex);
                setStartIndex(null);
              }
            }}
            onSlideChange={(s) => handleSlideChange(s.activeIndex)}
            className="w-full h-full"
          >
            {media.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="w-full h-full flex items-center justify-center">
                  {item.type === "image" ? (
                    <TransformWrapper>
                      <TransformComponent>
                        <Image
                          src={item.src}
                          alt={alt}
                          width={1920}
                          height={1080}
                          className="max-h-screen w-auto object-contain"
                        />
                      </TransformComponent>
                    </TransformWrapper>
                  ) : (
                    <video
                      ref={(el: HTMLVideoElement | null) => {
                        videoRefs.current[i] = el;
                      }}
                      src={item.src}
                      controls
                      playsInline
                      preload="metadata"
                      className="max-h-screen w-auto"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {active + 1} / {media.length}
          </div>
        </div>
      )}
    </>
  );
}
