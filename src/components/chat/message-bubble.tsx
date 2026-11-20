
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface MessageBubbleProps {
  message: Message;
  language: Language;
}

export default function MessageBubble({
  message,
  language,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const t = translations[language];
  const isAssistant = message.role === "assistant";

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Could not copy message:", error);
    }
  }

  return (
    <article
      className={`message-row ${message.role}`}
      lang={language}
    >
      <div className="message-avatar">
        {isAssistant ? <Bot size={19} /> : <User size={18} />}
      </div>

      <div className="message-content">
        <div className="message-heading">
          <span className="message-author">
            {isAssistant ? "Company AI" : t.you}
          </span>

          {isAssistant && (
            <button
              type="button"
              className="message-copy-button"
              onClick={copyMessage}
              title={t.copyResponse}
              aria-label={t.copyResponse}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? t.copied : t.copy}</span>
            </button>
          )}
        </div>

        <div className="markdown-content" dir="auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
