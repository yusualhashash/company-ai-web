import { Sparkles } from "lucide-react";

interface BrandMarkProps {
  size: number;
}

export default function BrandMark({ size }: BrandMarkProps) {
  const markSize = size >= 28 ? "size-9 text-lg" : size >= 22 ? "size-7 text-base" : "size-6 text-sm";

  return (
    <span aria-hidden="true" className={`relative inline-flex items-center justify-center ${markSize}`}>
      <span className="pointer-events-none absolute inset-0 rounded-full border border-dashed border-current/35 motion-safe:animate-[spin_12s_linear_infinite] motion-reduce:animate-none" />
      <span className="relative select-none font-black leading-none tracking-[-0.08em] text-current">YH</span>
      <Sparkles
        size={8}
        strokeWidth={2.5}
        className="absolute -right-1 -top-1 text-foreground drop-shadow motion-safe:animate-pulse motion-reduce:animate-none"
      />
    </span>
  );
}
