import type { ReactNode } from "react";

import { Dotty } from "./Mascot";

export function HalaAvatar({ size = 44 }: { size?: number }) {
  return <Dotty size={size} />;
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
        <div className="mb-0.5 text-[11px] font-semibold text-primary">دوتّي · مساعدك في التحقيق</div>
        {children}
      </div>
    </div>
  );
}
