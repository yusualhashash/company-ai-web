
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
      className="composer-area"
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <form className="composer" onSubmit={handleSubmit}>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.messagePlaceholder}
          rows={1}
          disabled={isLoading || disabled}
          aria-label={t.messagePlaceholder}
          dir="auto"
        />

        <div className="composer-footer">
          <div className="composer-tools">
            <button
              type="button"
              className="tool-button"
              title={t.attachmentsComingSoon}
              aria-label={t.attachmentsComingSoon}
            >
              <Paperclip size={17} />
            </button>

            <span className="access-indicator">
              <span className="status-dot" />
              {t.companyKnowledge}
            </span>
          </div>

          <button
            type="submit"
            className="send-button"
            disabled={!value.trim() || isLoading || disabled}
            aria-label={t.sendMessage}
          >
            <Send size={17} />
          </button>
        </div>
      </form>

      <p className="disclaimer">{t.disclaimer}</p>
    </div>
  );
}
