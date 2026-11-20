
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

      <div className="message-content">
        <div className="message-heading">
          <span className="message-author">
            {isAssistant ? "Company AI" : t.you}
          </span>
        </div>

        {isEditing ? (
          <div className="message-edit-container">
            <textarea
              ref={textareaRef}
              className="message-edit-textarea"
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

            <div className="message-edit-footer">
              <span className="message-edit-hint">
                {isArabic
                  ? "Enter للإرسال · Shift + Enter لسطر جديد"
                  : "Enter to send · Shift + Enter for a new line"}
              </span>

              <div className="message-edit-actions">
                <button
                  type="button"
                  className="message-edit-cancel"
                  onClick={cancelEditing}
                  disabled={isSaving}
                  aria-label={t.cancel}
                  title={t.cancel}
                >
                  <X size={17} />
                  <span>{t.cancel}</span>
                </button>

                <button
                  type="button"
                  className="message-edit-send"
                  onClick={() => void saveEdit()}
                  disabled={
                    isSaving ||
                    isLoading ||
                    !editedContent.trim() ||
                    editedContent.trim() === message.content
                  }
                  aria-label={t.saveChanges}
                  title={t.saveChanges}
                >
                  {isSaving ? (
                    <span className="edit-button-spinner" />
                  ) : (
                    <ArrowUp size={19} strokeWidth={2.5} />
                  )}
                </button>
              </div>
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
          className="message-edit-trigger"
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
