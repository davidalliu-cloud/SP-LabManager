"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted">
      {t("language.label")}
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as "en" | "sq")}
        className="rounded-full border border-[#d7c9b4] bg-[rgba(255,252,247,0.92)] px-3 py-1.5 text-xs font-semibold text-ink outline-none focus:border-lab-burgundy focus:ring-2 focus:ring-[#ead7c7]"
      >
        <option value="en">{t("language.en")}</option>
        <option value="sq">{t("language.sq")}</option>
      </select>
    </label>
  );
}
