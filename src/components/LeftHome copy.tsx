"use client";

import Market from "@/components/news/Market";
import WeatherWidget from "@/components/news/WeatherBox";
import PrayerTimesBox from "@/components/news/PrayerTimesBox";
import QuickAccessWidget from "./QuickAccessWidget";
import TodayInHistoryMiniWidget from "@/components/TodayInHistoryMiniWidget";

type Props = {
  city: string; 
};

export default function LeftInfoPanel({ city }: Props) {
  return (
    <div className="animate-soft-in">
      


      {/* DESKTOP: DİKEY (HEPSİ VAR) */}
      <div className="hidden lg:block space-y-6">
         <WeatherWidget city={city} />
          <PrayerTimesBox city={city} />

          <QuickAccessWidget />
       
        <Market />
        <TodayInHistoryMiniWidget />
      </div>

    </div>
  );
}
