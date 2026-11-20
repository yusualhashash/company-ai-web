
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
      className="user-profile"
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="avatar">
        <User size={18} />
      </div>

      <div className="profile-info">
        <span className="profile-name">
          {currentUser ? currentUser.email : t.guestUser}
        </span>

        <span className="profile-role">
          {currentUser ? t.authenticatedUser : t.publicAccess}
        </span>
      </div>

      {currentUser ? (
        <button
          type="button"
          className="icon-button"
          onClick={onLogout}
          title={t.signOut}
          aria-label={t.signOut}
        >
          <LogOut size={17} />
        </button>
      ) : (
        <Settings size={18} className="settings-icon" />
      )}
    </div>
  );
}
