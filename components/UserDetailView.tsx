"use client";

import Link from "next/link";
import {
  Award,
  BarChart3,
  ChevronLeft,
  Crown,
  GitBranch,
  Shield,
  Sparkles,
  Swords,
} from "lucide-react";

import { useI18n } from "@/components/I18nProvider";
import {
  extractEquipment,
  extractTitles,
  formatEquipmentOption,
  getLocalizedPrefixName,
  formatRarity,
  getEquipmentSlotLabel,
  getLocalizedEquipmentName,
  getRarityColorClass,
  pickNumber,
  pickString,
  type PublicProfile,
} from "@/lib/profile-utils";

type UserDetailViewProps = {
  profile: PublicProfile;
};

function SectionPlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof BarChart3;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#3d3d4a] bg-[#1c1c1f]/60 p-6">
      <div className="mb-3 flex items-center gap-2 text-[#5383e8]">
        <Icon className="h-5 w-5" />
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-[#9aa0ae]">{description}</p>
      <div className="mt-4 h-32 rounded-xl bg-[#282830]/80" />
    </div>
  );
}

export function UserDetailView({ profile }: UserDetailViewProps) {
  const { t, formatNumber, locale } = useI18n();

  const level = pickNumber(profile, ["level", "lv", "playerLevel"]);
  const combatPower = pickNumber(profile, ["combatPower", "power", "totalPower"]);
  const highestFloor = pickNumber(profile, ["highestFloor", "maxFloor", "bestFloor"]);
  const guildName = pickString(profile, ["guildName"], "");
  const equipment = extractEquipment(profile);
  const { activeTitle, ownedTitles } = extractTitles(profile);

  const stats = [
    { label: t.common.level, value: formatNumber(level ?? 0), icon: Sparkles },
    { label: t.common.combatPower, value: formatNumber(Math.round(combatPower ?? 0)), icon: Swords },
    {
      label: t.common.highestFloor,
      value:
        highestFloor !== null
          ? `${formatNumber(highestFloor)}${t.common.floorUnit}`
          : "—",
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen bg-[#1c1c1f] font-sans text-[#cdd2dc]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(83,131,232,0.12),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(139,92,246,0.08),transparent_35%)]" />

      <main className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#9aa0ae] transition hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.user.backToRanking}
        </Link>

        <section className="overflow-hidden rounded-2xl border border-[#3d3d4a] bg-[#282830] shadow-2xl shadow-black/40">
          <div className="relative border-b border-[#3d3d4a] bg-gradient-to-r from-[#1a2744] via-[#282830] to-[#1f2937] px-5 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(83,131,232,0.2),transparent_55%)]" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#5383e8]/40 bg-[#1c1c1f]">
                  <Crown className="h-8 w-8 text-[#5383e8]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5383e8]">
                    {t.common.playerProfile}
                  </p>
                  <h1 className="text-3xl font-bold text-white sm:text-4xl">
                    {profile.nickname}
                  </h1>
                  {guildName !== "—" && (
                    <p className="mt-1 text-sm text-[#9aa0ae]">
                      {t.user.guildPrefix} · {guildName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:p-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[#3d3d4a] bg-[#1c1c1f] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-[#9aa0ae]">{stat.label}</span>
                  <stat.icon className="h-4 w-4 text-[#5383e8]" />
                </div>
                <p className="text-2xl font-bold tabular-nums text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[#5383e8]/30 bg-gradient-to-br from-[#1a2744]/80 via-[#282830] to-[#282830] p-5 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-6 w-6 text-[#f5c451]" />
            <h2 className="text-xl font-bold text-white">{t.user.honorTitle}</h2>
          </div>

          <div className="rounded-xl border border-[#f5c451]/40 bg-[#f5c451]/10 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-[#f5c451]">
              {t.user.equippedTitle}
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              {activeTitle || t.user.noTitle}
            </p>
          </div>

          {ownedTitles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {ownedTitles.map((title) => (
                <span
                  key={title}
                  className="rounded-full border border-[#3d3d4a] bg-[#1c1c1f] px-3 py-1.5 text-sm text-[#cdd2dc]"
                >
                  {title}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-white">{t.user.equipment}</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {equipment.map((item) => {
              const slotLabel = getEquipmentSlotLabel(item.slotKey, t.equipment);
              const localizedName = getLocalizedEquipmentName(item, locale);
              const displayName =
                item.empty || !localizedName ? t.equipment.unequipped : localizedName;
              const subOptions = item.options.map((option) =>
                formatEquipmentOption(option, t.stats, locale),
              );

              return (
                <article
                  key={item.slotKey}
                  className={`rounded-2xl border bg-[#282830] p-5 ${
                    item.empty
                      ? "border-[#3d3d4a] opacity-70"
                      : `border-[#3d3d4a] ${getRarityColorClass(item.rarity).split(" ")[0]}`
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#5383e8]">
                        {slotLabel}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-white">{displayName}</h3>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#3d3d4a] bg-[#1c1c1f] text-[#5383e8]">
                      <Swords className="h-4 w-4" />
                    </div>
                  </div>

                  {!item.empty && (
                    <>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {item.rarity && (
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getRarityColorClass(item.rarity)}`}
                          >
                            {formatRarity(item.rarity, t.rarity)}
                          </span>
                        )}
                        <span className="rounded-full border border-[#3d3d4a] bg-[#1c1c1f] px-2.5 py-1 text-xs text-[#cdd2dc]">
                          +{item.enhancementLevel} {t.common.enhance}
                        </span>
                      </div>

                      {item.prefixes.length > 0 && (
                        <div className="mb-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9aa0ae]">
                            {t.user.prefix}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.prefixes.map((prefix) => (
                              <span
                                key={prefix}
                                className="rounded-lg border border-[#5383e8]/30 bg-[#5383e8]/10 px-2.5 py-1 text-sm font-medium text-[#9eb8ff]"
                              >
                                {getLocalizedPrefixName(prefix, locale)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#9aa0ae]">
                          {t.user.subOption}
                        </p>
                        {subOptions.length > 0 ? (
                          <ul className="space-y-2">
                            {subOptions.map((option, index) => (
                              <li
                                key={`${item.slotKey}-${index}`}
                                className="rounded-lg border border-[#3d3d4a] bg-[#1c1c1f] px-3 py-2 text-sm text-[#cdd2dc]"
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-[#6b7280]">{t.user.noSubOption}</p>
                        )}
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SectionPlaceholder
            title={t.user.historyTitle}
            description={t.user.historyDescription}
            icon={BarChart3}
          />
          <SectionPlaceholder
            title={t.user.skillTitle}
            description={t.user.skillDescription}
            icon={GitBranch}
          />
        </section>
      </main>
    </div>
  );
}
