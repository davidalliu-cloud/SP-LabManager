"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted">
      <span className="hidden sm:inline">{t("language.label")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as "en" | "sq")}
        className="rounded-md border border-line bg-white px-2 py-1.5 text-xs font-semibold text-ink outline-none focus:border-lab-burgundy focus:ring-2 focus:ring-lab-burgundy/15 sm:px-3"
      >
        <option value="en">{t("language.en")}</option>
        <option value="sq">{t("language.sq")}</option>
      </select>
    </label>
  );
}
