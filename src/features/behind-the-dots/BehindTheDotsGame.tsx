import { Link } from "@tanstack/react-router";
import { ArrowLeft, FolderClosed, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";
import { CASES, MAX_SCORE, TUTORIAL } from "./data/cases";
import { BRIEFING, CHOICES, ENDING_LINE, MEETING_LINE, SKILLS, TUTORIAL_LINES } from "./data/dialogue";
import { EvidenceCard, EvidenceTray } from "./components/EvidenceFile";
import { ScatterGuess } from "./components/ScatterGuess";
import { ScatterPlot } from "./components/ScatterPlot";
import { StoryCard } from "./components/StoryCard";
import { pearson } from "./engine/correlation";
import { currentCase, initialState, reducer, totalScore, type Action, type GameState } from "./engine/gameState";
import { loadMeta, loadState, saveMeta, saveState, type Meta } from "./engine/persistence";
import { playTone } from "./engine/sound";

const USER_ID = "guest";

function Brand() {
  return (
    <header dir="ltr" className="flex items-center justify-between border-b bg-card px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-primary px-2 py-1 font-latin text-sm font-black tracking-widest text-primary-foreground">IMP</span>
      </div>
      <div className="font-latin text-sm font-bold tracking-tight">
        The <span className="text-primary">Analyst</span>
      </div>
    </header>
  );
}

const Btn = ({ children, onClick, variant = "primary", className = "" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost"; className?: string }) => (
  <button
    onClick={onClick}
    className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-bold transition active:scale-[0.99] ${
      variant === "primary" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border bg-card text-foreground hover:bg-muted"
    } ${className}`}
  >
    {children}
  </button>
);

export function BehindTheDotsGame() {
  const [loaded, setLoaded] = useState(false);
  const [state, rawDispatch] = useReducer(reducer, initialState);
  const [meta, setMeta] = useState<Meta>({ tutorialDone: false, bestScore: 0, muted: false });
  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  useEffect(() => {
    const s = loadState(window.localStorage, USER_ID);
    rawDispatch({ type: "__hydrate", s });
    setMeta(loadMeta(window.localStorage, USER_ID));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveState(window.localStorage, USER_ID, state);
  }, [state, loaded]);

  useEffect(() => {
    const onVis = () => document.hidden && rawDispatch({ type: "pause" });
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const updateMeta = (m: Partial<Meta>) =>
    setMeta((prev) => {
      const next = { ...prev, ...m };
      saveMeta(window.localStorage, USER_ID, next);
      return next;
    });

  const dispatch = (a: Action) => {
    const tone = ({ submit: "reveal", submitTutorial: "reveal", attach: "save", submitChoice: "tap" } as const)[a.type as "submit"];
    if (tone) playTone(tone, meta.muted);
    if (a.type === "finishTutorial" && !meta.tutorialDone) updateMeta({ tutorialDone: true });
    rawDispatch(a);
  };

  useEffect(() => {
    if (state.phase === "debrief") {
      const sc = totalScore(state);
      if (sc > meta.bestScore) updateMeta({ bestScore: sc });
      playTone("win", meta.muted);
    }
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.caseIndex]);

  if (!loaded) return <div className="min-h-screen bg-background" />;

  const inGame = state.phase !== "cover";

  return (
    <div dir="rtl" lang="ar" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Brand />
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          {inGame && state.phase !== "debrief" ? <EvidenceTray evidence={state.evidence} /> : <span />}
          <div className="flex items-center gap-1">
            {inGame && state.phase !== "debrief" && (
              <IconBtn label="إيقاف مؤقت" onClick={() => dispatch({ type: "pause" })}>
                <Pause className="h-4 w-4" />
              </IconBtn>
            )}
            <IconBtn label={meta.muted ? "تشغيل الصوت" : "كتم الصوت"} onClick={() => updateMeta({ muted: !meta.muted })}>
              {meta.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </IconBtn>
          </div>
        </div>

        <main key={`${state.phase}-${state.caseIndex}`} className="animate-rise">
          <Scene state={state} meta={meta} dispatch={dispatch} />
        </main>
      </div>

      {state.paused && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-pop rounded-2xl bg-card p-6 text-center shadow-card">
            <h2 className="mb-2 text-xl font-bold">التحقيق متوقف مؤقتاً</h2>
            <p className="mb-5 text-sm text-muted-foreground">تقدمك محفوظ. كمّل وقت ما تحب.</p>
            <Btn onClick={() => dispatch({ type: "resume" })} className="w-full">
              <Play className="h-4 w-4" /> كمّل التحقيق
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button aria-label={label} title={label} onClick={onClick} className="grid h-11 w-11 place-items-center rounded-full border bg-card hover:bg-muted">
      {children}
    </button>
  );
}

function Scene({ state, meta, dispatch }: { state: GameState; meta: Meta; dispatch: (a: Action) => void }) {
  switch (state.phase) {
    case "cover":
      return <Cover meta={meta} onStart={() => dispatch({ type: "start" })} hasProgress={false} />;
    case "briefing":
      return <Briefing state={state} meta={meta} dispatch={dispatch} />;
    case "tutorial":
    case "tutorialReveal":
      return <Tutorial state={state} meta={meta} dispatch={dispatch} />;
    case "puzzle":
    case "reveal":
      return <Puzzle state={state} dispatch={dispatch} />;
    case "meeting":
    case "challenge":
      return <Meeting state={state} dispatch={dispatch} />;
    case "debrief":
      return <Debrief state={state} meta={meta} dispatch={dispatch} />;
  }
}

function Cover({ meta, onStart }: { meta: Meta; onStart: () => void; hasProgress: boolean }) {
  return (
    <section className="py-8 text-center">
      <div className="mx-auto mb-6 w-full max-w-sm rounded-2xl border bg-card p-4 shadow-card">
        <ScatterPlot compact xs={CASES[0].xs} ys={CASES[0].ys} xLabel="" yLabel="" />
      </div>
      <p className="mb-2 font-latin text-xs font-semibold uppercase tracking-[0.3em] text-primary">Behind the Dots</p>
      <h1 className="mb-3 text-5xl font-black">ورا النقط</h1>
      <p className="mx-auto mb-8 max-w-md text-lg leading-relaxed text-muted-foreground">
        شكاوى عملاء "رواد" زادت. اقرأ النقط، خمّن الارتباط، واعرف إمتى النمط يبقى دليل وإمتى لأ.
      </p>
      <div className="flex flex-col items-center gap-3">
        <Btn onClick={onStart} className="w-full max-w-xs">ابدأ التحقيق</Btn>
        <Link to="/" className="inline-flex h-11 items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 rotate-180" /> ارجع للألعاب
        </Link>
        {meta.bestScore > 0 && (
          <p className="text-xs text-muted-foreground">
            أفضل نتيجة: <span className="font-latin">{meta.bestScore}/{MAX_SCORE}</span>
          </p>
        )}
      </div>
    </section>
  );
}

function Briefing({ state, meta, dispatch }: { state: GameState; meta: Meta; dispatch: (a: Action) => void }) {
  const done = state.briefingStep >= BRIEFING.length - 1;
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
        <FolderClosed className="h-10 w-10 text-primary" />
        <div>
          <div className="text-xs text-muted-foreground">ملف قضية · رواد للأجهزة المنزلية</div>
          <div className="text-lg font-bold">شكاوى العملاء</div>
        </div>
      </div>
      <div className="space-y-3">
        {BRIEFING.slice(0, state.briefingStep + 1).map((l, i) => (
          <StoryCard key={i} who={l.who}>{l.text}</StoryCard>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {done ? (
          <Btn onClick={() => dispatch({ type: "openCase" })} className="flex-1">افتح الملف</Btn>
        ) : (
          <Btn variant="ghost" onClick={() => dispatch({ type: "advanceBriefing" })} className="flex-1">التالي</Btn>
        )}
        {meta.tutorialDone && (
          <Btn variant="ghost" onClick={() => dispatch({ type: "skipTutorial", tutorialEverDone: true })}>تخطّى التمرين</Btn>
        )}
      </div>
    </section>
  );
}

function MiniPattern({ kind }: { kind: "up" | "down" | "none" }) {
  const xs = [1, 2, 3, 4, 5, 6, 7, 8];
  const ys = kind === "up" ? [2, 3, 3, 5, 5, 6, 8, 8] : kind === "down" ? [8, 7, 7, 5, 5, 4, 2, 2] : [5, 2, 7, 4, 8, 3, 6, 4];
  const label = kind === "up" ? "موجب ↗" : kind === "down" ? "سالب ↘" : "قريب من الصفر";
  return (
    <div className="rounded-xl border bg-card p-2 text-center">
      <ScatterPlot compact xs={xs} ys={ys} xLabel="" yLabel="" />
      <div className="mt-1 text-xs font-semibold">{label}</div>
    </div>
  );
}

function Tutorial({ state, meta, dispatch }: { state: GameState; meta: Meta; dispatch: (a: Action) => void }) {
  const [dot, setDot] = useState<number | null>(5);
  const revealed = state.phase === "tutorialReveal";
  const actual = pearson(TUTORIAL.xs, TUTORIAL.ys)!;
  return (
    <section className="space-y-4">
      <StoryCard>{TUTORIAL_LINES[0]}</StoryCard>
      <p className="text-center text-xs text-muted-foreground">دوس على أي نقطة تشوف الرقمين بتوعها</p>
      <div className="rounded-2xl border bg-card p-3 shadow-card">
        <ScatterPlot xs={TUTORIAL.xs} ys={TUTORIAL.ys} xLabel={TUTORIAL.xLabel} yLabel={TUTORIAL.yLabel} highlight={dot} onDotClick={setDot} showFit={revealed} />
        {dot !== null && (
          <p className="mt-1 text-center text-sm">
            الفرع ده: {TUTORIAL.xLabel} = <b className="font-latin">{TUTORIAL.xs[dot]}</b> · {TUTORIAL.yLabel} = <b className="font-latin">{TUTORIAL.ys[dot]}</b>
          </p>
        )}
      </div>
      <StoryCard delay={150}>{TUTORIAL_LINES[1]}</StoryCard>
      <div className="grid grid-cols-3 gap-2">
        <MiniPattern kind="up" />
        <MiniPattern kind="down" />
        <MiniPattern kind="none" />
      </div>
      <StoryCard delay={300}>{TUTORIAL_LINES[2]}</StoryCard>
      <h2 className="pt-2 text-center text-lg font-bold">جرّب تحرّك المؤشر</h2>
      <ScatterGuessTutorial
        guess={state.guess}
        onGuess={(v) => dispatch({ type: "setGuess", value: v })}
        result={revealed && state.tutorialGuess !== null ? { guess: state.tutorialGuess, actual, points: 0 } : undefined}
        onSubmit={() => dispatch({ type: "submitTutorial" })}
      />
      {revealed && (
        <div className="space-y-3">
          <StoryCard>{TUTORIAL.halaAfter}</StoryCard>
          <div className="flex gap-2">
            <Btn onClick={() => dispatch({ type: "finishTutorial" })} className="flex-1">كمّل التحقيق</Btn>
            <Btn variant="ghost" onClick={() => dispatch({ type: "retryTutorial" })}>
              <RotateCcw className="h-4 w-4" /> جرّب تاني
            </Btn>
          </div>
        </div>
      )}
      {!revealed && meta.tutorialDone && (
        <button onClick={() => dispatch({ type: "skipTutorial", tutorialEverDone: true })} className="mx-auto block h-11 text-sm text-muted-foreground underline">
          تخطّى التمرين
        </button>
      )}
    </section>
  );
}

function ScatterGuessTutorial(props: { guess: number; onGuess: (v: number) => void; result?: { guess: number; actual: number; points: number }; onSubmit: () => void }) {
  return <ScatterGuess c={TUTORIAL} {...props} />;
}

function Puzzle({ state, dispatch }: { state: GameState; dispatch: (a: Action) => void }) {
  const c = currentCase(state);
  const result = state.phase === "reveal" ? state.results[c.id] : undefined;
  return (
    <section className="space-y-4">
      <div className="text-xs font-semibold text-primary">
        الدليل <span className="font-latin">{state.caseIndex + 1}</span> من <span className="font-latin">{CASES.length}</span> · {c.title}
      </div>
      <StoryCard>{c.question}</StoryCard>
      <ScatterGuess
        c={c}
        guess={state.guess}
        onGuess={(v) => dispatch({ type: "setGuess", value: v })}
        result={result}
        hintsUsed={state.hintsUsed}
        onHint={() => dispatch({ type: "hint" })}
        onSubmit={() => dispatch({ type: "submit" })}
      />
      {result && (
        <div className="space-y-3">
          <StoryCard delay={200}>{c.halaAfter}</StoryCard>
          <Btn onClick={() => dispatch({ type: "attach" })} className="w-full">
            احفظ الدليل
          </Btn>
        </div>
      )}
    </section>
  );
}

function Meeting({ state, dispatch }: { state: GameState; dispatch: (a: Action) => void }) {
  const challenge = state.phase === "challenge" ? CHOICES.find((c) => c.id === state.choice) : null;
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">اجتماع العمليات</h1>
      <StoryCard>{MEETING_LINE}</StoryCard>
      <div className="grid gap-3 sm:grid-cols-3">
        {state.evidence.map((id) => (
          <EvidenceCard key={id} id={id} result={state.results[id]} />
        ))}
      </div>
      {challenge ? (
        <div className="space-y-3">
          <div className="rounded-xl border bg-muted p-3 text-sm">
            <span className="font-semibold">توصيتك: </span>{challenge.text}
          </div>
          <StoryCard>{challenge.challenge}</StoryCard>
          <Btn onClick={() => dispatch({ type: "revise" })} className="w-full">راجع توصيتك</Btn>
        </div>
      ) : (
        <div className="space-y-2">
          <h2 className="pt-2 font-bold">قدّم توصيتك</h2>
          {CHOICES.map((ch) => (
            <button
              key={ch.id}
              onClick={() => dispatch({ type: "choose", choice: ch.id })}
              aria-pressed={state.choice === ch.id}
              className={`flex w-full items-start gap-3 rounded-xl border bg-card p-4 text-right text-[15px] leading-relaxed transition hover:bg-muted ${
                state.choice === ch.id ? "border-primary ring-2 ring-primary/30" : ""
              }`}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border font-latin text-sm font-bold ${state.choice === ch.id ? "bg-primary text-primary-foreground" : ""}`}>
                {ch.id}
              </span>
              {ch.text}
            </button>
          ))}
          <Btn onClick={() => state.choice && dispatch({ type: "submitChoice" })} className={`w-full ${state.choice ? "" : "pointer-events-none opacity-40"}`}>
            قدّم التوصية
          </Btn>
        </div>
      )}
    </section>
  );
}

