
"use client";

import { useState, type MouseEvent } from "react";
import {
  Bot,
  Plus,
  MessageSquare,
  Search,
  PanelLeftClose,
  Trash2,
  X,
} from "lucide-react";

import type { CurrentUser, ChatSession } from "@/lib/api";
import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";
import UserProfile from "./user-profile";

interface SidebarProps {
  currentUser: CurrentUser | null;
  isCheckingAuth: boolean;
  sessions: ChatSession[];
  sessionId: string | null;
  isLoading: boolean;
  deletingSessionId: string | null;
  language: Language;
  onNewChat: () => void;
  onSelectConversation: (session: ChatSession) => void;
  onDeleteConversation: (
    event: MouseEvent<HTMLButtonElement>,
    session: ChatSession
  ) => void;
  onLogout: () => void;
  onClose: () => void;
}

export default function Sidebar({
  currentUser,
  isCheckingAuth,
  sessions,
  sessionId,
  isLoading,
  deletingSessionId,
  language,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onLogout,
  onClose,
}: SidebarProps) {
  const t = translations[language];
  const isArabic = language === "ar";

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleNewChat = () => {
    setSearchQuery("");
    setSearchOpen(false);
    onNewChat();
  };

  return (
    <aside className="flex h-full w-[275px] shrink-0 flex-col border-e border-white/10 bg-sidebar p-4 pt-5 max-[900px]:w-[245px] max-[900px]:min-w-[245px] max-[640px]:absolute max-[640px]:inset-y-0 max-[640px]:start-0 max-[640px]:z-20 max-[640px]:w-[calc(100vw_-_56px)] max-[640px]:max-w-[276px] max-[640px]:min-w-0 max-[640px]:shadow-2xl" lang={language} dir={isArabic ? "rtl" : "ltr"}>
      {/* Sidebar header */}
      <div className="mb-7 flex items-center justify-between">
        <div className="group flex items-center gap-3 text-lg font-bold tracking-tight">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-hover to-accent text-background shadow-lg shadow-accent/15 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-accent/25">
            <Bot size={22} />
          </div>
          <span>Company AI</span>
        </div>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={onClose}
          aria-label={t.closeSidebar}
        >
          <PanelLeftClose size={19} />
        </button>
      </div>

      {/* New conversation */}
      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-hover to-accent text-sm font-semibold text-background shadow-lg shadow-accent/10 transition hover:-translate-y-0.5 hover:shadow-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        onClick={handleNewChat}
      >
        <Plus size={18} />
        <span>{t.newConversation}</span>
      </button>

      {/* Search conversations */}
      <button
        type="button"
        className={`mt-2 flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl border px-3 text-start text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${searchOpen ? "border-accent/20 bg-accent/10 text-accent-hover" : "border-transparent text-muted hover:bg-white/5 hover:text-foreground"}`}
        onClick={() => {
          setSearchOpen((previous) => !previous);
          setSearchQuery("");
        }}
        aria-expanded={searchOpen}
      >
        <Search size={17} />
        <span>{t.searchConversations}</span>
      </button>

      {searchOpen && (
        <div className="mt-2 flex min-h-10 items-center gap-2 rounded-xl border border-accent/25 bg-white/[0.035] px-3 text-muted focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
          <Search size={16} />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchConversations}
            autoComplete="off"
            className="w-full min-w-0 bg-transparent text-xs text-foreground outline-none placeholder:text-muted"

          />

          {searchQuery && (
            <button
              type="button"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted transition hover:bg-white/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
              onClick={() => setSearchQuery("")}
              aria-label={t.clearSearch}
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      {/* Conversation history */}
      <div className="mt-7 min-h-0 flex-1 overflow-y-auto pe-0.5 [scrollbar-color:#34394a_transparent] [scrollbar-width:thin]">
        <p className="mb-3.5 px-2 text-[10px] font-bold tracking-[1.3px] text-muted">
          {searchQuery.trim() ? t.searchResults : t.yourConversations}
        </p>

        {currentUser ? (
          filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session.id}
className={`group mb-1 flex min-h-11 items-center gap-1 rounded-xl border px-1 transition ${sessionId === session.id ? "border-accent/20 bg-accent/10 text-foreground" : "border-transparent text-muted hover:bg-white/[0.045]"}`}
              >
                <button
                  type="button"
                  className="flex min-h-9 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 text-start text-xs text-inherit transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate [&>svg]:shrink-0 [&>svg]:text-muted"
                  onClick={() => onSelectConversation(session)}
                  disabled={isLoading || deletingSessionId !== null}
                  aria-label={`${t.openConversation}: ${session.title}`}
                >
                  <MessageSquare size={16} />
                  <span>{session.title}</span>
                </button>

                <button
                  type="button"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted opacity-0 transition hover:bg-red-500/10 hover:text-red-400 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-accent group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50 max-[640px]:size-10 max-[640px]:opacity-100"
                  title={t.deleteConversation}
                  aria-label={`${t.deleteConversation}: ${session.title}`}
                  disabled={isLoading || deletingSessionId !== null}
                  onClick={(event) =>
                    onDeleteConversation(event, session)
                  }
                >
                  {deletingSessionId === session.id ? (
                    <span className="text-[11px]">...</span>
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))
          ) : (
            <p className="mb-3.5 px-2 text-[10px] font-bold tracking-[1.3px] text-muted">
              {searchQuery.trim()
                ? t.noMatchingConversations
                : t.noConversations}
            </p>
          )
        ) : (
          <p className="mb-3.5 px-2 text-[10px] font-bold tracking-[1.3px] text-muted">
            {isCheckingAuth
              ? t.checkingAccount
              : t.signInToSave}
          </p>
        )}
      </div>

      {/* User profile */}
      <div className="border-t border-white/10 pt-3">
        <UserProfile
          currentUser={currentUser}
          onLogout={onLogout}
          language={language}
        />
      </div>
    </aside>
  );
}
