"use client";

import {
  Castle,
  ShieldHalf,
  Swords,
  Timer,
} from "lucide-react";

import type { RankingType } from "@/lib/ranking-types";

export type RankingTab = {
  id: RankingType;
  label: string;
  emoji: string;
  icon: typeof Castle;
  metricLabel: string;
};

export const RANKING_TABS: RankingTab[] = [
  {
    id: "highestFloor",
    label: "탑 최고층 랭킹",
    emoji: "🏰",
    icon: Castle,
    metricLabel: "최고층",
  },
  {
    id: "weeklyFocus",
    label: "주간 집중 랭킹",
    emoji: "⏱️",
    icon: Timer,
    metricLabel: "집중 시간",
  },
  {
    id: "combatPower",
    label: "종합 전투력 랭킹",
    emoji: "⚔️",
    icon: Swords,
    metricLabel: "전투력",
  },
  {
    id: "guild",
    label: "길드 명예의 전당",
    emoji: "🛡️",
    icon: ShieldHalf,
    metricLabel: "길드",
  },
];

type RankingTabBarProps = {
  activeTab: RankingType;
  onTabChange: (tab: RankingType) => void;
};

export function RankingTabBar({ activeTab, onTabChange }: RankingTabBarProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
      {RANKING_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-300 sm:flex-none sm:px-5 ${
              isActive
                ? "border-[#5383e8] bg-[#5383e8]/15 text-white shadow-[0_0_20px_rgba(83,131,232,0.2)]"
                : "border-[#3d3d4a] bg-[#282830] text-[#9aa0ae] hover:border-[#5383e8]/40 hover:text-white"
            }`}
          >
            <span>{tab.emoji}</span>
            <Icon className="hidden h-4 w-4 sm:block" />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
