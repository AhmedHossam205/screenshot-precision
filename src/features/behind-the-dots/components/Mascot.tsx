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
    <div aria-hidden className={chomp ? "animate-chomp" : "animate-wobble"} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <path d="M6 40 Q4 10 32 8 Q60 10 58 40 L54 54 L46 48 L38 56 L30 48 L22 56 L14 48 L8 54 Z" className="fill-foreground" />
        <circle cx="12" cy="14" r="3" className="fill-foreground" />
        <circle cx="54" cy="12" r="2.5" className="fill-foreground" />
        <circle cx="22" cy="24" r="6" className="fill-background" />
        <circle cx="42" cy="24" r="6" className="fill-background" />
        <circle cx="23" cy="25" r="3" className="fill-primary" />
        <circle cx="41" cy="25" r="3" className="fill-primary" />
        <path d="M14 15 L28 20 M50 15 L36 20" className="stroke-background" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 36 L20 42 L24 36 L28 42 L32 36 L36 42 L40 36 L44 42 L48 36" className="fill-none stroke-background" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** The Glitch creeps toward Dotty over `seconds`; reaching her calls onTimeout once. */
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
          setTimeout(() => cb.current(), 450);
        }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, seconds]);

  const p = elapsed / seconds;
  const left = Math.max(0, Math.ceil(seconds - elapsed));
  const danger = left <= 3;
  const caught = elapsed >= seconds;

  return (
    <div className={`rounded-2xl border bg-card p-3 shadow-card ${danger && !caught ? "animate-shiver" : ""}`} role="timer" aria-label={`فاضل ${left} ثواني`}>
      <div className="mb-1 flex items-center justify-between text-xs font-semibold">
        <span className={danger ? "text-primary" : "text-muted-foreground"}>
          {caught ? "جليتش مسك دوتّي! 😱" : danger ? "بسرعة! جليتش قرّب!" : "ثبّت توقعك قبل ما جليتش يوصل لدوتّي"}
        </span>
        <span className={`font-latin text-lg font-black tabular-nums ${danger ? "text-primary" : ""}`}>{left}s</span>
      </div>
      <div dir="ltr" className="relative h-16">
        <div className="absolute inset-x-0 bottom-2 h-2 rounded-full bg-muted" />
        <div className="absolute bottom-2 left-0 h-2 rounded-full bg-primary/60" style={{ width: `${p * 100}%` }} />
        <div className="absolute bottom-0" style={{ left: `calc(${p * 82}% )` }}>
          <Glitch size={52} chomp={caught || danger} />
        </div>
        <div className="absolute bottom-1 right-0">
          <Dotty size={44} mood={caught || danger ? "scared" : "happy"} />
        </div>
      </div>
    </div>
  );
}
