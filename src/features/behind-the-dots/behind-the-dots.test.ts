import { describe, expect, it } from "vitest";
import { CASES, TUTORIAL } from "./data/cases";
import { formatR, pearson, scoreGuess } from "./engine/correlation";
import { initialState, reducer, totalScore, type Action, type GameState } from "./engine/gameState";
import { loadState, saveState, sessionKey } from "./engine/persistence";

const run = (s: GameState, ...as: Action[]) => as.reduce(reducer, s);
const memStore = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
};

describe("pearson", () => {
  it("matches the bible's coefficients", () => {
    expect(pearson(TUTORIAL.xs, TUTORIAL.ys)!).toBeCloseTo(0.96, 2);
    const [c1, c2, c3] = CASES.map((c) => pearson(c.xs, c.ys)!) as [number, number, number];
    expect(Math.abs(c1 - 0.82)).toBeLessThan(0.005);
    expect(Math.abs(c2 + 0.88)).toBeLessThan(0.005);
    expect(Math.abs(c3 - 0.05)).toBeLessThan(0.005);
  });
  it("is order-invariant", () => {
    const c = CASES[0]!;
    expect(pearson([...c.xs].reverse(), [...c.ys].reverse())).toBeCloseTo(pearson(c.xs, c.ys)!, 12);
  });
  it("returns null for degenerate input, never NaN", () => {
    expect(pearson([], [])).toBeNull();
    expect(pearson([1], [2])).toBeNull();
    expect(pearson([1, 2, 3], [5, 5, 5])).toBeNull();
    expect(formatR(null)).not.toContain("NaN");
  });
});

describe("scoring thresholds", () => {
  it("awards 3/2/1/0 at exact boundaries", () => {
    expect(scoreGuess(0.65, 0.5).points).toBe(3);
    expect(scoreGuess(0.8, 0.5).points).toBe(2);
    expect(scoreGuess(1.0, 0.5).points).toBe(1);
    expect(scoreGuess(-0.01, 0.5).points).toBe(0);
  });
});

describe("game flow", () => {
  const toPuzzle = () =>
    run(initialState, { type: "start" }, { type: "advanceBriefing" }, { type: "advanceBriefing" }, { type: "openCase" }, { type: "submitTutorial" }, { type: "finishTutorial" });

  it("tutorial cannot be skipped on first play", () => {
    const s = run(initialState, { type: "start" }, { type: "openCase" }, { type: "skipTutorial", tutorialEverDone: false });
    expect(s.phase).toBe("tutorial");
  });
  it("awards points once per case and saves evidence once", () => {
    let s = run(toPuzzle(), { type: "setGuess", value: 0.8 }, { type: "submit" });
    expect(s.results.C1?.points).toBe(3);
    s = run(s, { type: "submit" }, { type: "attach" }, { type: "attach" });
    expect(s.evidence).toEqual(["C1"]);
    expect(totalScore(s)).toBe(3);
  });
  it("guess moves in 0.01 steps", () => {
    expect(run(toPuzzle(), { type: "setGuess", value: 0.37 }).guess).toBe(0.37);
    expect(run(toPuzzle(), { type: "setGuess", value: -0.63 }).guess).toBe(-0.63);
  });
  it("timeout reveals and costs 1 point, never below 0", () => {
    const s = run(toPuzzle(), { type: "setGuess", value: 0.8 }, { type: "timeout" });
    expect(s.phase).toBe("reveal");
    expect(s.results.C1?.points).toBe(2);
    expect(s.results.C1?.timedOut).toBe(true);
    const z = run(toPuzzle(), { type: "setGuess", value: -1 }, { type: "timeout" });
    expect(z.results.C1?.points).toBe(0);
  });
  it("hints do not change the guess or reveal r", () => {
    const s = run(toPuzzle(), { type: "hint" }, { type: "hint" }, { type: "hint" });
    expect(s.hintsUsed).toBe(2);
    expect(s.results.C1).toBeUndefined();
  });
  it("overclaims lead to challenge, then revision, and A finishes", () => {
    let s = toPuzzle();
    for (let i = 0; i < 3; i++) s = run(s, { type: "submit" }, { type: "attach" });
    expect(s.phase).toBe("meeting");
    s = run(s, { type: "choose", choice: "B" }, { type: "submitChoice" });
    expect(s.phase).toBe("challenge");
    s = run(s, { type: "revise" }, { type: "choose", choice: "A" }, { type: "submitChoice" });
    expect(s.phase).toBe("debrief");
    expect(s.evidence).toHaveLength(3);
  });
});

describe("persistence", () => {
  it("restores reveal after refresh without re-awarding", () => {
    const store = memStore();
    const s = run(initialState, { type: "start" }, { type: "openCase" }, { type: "submitTutorial" }, { type: "finishTutorial" }, { type: "setGuess", value: 0.8 }, { type: "submit" });
    saveState(store, "u1", s);
    const back = loadState(store, "u1");
    expect(back.phase).toBe("reveal");
    expect(totalScore(run(back, { type: "submit" }))).toBe(3);
    expect(store.getItem(sessionKey("u2"))).toBeNull();
  });
  it("ignores corrupt or wrong-version saves", () => {
    const store = memStore();
    store.setItem(sessionKey("u"), "{bad");
    expect(loadState(store, "u").phase).toBe("cover");
    store.setItem(sessionKey("u"), JSON.stringify({ v: 0, phase: "debrief" }));
    expect(loadState(store, "u").phase).toBe("cover");
  });
});
