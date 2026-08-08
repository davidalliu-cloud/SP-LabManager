"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's own standalone flag
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setStandalone(isStandalone());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (standalone || dismissed) return null;

  const showIosInstructions = isIos() && !deferredPrompt;
  if (!deferredPrompt && !showIosInstructions) return null;

  return (
    <div className="mx-4 mt-3 flex items-center justify-between gap-3 rounded-md border border-lab-burgundy/20 bg-lab-porcelain px-4 py-3 text-sm">
      {deferredPrompt ? (
        <>
          <span className="text-ink">Install this app on your phone for quick access.</span>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={async () => {
                await deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                setDeferredPrompt(null);
              }}
              className="rounded-md bg-lab-burgundy px-3 py-1.5 text-xs font-semibold text-white"
            >
              Install
            </button>
            <button type="button" onClick={() => setDismissed(true)} className="text-xs font-semibold text-muted">
              Not now
            </button>
          </div>
        </>
      ) : (
        <>
          <span className="text-ink">
            Add to Home Screen: tap the Share icon, then &quot;Add to Home Screen&quot;.
          </span>
          <button type="button" onClick={() => setDismissed(true)} className="shrink-0 text-xs font-semibold text-muted">
            Got it
          </button>
        </>
      )}
    </div>
  );
}
