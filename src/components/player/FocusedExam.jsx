import { useState } from "react";
import { Check } from "lucide-react";
import { PatientSVG } from "./PatientSVG.jsx";
import { WhyModal } from "../shared/WhyModal.jsx";
import { ExamInset } from "./examAnimations.jsx";
import { buildExams } from "../../lib/scenarios/examMap.js";
import { signCanonicalId } from "../../lib/scenarios/canonicalize.js";
import { usePlayerStore } from "../../stores/playerStore.js";
import { expandSingleMarkedItem } from "../../lib/ai/client.js";

// Focused-exam interaction (Phase-7 redesign). Replaces the binary
// "flag the abnormal sign tile" BodySystemsView for the PHYSICAL exam:
// the avatar sits center-stage, one exam button per generated sign, and
// tapping zooms to an animated rendering of the ACTUAL finding (examMap +
// examAnimations) plus the finding prose and the existing `why` (via the
// shared WhyModal, so Mark-for-Review still feeds the debrief). Exploration
// only — no right/wrong here. Vitals stay flaggable on the monitor and labs
// stay flaggable in LabPanel; this only changes the signs interaction.

export function FocusedExam(props) {
  var signs = props.signs || [];
  var vitals = props.vitals;
  var phaseIdx = props.phaseIdx !== undefined ? props.phaseIdx : 0;
  var ageGroup = props.ageGroup || "infant";
  var sex = props.sex || "neutral";
  var visuals = props.visuals || [];
  var seed = props.seed || "";
  var status = props.status || "stable";
  var exams = buildExams(signs, vitals);
  var _open = useState(null); var openExam = _open[0]; var setOpenExam = _open[1];
  var _done = useState({}); var done = _done[0]; var setDone = _done[1];
  var _why = useState(null); var whyTarget = _why[0]; var setWhyTarget = _why[1];

  if (exams.length === 0) return null;

  function openEx(ex) {
    setOpenExam(ex);
    if (!done[ex.id]) { var d = Object.assign({}, done); d[ex.id] = 1; setDone(d); }
  }
  function closeEx() { setOpenExam(null); }
  function openWhy() {
    var ex = openExam; if (!ex) return;
    var s = ex.sign || {};
    setWhyTarget(Object.assign({}, s, { _abnormal: !!s.bad, why: ex.why }));
  }

  var nDone = Object.keys(done).length;
  var rrNum = (vitals && vitals.rr) ? (typeof vitals.rr === "object" ? (parseFloat(vitals.rr.value) || 20) : vitals.rr) : 20;

  // Mark-for-Review for the open exam finding — mirrors WhyModal.handleMark so
  // the deep-dive is eagerly generated and the item lands in the debrief.
  var markedList = usePlayerStore(function(s){ return s.markedForReview; });
  function currentMarkItem() {
    var ex = openExam; if (!ex || !ex.sign) return null;
    return { id: signCanonicalId(ex.sign) + "@p" + phaseIdx, kind: "sign", phaseIdx: phaseIdx, label: ex.label, _slotRef: { kind: "sign", phaseIdx: phaseIdx, indexOrId: ex.sign.label } };
  }
  var curMark = currentMarkItem();
  var curMarked = curMark ? markedList.some(function(x){ return x.id === curMark.id; }) : false;
  function markCurrent() {
    var it = currentMarkItem(); if (!it) return;
    var store = usePlayerStore.getState();
    if (store.toggleMarkForReview(it) !== "added") return;
    var scn = store.activeScenario;
    if (!scn || !it._slotRef || store.deepDiveCache[it.id]) return;
    if (!store.beginDeepDive(it.id)) return;
    expandSingleMarkedItem(scn, it).then(function(text){ if (text) usePlayerStore.getState().setDeepDive(it.id, text); }).catch(function(err){ console.warn("[eager deep-dive] " + it.id + " — " + (err && err.message || err)); }).finally(function(){ usePlayerStore.getState().endDeepDive(it.id); });
  }

  return (
    <div style={{position:"relative",marginTop:8,marginBottom:8}}>
      <div style={{fontSize:12,fontWeight:700,color:"#4ECDC4",marginBottom:8}}>Focused Exam</div>
      <div style={{position:"relative",borderRadius:14,overflow:"hidden",background:"radial-gradient(60% 50% at 50% 38%,rgba(78,205,196,0.10),transparent 70%)",border:"1px solid rgba(255,255,255,0.06)",padding:"6px 0 2px",marginBottom:8}}>
        <div style={{width:138,margin:"0 auto"}}>
          <PatientSVG status={status} rr={rrNum} ageGroup={ageGroup} sex={sex} visuals={visuals} emotion="sad" seed={seed}/>
        </div>
        <div style={{position:"absolute",left:10,top:9,fontSize:10,fontWeight:700,color:"#4ECDC4",background:"rgba(78,205,196,0.12)",padding:"4px 9px",borderRadius:20}}>Tap an exam below</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {exams.map(function(ex, i) {
          var isDone = !!done[ex.id];
          return (
            <button key={i} onClick={function(){openEx(ex);}} className="bw-tap" style={{textAlign:"left",border:isDone?"1px solid rgba(0,184,148,0.5)":"1px solid rgba(255,255,255,0.1)",background:isDone?"rgba(0,184,148,0.08)":"rgba(255,255,255,0.04)",borderRadius:10,padding:"9px 10px",cursor:"pointer",color:"#dfe6f4",display:"flex",alignItems:"center",gap:6}}>
              <span style={{flex:1,minWidth:0}}>
                <span style={{fontSize:12,fontWeight:700,display:"block",lineHeight:1.2}}>{ex.label}</span>
                <span style={{fontSize:9.5,color:"#8b93a7",textTransform:"capitalize"}}>{ex.region}</span>
              </span>
              {isDone ? <Check size={14} color="#00b894" style={{flexShrink:0}}/> : null}
            </button>
          );
        })}
      </div>
      <div style={{fontSize:10,color:"#7f8694",fontWeight:600,marginTop:7,textAlign:"center"}}>{nDone + " of " + exams.length + " examined"}</div>

      {openExam ? (
        <div onClick={function(e){if(e.target===e.currentTarget)closeEx();}} style={{position:"absolute",inset:0,background:"rgba(8,11,20,0.82)",borderRadius:14,display:"flex",flexDirection:"column",justifyContent:"flex-end",zIndex:5}}>
          <div style={{background:"rgba(13,17,28,0.98)",border:"1px solid rgba(78,205,196,0.22)",borderRadius:14,padding:"10px 12px 12px",margin:"0 4px 4px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{flex:1,fontSize:14,fontWeight:700,color:"#fff"}}>{openExam.label}</div>
              <button onClick={closeEx} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",color:"#c4cbdb",width:26,height:26,borderRadius:8,cursor:"pointer",fontWeight:700,lineHeight:1}}>×</button>
            </div>
            <div style={{borderRadius:10,overflow:"hidden",background:"rgba(3,5,12,0.5)",border:"1px solid rgba(255,255,255,0.06)"}}>
              <ExamInset animation={openExam.animation} params={openExam.params} label={openExam.label}/>
            </div>
            <div style={{fontSize:10,fontWeight:800,color:"#4ECDC4",letterSpacing:0.5,margin:"9px 0 4px"}}>FINDING</div>
            <div style={{fontSize:12.5,color:"#dfe6f4",lineHeight:1.5,fontWeight:600}}>{openExam.finding}</div>
            <button onClick={markCurrent} style={{width:"100%",marginTop:11,padding:"9px 0",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",background:curMarked?"rgba(254,202,87,0.2)":"rgba(255,255,255,0.06)",border:"1px solid "+(curMarked?"rgba(254,202,87,0.55)":"rgba(255,255,255,0.18)"),color:curMarked?"#FECA57":"#ddd"}}>{curMarked?"✓ Marked for Review":"Mark for Review"}</button>
            <div style={{display:"flex",gap:8,marginTop:9}}>
              <button onClick={openWhy} style={{flex:1,background:"rgba(165,94,234,0.16)",border:"1px solid rgba(165,94,234,0.4)",color:"#cdb6f0",fontWeight:700,fontSize:12,padding:"10px 0",borderRadius:10,cursor:"pointer"}}>Why does this matter?</button>
              <button onClick={closeEx} style={{flex:1,background:"linear-gradient(135deg,#4ECDC4,#44B09E)",border:"none",color:"#06231f",fontWeight:700,fontSize:12.5,padding:"10px 0",borderRadius:10,cursor:"pointer"}}>Done</button>
            </div>
          </div>
        </div>
      ) : null}

      <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.label:""} body={whyTarget?(whyTarget.why||"No additional explanation available for this finding."):""} accent={whyTarget&&whyTarget._abnormal?"#FF6B81":"#4ECDC4"} item={whyTarget?{id:signCanonicalId(whyTarget)+"@p"+phaseIdx,kind:"sign",phaseIdx:phaseIdx,label:whyTarget.label,_slotRef:{kind:"sign",phaseIdx:phaseIdx,indexOrId:whyTarget.label}}:null}/>
    </div>
  );
}
