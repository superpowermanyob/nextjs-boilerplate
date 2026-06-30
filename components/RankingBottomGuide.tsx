"use client";

import Image from "next/image";
import {
  Hammer,
  Timer,
  Trophy,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { useI18n } from "@/components/I18nProvider";
import { gt } from "@/lib/game-guide-messages";
import type { Locale } from "@/lib/i18n/locales";

const RARITIES = [
  { key: "rarityCommon", descKey: "guideRarityCommonDesc", optionCount: 0, color: "#9ca3af" },
  { key: "rarityMagic", descKey: "guideRarityMagicDesc", optionCount: 1, color: "#7dd3fc", growthKey: "guideRarityGrowthMagic" },
  { key: "rarityRare", descKey: "guideRarityRareDesc", optionCount: 2, color: "#d8b4fe", growthKey: "guideRarityGrowthRare" },
  { key: "rarityLegendary", descKey: "guideRarityLegendaryDesc", optionCount: 3, color: "#ffc400", growthKey: "guideRarityGrowthLegendary" },
  { key: "rarityMythic", descKey: "guideRarityMythicDesc", optionCount: 4, color: "#f87171", growthKey: "guideRarityGrowthMythic" },
  { key: "rarityTranscendent", descKey: "guideRarityTranscendentDesc", optionCount: 5, color: "#7f1d1d", growthKey: "guideRarityGrowthTranscendent" },
  { key: "rarityEternal", descKey: "guideRarityEternalDesc", optionCount: 6, color: "#e3e8ee", growthKey: "guideRarityGrowthEternal" },
  { key: "rarityImmortal", descKey: "guideRarityImmortalDesc", optionCount: 7, color: "#ffd700" },
  { key: "rarityAbsolute", descKey: "guideRarityAbsoluteDesc", optionCount: 8, color: "#ffaa00" },
  { key: "rarityPrimal", descKey: "guideRarityPrimalDesc", optionCount: 9, color: "#e8e8ff" },
  { key: "rarityDivine", descKey: "guideRarityDivineDesc", optionCount: 10, color: "#aaddff" },
] as const;

const STATS = [
  { icon: "❤️", statKey: "hp", bodyKey: "guideStatHpBody", color: "#f87171" },
  { icon: "🔥", statKey: "atk", bodyKey: "guideStatAtkBody", color: "#fb923c" },
  { icon: "🛡️", statKey: "def", bodyKey: "guideStatDefBody", color: "#7dd3fc" },
  { icon: "⚡", statKey: "spd", bodyKey: "guideStatSpdBody", color: "#86efac" },
  { icon: "🍀", statKey: "luk", bodyKey: "guideStatLukBody", color: "#d8b4fe" },
  { icon: "🎯", statKey: "focus", bodyKey: "guideStatFocusBody", color: "#67e8f9" },
] as const;

function GuideText({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.split("\n");

  return (
    <div className={`space-y-3 ${className}`}>
      {lines.map((line, lineIndex) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p
            key={lineIndex}
            className="text-[0.9375rem] leading-[1.75] tracking-[0.01em] text-[#b8bec8]"
          >
            {parts.map((part, partIndex) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={partIndex} className="font-semibold text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

function GuideSectionCard({
  icon: Icon,
  emoji,
  title,
  accent,
  children,
}: {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <article
      className="overflow-hidden rounded-2xl border bg-[#1c1c28]"
      style={{ borderColor: `${accent}55` }}
    >
      <header
        className="flex items-start gap-3 border-b px-5 py-4"
        style={{
          borderColor: `${accent}33`,
          background: `linear-gradient(135deg, ${accent}14 0%, transparent 70%)`,
        }}
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          {emoji ? (
            <span className="text-xl leading-none">{emoji}</span>
          ) : Icon ? (
            <Icon className="h-5 w-5" />
          ) : null}
        </div>
        <h3 className="pt-1 text-lg font-bold leading-snug tracking-tight text-white sm:text-xl">
          {title}
        </h3>
      </header>
      <div className="space-y-4 px-5 py-5">{children}</div>
    </article>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-[0.95rem] font-extrabold leading-snug tracking-wide text-white">
      {children}
    </h4>
  );
}

function KeywordLine({
  pre,
  keyword,
  post,
  keywordColor,
}: {
  pre: string;
  keyword: string;
  post: string;
  keywordColor: string;
}) {
  return (
    <p className="text-[0.9375rem] leading-[1.75] tracking-[0.01em] text-[#b8bec8]">
      {pre}
      <span className="font-extrabold" style={{ color: keywordColor }}>
        {keyword}
      </span>
      {post}
    </p>
  );
}

function WarnLine({
  label,
  pre,
  keyword,
  post,
}: {
  label: string;
  pre: string;
  keyword: string;
  post: string;
}) {
  return (
    <p className="text-[0.9375rem] leading-[1.75] tracking-[0.01em] text-[#b8bec8]">
      <span className="font-extrabold text-[#ff7043]">{label}</span>
      {pre}
      <span className="font-extrabold text-red-300">{keyword}</span>
      {post}
    </p>
  );
}

function RankingBottomGuideContent({ locale }: { locale: Locale }) {
  const t = (key: string, params?: Record<string, string | number>) =>
    gt(locale, key, params);

  return (
    <section
      id="game-guide"
      aria-labelledby="game-guide-heading"
      className="mt-16 border-t border-[#3d3d4a]/80 pt-12"
    >
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#5383e8]/30 shadow-[0_12px_40px_rgba(83,131,232,0.15)]">
        <div className="relative aspect-[21/9] min-h-[140px] w-full sm:aspect-[2.4/1]">
          <Image
            src="/og-image.webp"
            alt="Focus RPG"
            fill
            priority={false}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#4a148c]/50 via-transparent to-[#1a237e]/40" />
        </div>
        <div className="relative -mt-16 px-5 pb-6 sm:-mt-20 sm:px-8 sm:pb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-300/35 bg-[#2d1b4e]/90 text-2xl shadow-lg backdrop-blur-sm">
              📖
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#9eb8ff]">
                Official Wiki
              </p>
              <h2
                id="game-guide-heading"
                className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
              >
                {t("guideAppBarTitle")}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed tracking-wide text-[#cdd2dc]/90 sm:text-base">
                {t("guideWelcome")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <GuideSectionCard emoji="💎" title={t("guideSecDailyGemsTitle")} accent="#67e8f9">
          <GuideText text={t("guideDailyGemsBullet1")} />
          <GuideText text={t("guideDailyGemsBullet2")} />
        </GuideSectionCard>

        <GuideSectionCard emoji="✨" title={t("guideSecRarityTitle")} accent="#ffc400">
          <GuideText text={t("guideSecRarityIntro")} />
          <div className="space-y-3 pt-2">
            {RARITIES.map((rarity) => (
              <div
                key={rarity.key}
                className="rounded-xl border bg-white/[0.03] p-4"
                style={{ borderColor: `${rarity.color}66` }}
              >
                <div className="flex gap-3">
                  <div
                    className="w-1 shrink-0 rounded-full"
                    style={{
                      backgroundColor: rarity.color,
                      boxShadow: `0 0 12px ${rarity.color}66`,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold" style={{ color: rarity.color }}>
                      {t(rarity.key)}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-[#9aa0ae]">
                      {t("helpRarityOptionSlots", { count: rarity.optionCount })}
                    </p>
                    {"growthKey" in rarity && rarity.growthKey && (
                      <span
                        className="mt-2 inline-block rounded-full border px-3 py-1 text-xs font-extrabold"
                        style={{
                          color: rarity.color,
                          borderColor: `${rarity.color}88`,
                          backgroundColor: `${rarity.color}22`,
                        }}
                      >
                        {t(rarity.growthKey)}
                      </span>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-[#b8bec8]">
                      {t(rarity.descKey)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GuideSectionCard>

        <GuideSectionCard emoji="📚" title={t("guideSecCollectionTitle")} accent="#ffd54f">
          <GuideText text={t("guideCollectionIntro")} />
          <div className="rounded-xl border border-[#ffd54f]/30 bg-[#ffd54f]/5 p-4">
            <SubHeading>{t("guide_collection_title")}</SubHeading>
            <GuideText text={t("guide_collection_content")} className="mt-2" />
          </div>
          <GuideText text={t("guideCollectionSlotsHeading")} />
          <GuideText text={t("guideCollectionSlotsBody")} />
          <GuideText text={t("guideCollectionBonusHeading")} />
          <GuideText text={t("guideCollectionBonusBody")} />
          <GuideText text={t("guide_collection_detail_body")} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#ffd54f]/40 bg-white/[0.03] p-4">
              <span className="inline-block rounded-md bg-red-500/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                {t("collection_set_completed_stamp")}
              </span>
              <SubHeading>{t("guideCollectionCoreSetHeading")}</SubHeading>
              <GuideText text={t("guideCollectionCoreSetBody")} className="mt-2" />
            </div>
            <div className="rounded-xl border border-[#e3e8ee]/40 bg-white/[0.03] p-4 shadow-[0_0_24px_rgba(227,232,238,0.08)]">
              <span className="inline-block rounded-md bg-[#7f0000] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                {t("collection_master_set_stamp")}
              </span>
              <SubHeading>{t("guideCollectionMasterSetHeading")}</SubHeading>
              <GuideText text={t("guideCollectionMasterSetBody")} className="mt-2" />
            </div>
          </div>
          <div className="rounded-xl border border-[#ffd54f]/45 bg-gradient-to-br from-[#ffd54f]/20 to-[#e3e8ee]/10 p-4">
            <SubHeading>{t("guideCollectionMasteryHeading")}</SubHeading>
            <p className="mt-1 text-xs font-bold text-[#9aa0ae]">
              {t("guideCollectionMasteryFormulaTitle")}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-black">
              <span className="rounded-lg border border-[#ffd54f]/60 bg-[#ffd54f]/15 px-3 py-2 text-[#ffd54f]">
                {t("guideCollectionMasteryFormulaRarity")} · {t("guideCollectionMasteryFormulaCap")}
              </span>
              <span className="text-white/80">×</span>
              <span className="rounded-lg border border-cyan-300/60 bg-cyan-300/15 px-3 py-2 text-cyan-200">
                {t("guideCollectionMasteryFormulaMastery")} · {t("guideCollectionMasteryFormulaCap")}
              </span>
              <span className="text-white/80">=</span>
              <span className="rounded-lg bg-[#e3e8ee] px-3 py-2 text-[#1a1a24]">
                ✨ {t("guideCollectionMasteryFormulaTotal")}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-[#e3e8ee]/50 bg-gradient-to-br from-[#e3e8ee]/15 to-black/20 p-4">
            <GuideText text={t("guideCollectionMasteryCallout")} />
          </div>
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
            <SubHeading>{t("guide_collection_max_bonus_title")}</SubHeading>
            <p className="mt-2 text-sm font-bold text-amber-200">{t("guide_collection_max_bonus_line1")}</p>
            <p className="mt-1 text-sm font-bold text-amber-200/90">{t("guide_collection_max_bonus_line2")}</p>
          </div>
        </GuideSectionCard>

        <GuideSectionCard emoji="🩸" title={t("guideSecHighRarityTitle")} accent="#d0a2c8">
          <GuideText text={t("guideHighRarityIntro")} />
          <div className="space-y-3">
            <div className="rounded-xl border border-red-900/70 bg-gradient-to-br from-[#3b0000] to-red-900/40 p-4">
              <p className="font-extrabold text-red-400">🩸 {t("guideTranscendentBlockTitle")}</p>
              <GuideText text={t("guideTranscendentBlockBody")} className="mt-2" />
            </div>
            <div className="rounded-xl border border-[#e3e8ee]/60 bg-gradient-to-br from-[#e3e8ee]/35 to-[#1a1f26] p-4">
              <p className="font-extrabold text-[#fafafa]">✨ {t("guideEternalBlockTitle")}</p>
              <GuideText text={t("guideEternalBlockBody")} className="mt-2" />
            </div>
          </div>
          <SubHeading>{t("guideSynthesisFragmentHeading")}</SubHeading>
          <GuideText text={t("guideSynthesisFragmentBody")} />
          <GuideText text={t("guide_fragment_drop_info")} />
          <div className="space-y-2">
            <p className="rounded-lg border border-red-900/55 bg-red-900/15 px-3 py-2 text-sm font-extrabold text-red-300">
              🩸 {t("guideSynthesisFragmentTransPity")}
            </p>
            <p className="rounded-lg border border-[#e3e8ee]/55 bg-[#e3e8ee]/10 px-3 py-2 text-sm font-extrabold text-white">
              ✨ {t("guideSynthesisFragmentEternalPity")}
            </p>
          </div>
          <div className="rounded-xl border border-[#e3e8ee]/50 bg-gradient-to-br from-[#e3e8ee]/12 to-black/20 p-4">
            <SubHeading>{t("guideSynthesisEternalMercifulHeading")}</SubHeading>
            <GuideText text={t("guideSynthesisEternalMercifulBody")} className="mt-2" />
          </div>
        </GuideSectionCard>

        <GuideSectionCard emoji="⚔️" title={t("guideSecStatsTitle")} accent="#67e8f9">
          <GuideText text={t("guideSecStatsIntro")} />
          <div className="space-y-4 pt-1">
            {STATS.map((stat) => (
              <div key={stat.statKey} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
                  style={{
                    backgroundColor: `${stat.color}22`,
                    border: `1px solid ${stat.color}55`,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="font-bold text-white">{t(stat.statKey)}</p>
                  <GuideText text={t(stat.bodyKey)} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
          <GuideText text={t("guideHpGoldUpgradeNote")} />
        </GuideSectionCard>

        <GuideSectionCard icon={Timer} title={t("guideSecFocusTitle")} accent="#ff7043">
          <GuideText text={t("guideFocusCombatBody")} />
        </GuideSectionCard>

        <GuideSectionCard emoji="🧪" title={t("guideSecPotionTitle")} accent="#86efac">
          <GuideText text={t("guidePotionBody")} />
        </GuideSectionCard>

        <GuideSectionCard icon={Trophy} title={t("guideSecWeeklyTitle")} accent="#ffd54f">
          <GuideText text={t("guideWeeklyBody")} />
        </GuideSectionCard>

        <GuideSectionCard icon={Hammer} title={t("guideSecForgeTitle")} accent="#ff7043">
          <SubHeading>{t("guideForgeEnhanceHeading")}</SubHeading>
          <KeywordLine
            pre={t("guideForgeEnhanceSafePre")}
            keyword={t("guideForgeEnhanceSafeKw")}
            post={t("guideForgeEnhanceSafePost")}
            keywordColor="#ffca28"
          />
          <KeywordLine
            pre={t("guideForgeEnhanceDownPre")}
            keyword={t("guideForgeEnhanceDownKw")}
            post={t("guideForgeEnhanceDownPost")}
            keywordColor="#fb923c"
          />
          <WarnLine
            label={t("guideForgeEnhanceWarnLabel")}
            pre={t("guideForgeEnhanceWarnPre")}
            keyword={t("guideForgeEnhanceWarnKw")}
            post={t("guideForgeEnhanceWarnPost")}
          />
          <SubHeading>{t("guideForgeSynthesisHeading")}</SubHeading>
          <GuideText text={t("guideForgeSynthesisIntro")} />
          <WarnLine
            label={t("guideForgeSynthesisWarnLabel")}
            pre={t("guideForgeSynthesisWarnPre")}
            keyword={t("guideForgeSynthesisWarnKw")}
            post={t("guideForgeSynthesisWarnPost")}
          />
        </GuideSectionCard>

        <GuideSectionCard icon={Wand2} title={t("guideSecSynthesisTitle")} accent="#d8b4fe">
          <GuideText text={t("guideSynthesisBody")} />
        </GuideSectionCard>
      </div>
    </section>
  );
}

export function RankingBottomGuide() {
  const { locale } = useI18n();
  return <RankingBottomGuideContent locale={locale} />;
}
