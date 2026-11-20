
"use client";

import type { KeyboardEvent, FormEvent } from "react";
import { Send, Paperclip } from "lucide-react";

import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  language: Language;
}

export default function ChatComposer({
  value,
  onChange,
  onSend,
  isLoading,
  disabled = false,
  language,
}: ChatComposerProps) {
  const t = translations[language];
  const isArabic = language === "ar";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = value.trim();

    if (!message || isLoading || disabled) return;

    onSend(message);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      const message = value.trim();

      if (message && !isLoading && !disabled) {
        onSend(message);
      }
    }
  }

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center bg-gradient-to-b from-transparent via-background/95 to-background px-6 pb-4 pt-7 max-[640px]:px-2.5 max-[640px]:pt-4 max-[640px]:pb-[max(12px,env(safe-area-inset-bottom))]"
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <form className="relative w-full max-w-[820px] rounded-[18px] border border-white/10 bg-surface p-4 shadow-2xl transition duration-200 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10 max-[640px]:rounded-2xl max-[640px]:p-3" onSubmit={handleSubmit}>
        <textarea
          className="block min-h-12 max-h-40 w-full resize-none bg-transparent px-0.5 py-2 text-sm leading-7 text-foreground outline-none placeholder:text-muted disabled:opacity-50"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.messagePlaceholder}
          rows={1}
          disabled={isLoading || disabled}
          aria-label={t.messagePlaceholder}
          dir="auto"
        />

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-white/[0.055] pt-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition hover:border hover:border-accent/15 hover:bg-accent/10 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-accent"
              title={t.attachmentsComingSoon}
              aria-label={t.attachmentsComingSoon}
            >
              <Paperclip size={17} />
            </button>

            <span className="flex items-center gap-2 text-[11px] text-muted max-[640px]:text-[10px]">
              <span className="size-2 rounded-full bg-accent shadow-[0_0_9px_rgba(72,201,149,0.35)]" />
              {t.companyKnowledge}
            </span>
          </div>

          <button
            type="submit"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-hover to-accent text-background shadow-md shadow-accent/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 max-[640px]:size-9"
            disabled={!value.trim() || isLoading || disabled}
            aria-label={t.sendMessage}
          >
            <Send size={17} />
          </button>
        </div>
      </form>

      <p className="mt-3 max-w-[320px] text-center text-[10px] leading-relaxed text-muted max-[640px]:mt-2">{t.disclaimer}</p>
    </div>
  );
}
