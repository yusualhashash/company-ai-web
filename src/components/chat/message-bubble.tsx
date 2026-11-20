
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  User,
  Copy,
  Check,
  Pencil,
  X,
  ArrowUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  onEdit?: (messageId: string, newContent: string) => Promise<void>;
  isLoading?: boolean;
}

export default function MessageBubble({
  message,
  language,
  onEdit,
  isLoading = false,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const t = translations[language];
  const isAssistant = message.role === "assistant";
  const isArabic = language === "ar";

  useEffect(() => {
    if (!isEditing) return;

    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.focus();
    textarea.setSelectionRange(
      textarea.value.length,
      textarea.value.length
    );

    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(textarea.scrollHeight, 100)}px`;
  }, [isEditing]);

  function resizeTextarea() {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(textarea.scrollHeight, 100)}px`;
  }

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

  function startEditing() {
    if (isLoading) return;

    setEditedContent(message.content);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (isSaving) return;

    setEditedContent(message.content);
    setIsEditing(false);
  }

  async function saveEdit() {
    const newContent = editedContent.trim();

    if (
      !newContent ||
      newContent === message.content ||
      !onEdit ||
      isSaving ||
      isLoading
    ) {
      if (newContent === message.content) {
        setIsEditing(false);
      }

      return;
    }

    setIsSaving(true);

    try {
      await onEdit(message.id, newContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Could not edit message:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void saveEdit();
    }
  }

  return (
    <article
      className={`message-row ${message.role} ${
        isEditing ? "message-editing" : ""
      }`}
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="message-avatar">
        {isAssistant ? <Bot size={19} /> : <User size={18} />}
      </div>

      <div
        className={`message-content ${
          isEditing
            ? "w-full min-w-0 !max-w-none !rounded-2xl !border !border-[var(--border)] !bg-transparent !p-0"
            : ""
        }`}
      >

        <div className="message-heading">
          <span className="message-author">
            {isAssistant ? "Company AI" : t.you}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-surface p-3 shadow-lg transition-all duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 sm:p-4">
            <textarea
              ref={textareaRef}
              className="block min-h-24 max-h-80 w-full resize-none overflow-y-auto rounded-xl border border-transparent bg-transparent p-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted focus:border-accent/40 focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
              value={editedContent}
              onChange={(event) => {
                setEditedContent(event.target.value);
                resizeTextarea();
              }}
              onKeyDown={handleKeyDown}
              placeholder={t.editMessagePlaceholder}
              disabled={isSaving}
              rows={3}
              dir="auto"
            />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-surface/70 px-4 py-2.5 text-sm font-medium text-muted transition duration-200 hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                onClick={cancelEditing}
                disabled={isSaving}
              >
                <X size={16} />
                <span>{isArabic ? "إلغاء" : "Cancel"}</span>
              </button>

              <button
                type="button"
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-background shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 sm:w-auto"
                onClick={() => void saveEdit()}
                disabled={
                  isSaving ||
                  isLoading ||
                  !editedContent.trim() ||
                  editedContent.trim() === message.content
                }
              >
                {isSaving ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
                ) : (
                  <ArrowUp size={17} />
                )}
                <span>{isArabic ? "إرسال" : "Send"}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="markdown-content" dir="auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>

            {isAssistant && (
              <div className="message-footer">
                <div className="message-actions">
                  <button
                    type="button"
                    className="message-copy-button"
                    onClick={copyMessage}
                    title={t.copyResponse}
                    aria-label={t.copyResponse}
                  >
                    {copied ? (
                      <Check size={15} />
                    ) : (
                      <Copy size={15} />
                    )}
                    <span>{copied ? t.copied : t.copy}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!isAssistant && !isEditing && onEdit && (
        <button
          type="button"
          className="ms-2 mt-5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted opacity-90 transition duration-200 hover:-translate-y-px hover:border-[var(--border)] hover:bg-surface-hover hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:mt-7 sm:size-8"
          onClick={startEditing}
          disabled={isLoading}
          title={t.editMessage}
          aria-label={t.editMessage}
        >
          <Pencil size={16} />
        </button>
      )}
    </article>
  );
}
