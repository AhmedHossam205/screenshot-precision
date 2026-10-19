export type CaseId = "T0" | "C1" | "C2" | "C3";

export interface StoryCase {
  id: CaseId;
  title: string;
  question: string;
  xLabel: string;
  yLabel: string;
  xLabelEn: string;
  yLabelEn: string;
  xs: readonly number[];
  ys: readonly number[];
  /** Reveal text after the guess sentence. */
  insight: string;
  /** Hala's line after the reveal. */
  halaAfter: string;
  evidenceTitle: string;
  evidenceSummary: string;
  /** Short explanation shown on poor guesses. */
  patternTip: string;
}

export const TUTORIAL: StoryCase = {
  id: "T0",
  title: "تمرين: نمط طالع",
  question: "حرّك المؤشر وخمّن اتجاه النقط.",
  xLabel: "عدد الأصناف اللي اتفحصت",
  yLabel: "الفحوصات المكتملة",
  xLabelEn: "Items inspected",
  yLabelEn: "Checks completed",
  xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ys: [3, 5, 4, 7, 8, 8, 11, 10, 13, 12],
  insight: "النقط طالعة لفوق وقريبة من خط. العلاقة طردية وقوية.",
  halaAfter: "عاش! التدريب كان على مهلك. من دلوقتي كل قضية لها 15 ثانية—خلّصها قبل ما جليتش ياكل دوتّي والملف!",
  evidenceTitle: "تمرين",
  evidenceSummary: "",
  patternTip: "النقط طالعة لفوق وقريبة من خط.",
};

export const CASES: readonly StoryCase[] = [
  {
    id: "C1",
    title: "التأخير والشكاوى",
    question: "بص على النقط: التأخير الأكبر معاه شكاوى أكتر؟",
    xLabel: "متوسط تأخير التسليم (ساعة)",
    yLabel: "شكاوى لكل 100 طلب",
    xLabelEn: "Delivery delay (hours)",
    yLabelEn: "Complaints / 100 orders",
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    ys: [4, 7, 4, 11, 7, 10, 9, 15, 8, 19, 14, 17],
    insight: "النقط طالعة لفوق. ده ارتباط، مش إثبات للسبب.",
    halaAfter: "الاتنين بيزيدوا مع بعض في العينة دي. محتاجين دليل أكتر عشان نعرف السبب.",
    evidenceTitle: "تأخير التسليم ↔ الشكاوى",
    evidenceSummary: "التأخير والشكاوى بيزيدوا مع بعض في العينة.",
    patternTip: "النقط طالعة لفوق وقريبة من خط.",
  },
  {
    id: "C2",
    title: "الموظفين ووقت الانتظار",
    question: "لما عدد الموظفين يزيد، وقت الانتظار بيحصل له إيه؟",
    xLabel: "عدد الموظفين في الشيفت",
    yLabel: "وقت انتظار الرد (دقيقة)",
    xLabelEn: "Agents on shift",
    yLabelEn: "Response wait (min)",
    xs: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    ys: [27, 30, 19, 28, 23, 20, 13, 20, 11, 15, 5, 8],
    insight: "النقط نازلة. موظفين أكتر مع انتظار أقل.",
    halaAfter: "دي علاقة عكسية. وده برضه ارتباط، مش دليل أكيد على السبب.",
    evidenceTitle: "الموظفين ↔ وقت الانتظار",
    evidenceSummary: "موظفين أكتر مع وقت انتظار أقل في العينة.",
    patternTip: "النقط نازلة وقريبة من خط.",
  },
  {
    id: "C3",
    title: "الخصومات والشكاوى",
    question: "النقط دي بتبين اتجاه واضح بين الخصم والشكاوى؟",
    xLabel: "نسبة الخصم (%)",
    yLabel: "شكاوى لكل 100 طلب",
    xLabelEn: "Discount (%)",
    yLabelEn: "Complaints / 100 orders",
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    ys: [12, 4, 17, 7, 16, 9, 10, 14, 5, 18, 8, 11],
    insight: "النقط متبعثرة. مفيش اتجاه واضح هنا.",
    halaAfter: "ده ما يثبتش إن الخصومات ملهاش تأثير في ظروف تانية.",
    evidenceTitle: "الخصومات ↔ الشكاوى",
    evidenceSummary: "مفيش اتجاه واضح بين الخصم والشكاوى في العينة.",
    patternTip: "النقط متبعثرة من غير ميل واضح.",
  },
];

export const ALL_CASE_IDS = CASES.map((c) => c.id);
export const MAX_SCORE = CASES.length * 3;
