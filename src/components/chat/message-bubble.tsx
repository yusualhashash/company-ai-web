
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
      className={`group mb-8 flex items-start gap-4 max-[640px]:mb-6 max-[640px]:gap-2 ${isAssistant ? "ml-auto w-fit max-w-full flex-row-reverse max-[640px]:ml-0 max-[640px]:w-full max-[640px]:flex-row" : ""}`}
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className={`flex size-[38px] min-w-[38px] shrink-0 items-center justify-center rounded-xl border shadow-md max-[640px]:size-8 max-[640px]:min-w-8 max-[640px]:rounded-[10px] ${isAssistant ? "border-accent/25 bg-gradient-to-br from-accent-hover to-accent text-background shadow-accent/15" : "border-white/10 bg-gradient-to-br from-slate-600 to-slate-800 text-foreground"}`}>
        {isAssistant ? <Bot size={19} /> : <User size={18} />}
      </div>

      <div
        className={`min-w-0 flex-1 pt-0.5 ${isEditing ? "w-full !max-w-none !rounded-2xl !border-0 !bg-transparent !p-0" : isAssistant ? "max-w-[min(85%,700px)]" : "max-w-[min(80%,650px)] rounded-[4px_15px_15px_15px] border border-white/10 bg-gradient-to-br from-surface-hover to-surface px-4 py-3 max-[640px]:max-w-[82%] max-[640px]:px-3 max-[640px]:py-2.5"}`}>


        <div className={`mb-2.5 flex min-h-6 items-center justify-between gap-3 ${isAssistant ? "justify-end" : "max-[640px]:mb-2"}`}>
          <span className={`block text-[13px] font-bold tracking-[0.1px] ${isAssistant ? "text-foreground" : "text-muted"}`}>
            {isAssistant ? "Company AI" : t.you}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-2 w-full rounded-2xl border border-border bg-surface p-3 shadow-lg transition-all duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 sm:p-4">
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

            <div className="mt-3 flex flex-row gap-2 sm:justify-end">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface/70 px-4 py-2.5 text-sm font-medium text-muted transition duration-200 hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-initial"
                onClick={cancelEditing}
                disabled={isSaving}
              >
                <X size={16} />
                <span>{isArabic ? "إلغاء" : "Cancel"}</span>
              </button>

              <button
                type="button"
                className="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-background shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 sm:w-auto sm:flex-initial"
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
            <div className="break-words text-sm leading-[1.85] text-[#d5dbea] max-[640px]:text-[14px] max-[640px]:leading-[1.7] [&_p]:mb-3.5 [&_p:last-child]:mb-0 [&_p]:whitespace-pre-wrap [&_strong]:font-bold [&_strong]:text-foreground [&_em]:italic [&_h1]:my-4 [&_h1]:text-[21px] [&_h2]:my-3 [&_h2]:text-lg [&_h3]:my-3 [&_h3]:text-base [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h1]:leading-relaxed [&_h2]:leading-relaxed [&_h3]:leading-relaxed [&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:mb-2 [&_li::marker]:text-accent-hover [&_a]:text-accent-hover [&_a]:underline [&_code]:rounded-md [&_code]:border [&_code]:border-accent/15 [&_code]:bg-accent/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-background [&_pre]:p-4 [&_pre]:leading-relaxed [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-4 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_th]:border [&_th]:border-border [&_th]:bg-accent/10 [&_th]:p-2.5 [&_td]:border [&_td]:border-border [&_td]:p-2.5">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>

            {isAssistant && (
              <div className="mt-2.5 flex w-full items-center justify-start">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-muted opacity-0 transition hover:bg-accent/10 hover:text-accent-hover focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-accent group-hover:opacity-100 max-[640px]:opacity-100"
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
          className="ms-2 mt-5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted opacity-90 transition duration-200 hover:-translate-y-px hover:border-border hover:bg-surface-hover hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:mt-7 sm:size-8"
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
