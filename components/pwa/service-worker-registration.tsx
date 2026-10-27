"use client";

import { useEffect } from "react";

/** Whether this is a local development origin rather than the deployed app. */
function isLocalDevelopment() {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".localhost");
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    // Not in development, and any worker already installed here is removed.
    //
    // The worker caches /_next/static/ first and never revalidates, which is
    // right in production because a build gives every chunk a content-hashed
    // name, so a deploy asks for URLs that were never cached. A dev server does
    // not hash: the chunk for a page keeps one stable path across every edit.
    // The worker therefore pins the first version of a page it ever sees and
    // serves it for good — edits compile, the server restarts, .next is
    // deleted, and the browser still runs the old code, with nothing on screen
    // to say why.
    if (isLocalDevelopment()) {
      void (async () => {
        for (const registration of await navigator.serviceWorker.getRegistrations()) {
          await registration.unregister().catch(() => undefined);
        }
        if (typeof caches === "undefined") return;
        for (const key of await caches.keys()) {
          if (key.startsWith("sarp-lab-")) await caches.delete(key).catch(() => undefined);
        }
      })();
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  return null;
}
