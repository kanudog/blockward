// Focused-exam animation registry. One <ExamInset> renders the zoomed,
// animated finding for a mapped exam (see src/lib/scenarios/examMap.js).
// Animations use declarative SVG <animate>/<animateTransform> (SMIL) — the
// same approach as PatientSVG — so there's no global CSS to inject. Colours
// are the current player-screen palette (teal/navy), not the design-token
// theme; clinical fills (skin, blood) are literal and theme-agnostic.
//
// v1 keys: pupil-reaction | breathing | cap-refill | skin-inspect. Anything
// else (gcs, abdomen, …) falls through to the generic "inspect" zoom until a
// bespoke renderer is added — driven by the smoke-test coverage report.

function clamp(n, a, b) { if (n == null || isNaN(n)) return a; return n < a ? a : (n > b ? b : n); }

function renderPupils(p) {
  var leftMm = p.leftMm || 2;
  var rightMm = p.rightMm || 4;
  var aniso = !!p.aniso;
  var rL = clamp(leftMm * 2.2, 3.5, 11);
  var rR = clamp(rightMm * 2.2, 3.5, 11);
  var rLc = (rL * 0.5).toFixed(1);
  var lPupVals = rL + ";" + rL + ";" + rLc + ";" + rLc + ";" + rL + ";" + rL;
  var lLightVals = "0;0;0.5;0.5;0;0";
  return (
    <svg viewBox="0 0 200 150" style={{width:"100%",height:150,display:"block"}}>
      <circle cx="60" cy="70" r="30" fill="#fbf7f0"/>
      <circle cx="60" cy="70" r="30" fill="none" stroke="#e2d3bf" strokeWidth="1.5"/>
      <circle cx="60" cy="70" r="16.5" fill="#6f4a2a"/>
      <circle cx="60" cy="70" r="25" fill="#fff7d6" opacity="0">
        <animate attributeName="opacity" dur="4.6s" repeatCount="indefinite" keyTimes="0;0.06;0.13;0.30;0.37;1" values={lLightVals}/>
      </circle>
      <circle cx="60" cy="70" r={rL} fill="#121212">
        <animate attributeName="r" dur="4.6s" repeatCount="indefinite" keyTimes="0;0.13;0.19;0.31;0.38;1" values={lPupVals}/>
      </circle>
      <circle cx="53" cy="63" r="3.1" fill="#fff" opacity="0.85"/>
      <circle cx="140" cy="70" r="30" fill="#fbf7f0"/>
      <circle cx="140" cy="70" r="30" fill="none" stroke="#e2d3bf" strokeWidth="1.5"/>
      <circle cx="140" cy="70" r="16.5" fill="#6f4a2a"/>
      <circle cx="140" cy="70" r="25" fill="#fff7d6" opacity="0">
        <animate attributeName="opacity" dur="4.6s" repeatCount="indefinite" keyTimes="0;0.52;0.59;0.76;0.83;1" values="0;0;0.5;0.5;0;0"/>
      </circle>
      {aniso ? (
        <circle cx="140" cy="70" r={rR} fill="#121212"/>
      ) : (
        <circle cx="140" cy="70" r={rR} fill="#121212">
          <animate attributeName="r" dur="4.6s" repeatCount="indefinite" keyTimes="0;0.52;0.59;0.76;0.83;1" values={rR + ";" + rR + ";" + (rR*0.5).toFixed(1) + ";" + (rR*0.5).toFixed(1) + ";" + rR + ";" + rR}/>
        </circle>
      )}
      <circle cx="133" cy="63" r="2.6" fill="#fff" opacity="0.55"/>
      <text x="8" y="128" fill="#55efc4" fontFamily="sans-serif" fontWeight="800" fontSize="10.5">{"L " + leftMm + " mm" + (aniso ? " · reactive" : "")}</text>
      <text x="192" y="128" textAnchor="end" fill={aniso ? "#ff7675" : "#55efc4"} fontFamily="sans-serif" fontWeight="800" fontSize="10.5">{"R " + rightMm + " mm" + (aniso ? " · fixed" : "")}</text>
    </svg>
  );
}

