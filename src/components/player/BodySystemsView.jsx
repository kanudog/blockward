import { Brain, Heart, Wind, Droplets, Shield, Gauge, Eye, Search } from "lucide-react";
export function BodySystemsView(props) {
  var signs = props.signs || [];
  var allSystems = ["Neuro","Cardiovascular","Respiratory","GI","GI/Hydration","Integumentary","Renal","Musculoskeletal","HEENT"];
  function guessSys(s) {
    if (s.sys) return s.sys;
    var l = (s.label + " " + s.detail).toLowerCase();
    if (l.indexOf("neuro") >= 0 || l.indexOf("mental") >= 0 || l.indexOf("gcs") >= 0 || l.indexOf("pupil") >= 0 || l.indexOf("fontanelle") >= 0 || l.indexOf("conscious") >= 0 || l.indexOf("alert") >= 0 || l.indexOf("letharg") >= 0 || l.indexOf("responsive") >= 0 || l.indexOf("behavior") >= 0 || l.indexOf("irritable") >= 0 || l.indexOf("eye") >= 0 || l.indexOf("seiz") >= 0) return "Neuro";
    if (l.indexOf("heart") >= 0 || l.indexOf("cardio") >= 0 || l.indexOf("pulse") >= 0 || l.indexOf("rhythm") >= 0 || l.indexOf("jvd") >= 0 || l.indexOf("jugular") >= 0 || l.indexOf("perfus") >= 0 || l.indexOf("cool ext") >= 0 || l.indexOf("mottl") >= 0) return "Cardiovascular";
    if (l.indexOf("lung") >= 0 || l.indexOf("breath") >= 0 || l.indexOf("wheez") >= 0 || l.indexOf("retract") >= 0 || l.indexOf("stridor") >= 0 || l.indexOf("airway") >= 0 || l.indexOf("respir") >= 0 || l.indexOf("tripod") >= 0 || l.indexOf("trachea") >= 0 || l.indexOf("apne") >= 0) return "Respiratory";
    if (l.indexOf("abdomen") >= 0 || l.indexOf("bowel") >= 0 || l.indexOf("vomit") >= 0 || l.indexOf("mucous") >= 0 || l.indexOf("oral") >= 0 || l.indexOf("hydrat") >= 0) return "GI/Hydration";
    if (l.indexOf("skin") >= 0 || l.indexOf("rash") >= 0 || l.indexOf("hive") >= 0 || l.indexOf("flush") >= 0 || l.indexOf("cyan") >= 0 || l.indexOf("color") >= 0 || l.indexOf("pale") >= 0 || l.indexOf("diaphor") >= 0 || l.indexOf("integument") >= 0) return "Integumentary";
    if (l.indexOf("urin") >= 0 || l.indexOf("renal") >= 0 || l.indexOf("kidney") >= 0 || l.indexOf("diaper") >= 0 || l.indexOf("oligur") >= 0) return "Renal";
    if (l.indexOf("speech") >= 0 || l.indexOf("motor") >= 0 || l.indexOf("posture") >= 0 || l.indexOf("work of") >= 0) return "Musculoskeletal";
    if (s.pos === "head" || s.pos === "face") return "HEENT";
    return "Other";
  }
  var grouped = {};
  signs.forEach(function(s) {
    var sys = guessSys(s);
    if (!grouped[sys]) grouped[sys] = [];
    grouped[sys].push(s);
  });
  var sysIconMap = {"Neuro":Brain,"Cardiovascular":Heart,"Respiratory":Wind,"GI":Droplets,"GI/Hydration":Droplets,"Integumentary":Shield,"Renal":Droplets,"Musculoskeletal":Gauge,"HEENT":Eye,"Other":Search};
  var sysIcons = {};
  var presentSystems = Object.keys(grouped);
  var absentSystems = allSystems.filter(function(s) { return !grouped[s]; });
  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <div style={{fontSize:12,fontWeight:700,color:"#4ECDC4",marginBottom:8}}>Systems Assessment:</div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {presentSystems.map(function(sys,i) {
          var IconComp = sysIconMap[sys] || Search;
          return (
            <div key={sys} style={{borderRadius:8,padding:"6px 10px",background:"rgba(78,205,196,0.08)",border:"1px solid rgba(78,205,196,0.15)"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#4ECDC4",marginBottom:3,display:"flex",alignItems:"center",gap:4}}><IconComp size={14}/>  {sys}</div>
              {grouped[sys].map(function(s,j) {
                return <div key={j} style={{fontSize:11,color:"#ccd",lineHeight:1.4,marginBottom:2}}><span style={{fontWeight:600,color:"#ddd"}}>{s.label}:</span> {s.detail}</div>;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
