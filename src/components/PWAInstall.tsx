"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstall() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Don't show if user already dismissed in this session
    if (sessionStorage.getItem("pwa-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      // Show prompt after 5 seconds of browsing
      setTimeout(() => setShow(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setShow(false);
      setInstallEvent(null);
    }
  }

  function dismiss() {
    setShow(false);
    sessionStorage.setItem("pwa-dismissed", "1");
  }

  if (!show || !installEvent) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 max-w-sm sm:max-w-xs">
      <div className="bg-[var(--dark-card)] border border-[var(--gold)] rounded-2xl p-4 shadow-2xl shadow-black/40 animate-in slide-in-from-bottom-4">
        <button
          onClick={dismiss}
          className="absolute top-2 right-2 text-[var(--text-muted)] hover:text-white transition-colors p-1"
          aria-label="Закрити"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-1">Встановити ЄСвято</p>
            <p className="text-[var(--text-muted)] text-xs leading-relaxed">
              Швидкий доступ з робочого столу телефону, без браузера
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={install}
            className="flex-1 bg-[var(--gold)] text-black text-sm font-semibold py-2.5 rounded-lg hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Встановити
          </button>
          <button
            onClick={dismiss}
            className="px-4 text-[var(--text-muted)] text-sm hover:text-white transition-colors"
          >
            Пізніше
          </button>
        </div>
      </div>
    </div>
  );
}
