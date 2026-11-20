
"use client";

import { Bot, Code2, Lightbulb, MessageSquare } from "lucide-react";

import type { Language } from "@/lib/i18n";
import { translations } from "@/lib/i18n";

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
  language: Language;
}

const suggestions = [
  {
    id: "services",
    icon: <MessageSquare size={18} />,
    prompt: "What services does our company provide?",
  },
  {
    id: "technical",
    icon: <Code2 size={18} />,
    prompt: "What technologies does our company use?",
  },
  {
    id: "assistance",
    icon: <Lightbulb size={18} />,
    prompt: "How can your team help my business?",
  },
];

export default function WelcomeScreen({
  onSuggestionClick,
  language,
}: WelcomeScreenProps) {
  const t = translations[language];
  const isArabic = language === "ar";

  const suggestionTranslations = {
    services: {
      title: t.companyServices,
      description: t.companyServicesDescription,
    },
    technical: {
      title: t.technicalSolutions,
      description: t.technicalSolutionsDescription,
    },
    assistance: {
      title: t.getAssistance,
      description: t.getAssistanceDescription,
    },
  };

  return (
    <div
      className="welcome-screen"
      lang={language}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="welcome-icon">
        <Bot size={30} />
      </div>

      <h1>{t.welcomeTitle}</h1>

      <p>{t.welcomeDescription}</p>

      <div className="suggestion-grid">
        {suggestions.map((item) => {
          const translated =
            suggestionTranslations[
              item.id as keyof typeof suggestionTranslations
            ];

          return (
            <button
              key={item.id}
              type="button"
              className="suggestion-card"
              onClick={() => onSuggestionClick(item.prompt)}
            >
              <span className="suggestion-icon">{item.icon}</span>

              <span className="suggestion-title">
                {translated.title}
              </span>

              <span className="suggestion-description">
                {translated.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