function renderBreathing(p) {
  var rate = clamp(p.rate || 24, 6, 70);
  var dur = (60 / rate).toFixed(2) + "s";
  var label = "RR " + Math.round(rate) + (p.retractions ? " · retractions" : (p.irregular ? " · irregular" : ""));
  return (
    <svg viewBox="0 0 220 150" style={{width:"100%",height:150,display:"block"}}>
      <rect x="0" y="120" width="220" height="30" fill="#2c4a8f"/>
      <rect x="0" y="113" width="220" height="9" rx="3" fill="#3f63b8"/>
      <g>
        <animateTransform attributeName="transform" type="translate" dur={dur} repeatCount="indefinite" values="0,0;0,-7;0,0"/>
        <path d="M0 120 L0 98 C40 86 76 72 110 72 C150 72 190 88 220 102 L220 120 Z" fill="#f0c49a"/>
        <path d="M0 98 C40 86 76 72 110 72 C150 72 190 88 220 102" fill="none" stroke="#d8a86a" strokeWidth="2"/>
        <path d="M104 84 q6 6 12 0" fill="none" stroke="#c69468" strokeWidth="2" strokeLinecap="round"/>
        {p.retractions ? (<g stroke="#b9743b" strokeWidth="1.6" fill="none" opacity="0.7"><path d="M40 96 q4 5 0 10"/><path d="M180 96 q-4 5 0 10"/></g>) : null}
      </g>
      <text x="110" y="142" textAnchor="middle" fill="#9fb8e0" fontFamily="sans-serif" fontWeight="800" fontSize="11">{label}</text>
    </svg>
  );
}

function renderCapRefill(p) {
  var sec = clamp(p.seconds || 2, 0.5, 9);
  var fadeEnd = clamp(0.27 + sec * 0.10, 0.34, 0.92).toFixed(2);
  var blanchVals = "0;0;0.95;0.95;0;0";
  var blanchKt = "0;0.15;0.22;0.27;" + fadeEnd + ";1";
  return (
    <svg viewBox="0 0 200 150" style={{width:"100%",height:150,display:"block"}}>
      <text x="8" y="22" fill="#4ECDC4" fontFamily="sans-serif" fontWeight="800" fontSize="10">compress</text>
      <text x="192" y="22" textAnchor="end" fill="#55efc4" fontFamily="sans-serif" fontWeight="800" fontSize="10">{"refill " + sec + " s"}</text>
      <path d="M86 150 L84 64 Q84 42 100 42 Q116 42 116 64 L114 150 Z" fill="#f0c49a" stroke="#d8a86a" strokeWidth="1"/>
      <ellipse cx="100" cy="58" rx="11.5" ry="14" fill="#f6d9bc"/>
      <ellipse cx="100" cy="60" rx="14" ry="19" fill="#fdeede" opacity="0">
        <animate attributeName="opacity" dur="4s" repeatCount="indefinite" keyTimes={blanchKt} values={blanchVals}/>
      </ellipse>
      <g>
        <animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" keyTimes="0;0.10;0.15;0.25;0.33;1" values="-26,0;-26,0;0,0;0,0;-26,0;-26,0"/>
        <path d="M10 48 L66 48 Q84 48 84 60 Q84 72 66 72 L10 72 Z" fill="#e3a878" stroke="#c98f5f" strokeWidth="1"/>
        <ellipse cx="76" cy="60" rx="4.5" ry="7" fill="#f2cfa2"/>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" dur="4s" repeatCount="indefinite" keyTimes="0;0.10;0.15;0.25;0.33;1" values="26,0;26,0;0,0;0,0;26,0;26,0"/>
        <path d="M190 48 L134 48 Q116 48 116 60 Q116 72 134 72 L190 72 Z" fill="#dca06f" stroke="#bd8753" strokeWidth="1"/>
        <ellipse cx="124" cy="60" rx="4.5" ry="7" fill="#ecc596"/>
      </g>
    </svg>
  );
}

