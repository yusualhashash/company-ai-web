
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Bot, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  rememberEmail: boolean;
  setRememberEmail: (value: boolean) => void;
  isLoggingIn: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  language: Language;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  rememberEmail,
  setRememberEmail,
  isLoggingIn,
  error,
  onSubmit,
  language,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const t = translations[language];
  const isArabic = language === "ar";

  return (
    <div
      className={`absolute top-[75px] z-[100] w-[360px] max-w-[calc(100vw_-_32px)] rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl shadow-black/40 ${isArabic ? "left-5" : "right-5"} max-[640px]:left-4 max-[640px]:right-4 max-[640px]:w-auto`}
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mb-6 flex items-center gap-3.5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent-hover">
          <Bot size={23} />
        </div>

        <div>
          <h3 className="m-0 text-lg font-bold text-foreground">{t.welcomeBack}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{t.loginSubtitle}</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="mb-2 block text-xs font-semibold text-foreground">{t.emailAddress}</label>

        <div className="mb-4 flex h-12 w-full items-center gap-2.5 rounded-xl border border-border bg-background px-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">

          <Mail size={17} className="shrink-0 text-muted" />

          <input
            type="email"
            placeholder={t.enterEmail}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="username"
            dir="ltr"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted focus:ring-0 autofill:shadow-[inset_0_0_0_1000px_var(--color-background)] autofill:[-webkit-text-fill-color:var(--color-foreground)]"
          />
        </div>

        <label className="mb-2 block text-xs font-semibold text-foreground">{t.password}</label>

        <div className="mb-4 flex h-12 w-full items-center gap-2.5 rounded-xl border border-border bg-background px-3 transition focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">

          <LockKeyhole size={17} className="shrink-0 text-muted" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder={t.enterPassword}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            dir="ltr"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted focus:ring-0 autofill:shadow-[inset_0_0_0_1000px_var(--color-background)] autofill:[-webkit-text-fill-color:var(--color-foreground)]"
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? t.hidePassword : t.showPassword}
            title={showPassword ? t.hidePassword : t.showPassword}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-muted transition hover:bg-white/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>

        <label className="mb-4 flex cursor-pointer items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(event) =>
              setRememberEmail(event.target.checked)
            }
            className="size-4 cursor-pointer accent-accent"
          />
          {t.rememberEmail}
        </label>

        {error && (
          <div role="alert" className="mb-3 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className={`mt-2 min-h-11 w-full rounded-xl bg-gradient-to-r from-accent-hover to-accent px-4 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/10 transition hover:-translate-y-0.5 hover:shadow-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 ${isLoggingIn ? "opacity-70" : ""}`}
        >
          {isLoggingIn ? t.signingIn : t.signInToCompany}
        </button>
      </form>

    </div>
  );
}
