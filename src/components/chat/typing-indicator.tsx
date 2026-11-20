import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="message-row assistant">
      <div className="message-avatar">
        <Bot size={19} />
      </div>

      <div className="message-content">
        <span className="message-author">Company AI</span>

        <div className="typing-indicator" aria-label="Company AI is typing">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}