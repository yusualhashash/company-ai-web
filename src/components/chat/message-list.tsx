
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
    <div className="min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto scroll-smooth px-6 pt-9 pb-[190px] lg:px-[calc((100%-850px)/2)] max-[640px]:px-3.5 max-[640px]:pt-5 max-[640px]:pb-[180px] [scrollbar-color:transparent_transparent] [scrollbar-width:thin]">
      {messages.map((message) => (
        <div
          key={message.id}
          className="min-w-0"
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
        <div className="min-w-0">
          <TypingIndicator />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
