
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
      className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-7 pt-10 pb-[190px] text-center max-[640px]:justify-start max-[640px]:px-3 max-[640px]:pt-7 max-[640px]:pb-[170px]"
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="relative mb-7 flex size-[76px] items-center justify-center rounded-[23px] border border-accent-hover/35 bg-gradient-to-br from-accent/20 to-accent/5 text-accent-hover shadow-xl shadow-accent/10 before:absolute before:-inset-2 before:rounded-[28px] before:border before:border-accent/15 max-[640px]:mb-[18px] max-[640px]:size-[54px] max-[640px]:rounded-[17px]">
        <Bot size={30} />
      </div>

      <h1 className="m-0 max-w-[750px] text-balance text-[clamp(27px,5vw,54px)] font-bold leading-[1.16] tracking-[-2px] text-foreground max-[640px]:max-w-[360px] max-[640px]:text-[clamp(27px,9vw,36px)] max-[640px]:leading-[1.14] max-[640px]:tracking-[-1.3px]">{t.welcomeTitle}</h1>

      <p className="my-5 mb-9 max-w-[490px] text-pretty text-sm leading-8 text-muted max-[640px]:my-3 max-[640px]:mb-5 max-[640px]:max-w-[340px] max-[640px]:text-[13px] max-[640px]:leading-relaxed">{t.welcomeDescription}</p>


    </div>
  );
}
