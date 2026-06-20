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
  } else if (lesion === "sting") {
    marks = (<g><ellipse cx="100" cy="70" rx="24" ry="17" fill="#e8a07a" opacity="0.5"><animate attributeName="rx" dur="3s" repeatCount="indefinite" values="22;26;22"/></ellipse><ellipse cx="100" cy="70" rx="13" ry="10" fill="#e07a6a" opacity="0.55"/><circle cx="100" cy="70" r="2.8" fill="#9c1a1a"/></g>);
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

function renderResponsiveness(p) {
  var level = p.level || "A";
  var rows = [["A", "Alert"], ["V", "Responds to voice"], ["P", "Responds to pain"], ["U", "Unresponsive"]];
  return (
    <div style={{padding:"14px 16px"}}>
      {rows.map(function(r, i) {
        var hit = r[0] === level;
        return (
          <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"8px 11px",marginBottom:6,borderRadius:8,background:hit?"rgba(78,205,196,0.16)":"rgba(255,255,255,0.03)",border:hit?"1px solid rgba(78,205,196,0.5)":"1px solid rgba(255,255,255,0.06)"}}>
            <span style={{width:23,height:23,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:hit?"#06231f":"#8b93a7",background:hit?"#4ECDC4":"rgba(255,255,255,0.06)"}}>{r[0]}</span>
            <span style={{fontSize:12.5,fontWeight:700,color:hit?"#eafdfb":"#9aa6b8"}}>{r[1]}</span>
          </div>
        );
      })}
    </div>
  );
}

function renderAbdomen(p) {
  var state = p.state || "soft";
  var distended = state === "distended";
  var guarded = state === "guarded" || state === "tender";
  var label = state === "soft" ? "soft, non-tender" : state;
  return (
    <svg viewBox="0 0 200 150" style={{width:"100%",height:150,display:"block"}}>
      <rect x="86" y="6" width="28" height="16" rx="7" fill="#f0c49a"/>
      <g>
        <animateTransform attributeName="transform" type="translate" dur="3.6s" repeatCount="indefinite" values="0,0;0,-2.5;0,0"/>
        <rect x="22" y="28" width="44" height="15" rx="7" fill="#f0c49a" stroke="#d8a86a" strokeWidth="1"/>
        <rect x="134" y="28" width="44" height="15" rx="7" fill="#f0c49a" stroke="#d8a86a" strokeWidth="1"/>
        <path d="M64 30 Q62 22 72 21 L128 21 Q138 22 136 30 L146 60 Q150 94 138 120 Q136 131 122 133 L78 133 Q64 131 62 120 Q50 94 54 60 Z" fill="#f0c49a" stroke="#d8a86a" strokeWidth="1.5"/>
        <path d="M74 40 Q100 48 126 40" fill="none" stroke="#e0ad7e" strokeWidth="1.4" opacity="0.55"/>
        {distended ? <ellipse cx="100" cy="98" rx="42" ry="28" fill="#f0c49a" stroke="#d8a86a" strokeWidth="1.5"/> : null}
        <ellipse cx="100" cy="98" rx="2.4" ry="3.4" fill="#c69468"/>
        {guarded ? (<g stroke="#c69468" strokeWidth="1.6" opacity="0.5" strokeLinecap="round"><line x1="100" y1="58" x2="100" y2="116"/><line x1="80" y1="82" x2="120" y2="82"/><line x1="82" y1="102" x2="118" y2="102"/></g>) : null}
      </g>
      <text x="100" y="144" textAnchor="middle" fill="#cbb6a0" fontFamily="sans-serif" fontWeight="800" fontSize="11">{"abdomen · " + label}</text>
    </svg>
  );
}

function renderAngioedema(p) {
  var hives = !!p.hives;
  return (
    <svg viewBox="0 0 200 150" style={{width:"100%",height:150,display:"block"}}>
      <rect x="58" y="12" width="84" height="98" rx="28" fill="#f3cba0" stroke="#d8a86a" strokeWidth="1"/>
      <circle cx="82" cy="56" r="3.6" fill="#1a1a1a"/>
      <circle cx="118" cy="56" r="3.6" fill="#1a1a1a"/>
      <path d="M75 44 Q82 40 89 44" fill="none" stroke="#9b6b50" strokeWidth="2" strokeLinecap="round"/>
      <path d="M111 44 Q118 40 125 44" fill="none" stroke="#9b6b50" strokeWidth="2" strokeLinecap="round"/>
      {hives ? (<g fill="#ff6b6b" opacity="0.5"><circle cx="70" cy="42" r="3.2"/><circle cx="130" cy="46" r="2.8"/><circle cx="124" cy="34" r="2.4"/></g>) : null}
      <ellipse cx="100" cy="90" rx="25" ry="13" fill="#e0625f"><animate attributeName="ry" dur="3s" repeatCount="indefinite" values="12;15.5;12"/></ellipse>
      <path d="M75 90 q25 -9 50 0" fill="none" stroke="#b23d3b" strokeWidth="1.6"/>
      <text x="100" y="138" textAnchor="middle" fill="#e3a3a1" fontFamily="sans-serif" fontWeight="800" fontSize="11">lip / facial swelling</text>
    </svg>
  );
}

