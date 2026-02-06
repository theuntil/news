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
      
      {/* MOBİL: YATAY (MARKET YOK) */}
      <div className="flex flex-row gap-1 lg:hidden">
        <PrayerTimesBox city={city} />
        <WeatherWidget city={city} />
        {/* Market BURADA YOK */}
      </div>


    </div>
  );
}
