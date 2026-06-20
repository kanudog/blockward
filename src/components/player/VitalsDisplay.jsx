import { useRef, useEffect } from "react";

// Phase-5.4.3a: vitals entries are rich objects per schema 5.4.1:
//   { id, label, value, unit, bad, why, _slotRef }
// Helpers extract the numeric or display form. Legacy callers that
// passed scalar numbers (e.g. ad-hoc test scaffolds) still work.
function vNum(v){if(v==null)return 0;if(typeof v==="object")return parseFloat(v.value)||0;return Number(v)||0;}
function vStr(v){if(v==null)return "";if(typeof v==="object")return v.value;return v;}

// Phase 6.2b.4-fixup: orchestrator emits BP as a single combined
// vital (id: "bp", value: "84/52") instead of split sbp/dbp. Built-in
// scenarios still emit split sbp/dbp. Read the unified shape first,
// fall back to combining the split keys for backward compat. Returns
// {value, unit, bad} or null if neither shape is present.
function _getBpDisplay(vitals){
  if(!vitals)return null;
  var bpVital=vitals.bp;
  // Phase-7: the reassessment screen passes reassessment.vitals raw, where bp
  // is a combined STRING ("106/68"); accept that shape so the reassess monitor
  // doesn't render a blank BP cell (recovery has its own string handling).
  if(typeof bpVital==="string"&&bpVital!==""){
    return{value:bpVital,unit:"mmHg",bad:false};
  }
  if(bpVital&&typeof bpVital==="object"){
    return{value:vStr(bpVital),unit:bpVital.unit||"mmHg",bad:!!bpVital.bad};
  }
  var sbp=vitals.sbp;
  var dbp=vitals.dbp;
  if(sbp&&dbp){
    var sv=vStr(sbp);var dv=vStr(dbp);
    if(sv==null||sv==="")return null;
    var sbpBad=typeof sbp==="object"?!!sbp.bad:false;
    var dbpBad=typeof dbp==="object"?!!dbp.bad:false;
    var sbpUnit=typeof sbp==="object"?(sbp.unit||"mmHg"):"mmHg";
    return{value:sv+"/"+dv,unit:sbpUnit,bad:sbpBad||dbpBad};
  }
  return null;
}

