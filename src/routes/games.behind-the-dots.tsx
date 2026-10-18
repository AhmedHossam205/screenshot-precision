import { createFileRoute } from "@tanstack/react-router";
import { BehindTheDotsGame } from "@/features/behind-the-dots/BehindTheDotsGame";

export const Route = createFileRoute("/games/behind-the-dots")({
  head: () => ({
    meta: [
      { title: "ورا النقط | Behind the Dots — The Analyst" },
      { name: "description", content: "لغز بيزنس قصير: اقرأ مخططات الانتشار، خمّن معامل الارتباط، وقدّم توصية مبنية على الأدلة." },
      { property: "og:title", content: "ورا النقط | Behind the Dots" },
      { property: "og:description", content: "خمّن الارتباط بين المتغيرات… واعرف إمتى النمط يبقى دليل وإمتى لأ." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BehindTheDotsGame,
});