function Debrief({ state, meta, dispatch }: { state: GameState; meta: Meta; dispatch: (a: Action) => void }) {
  const score = totalScore(state);
  return (
    <section className="space-y-5">
      <StoryCard>{ENDING_LINE}</StoryCard>
      <div className="animate-pop rounded-2xl border bg-card p-6 text-center shadow-card">
        <div className="text-sm text-muted-foreground">دقة تقديراتك</div>
        <div className="font-latin text-6xl font-black text-primary">
          {score}<span className="text-2xl text-muted-foreground">/{MAX_SCORE}</span>
        </div>
        {meta.bestScore > 0 && <div className="mt-1 text-xs text-muted-foreground">أفضل نتيجة: <span className="font-latin">{meta.bestScore}/{MAX_SCORE}</span></div>}
        <p className="mt-3 text-sm">التوصية: تحقيق مبدئي في التأخير ووقت الاستجابة، مع جمع أدلة إضافية.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {state.evidence.map((id) => (
          <EvidenceCard key={id} id={id} result={state.results[id]} />
        ))}
      </div>
      <div className="rounded-2xl border bg-card p-4">
        <h2 className="mb-2 font-bold">المهارات اللي اتمرنت عليها</h2>
        <ul className="list-disc space-y-1 pr-5 text-sm">
          {SKILLS.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          اللي لسه مش معروف: هل التأخير أو قلة الموظفين هما السبب فعلاً؟ ده محتاج تجربة أو بيانات إضافية تستبعد العوامل التانية.
        </p>
      </div>
      <div className="rounded-2xl bg-foreground p-5 text-center text-background">
        <p className="font-latin text-lg font-bold">Read the pattern. Question the conclusion.</p>
        <p className="mt-1 text-sm opacity-80">الارتباط إشارة تستاهل نتابعها… مش حكم بالسببية.</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Btn onClick={() => dispatch({ type: "replay" })} className="flex-1">
          <RotateCcw className="h-4 w-4" /> العب مرة تانية
        </Btn>
        <Link to="/" className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border bg-card font-bold hover:bg-muted">
          ارجع للألعاب
        </Link>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        عايز تتعمق أكتر؟{" "}
        <a href="https://imp.education" target="_blank" rel="noreferrer" className="underline hover:text-primary">
          دبلومة تحليل البيانات وذكاء الأعمال من IMP
        </a>
      </p>
    </section>
  );
}
