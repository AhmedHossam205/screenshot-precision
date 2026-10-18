import { createFileRoute, Link } from "@tanstack/react-router";
import { ScatterPlot } from "@/features/behind-the-dots/components/ScatterPlot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Analyst by IMP — ألعاب التفكير التحليلي" },
      { name: "description", content: "ألعاب قصصية قصيرة بتعلّمك التفكير التحليلي وقراءة البيانات." },
      { property: "og:title", content: "The Analyst by IMP" },
      { property: "og:description", content: "ألعاب قصصية قصيرة بتعلّمك التفكير التحليلي وقراءة البيانات." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-background">
      <header dir="ltr" className="flex items-center justify-between border-b bg-card px-4 py-3">
        <span className="rounded-md bg-primary px-2 py-1 font-latin text-sm font-black tracking-widest text-primary-foreground">IMP</span>
        <span className="font-latin text-sm font-bold">The <span className="text-primary">Analyst</span></span>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-black">اختار لعبتك</h1>
        <p className="mb-8 text-muted-foreground">قضايا قصيرة بتتحل بالتفكير، مش بالحفظ.</p>
        <Link
          to="/games/behind-the-dots"
          className="group grid gap-4 rounded-2xl border bg-card p-5 shadow-card transition hover:border-primary sm:grid-cols-[1fr_200px]"
        >
          <div>
            <div className="mb-1 font-latin text-xs font-semibold uppercase tracking-widest text-primary">Behind the Dots · جديد</div>
            <h2 className="mb-2 text-2xl font-bold">ورا النقط</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">خمن الارتباط بين المتغيرات... واعرف إمتى النمط يبقى دليل وإمتى لأ.</p>
            <span className="mt-4 inline-block text-sm font-bold text-primary group-hover:underline">العب دلوقتي ← 4–6 دقايق</span>
          </div>
          <div className="rounded-xl bg-muted p-2">
            <ScatterPlot compact xs={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]} ys={[27, 30, 19, 28, 23, 20, 13, 20, 11, 15, 5, 8]} xLabel="" yLabel="" />
          </div>
        </Link>
      </main>
    </div>
  );
}