function renderLimbDeformity(p) {
  var open = !!p.open;
  return (
    <svg viewBox="0 0 200 150" style={{width:"100%",height:150,display:"block"}}>
      <rect x="89" y="16" width="22" height="48" rx="10" fill="#f0c49a" stroke="#d8a86a" strokeWidth="1"/>
      <g transform="rotate(42 100 62)">
        <rect x="89" y="62" width="22" height="48" rx="10" fill="#f0c49a" stroke="#d8a86a" strokeWidth="1"/>
      </g>
      {open ? (
        <g>
          <polygon points="97,58 115,44 107,60" fill="#f4f1e8" stroke="#d8d2c0" strokeWidth="1"/>
          <polygon points="101,55 113,40 108,53" fill="#eceadf"/>
          <circle cx="102" cy="58" r="3.4" fill="#9c1a1a"/>
          <path d="M103 60 q-2 9 0 15 q2 -7 0 -15 Z" fill="#b11d1d"><animate attributeName="opacity" dur="2.6s" repeatCount="indefinite" values="0.3;1;0.3"/></path>
        </g>
      ) : (
        <ellipse cx="103" cy="62" rx="13" ry="10" fill="#d98a86" opacity="0.55"/>
      )}
      <text x="100" y="140" textAnchor="middle" fill="#cbb6a0" fontFamily="sans-serif" fontWeight="800" fontSize="11">{open ? "open fracture" : "angulated deformity"}</text>
    </svg>
  );
}

function renderPenetratingWound(p) {
  var exit = !!p.exit;
  return (
    <svg viewBox="0 0 200 150" style={{width:"100%",height:150,display:"block"}}>
      <rect x="38" y="38" width="124" height="66" rx="22" fill="#f0c49a" stroke="#d8a86a" strokeWidth="1"/>
      <circle cx="78" cy="66" r="6" fill="#5b0f0f"/>
      <circle cx="78" cy="66" r="9" fill="none" stroke="#a62626" strokeWidth="2.5"/>
      <path d="M78 72 q-2 11 0 20 q2 -9 0 -20 Z" fill="#b11d1d"><animate attributeName="opacity" dur="2.6s" repeatCount="indefinite" values="0.3;1;0.3"/></path>
      <text x="78" y="116" textAnchor="middle" fill="#9fb8e0" fontFamily="sans-serif" fontWeight="800" fontSize="9">entry</text>
      {exit ? (
        <g>
          <circle cx="126" cy="66" r="9" fill="#5b0f0f"/>
          <circle cx="126" cy="66" r="13" fill="none" stroke="#a62626" strokeWidth="3"/>
          <path d="M126 78 q-3 13 0 23 q3 -10 0 -23 Z" fill="#b11d1d"><animate attributeName="opacity" dur="2.6s" repeatCount="indefinite" values="1;0.3;1"/></path>
          <text x="126" y="116" textAnchor="middle" fill="#9fb8e0" fontFamily="sans-serif" fontWeight="800" fontSize="9">exit</text>
        </g>
      ) : null}
      <text x="100" y="138" textAnchor="middle" fill="#cbb6a0" fontFamily="sans-serif" fontWeight="800" fontSize="11">penetrating wound</text>
    </svg>
  );
}

function renderPulseCheck(p) {
  var rate = clamp(p.rate || 90, 30, 220);
  var dur = (60 / rate).toFixed(2) + "s";
  return (
    <svg viewBox="0 0 200 150" style={{width:"100%",height:150,display:"block"}}>
      <path d="M12 76 L132 68 Q150 67 156 80 Q150 95 132 94 L12 96 Z" fill="#f0c49a" stroke="#d8a86a" strokeWidth="1"/>
      <g fill="#f0c49a" stroke="#d8a86a" strokeWidth="1">
        <rect x="150" y="62" width="28" height="7" rx="3"/>
        <rect x="150" y="71" width="30" height="7" rx="3"/>
        <rect x="150" y="80" width="28" height="7" rx="3"/>
        <rect x="150" y="89" width="24" height="7" rx="3"/>
      </g>
      <circle cx="118" cy="82" r="5" fill="#d05a5a" opacity="0.5">
        <animate attributeName="r" dur={dur} repeatCount="indefinite" values="3.5;6.5;3.5"/>
        <animate attributeName="opacity" dur={dur} repeatCount="indefinite" values="0.25;0.6;0.25"/>
      </circle>
      <g fill="#e3a878" stroke="#c98f5f" strokeWidth="1">
        <rect x="106" y="34" width="11" height="46" rx="5"/>
        <rect x="119" y="32" width="11" height="48" rx="5"/>
      </g>
      <text x="100" y="142" textAnchor="middle" fill="#cbb6a0" fontFamily="sans-serif" fontWeight="800" fontSize="11">{"radial pulse · HR " + Math.round(rate)}</text>
    </svg>
  );
}

export function ExamInset(props) {
  var animation = props.animation;
  var params = props.params || {};
  if (animation === "pupil-reaction") return renderPupils(params);
  if (animation === "breathing") return renderBreathing(params);
  if (animation === "cap-refill") return renderCapRefill(params);
  if (animation === "pulse-check") return renderPulseCheck(params);
  if (animation === "skin-inspect") return renderSkin(params);
  if (animation === "responsiveness") return renderResponsiveness(params);
  if (animation === "abdomen") return renderAbdomen(params);
  if (animation === "face-angioedema") return renderAngioedema(params);
  if (animation === "limb-deformity") return renderLimbDeformity(params);
  if (animation === "penetrating-wound") return renderPenetratingWound(params);
  return renderInspect(params, props.label);
}
