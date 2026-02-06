"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Euro,
  PoundSterling,
  Coins,
  Landmark,
  JapaneseYen,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/* ---------------- TYPES ---------------- */
type Item = {
  code: string;
  value: number;
  diff: number;
  pct: number;
};

const ORDER = ["USD", "EUR", "GBP", "CHF", "DKK", "JPY"];

/* ---------------- COMPONENT ---------------- */
export default function MarketsWidget() {
  // ✅ TÜM HOOK’LAR COMPONENT İÇİNDE
  const [items, setItems] = useState<Item[] | null>(null);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 🔑 hydration-safe mount flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔑 data fetch
  useEffect(() => {
    let alive = true;

    fetch("/api/markets", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setItems(j?.success ? j.data : []);
        requestAnimationFrame(() => setReady(true));
      })
      .catch(() => {
        if (alive) {
          setItems([]);
          requestAnimationFrame(() => setReady(true));
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      className={`
        w-full
        bg-white
        rounded-2xl
        px-3
        py-3
        shadow-sm
        overflow-hidden
        transition-all
        duration-500
        ${mounted && ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
      `}
    >
      {/* HEADER */}
      <header className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-green-600" />
        <h3 className="text-sm font-semibold">Piyasalar</h3>
      </header>

      {/* CONTENT */}
      {items === null ? (
        <Skeleton />
      ) : items.length === 0 ? (
        <p className="text-xs text-neutral-400">
          Piyasa verisi alınamadı
        </p>
      ) : (
        <div
          className="
            flex
            gap-3
            overflow-x-auto
            scrollbar-none
            sm:grid
            sm:grid-cols-3
            lg:grid-cols-6
            sm:overflow-visible
          "
        >
          {ORDER.map((code) => {
            const item = items.find((i) => i.code === code);
            return item ? (
              <Card key={code} item={item} />
            ) : (
              <EmptyCard key={code} code={code} />
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ---------------- CARD ---------------- */

function Card({ item }: { item: Item }) {
  const up = item.diff >= 0;

  return (
    <div className="min-w-[140px] sm:min-w-0 rounded-xl border border-neutral-100 px-3 py-2 flex flex-col gap-1 bg-white hover:bg-neutral-50 transition">
      <div className="flex items-center gap-1.5 text-xs text-neutral-600">
        <CurrencyIcon code={item.code} />
        <span className="font-medium">{item.code}</span>
      </div>

      <div className="flex items-center justify-between tabular-nums">
        <span className="text-sm font-bold text-neutral-900">
          {item.value.toFixed(2)} ₺
        </span>

        <span
          className={`flex items-center gap-1 text-[11px] ${
            up ? "text-green-600" : "text-red-600"
          }`}
        >
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {item.pct.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

/* ---------------- EMPTY CARD ---------------- */

function EmptyCard({ code }: { code: string }) {
  return (
    <div className="min-w-[140px] sm:min-w-0 rounded-xl border border-neutral-100 px-3 py-2 opacity-40">
      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2">
        <CurrencyIcon code={code} />
        {code}
      </div>
      <div className="h-3 w-20 bg-neutral-200 rounded animate-pulse" />
    </div>
  );
}

/* ---------------- ICON MAP ---------------- */

function CurrencyIcon({ code }: { code: string }) {
  switch (code) {
    case "USD":
      return <DollarSign size={12} />;
    case "EUR":
      return <Euro size={12} />;
    case "GBP":
      return <PoundSterling size={12} />;
    case "CHF":
      return <Landmark size={12} />;
    case "DKK":
      return <Coins size={12} />;
    case "JPY":
      return <JapaneseYen size={12} />;
    default:
      return <Coins size={12} />;
  }
}

/* ---------------- SKELETON ---------------- */

function Skeleton() {
  return (
    <div className="flex gap-3 animate-pulse sm:grid sm:grid-cols-3 lg:grid-cols-6">
      {ORDER.map((c) => (
        <div
          key={c}
          className="min-w-[140px] sm:min-w-0 rounded-xl border border-neutral-100 px-3 py-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded bg-neutral-200" />
            <div className="h-2.5 w-8 bg-neutral-200 rounded" />
          </div>
          <div className="h-3 w-20 bg-neutral-200 rounded" />
        </div>
      ))}
    </div>
  );
}
