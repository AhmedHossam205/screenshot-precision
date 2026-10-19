import { useEffect, useRef, useState } from "react";

export type Mood = "happy" | "scared" | "cheer";

/** Dotty — a friendly data point who escaped the Glitch monster and guides the player. */
export function Dotty({ size = 44, mood = "happy" }: { size?: number; mood?: Mood }) {
  return (
    <div aria-hidden className={`shrink-0 ${mood === "scared" ? "animate-shiver" : mood === "cheer" ? "animate-hop" : "animate-bob"}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <ellipse cx="32" cy="60" rx="16" ry="3" className="fill-foreground/10" />
        <circle cx="32" cy="32" r="26" className="fill-primary" />
        <circle cx="24" cy="22" r="6" className="fill-primary-foreground/25" />
        <g className="animate-blink" style={{ transformOrigin: "32px 28px" }}>
          <circle cx="23" cy="28" r="6" className="fill-primary-foreground" />
          <circle cx="41" cy="28" r="6" className="fill-primary-foreground" />
          <circle cx={mood === "scared" ? 21 : 24} cy="29" r="3" className="fill-foreground" />
          <circle cx={mood === "scared" ? 39 : 42} cy="29" r="3" className="fill-foreground" />
        </g>
        {mood === "scared" ? (
          <ellipse cx="32" cy="45" rx="5" ry="6" className="fill-foreground" />
        ) : (
          <path d="M22 41 Q32 52 42 41" className="fill-none stroke-primary-foreground" strokeWidth="4" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}

/** Glitch — the scrambled-dots monster that eats data when time runs out. */
export function Glitch({ size = 56, chomp = false }: { size?: number; chomp?: boolean }) {
  return (
    <div aria-hidden className={chomp ? "animate-lunge" : "animate-scuttle"} style={{ width: size, height: size }}>
      <svg viewBox="0 0 80 80" width={size} height={size} overflow="visible">
        {/* orbiting eaten data dots */}
        <g className="animate-orbit" style={{ transformOrigin: "40px 40px" }}>
          <circle cx="6" cy="20" r="3" className="fill-primary" />
          <circle cx="74" cy="30" r="2.5" className="fill-chart-dot" />
          <circle cx="66" cy="72" r="2" className="fill-primary" />
        </g>
        {/* legs */}
        <g className="fill-foreground">
          <rect x="18" y="62" width="7" height="12" rx="3.5" className="animate-leg" style={{ transformOrigin: "21px 62px" }} />
          <rect x="36" y="62" width="7" height="12" rx="3.5" className="animate-leg-alt" style={{ transformOrigin: "39px 62px" }} />
          <rect x="54" y="62" width="7" height="12" rx="3.5" className="animate-leg" style={{ transformOrigin: "57px 62px" }} />
        </g>
        {/* horns */}
        <path d="M20 22 L12 4 L30 16 Z M60 22 L68 4 L50 16 Z" className="fill-primary animate-wiggle" style={{ transformOrigin: "40px 20px" }} />
        {/* spiky body */}
        <path d="M8 44 Q6 14 40 12 Q74 14 72 44 Q74 58 66 66 L14 66 Q6 58 8 44 Z" className="fill-foreground" />
        <path d="M14 30 L6 26 M66 30 L74 26 M12 48 L3 50 M68 48 L77 50" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
        {/* eyes */}
        <circle cx="28" cy="30" r="9" className="fill-background" />
        <circle cx="52" cy="30" r="9" className="fill-background" />
        <g className="animate-look">
          <circle cx="29" cy="31" r="4.5" className="fill-primary" />
          <circle cx="53" cy="31" r="4.5" className="fill-primary" />
          <circle cx="30.5" cy="29.5" r="1.5" className="fill-background" />
          <circle cx="54.5" cy="29.5" r="1.5" className="fill-background" />
        </g>
        <path d="M17 18 L36 24 M63 18 L44 24" className="stroke-background" strokeWidth="3.5" strokeLinecap="round" />
        {/* mouth */}
        <path d="M18 44 Q40 40 62 44 L58 58 Q40 64 22 58 Z" className="fill-primary/80" />
        <g className={chomp ? "animate-jaw-fast" : "animate-jaw"}>
          <path d="M18 44 L24 52 L30 44 L36 52 L42 44 L48 52 L54 44 L60 52 L62 44 Z" className="fill-background" />
        </g>
        <path d="M22 58 L27 52 L32 58 L38 52 L44 58 L50 52 L56 58 Z" className="fill-background" />
      </svg>
    </div>
  );
}

/** The Glitch silently creeps toward Dotty over `seconds` (no countdown shown); reaching her calls onTimeout once. */
export function ChaseTimer({ seconds, paused, onTimeout }: { seconds: number; paused: boolean; onTimeout: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const fired = useRef(false);
  const cb = useRef(onTimeout);
  cb.current = onTimeout;

  useEffect(() => {
    if (paused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setElapsed((e) => {
        const n = Math.min(seconds, e + dt);
        if (n >= seconds && !fired.current) {
          fired.current = true;
          setTimeout(() => cb.current(), 500);
        }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, seconds]);

  const p = elapsed / seconds;
  const danger = p >= 0.75;
  const caught = elapsed >= seconds;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 shadow-card backdrop-blur" aria-hidden>
      <div className={`mx-auto max-w-2xl px-4 pt-1 ${danger && !caught ? "animate-shiver" : ""}`}>
        <div className={`text-center text-xs font-semibold ${danger ? "text-primary" : "text-muted-foreground"}`}>
          {caught ? "جليتش مسك دوتّي!" : danger ? "جليتش قرّب جداً! ثبّت توقعك!" : "جليتش جاي ورا دوتّي…"}
        </div>
        <div dir="ltr" className="relative h-20">
          <div className="absolute inset-x-0 bottom-3 h-1.5 rounded-full bg-muted" />
          <div className="absolute bottom-3 left-0 h-1.5 rounded-full bg-primary/50" style={{ width: `${p * 100}%` }} />
          <div className="absolute bottom-1" style={{ left: `${p * 80}%`, transform: `scale(${1 + p * 0.35})`, transformOrigin: "bottom left" }}>
            <Glitch size={56} chomp={caught || danger} />
          </div>
          <div className="absolute bottom-2 right-0">
            <Dotty size={44} mood={caught || danger ? "scared" : "happy"} />
          </div>
        </div>
      </div>
    </div>
  );
}
