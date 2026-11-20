
"use client";

import { useEffect, useRef } from "react";
import MessageBubble, { type Message } from "./message-bubble";
import TypingIndicator from "./typing-indicator";

import type { Language } from "@/lib/i18n";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  language: Language;
}

export default function MessageList({
  messages,
  isLoading,
  language,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  return (
    <div className="messages-list">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          language={language}
        />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
