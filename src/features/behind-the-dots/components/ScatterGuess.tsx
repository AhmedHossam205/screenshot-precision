import { Lightbulb } from "lucide-react";
import type { StoryCase } from "../data/cases";
import { HINTS } from "../data/dialogue";
import { formatR, SCORE_LABELS, scoreGuess } from "../engine/correlation";
import type { CaseResult } from "../engine/gameState";
import { RSlider } from "./RSlider";
import { ScatterPlot } from "./ScatterPlot";
import { Dotty, Glitch } from "./Mascot";

interface Props {
  c: StoryCase;
  guess: number;
  onGuess: (v: number) => void;
  result?: CaseResult | undefined;
  hintsUsed?: number;
  onHint?: () => void;
  onSubmit: () => void;
}

export function ScatterGuess({ c, guess, onGuess, result, hintsUsed = 0, onHint, onSubmit }: Props) {
  const revealed = !!result;
  const score = result ? scoreGuess(result.guess, result.actual) : null;
  return (
    <div className="rounded-2xl border bg-card p-3 shadow-card sm:p-5">
      <div dir="ltr" className="mb-1 text-center font-latin text-xs text-muted-foreground">
        {c.xLabelEn} → {c.yLabelEn}
      </div>
      <ScatterPlot xs={c.xs} ys={c.ys} xLabel={c.xLabel} yLabel={c.yLabel} showFit={revealed} />

      {!revealed ? (
        <div className="mt-3 space-y-3">
          <RSlider value={guess} onChange={onGuess} />
          {hintsUsed > 0 && (
            <div className="space-y-1">
              {HINTS.slice(0, hintsUsed).map((h) => (
                <p key={h} className="animate-rise rounded-lg bg-muted px-3 py-2 text-sm">💡 {h}</p>
              ))}
              {hintsUsed >= 2 && (
                <p className="text-xs text-muted-foreground">مش لازم تكون دقيق جداً. ثبّت توقعك وكمّل.</p>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={onSubmit}
              className="h-12 flex-1 rounded-xl bg-primary text-base font-bold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.99]"
            >
              ثبّت توقعك
            </button>
            {onHint && hintsUsed < 2 && (
              <button onClick={onHint} className="flex h-12 items-center gap-1 rounded-xl border px-4 text-sm font-semibold">
                <Lightbulb className="h-4 w-4" /> تلميح صغير
              </button>
            )}
          </div>
        </div>
      ) : (
        result &&
        score && (
          <div className="mt-3 animate-rise space-y-3">
            {result.timedOut && (
              <div className="flex items-center gap-3 rounded-xl bg-primary-soft p-3 text-sm">
                <Glitch size={40} chomp />
                <span>جليتش لحق ياكل جزء من النقط! خسرت نقطة. المرة الجاية اتحرك أسرع 💨</span>
              </div>
            )}
            {!result.timedOut && c.id !== "T0" && (
              <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                <Dotty size={36} mood="cheer" /> نجّيتني من جليتش!
              </div>
            )}
            <h3 className="text-center text-sm font-semibold text-muted-foreground">البيانات بتقول إيه؟</h3>
            <div dir="ltr" className="grid grid-cols-3 gap-2 text-center">
              <Stat label="توقعك" value={formatR(result.guess)} />
              <Stat label="r الحقيقي" value={formatR(result.actual)} strong />
              <Stat label="الفرق" value={score.error.toFixed(2)} />
            </div>
            <div className="flex items-center justify-center gap-2 animate-pop">
              <span className="rounded-full bg-primary-soft px-3 py-1 text-sm font-bold text-primary">{SCORE_LABELS[score.label]}</span>
              {c.id !== "T0" && <span className="text-sm font-semibold">+{result.points} نقط</span>}
            </div>
            <p className="text-[15px] leading-relaxed">
              توقعك كان <span dir="ltr" className="font-latin font-semibold">{formatR(result.guess)}</span>، والارتباط الحقيقي حوالي{" "}
              <span dir="ltr" className="font-latin font-semibold">{formatR(result.actual)}</span>. {c.insight}
            </p>
            {score.points < 2 && <p className="text-sm text-muted-foreground">{c.patternTip}</p>}
          </div>
        )
      )}
    </div>
  );
}

function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`rounded-xl border p-2 ${strong ? "border-primary bg-primary-soft" : ""}`}>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`font-latin text-xl font-bold tabular-nums ${strong ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}
