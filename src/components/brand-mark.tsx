import { Bot, Sparkles } from "lucide-react";

interface BrandMarkProps {
  size: number;
}

export default function BrandMark({ size }: BrandMarkProps) {
  return (
    <span aria-hidden="true" className="relative inline-flex items-center justify-center">
      <span className="pointer-events-none absolute -inset-[3px] rounded-full border border-current/30" />
      <Bot size={size} strokeWidth={1.9} />
      <Sparkles
        size={Math.max(8, Math.round(size * 0.38))}
        strokeWidth={2.4}
        className="absolute -right-1 -top-1 text-foreground drop-shadow"
      />
    </span>
  );
}