function renderSkin(p) {
  var lesion = p.lesion || "normal";
  var patch = "#f3c79c";
  if (lesion === "cyanosis") patch = "#9fb6c9";
  else if (lesion === "pallor") patch = "#f3dac3";
  else if (lesion === "jaundice") patch = "#e6c66a";
  var marks = null;
  if (lesion === "petechiae") {
    marks = (<g fill="#8e2a4f"><circle cx="70" cy="56" r="2.2"/><circle cx="82" cy="64" r="1.8"/><circle cx="74" cy="72" r="2"/><circle cx="92" cy="54" r="1.6"/><circle cx="100" cy="68" r="2.1"/><circle cx="110" cy="58" r="1.8"/><circle cx="120" cy="70" r="2"/><circle cx="128" cy="60" r="1.7"/><circle cx="88" cy="78" r="1.9"/></g>);
  } else if (lesion === "hives" || lesion === "rash") {
    marks = (<g fill="#ff6b6b" opacity="0.6"><ellipse cx="78" cy="62" rx="9" ry="6"/><ellipse cx="108" cy="74" rx="11" ry="7"/><ellipse cx="132" cy="58" rx="8" ry="6"/><ellipse cx="92" cy="86" rx="7" ry="5"/></g>);
  } else if (lesion === "bruise") {
    marks = (<g><path d="M74 56 C88 46 116 48 128 62 C134 74 120 88 102 88 C82 88 66 76 70 64 Z" fill="#7e4f93" opacity="0.62"/><path d="M88 58 C102 52 118 60 116 74 C112 84 96 84 88 76 C82 68 80 62 88 58 Z" fill="#46285c" opacity="0.6"/></g>);
  } else if (lesion === "laceration") {
    marks = (<g><path d="M70 80 L130 60" stroke="#7a1f1f" strokeWidth="4" strokeLinecap="round"/><path d="M70 80 L130 60" stroke="#b11d1d" strokeWidth="1.6" strokeLinecap="round"/></g>);
  } else if (lesion === "mottling") {
    marks = (<g fill="#b58aa0" opacity="0.5"><circle cx="74" cy="58" r="7"/><circle cx="100" cy="74" r="9"/><circle cx="126" cy="60" r="6"/><circle cx="112" cy="84" r="5"/></g>);
  } else {
    marks = (<text x="100" y="78" textAnchor="middle" fill="#9b7d4f" fontFamily="sans-serif" fontWeight="800" fontSize="11">clear, no rash</text>);
  }
  return (
    <svg viewBox="0 0 200 150" style={{width:"100%",height:150,display:"block"}}>
      <rect x="14" y="22" width="172" height="96" rx="14" fill={patch}/>
      <g opacity="0.9">{marks}</g>
      <rect x="14" y="22" width="172" height="96" rx="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      <text x="100" y="136" textAnchor="middle" fill="#cbb6a0" fontFamily="sans-serif" fontWeight="800" fontSize="10.5">{lesion === "normal" ? "skin inspection" : ("skin · " + lesion)}</text>
    </svg>
  );
}

function renderInspect(p, label) {
  return (
    <svg viewBox="0 0 200 150" style={{width:"100%",height:150,display:"block"}}>
      <circle cx="92" cy="68" r="30" fill="none" stroke="#4ECDC4" strokeWidth="3" opacity="0.8"/>
      <line x1="113" y1="89" x2="132" y2="108" stroke="#4ECDC4" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
      <circle cx="92" cy="68" r="30" fill="rgba(78,205,196,0.06)">
        <animate attributeName="r" dur="2.4s" repeatCount="indefinite" values="28;31;28"/>
      </circle>
      <text x="100" y="138" textAnchor="middle" fill="#8fa6bd" fontFamily="sans-serif" fontWeight="800" fontSize="10.5">{label || "examining"}</text>
    </svg>
  );
}

export function ExamInset(props) {
  var animation = props.animation;
  var params = props.params || {};
  if (animation === "pupil-reaction") return renderPupils(params);
  if (animation === "breathing") return renderBreathing(params);
  if (animation === "cap-refill") return renderCapRefill(params);
  if (animation === "skin-inspect") return renderSkin(params);
  return renderInspect(params, props.label);
}
