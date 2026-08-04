"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const store = useLabStore();
  const notifications = store.notifications.filter((item) => item.userId === store.currentUserId);
  const { t } = useI18n();
  const unread = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-full border border-[#d7c9b4] bg-[rgba(255,252,247,0.92)] px-3 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-lab-burgundy hover:bg-[#fbf2e6] hover:text-lab-burgundy"
      >
        {t("notifications.alerts")}
        {unread > 0 ? (
          <span className="ml-2 rounded-full bg-lab-red px-2 py-0.5 text-xs font-semibold text-white">{unread}</span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-80 rounded-[1.4rem] border border-[#ddcdb7] bg-[rgba(255,252,247,0.96)] p-2 shadow-soft backdrop-blur-sm">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Njoftime</div>
          <div className="max-h-96 overflow-auto">
            {notifications.slice(0, 8).map((item) => (
              <div key={item.id} className="rounded-2xl border border-transparent px-3 py-3 hover:border-[#dccab1] hover:bg-[rgba(233,216,190,0.28)]">
                <div className="text-sm font-semibold text-ink">{item.title}</div>
                <div className="mt-1 text-xs text-muted">{item.message}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
