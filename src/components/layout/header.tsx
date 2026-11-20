
"use client";

import {
  Bot,
  PanelLeftClose,
  Globe,
  ChevronDown,
  Check,
} from "lucide-react";

import type { Language } from "@/lib/i18n";
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
    <header className="topbar">
      <div className="topbar-left">
        {!sidebarOpen && (
          <button
            type="button"
            className="icon-button"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <PanelLeftClose size={19} />
          </button>
        )}

        <div className="mobile-brand">
          <div className="brand-icon small">
            <Bot size={19} />
          </div>
          <span>Company AI</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="language-selector">
          <button
            type="button"
            className="language-button"
            onClick={() => setLanguageMenuOpen((previous) => !previous)}
            aria-expanded={languageMenuOpen}
            aria-haspopup="listbox"
          >
            <Globe size={16} />
            <span>{selectedLanguage?.nativeLabel}</span>
            <ChevronDown size={14} />
          </button>

          {languageMenuOpen && (
            <div className="language-menu" role="listbox">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`language-option ${
                    language === item.code ? "active" : ""
                  }`}
                  role="option"
                  aria-selected={language === item.code}
                  onClick={() => {
                    onLanguageChange(item.code);
                    setLanguageMenuOpen(false);
                  }}
                >
                  <span>{item.nativeLabel}</span>
                  {language === item.code && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {!isAuthenticated && !isCheckingAuth && (
          <button
            type="button"
            className="login-button"
            onClick={onToggleLogin}
          >
            {language === "ar" ? "تسجيل الدخول" : "Sign in"}
          </button>
        )}
      </div>
    </header>
  );
}
