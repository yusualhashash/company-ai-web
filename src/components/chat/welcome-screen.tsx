
"use client";

import { Bot } from "lucide-react";

import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface WelcomeScreenProps {
  language: Language;
}

export default function WelcomeScreen({
  language,
}: WelcomeScreenProps) {
  const t = translations[language];
  const isArabic = language === "ar";


  return (
    <div
      className="welcome-screen mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center"
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="welcome-icon">
        <Bot size={30} />
      </div>

      <h1>{t.welcomeTitle}</h1>

      <p>{t.welcomeDescription}</p>


    </div>
  );
}
