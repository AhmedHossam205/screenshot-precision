import { Dotty, Glitch } from "./Mascot";

export type StoryScene = "welcome" | "problem" | "scatter" | "chase";

const sceneNotes: Record<StoryScene, string> = {
  welcome: "رامي جهّز ملف روّاد",
  problem: "تنبيه جديد: الشكاوى زادت!",
  scatter: "كل نقطة = فرع من فروع روّاد",
  chase: "جليتش بيجري ورا دوتّي!",
};

/** A full-body analyst guide, drawn in layered SVG so his gestures and the data can move independently. */
export function GuideIllustration({ scene }: { scene: StoryScene }) {
  return (
    <div className={`guide-stage guide-stage-${scene}`} role="img" aria-label={sceneNotes[scene]}>
      <div className="guide-stage-glow" />
      <div className="guide-spark guide-spark-one">✦</div>
      <div className="guide-spark guide-spark-two">✦</div>
      <svg className="guide-full-figure" viewBox="0 0 360 300" aria-hidden="true">
        <g className="guide-bars">
          <rect x="22" y="202" width="46" height="69" rx="8" />
          <rect x="76" y="164" width="46" height="107" rx="8" />
          <rect x="130" y="123" width="46" height="148" rx="8" />
          <rect x="184" y="82" width="46" height="189" rx="8" />
          <path d="M30 186 C88 162 122 140 174 99" className="guide-trend-line" />
          <path d="M164 97 L180 94 L173 110" className="guide-trend-arrow" />
          <circle cx="51" cy="184" r="6" className="guide-trend-dot" />
          <circle cx="101" cy="151" r="6" className="guide-trend-dot" />
          <circle cx="146" cy="135" r="6" className="guide-trend-dot" />
          <circle cx="184" cy="98" r="6" className="guide-trend-dot" />
        </g>
        <g className="guide-person">
          {/* legs and sneakers */}
          <path d="M164 171 C153 202 128 215 98 235 L78 230 L106 204 L130 167Z" fill="#334b65" stroke="#25384d" strokeWidth="4" strokeLinejoin="round" />
          <path d="M188 171 C211 196 228 203 246 221 L236 238 L205 225 L174 199Z" fill="#334b65" stroke="#25384d" strokeWidth="4" strokeLinejoin="round" />
          <path d="M78 224 Q68 226 62 239 Q76 248 104 241 L108 233Z" fill="#fff8eb" stroke="#25384d" strokeWidth="4" strokeLinejoin="round" />
          <path d="M236 231 Q245 225 257 234 L269 246 Q256 256 230 246 L225 239Z" fill="#fff8eb" stroke="#25384d" strokeWidth="4" strokeLinejoin="round" />
          <path d="M72 238 L98 240 M234 246 L260 247" stroke="#46b7ca" strokeWidth="4" strokeLinecap="round" />
          {/* torso and neck */}
          <path d="M144 81 Q160 67 184 76 L208 94 L211 165 Q190 183 146 167 L135 112Z" fill="#45b7c8" stroke="#25384d" strokeWidth="4" strokeLinejoin="round" />
          <path d="M157 75 L160 93 L176 103 L190 88 L186 73Z" fill="#f1bd9b" stroke="#25384d" strokeWidth="3" strokeLinejoin="round" />
          <path d="M154 79 L171 96 L189 78" fill="#fff8eb" stroke="#25384d" strokeWidth="3" strokeLinejoin="round" />
          {/* face */}
          <path d="M143 37 Q146 13 172 13 Q198 14 200 41 L194 66 Q185 79 168 77 Q150 74 145 60Z" fill="#f3c5a4" stroke="#25384d" strokeWidth="4" strokeLinejoin="round" />
          <path d="M140 43 Q130 21 151 12 Q169 0 192 12 Q207 22 201 44 L195 39 Q188 27 177 25 Q164 34 146 34Z" fill="#303749" stroke="#25384d" strokeWidth="4" strokeLinejoin="round" />
          <path d="M152 44 Q158 40 164 44 M180 44 Q186 40 191 44" fill="none" stroke="#303749" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="159" cy="51" rx="3.5" ry="4.5" fill="#fffdf8" />
          <ellipse cx="184" cy="51" rx="3.5" ry="4.5" fill="#fffdf8" />
          <circle cx="160" cy="52" r="1.8" fill="#25384d" />
          <circle cx="185" cy="52" r="1.8" fill="#25384d" />
          <path d="M166 66 Q175 74 185 65" fill="none" stroke="#9c4f58" strokeWidth="3" strokeLinecap="round" />
          <circle cx="150" cy="61" r="4" fill="#ec8a83" opacity=".55" />
          <circle cx="192" cy="61" r="4" fill="#ec8a83" opacity=".55" />
          {/* arms */}
          <path d="M145 99 Q128 104 121 119 L104 127" fill="none" stroke="#45b7c8" strokeWidth="15" strokeLinecap="round" />
          <path d="M104 127 L97 123 M104 127 L101 135" fill="none" stroke="#f3c5a4" strokeWidth="7" strokeLinecap="round" />
          <g className="guide-pointing-arm">
            <path d="M198 100 Q219 95 226 82 L239 65" fill="none" stroke="#45b7c8" strokeWidth="15" strokeLinecap="round" />
            <path d="M239 65 L241 54 M239 65 L251 63" fill="none" stroke="#f3c5a4" strokeWidth="7" strokeLinecap="round" />
            <path d="M247 62 L268 47" fill="none" stroke="#f6bf4c" strokeWidth="4" strokeLinecap="round" />
          </g>
          {/* laptop */}
          <g className="guide-laptop">
            <path d="M111 119 L191 119 L203 164 L119 164Z" fill="#eaf7f4" stroke="#25384d" strokeWidth="4" strokeLinejoin="round" />
            <path d="M116 164 L203 164 L212 170 Q210 175 204 175 L111 175 Q105 174 109 169Z" fill="#b5d4d1" stroke="#25384d" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="158" cy="142" r="5" fill="#e9897c" />
          </g>
          {/* friendly team badge */}
          <circle cx="194" cy="115" r="11" fill="#fff8eb" stroke="#25384d" strokeWidth="3" />
          <path d="M189 115 L194 120 L201 110" fill="none" stroke="#45b7c8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      {scene === "welcome" && <div className="guide-floating-note">ملف جديد <span>📁</span></div>}
      {scene === "problem" && <div className="guide-floating-note guide-alert-note">الشكاوى زادت <span>📈</span></div>}
      {scene === "scatter" && (
        <div className="guide-mini-plot" dir="rtl">
          <span>كل نقطة = فرع</span>
          <div className="guide-mini-plot-dots" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <small>رقمين بنقارنهم</small>
        </div>
      )}
      {scene === "chase" && (
        <div className="guide-chase-friends" dir="ltr">
          <div className="guide-dotty-arrive"><Dotty size={54} mood="scared" /></div>
          <div className="guide-glitch-arrive"><Glitch size={58} /></div>
        </div>
      )}
      <div className="guide-scene-caption">{sceneNotes[scene]}</div>
    </div>
  );
}