function ecgPt(t,hr){var p=60/hr,x=(t%p)/p;if(x<.06)return 0;if(x<.08)return Math.sin((x-.06)/.02*Math.PI)*0.05;if(x<.10)return(x-.08)/.02*1.0;if(x<.12)return 1.0-(x-.10)/.02*1.0;if(x<.14)return 0;if(x<.30)return Math.sin((x-.14)/.16*Math.PI)*0.08;return 0;}
function plPt(t,hr){var p=60/hr,x=(t%p)/p;return(Math.sin(x*Math.PI*2-Math.PI/2)+1)/2*0.8;}
// reveal prop (phase-2.6 group E):
//   undefined or true → all vitals colored as today
//   false → all vitals rendered in white (no answer-leak)
//   object {hr, sbp, dbp, rr, spo2, temp, cap} → reveal per-key
// AssessPanel passes a per-key map driven by user flag interaction
// + showFb. Other call sites omit the prop and stay all-revealed.
export function VitalsDisplay(props){
  var vitals=props.vitals;var flash=props.flash;var reveal=props.reveal;
  function isRevealed(key){
    if(reveal===undefined||reveal===true)return true;
    if(reveal===false)return false;
    return !!reveal[key];
  }
  var cR=useRef(null);var tR=useRef(0);var aR=useRef(null);
  var hrNum=vNum(vitals.hr);
  useEffect(function(){var c=cR.current;if(!c)return;var ctx=c.getContext("2d");var W=c.width;var H=c.height;
    var draw=function(){tR.current+=.016;var t=tR.current;ctx.fillStyle="#0a0e1a";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(78,205,196,0.05)";ctx.lineWidth=.5;
      for(var i=0;i<W;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
      for(var j=0;j<H;j+=20){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke();}
      ctx.strokeStyle="#4ECDC4";ctx.lineWidth=2;ctx.shadowColor="#4ECDC4";ctx.shadowBlur=6;ctx.beginPath();
      for(var k=0;k<W;k++){var y=H*.25-ecgPt(t-(W-k)*.008,hrNum)*H*.2;k===0?ctx.moveTo(k,y):ctx.lineTo(k,y);}ctx.stroke();ctx.shadowBlur=0;
      ctx.strokeStyle="#FECA57";ctx.lineWidth=2;ctx.shadowColor="#FECA57";ctx.shadowBlur=6;ctx.beginPath();
      for(var m=0;m<W;m++){var yy=H*.7-plPt(t-(W-m)*.008,hrNum)*H*.15;m===0?ctx.moveTo(m,yy):ctx.lineTo(m,yy);}ctx.stroke();ctx.shadowBlur=0;
      ctx.font="bold 10px sans-serif";ctx.fillStyle="#4ECDC4";ctx.fillText("ECG II",8,16);ctx.fillStyle="#FECA57";ctx.fillText("SpO2",8,H*.57);
      aR.current=requestAnimationFrame(draw);};draw();return function(){cancelAnimationFrame(aR.current);};},[hrNum]);
  var bColor=flash?"#FF4757":"#555";
  var tempStr=(function(){var t=vStr(vitals.temp);if(t===""||t==null)return "";var n=parseFloat(t);return isNaN(n)?t:n.toFixed(1);})();
  var tempNum=vNum(vitals.temp);
  // Phase 6.2b.4-fixup: BP via unified _getBpDisplay (handles both
  // orchestrator "bp" and built-in sbp/dbp). The BP row key stays
  // "sbp" for the reveal-map keyed lookup that AssessPanel uses to
  // gate per-vital coloring — the canonical id system pre-dates the
  // unified bp shape and would touch too many call sites to rename.
  var bp=_getBpDisplay(vitals);
  var bpValue=bp?bp.value:"";
  var bpUnit=bp?bp.unit:"mmHg";
  // Cap refill may be missing if Sonnet emitted it as a sign and no
  // backfill ran (defensive — playerStore should always supply it).
  // vStr returns "" for undefined; the chip just renders empty.
  var vs=[
    {l:"HR",k:"hr",v:vStr(vitals.hr),u:"bpm"},
    {l:"SpO2",k:"spo2",v:vStr(vitals.spo2),u:"%"},
    {l:"RR",k:"rr",v:vStr(vitals.rr),u:"/min"},
    {l:"BP",k:"sbp",v:bpValue,u:bpUnit},
    {l:"Temp",k:"temp",v:tempStr,u:"C",_num:tempNum},
    {l:"Cap Refill",k:"cap",v:vStr(vitals.cap),u:"sec"}
  ];
  return(
    <div style={{borderRadius:16,overflow:"hidden",border:"4px solid "+bColor,background:"#0a0e1a"}}>
      <canvas ref={cR} width={400} height={180} style={{width:"100%",height:150,display:"block"}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,padding:8,background:"#0d1117"}}>
        {vs.map(function(v){
          var revealed=isRevealed(v.k);
          var vColor="#ffffff";
          if(revealed){
            vColor="#c8d6e5";
            if(v.l==="HR")vColor="#55efc4";
            else if(v.l==="SpO2")vColor="#fdcb6e";
            else if(v.l==="Temp"&&v._num&&(v._num<36.5||v._num>37.5))vColor="#ff7675";
          }
          return(
          <div key={v.l} style={{borderRadius:8,padding:4,textAlign:"center",background:"rgba(255,255,255,0.03)"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>{v.l}</div>
            <div style={{fontSize:20,fontWeight:900,color:vColor}}>{v.v}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.25)"}}>{v.u}</div>
          </div>);})}
      </div>
    </div>);
}
