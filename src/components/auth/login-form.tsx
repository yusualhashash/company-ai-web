
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
      style={{
        ...panelStyle,
        right: isArabic ? "auto" : "20px",
        left: isArabic ? "20px" : "auto",
        direction: isArabic ? "rtl" : "ltr",
      }}
      lang={language}
    >
      <div style={headerStyle}>
        <div style={logoStyle}>
          <Bot size={23} />
        </div>

        <div>
          <h3 style={titleStyle}>{t.welcomeBack}</h3>
          <p style={subtitleStyle}>{t.loginSubtitle}</p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <label style={labelStyle}>{t.emailAddress}</label>

        <div style={inputWrapperStyle}>
          <Mail size={17} style={iconStyle} />

          <input
            type="email"
            placeholder={t.enterEmail}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="username"
            dir="ltr"
            style={fieldStyle}
          />
        </div>

        <label style={labelStyle}>{t.password}</label>

        <div style={inputWrapperStyle}>
          <LockKeyhole size={17} style={iconStyle} />

          <input
            type={showPassword ? "text" : "password"}
            placeholder={t.enterPassword}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            dir="ltr"
            style={fieldStyle}
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? t.hidePassword : t.showPassword}
            title={showPassword ? t.hidePassword : t.showPassword}
            style={visibilityButtonStyle}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>

        <label style={rememberStyle}>
          <input
            type="checkbox"
            checked={rememberEmail}
            onChange={(event) =>
              setRememberEmail(event.target.checked)
            }
            style={{
              width: "16px",
              height: "16px",
              accentColor: "#10a37f",
              cursor: "pointer",
            }}
          />
          {t.rememberEmail}
        </label>

        {error && (
          <div role="alert" style={errorStyle}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoggingIn}
          className="login-button"
          style={{
            width: "100%",
            marginTop: "8px",
            opacity: isLoggingIn ? 0.7 : 1,
            cursor: isLoggingIn ? "not-allowed" : "pointer",
          }}
        >
          {isLoggingIn ? t.signingIn : t.signInToCompany}
        </button>
      </form>

      <p style={footerStyle}>{t.secureEmployeeAccess}</p>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  position: "absolute",
  top: "75px",
  zIndex: 100,
  width: "min(360px, calc(100vw - 32px))",
  padding: "24px",
  borderRadius: "16px",
  background: "#202027",
  border: "1px solid #393943",
  boxShadow: "0 16px 45px rgba(0,0,0,0.45)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "13px",
  marginBottom: "25px",
};

const logoStyle: React.CSSProperties = {
  width: "46px",
  height: "46px",
  borderRadius: "13px",
  background: "rgba(16,163,127,0.15)",
  color: "#10a37f",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "17px",
  fontWeight: 700,
  color: "#ffffff",
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#9999a5",
  marginTop: "4px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#d5d5dc",
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "8px",
};

const inputWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  height: "46px",
  padding: "0 12px",
  marginBottom: "18px",
  borderRadius: "9px",
  border: "1px solid #41414c",
  background: "#15151b",
};

const iconStyle: React.CSSProperties = {
  color: "#858592",
  flexShrink: 0,
};

const fieldStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#ffffff",
  fontSize: "13px",
};

const visibilityButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  background: "transparent",
  color: "#9999a5",
  cursor: "pointer",
  padding: "5px",
};

const rememberStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  marginBottom: "17px",
  color: "#b8b8c2",
  fontSize: "12px",
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  padding: "10px 12px",
  marginBottom: "12px",
  borderRadius: "8px",
  background: "rgba(255,80,80,0.09)",
  border: "1px solid rgba(255,80,80,0.2)",
  color: "#ff8585",
  fontSize: "12px",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#777783",
  fontSize: "11px",
  marginTop: "18px",
  marginBottom: 0,
};
