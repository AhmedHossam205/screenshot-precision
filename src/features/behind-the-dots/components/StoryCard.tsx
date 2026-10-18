import type { ReactNode } from "react";

export function HalaAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-foreground"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      ه
    </div>
  );
}

export function StoryCard({ who = "hala", children, delay = 0 }: { who?: "hala" | "player"; children: ReactNode; delay?: number }) {
  if (who === "player") {
    return (
      <div className="flex animate-rise justify-end" style={{ animationDelay: `${delay}ms` }}>
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-foreground px-4 py-3 text-[15px] leading-relaxed text-background">
          <div className="mb-0.5 text-[11px] opacity-70">أنت · المحلل</div>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex animate-rise items-start gap-3" style={{ animationDelay: `${delay}ms` }}>
      <HalaAvatar />
      <div className="max-w-[88%] rounded-2xl rounded-tr-sm border bg-card px-4 py-3 text-[15px] leading-relaxed shadow-card">
        <div className="mb-0.5 text-[11px] font-semibold text-primary">هالة · مسؤولة تجربة العملاء</div>
        {children}
      </div>
    </div>
  );
}
