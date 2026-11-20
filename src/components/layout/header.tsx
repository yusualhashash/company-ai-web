
"use client";

import {
  PanelLeftClose,
  Globe,
  ChevronDown,
  Check,
} from "lucide-react";

import type { Language } from "@/lib/i18n";
import BrandMark from "@/components/brand-mark";
import { useState } from "react";

interface HeaderProps {
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  onToggleLogin: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function Header({
  sidebarOpen,
  onOpenSidebar,
  isAuthenticated,
  isCheckingAuth,
  onToggleLogin,
  language,
  onLanguageChange,
}: HeaderProps) {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const languages = [
    { code: "en" as const, label: "English", nativeLabel: "English" },
    { code: "ar" as const, label: "Arabic", nativeLabel: "العربية" },
  ];

  const selectedLanguage = languages.find(
    (item) => item.code === language
  );

  return (
    <header className="relative z-10 flex h-[68px] min-h-[68px] shrink-0 items-center justify-between border-b border-white/10 bg-sidebar/90 px-[30px] backdrop-blur-xl max-[640px]:h-[58px] max-[640px]:min-h-[58px] max-[640px]:px-2.5">
      <div className="flex items-center gap-3 max-[640px]:gap-1">
        {!sidebarOpen && (
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <PanelLeftClose size={19} />
          </button>
        )}

        <div className="flex items-center gap-3 text-[15px] font-bold tracking-tight max-[640px]:gap-2 max-[640px]:text-sm max-[360px]:[&>span]:hidden">
          <div className="flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-accent-hover to-accent text-background shadow-md shadow-accent/15">
            <BrandMark size={19} />
          </div>
          <span>Company AI</span>
        </div>
      </div>

      <div className="flex items-center gap-3 max-[640px]:gap-1">
        <div className="relative z-[100] inline-flex shrink-0 items-center">
          <button
            type="button"
            className="flex min-h-10 min-w-[125px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-surface px-3 py-2 text-xs text-foreground transition hover:border-accent/40 hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-accent max-[640px]:min-h-9 max-[640px]:min-w-[105px] max-[640px]:gap-1.5 max-[640px]:px-2 max-[640px]:py-1.5 max-[640px]:text-[11px] max-[360px]:min-w-0 max-[360px]:px-2"

            onClick={() => setLanguageMenuOpen((previous) => !previous)}
            aria-expanded={languageMenuOpen}
            aria-haspopup="listbox"
          >
            <Globe size={16} />
            <span>{selectedLanguage?.nativeLabel}</span>
            <ChevronDown size={14} />
          </button>

          {languageMenuOpen && (
            <div className="absolute end-0 top-[calc(100%_+_10px)] z-[200] flex w-[170px] flex-col gap-1 rounded-xl border border-white/10 bg-surface p-2 shadow-2xl max-[640px]:w-[155px]" role="listbox">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-[13px] transition hover:bg-accent/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent ${language === item.code ? "bg-accent/15 font-semibold text-accent-hover" : "text-muted"}`}
                  role="option"
                  aria-selected={language === item.code}
                  onClick={() => {
                    onLanguageChange(item.code);
                    setLanguageMenuOpen(false);
                  }}
                >
                  <span>{item.nativeLabel}</span>
                  {language === item.code && <Check size={16} className="shrink-0 text-accent-hover" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isAuthenticated && !isCheckingAuth && (
          <button
            type="button"
            className="min-h-9 rounded-lg bg-gradient-to-r from-accent to-emerald-700 px-4 py-2 text-xs font-semibold text-background transition hover:-translate-y-px hover:from-accent-hover hover:to-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-[640px]:px-3 max-[640px]:text-[11px]"
            onClick={onToggleLogin}
          >
            {language === "ar" ? "تسجيل الدخول" : "Sign in"}
          </button>
        )}
      </div>
    </header>
  );
}
