import BrandMark from "@/components/brand-mark";

export default function TypingIndicator() {
  return (
    <div className="mb-6 flex w-full items-start gap-3 max-[640px]:gap-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-gradient-to-br from-accent-hover to-accent text-background shadow-md shadow-accent/15 max-[640px]:size-8">
        <BrandMark size={19} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <span className="mb-2 block text-[13px] font-bold text-foreground">Company AI</span>

        <div className="mt-2 flex w-fit min-w-16 items-center gap-1.5 rounded-e-2xl rounded-es-sm rounded-ss-sm border border-accent/15 bg-surface px-4 py-3.5 shadow-md" aria-label="Company AI is typing">
          <span className="size-1.5 animate-bounce rounded-full bg-accent-hover" />
          <span className="size-1.5 animate-bounce rounded-full bg-accent-hover" />
          <span className="size-1.5 animate-bounce rounded-full bg-accent-hover" />
        </div>
      </div>
    </div>
  );
}
