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
  question: "جرّب تحرّك المؤشر: النقط دي بتقول إيه؟",
  xLabel: "عدد الطلبات اللي اتراجعت",
  yLabel: "عدد الفحوصات المكتملة",
  xLabelEn: "Items inspected",
  yLabelEn: "Checks completed",
  xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  ys: [3, 5, 4, 7, 8, 8, 11, 10, 13, 12],
  insight: "النقط طالعة لفوق وقريبة من خط تخيلي، فالقيمة موجبة وقوية.",
  halaAfter: "تمام كده. يلا نشوف البيانات الحقيقية.",
  evidenceTitle: "تمرين",
  evidenceSummary: "",
  patternTip: "النقط طالعة لفوق ومتقاربة، فالقيمة موجبة وقوية نسبياً.",
};

export const CASES: readonly StoryCase[] = [
  {
    id: "C1",
    title: "الدليل أ · التأخير والشكاوى",
    question: "أول حاجة: هل الفروع اللي التسليم فيها بيتأخر بيظهر عندها شكاوى أكتر؟",
    xLabel: "متوسط تأخير التسليم (ساعة)",
    yLabel: "شكاوى لكل 100 طلب",
    xLabelEn: "Delivery delay (hours)",
    yLabelEn: "Complaints / 100 orders",
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    ys: [4, 7, 4, 11, 7, 10, 9, 15, 8, 19, 14, 17],
    insight: "النقط عموماً بترتفع مع زيادة التأخير. دي إشارة تستحق نتابعها، مش إثبات للسبب.",
    halaAfter:
      "واضح إن في ارتباط موجب بين التأخير والشكاوى. ده سبب قوي إننا نراجع عملية التسليم… بس مش دليل لوحده على السبب.",
    evidenceTitle: "تأخير التسليم ↔ الشكاوى",
    evidenceSummary: "ارتباط موجب قوي: التأخير الأكبر بيصاحبه شكاوى أكتر في العينة دي.",
    patternTip: "النقط بتميل لفوق ومتقاربة نسبياً، فالقيمة موجبة وقوية.",
  },
  {
    id: "C2",
    title: "الدليل ب · الموظفين ووقت الانتظار",
    question: "طيب بص على عدد الموظفين الموجودين في الشيفت، ووقت انتظار رد خدمة العملاء.",
    xLabel: "عدد الموظفين في الشيفت",
    yLabel: "وقت انتظار الرد (دقيقة)",
    xLabelEn: "Agents on shift",
    yLabelEn: "Response wait (min)",
    xs: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    ys: [27, 30, 19, 28, 23, 20, 13, 20, 11, 15, 5, 8],
    insight: "كل ما عدد الموظفين يزيد، وقت الانتظار بيميل يقل في العينة دي.",
    halaAfter:
      "هنا النقط نازلة. الفروع اللي عندها موظفين أكتر وقت الانتظار فيها أقل غالباً. ارتباط عكسي، مش موجب.",
    evidenceTitle: "الموظفين ↔ وقت الانتظار",
    evidenceSummary: "ارتباط عكسي قوي: موظفين أكتر بيصاحبهم انتظار أقل في العينة دي.",
    patternTip: "النقط متقاربة على اتجاه نازل، فالقيمة سالبة وقوية نسبياً.",
  },
  {
    id: "C3",
    title: "الدليل ج · الخصومات والشكاوى",
    question: "وفي رأي تالت بيقول: الخصومات هي اللي هتقلل الشكاوى. هل البيانات بتبين علاقة خطية واضحة؟",
    xLabel: "نسبة الخصم (%)",
    yLabel: "شكاوى لكل 100 طلب",
    xLabelEn: "Discount (%)",
    yLabelEn: "Complaints / 100 orders",
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    ys: [12, 4, 17, 7, 16, 9, 10, 14, 5, 18, 8, 11],
    insight: "مفيش اتجاه خطي واضح هنا. ده ما يعنيش إن الخصومات عمرها ما بتأثر.",
    halaAfter:
      "في البيانات دي مش ظاهر ارتباط خطي واضح. ده ما يثبتش إن الخصومات مالهاش أي تأثير في كل الظروف.",
    evidenceTitle: "الخصومات ↔ الشكاوى",
    evidenceSummary: "ارتباط خطي قريب من الصفر: مفيش ارتباط خطي واضح في العينة دي.",
    patternTip: "النقط متبعثرة من غير ميل واضح، فالقيمة قريبة من الصفر.",
  },
];

export const ALL_CASE_IDS = CASES.map((c) => c.id);
export const MAX_SCORE = CASES.length * 3;
