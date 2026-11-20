
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
    <aside className="sidebar flex h-full w-[275px] shrink-0 flex-col bg-surface" lang={language} dir={isArabic ? "rtl" : "ltr"}>
      {/* Sidebar header */}
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">
            <Bot size={22} />
          </div>
          <span>Company AI</span>
        </div>

        <button
          type="button"
          className="icon-button sidebar-toggle"
          onClick={onClose}
          aria-label={t.closeSidebar}
        >
          <PanelLeftClose size={19} />
        </button>
      </div>

      {/* New conversation */}
      <button
        type="button"
        className="new-chat-button"
        onClick={handleNewChat}
      >
        <Plus size={18} />
        <span>{t.newConversation}</span>
      </button>

      {/* Search conversations */}
      <button
        type="button"
        className={`sidebar-action ${searchOpen ? "search-active" : ""}`}
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
        <div className="sidebar-search">
          <Search size={16} />

          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchConversations}
            autoComplete="off"
          />

          {searchQuery && (
            <button
              type="button"
              className="sidebar-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label={t.clearSearch}
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      {/* Conversation history */}
      <div className="history-section">
        <p className="section-label">
          {searchQuery.trim() ? t.searchResults : t.yourConversations}
        </p>

        {currentUser ? (
          filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`history-item ${
                  sessionId === session.id ? "active" : ""
                }`}
              >
                <button
                  type="button"
                  className="history-open-button"
                  onClick={() => onSelectConversation(session)}
                  disabled={isLoading || deletingSessionId !== null}
                  aria-label={`${t.openConversation}: ${session.title}`}
                >
                  <MessageSquare size={16} />
                  <span>{session.title}</span>
                </button>

                <button
                  type="button"
                  className="icon-button history-delete"
                  title={t.deleteConversation}
                  aria-label={`${t.deleteConversation}: ${session.title}`}
                  disabled={isLoading || deletingSessionId !== null}
                  onClick={(event) =>
                    onDeleteConversation(event, session)
                  }
                >
                  {deletingSessionId === session.id ? (
                    <span style={{ fontSize: "11px" }}>...</span>
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))
          ) : (
            <p className="section-label">
              {searchQuery.trim()
                ? t.noMatchingConversations
                : t.noConversations}
            </p>
          )
        ) : (
          <p className="section-label">
            {isCheckingAuth
              ? t.checkingAccount
              : t.signInToSave}
          </p>
        )}
      </div>

      {/* User profile */}
      <div className="sidebar-bottom">
        <UserProfile
          currentUser={currentUser}
          onLogout={onLogout}
          language={language}
        />
      </div>
    </aside>
  );
}
