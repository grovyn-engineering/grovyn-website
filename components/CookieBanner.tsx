"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { X } from "lucide-react";
import {
  getConsent,
  setConsent,
  hasConsentChoice,
  type ConsentState,
  FULL_CONSENT,
  DEFAULT_CONSENT,
} from "@/lib/cookie-consent";

export default function CookieBanner() {
  const t = useTranslations("cookie_consent");
  const locale = useLocale();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Settings form state (for granular preferences)
  const [prefs, setPrefs] = useState<ConsentState>(() => getConsent() ?? DEFAULT_CONSENT);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!hasConsentChoice()) {
      setShowBanner(true);
      setPrefs(DEFAULT_CONSENT);
    }
  }, [mounted]);

  const hideBanner = () => {
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    setConsent(FULL_CONSENT);
    hideBanner();
    window.dispatchEvent(new CustomEvent("grovyn-consent-update", { detail: FULL_CONSENT }));
  };

  const handleDeclineAll = () => {
    setConsent(DEFAULT_CONSENT);
    hideBanner();
    window.dispatchEvent(new CustomEvent("grovyn-consent-update", { detail: DEFAULT_CONSENT }));
  };

  const handleSavePreferences = () => {
    const state: ConsentState = { ...prefs, necessary: true };
    setConsent(state);
    hideBanner();
    window.dispatchEvent(new CustomEvent("grovyn-consent-update", { detail: state }));
  };

  const openSettings = () => setShowSettings(true);

  if (!mounted || !showBanner) return null;

  const privacyUrl = `/${locale}/privacy`;

  return (
    <>
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-gray-100 text-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 relative">
          <button
            type="button"
            onClick={handleDeclineAll}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors z-10 shrink-0"
            aria-label={t("close_aria")}
          >
            <X size={20} />
          </button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex-1 min-w-0 pr-8 relative">
              <p className="text-sm leading-relaxed">
                {t("message")}{" "}
                <Link
                  href={privacyUrl}
                  className="text-emerald-600 font-medium hover:underline underline-offset-2"
                >
                  {t("privacy_policy")}
                </Link>
              </p>
              <p className="text-xs text-gray-600 mt-2">{t("decline_note")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0 sm:pr-10">
              <button
                type="button"
                onClick={openSettings}
                className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t("settings")}
              </button>
              <button
                type="button"
                onClick={handleDeclineAll}
                className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t("decline_all")}
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2.5 text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {t("accept_all")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 id="cookie-settings-title" className="text-lg font-bold text-[#111]">
                {t("modal_title")}
              </h2>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label={t("close_aria")}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="necessary"
                  checked
                  disabled
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600"
                />
                <label htmlFor="necessary" className="text-sm text-gray-700">
                  <span className="font-medium">{t("necessary_title")}</span>
                  <span className="block text-gray-500 text-xs mt-0.5">{t("necessary_desc")}</span>
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="analytics" className="text-sm text-gray-700">
                  <span className="font-medium">{t("analytics_title")}</span>
                  <span className="block text-gray-500 text-xs mt-0.5">{t("analytics_desc")}</span>
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="marketing" className="text-sm text-gray-700">
                  <span className="font-medium">{t("marketing_title")}</span>
                  <span className="block text-gray-500 text-xs mt-0.5">{t("marketing_desc")}</span>
                </label>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full px-4 py-2.5 text-sm font-medium bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
