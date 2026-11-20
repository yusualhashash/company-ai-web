
"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { Trash2 } from "lucide-react";

import LoginForm from "@/components/auth/login-form";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

import WelcomeScreen from "@/components/chat/welcome-screen";
import MessageList from "@/components/chat/message-list";
import ChatComposer from "@/components/chat/chat-composer";

import {
  createChatSession,
  sendChatMessage,
  editChatMessage,
  getMyChatSessions,
  getChatMessages,
  deleteChatSession,
  login,
  getCurrentUser,
  logout,
  type CurrentUser,
  type ChatSession,
  type ChatMessage,
} from "@/lib/api";

import type { Message } from "@/components/chat/message-bubble";
import { translations, type Language } from "@/lib/i18n";

const REMEMBERED_EMAIL_KEY = "company-ai-remembered-email";
const LANGUAGE_KEY = "company-ai-language";

export default function Home() {
  // Language state
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_KEY);

    if (savedLanguage === "en" || savedLanguage === "ar") {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir =
      language === "ar" ? "rtl" : "ltr";
  }, [language]);

  function handleLanguageChange(newLanguage: Language) {
    window.localStorage.setItem(LANGUAGE_KEY, newLanguage);
    setLanguage(newLanguage);
  }

  // Chat state
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);

  // Layout state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      // Synchronize the initial drawer state with the viewport after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(false);
    }
  }, []);

  // Authentication state
  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Conversation state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [deletingSessionId, setDeletingSessionId] =
    useState<string | null>(null);
  const [pendingDeletion, setPendingDeletion] =
    useState<ChatSession | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = deleteDialogRef.current;

    if (!dialog) return;

    if (pendingDeletion && !dialog.open) {
      dialog.showModal();
    } else if (!pendingDeletion && dialog.open) {
      dialog.close();
    }
  }, [pendingDeletion]);

  // Error state
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");

  // Login form state
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Restore remembered email
  useEffect(() => {
    const savedEmail = window.localStorage.getItem(
      REMEMBERED_EMAIL_KEY
    );

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  // Restore authentication
  useEffect(() => {
    let isMounted = true;

    async function restoreAuthentication() {
      try {
        const user = await getCurrentUser();

        if (isMounted) {
          setCurrentUser(user);
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    }

    restoreAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load authenticated conversations
  useEffect(() => {
    if (!currentUser) {
      setSessions([]);
      return;
    }

    async function loadSessions() {
      try {
        const data = await getMyChatSessions("");
        setSessions(data);
      } catch (err) {
        console.error("Could not load conversations:", err);
        setError(t.loadConversationsError);
      }
    }

    loadSessions();
  }, [currentUser, language]);

  // Start a new conversation
  function startNewChat() {
    setMessages([]);
    setInput("");
    setSessionId(null);
    setGuestToken(null);
    setError("");
  }

  // Open an existing conversation
  async function selectConversation(session: ChatSession) {
    if (isLoading || deletingSessionId) return;

    setIsLoading(true);
    setError("");

    try {
      const data: ChatMessage[] = await getChatMessages(session.id);

      setMessages(
        data.map((message) => ({
          id: message.id,
          role: message.role as Message["role"],
          content: message.content,
        }))
      );

      setSessionId(session.id);
      setGuestToken(null);
      setInput("");
    } catch (err) {
      console.error("Could not load conversation:", err);

      setError(
        err instanceof Error
          ? err.message
          : t.loadConversationError
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Request conversation deletion
  function handleDeleteConversation(
    event: MouseEvent<HTMLButtonElement>,
    session: ChatSession
  ) {
    event.stopPropagation();

    if (!currentUser || isLoading || deletingSessionId) return;

    setError("");
    setPendingDeletion(session);
  }

  async function confirmDeleteConversation() {
    const session = pendingDeletion;

    if (!session || !currentUser || isLoading || deletingSessionId) return;

    setDeletingSessionId(session.id);
    setError("");

    try {
      await deleteChatSession(session.id, "");

      setSessions((previous) =>
        previous.filter((item) => item.id !== session.id)
      );

      if (sessionId === session.id) {
        setMessages([]);
        setInput("");
        setSessionId(null);
        setGuestToken(null);
      }

      setPendingDeletion(null);
    } catch (err) {
      console.error("Could not delete conversation:", err);

      setError(
        err instanceof Error
          ? err.message
          : t.deleteError
      );
    } finally {
      setDeletingSessionId(null);
    }
  }

  // Login
  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) return;

    setIsLoggingIn(true);
    setLoginError("");

    try {
      await login(email.trim(), password);

      const user = await getCurrentUser();

      setCurrentUser(user);

      if (rememberEmail) {
        window.localStorage.setItem(
          REMEMBERED_EMAIL_KEY,
          email.trim()
        );
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      setSessionId(null);
      setGuestToken(null);
      setMessages([]);
      setInput("");
      setPassword("");
      setLoginError("");
      setError("");
      setShowLogin(false);
    } catch (err) {
      console.error("Login failed:", err);

      setLoginError(
        err instanceof Error
          ? err.message
          : t.loginError
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  // Logout
  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setCurrentUser(null);
      setSessions([]);
      setSessionId(null);
      setGuestToken(null);
      setMessages([]);
      setInput("");
      setError("");
      setLoginError("");
      setShowLogin(false);
    }
  }

  // Send a new message
  async function sendMessage(messageText: string) {
    const text = messageText.trim();

    if (!text || isLoading) return;

    setInput("");
    setError("");
    setIsLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((previous) => [...previous, userMessage]);

    try {
      let currentSessionId = sessionId;
      let currentGuestToken = guestToken;

      if (!currentSessionId) {
        const sessionResponse = await createChatSession();

        currentSessionId = sessionResponse.session.id;
        currentGuestToken = sessionResponse.guestToken ?? null;

        if (!currentUser && !currentGuestToken) {
          throw new Error(t.guestTokenError);
        }

        setSessionId(currentSessionId);
        setGuestToken(currentGuestToken);

        if (currentUser) {
          setSessions((previous) => [
            sessionResponse.session,
            ...previous,
          ]);
        }
      }

      await sendChatMessage(
        currentSessionId,
        text,
        undefined,
        currentGuestToken ?? undefined
      );

      const savedMessages = await getChatMessages(
        currentSessionId,
        undefined,
        currentGuestToken ?? undefined
      );

      setMessages(
        savedMessages.map((message) => ({
          id: message.id,
          role: message.role as Message["role"],
          content: message.content,
        }))
      );

      if (currentUser) {
        const updatedSessions = await getMyChatSessions("");
        setSessions(updatedSessions);
      }
    } catch (err) {
      console.error("Chat API error:", err);

      setError(
        err instanceof Error
          ? err.message
          : t.genericError
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Edit and resend a user message
  async function handleEditMessage(
    messageId: string,
    newContent: string
  ) {
    if (!sessionId || isLoading) return;

    const text = newContent.trim();

    if (!text) return;

    // Keep a copy so we can restore the conversation if sending fails.
    const previousMessages = [...messages];

    const editedMessageIndex = previousMessages.findIndex(
      (message) => message.id === messageId
    );

    if (editedMessageIndex === -1) return;

    setError("");
    setIsLoading(true);

    // Immediately hide all messages after the edited message.
    // Also display the new text optimistically.
    const updatedMessages = previousMessages
      .slice(0, editedMessageIndex + 1)
      .map((message) =>
        message.id === messageId
          ? { ...message, content: text }
          : message
      );

    setMessages(updatedMessages);

    try {
      await editChatMessage(
        sessionId,
        messageId,
        text,
        guestToken ?? undefined
      );

      // Load the final conversation from the backend.
      const savedMessages = await getChatMessages(
        sessionId,
        undefined,
        guestToken ?? undefined
      );

      setMessages(
        savedMessages.map((message) => ({
          id: message.id,
          role: message.role as Message["role"],
          content: message.content,
        }))
      );

      if (currentUser) {
        const updatedSessions = await getMyChatSessions("");
        setSessions(updatedSessions);
      }
    } catch (err) {
      console.error("Could not edit message:", err);

      // Restore the original conversation if the request fails.
      setMessages(previousMessages);

      setError(
        err instanceof Error
          ? err.message
          : t.genericError
      );

      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  // Render application
  return (
    <main
      className="app-shell flex h-dvh w-full overflow-hidden bg-background font-sans text-foreground"
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {sidebarOpen && (
        <Sidebar
          currentUser={currentUser}
          isCheckingAuth={isCheckingAuth}
          sessions={sessions}
          sessionId={sessionId}
          isLoading={isLoading}
          language={language}
          deletingSessionId={deletingSessionId}
          onNewChat={startNewChat}
          onSelectConversation={selectConversation}
          onDeleteConversation={handleDeleteConversation}
          onLogout={handleLogout}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <section className="main-panel relative flex min-w-0 flex-1 flex-col bg-background">
        <Header
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          isAuthenticated={!!currentUser}
          isCheckingAuth={isCheckingAuth}
          onToggleLogin={() => {
            setLoginError("");
            setShowLogin((previous) => !previous);
          }}
          language={language}
          onLanguageChange={handleLanguageChange}
        />

        {showLogin && !currentUser && (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberEmail={rememberEmail}
            setRememberEmail={setRememberEmail}
            isLoggingIn={isLoggingIn}
            error={loginError}
            onSubmit={handleLogin}
            language={language}
          />
        )}

        <div className="chat-container">
          {messages.length === 0 ? (
            <WelcomeScreen
              onSuggestionClick={sendMessage}
              language={language}
            />
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              language={language}
              onEditMessage={handleEditMessage}
            />
          )}

          {error && (
            <div
              role="alert"
              style={{
                color: "#ff7777",
                padding: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <ChatComposer
            value={input}
            onChange={setInput}
            onSend={sendMessage}
            language={language}
            isLoading={isLoading}
          />
        </div>
      </section>

      {pendingDeletion && (
        <dialog
          ref={deleteDialogRef}
          className="delete-dialog"
          role="alertdialog"
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          lang={language}
          dir={language === "ar" ? "rtl" : "ltr"}
          onCancel={(event) => {
            event.preventDefault();
            if (deletingSessionId === null) setPendingDeletion(null);
          }}
        >
            <div className="delete-dialog-icon" aria-hidden="true">
              <Trash2 size={21} />
            </div>
            <h2 id="delete-dialog-title">
              {t.deleteConversationConfirmation}
            </h2>
            <p className="delete-dialog-session">{pendingDeletion.title}</p>
            <p id="delete-dialog-description" className="delete-dialog-warning">
              {t.deleteConversationWarning}
            </p>
            {error && <p className="delete-dialog-error" role="alert">{error}</p>}
            <div className="delete-dialog-actions">
              <button
                type="button"
                autoFocus
                className="delete-dialog-cancel"
                onClick={() => setPendingDeletion(null)}
                disabled={deletingSessionId !== null}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className="delete-dialog-confirm"
                onClick={confirmDeleteConversation}
                disabled={deletingSessionId !== null}
                aria-busy={deletingSessionId !== null}
              >
                <Trash2 size={16} />
                {deletingSessionId === pendingDeletion.id ? "…" : t.deleteConversation}
              </button>
            </div>
        </dialog>
      )}
    </main>
  );
}
