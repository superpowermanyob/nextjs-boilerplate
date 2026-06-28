"use client";

import { Castle, ShieldHalf, Swords, Timer } from "lucide-react";

import { useI18n } from "@/components/I18nProvider";
import type { RankingType } from "@/lib/ranking-types";

type RankingTabBarProps = {
  activeTab: RankingType;
  onTabChange: (tab: RankingType) => void;
};

export function RankingTabBar({ activeTab, onTabChange }: RankingTabBarProps) {
  const { t } = useI18n();

  const tabs: {
    id: RankingType;
    emoji: string;
    icon: typeof Castle;
    label: string;
  }[] = [
    { id: "highestFloor", emoji: "🏰", icon: Castle, label: t.tabs.highestFloor },
    { id: "weeklyFocus", emoji: "⏱️", icon: Timer, label: t.tabs.weeklyFocus },
    { id: "combatPower", emoji: "⚔️", icon: Swords, label: t.tabs.combatPower },
    { id: "guild", emoji: "🛡️", icon: ShieldHalf, label: t.tabs.guild },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
      {tabs.map((tab) => {
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
