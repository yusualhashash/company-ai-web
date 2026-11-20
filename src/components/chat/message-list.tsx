
"use client";

import { useEffect, useRef } from "react";
import MessageBubble, { type Message } from "./message-bubble";
import TypingIndicator from "./typing-indicator";

import type { Language } from "@/lib/i18n";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  language: Language;
  onEditMessage: (
    messageId: string,
    newContent: string
  ) => Promise<void>;
}

export default function MessageList({
  messages,
  isLoading,
  language,
  onEditMessage,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const previousLoadingRef = useRef(isLoading);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    previousLoadingRef.current = isLoading;
  }, [isLoading]);

  return (
    <div className="messages-list">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className="message-enter-animation"
          style={{
            animationDelay: `${Math.min(index * 25, 150)}ms`,
          }}
        >
          <MessageBubble
            message={message}
            language={language}
            onEdit={onEditMessage}
            isLoading={isLoading}
          />
        </div>
      ))}

      {isLoading && (
        <div className="typing-enter-animation">
          <TypingIndicator />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
