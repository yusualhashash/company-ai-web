
"use client";

import { User, LogOut, Settings } from "lucide-react";
import type { CurrentUser } from "@/lib/api";
import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface UserProfileProps {
  currentUser: CurrentUser | null;
  onLogout: () => void;
  language: Language;
}

export default function UserProfile({
  currentUser,
  onLogout,
  language,
}: UserProfileProps) {
  const t = translations[language];
  const isArabic = language === "ar";

  return (
    <div
      className="flex min-w-0 items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/[0.045]"
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-slate-600 to-slate-800 text-foreground">
        <User size={18} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-xs font-semibold text-foreground">
          {currentUser ? currentUser.email : t.guestUser}
        </span>

        <span className="text-[10px] text-muted">
          {currentUser ? t.authenticatedUser : t.publicAccess}
        </span>
      </div>

      {currentUser ? (
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
          onClick={onLogout}
          title={t.signOut}
          aria-label={t.signOut}
        >
          <LogOut size={17} />
        </button>
      ) : (
        <Settings size={18} className="shrink-0 text-muted" />
      )}
    </div>
  );
}
