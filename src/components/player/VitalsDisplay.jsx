import { useRef, useEffect } from "react";
import { Flag, Check } from "lucide-react";
import { useTokens } from "../theme/themeStore.js";

// The physical-device monitor (sweep-writer ECG/pleth traces + a value grid).
// De-sanitized from the fable TelemetryDisplay: real vital keys, and — per
// owner direction 2026-07-10 — the monitor shows HR / SpO₂ / RR / BP / Temp;
// Capillary refill is a FINDINGS-only vital (surfaced through the examine loop)
// and is never a tile or flag target here.
//
// Vital entries are rich objects {value,unit,bad,...}; helpers extract the
// numeric or display form. Legacy scalar callers still work.
function vNum(v){if(v==null)return 0;if(typeof v==="object")return parseFloat(v.value)||0;return Number(v)||0;}
function vStr(v){if(v==null)return "";if(typeof v==="object")return v.value;return v;}
function vBad(v){if(v==null)return false;if(typeof v==="object")return !!v.bad;return false;}
function firstNum(v){var n=parseFloat(String(v));return isNaN(n)?0:n;}

// Blood pressure display. Accepts a unified `bp` (object {value:"106/68",…} or
// a raw "106/68" string — the reassessment screen passes it raw) or split
// sbp/dbp. The tile/flag/reveal key stays "sbp" (judged by the systolic).
function _getBpDisplay(vitals){
  if(!vitals)return null;
  var bp=vitals.bp;
  if(typeof bp==="string"&&bp!=="")return {value:bp,unit:"mmHg",bad:false};
  if(bp&&typeof bp==="object")return {value:vStr(bp),unit:bp.unit||"mmHg",bad:!!bp.bad};
  if(bp!=null&&bp!=="")return {value:String(bp),unit:"mmHg",bad:false};
  var sbp=vitals.sbp,dbp=vitals.dbp;
  if(sbp!=null&&dbp!=null){
    var sv=vStr(sbp),dv=vStr(dbp);
    if(sv==null||sv==="")return null;
    var sbad=typeof sbp==="object"?!!sbp.bad:false;
    var dbad=typeof dbp==="object"?!!dbp.bad:false;
    var unit=typeof sbp==="object"?(sbp.unit||"mmHg"):"mmHg";
    return {value:sv+"/"+dv,unit:unit,bad:sbad||dbad};
  }
  return null;
}

// ---- trace shapes ------------------------------------------------------------
// Both traces are TIME-ACCURATE: t advances in real seconds (rAF timestamps),
// each pixel is a fixed slice of history, so complexes cross the screen edge at
// exactly the stated HR tempo (bpm). HR paces BOTH traces — the smooth pleth
// trace is the SpO₂ oscillation that rides under the primary rate.
function g(x,c,w){var d=(x-c)/w;return Math.exp(-d*d);}

// Primary ECG complex: a small rounded lead-in bump, a sharp narrow up-down
// spike with a brief undershoot, then a broader trailing wave, flat baseline in
// between. Keeps near-constant width while the interval stretches with the
// rate; only at very fast rates does the whole complex compress.
function spikePt(tSec,rate){
  if(!rate||rate<=0)return 0;
  var p=60/rate;
  var tau=tSec%p;if(tau<0)tau+=p;
  var k=Math.min(1,p/0.35);
  var x=tau/k;
  return 0.14*g(x,0.05,0.02)
    -0.07*g(x,0.117,0.009)
    +1.0*g(x,0.135,0.012)
    -0.22*g(x,0.158,0.013)
    +0.28*g(x,0.28,0.05);
}

// Secondary slow (pleth) trace: asymmetric smooth cycle — quicker rise, slower
// release, a brief rest at baseline before the next cycle.
function wavePt(tSec,rate){
  if(!rate||rate<=0)return 0;
  var p=60/rate;
  var x=(tSec%p)/p;if(x<0)x+=1;
  if(x<0.40)return 0.5*(1-Math.cos(Math.PI*(x/0.40)));
  var y=0.5*(1+Math.cos(Math.PI*((x-0.40)/0.60)));
  return Math.pow(y,1.25);
}

var SEC_PER_PX=0.008; // 400px canvas = 3.2s visible history

// ---- component ---------------------------------------------------------------
// Props (all optional beyond `vitals`):
//   vitals    — snapshot keyed by vital id (rich objects or scalars).
//   flash     — true = CRITICAL device frame (genuine hard-stop beats only).
//   attention — true = everyday AMBER device frame.
//   reveal    — undefined/true = all shown, false = blinded, or a per-key map
//               ({hr,spo2,rr,sbp,temp}) — read-only callers only.
//   ranges    — {hr:[lo,hi],…} expected band per key for the ACTIVE profile
//               (BP judged by its systolic under key "sbp").
//   showRanges— render the quiet band under each value (hint or post-commit).
//   judged    — post-commit: chips take caught / missed / inband states.
//   flaggedKeys — {hr:true,…} the learner's current flags (tile keys).
//   onFlagKey(key) — makes chips tappable pre-commit (flag/unflag).
//   onWhyKey(key)  — post-commit tap on an out-of-band chip (opens Why).
export function VitalsDisplay(props){
  var t=useTokens();
  var vitals=props.vitals||{};var flash=props.flash;var reveal=props.reveal;var attention=props.attention;
  var ranges=props.ranges||null;var showRanges=!!props.showRanges;var judged=!!props.judged;
  var flaggedKeys=props.flaggedKeys||null;var onFlagKey=props.onFlagKey;var onWhyKey=props.onWhyKey;
  var interactive=typeof onFlagKey==="function";
  var M=t.MONITOR;
  function isRevealed(key){
    if(reveal===undefined||reveal===true)return true;
    if(reveal===false)return false;
    return !!reveal[key];
  }
  var cR=useRef(null);var tR=useRef(0);var aR=useRef(null);var lastR=useRef(null);
  var hrNum=vNum(vitals.hr);
  // SWEEP WRITER (owner direction): the traces stay STATIC on screen. A vertical
  // blank gap sweeps left→right across BOTH traces at once — fresh signal is
  // written just behind it, the previous pass remains ahead of it until
  // overwritten — and the writer wraps back to the left edge each cycle. One
  // full sweep covers W * SEC_PER_PX seconds, so tempo accuracy is unchanged.
  useEffect(function(){var c=cR.current;if(!c)return;var ctx=c.getContext("2d");var W=c.width;var H=c.height;
    var reduceMotion=false;
    try{reduceMotion=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches);}catch(e){}
    var base1=H*0.34;var amp1=H*0.26;
    var base2=H*0.88;var amp2=H*0.20;
    var GAP=14;
    function y1At(tt){return base1-spikePt(tt,hrNum)*amp1;}
    function y2At(tt){return base2-wavePt(tt,hrNum)*amp2;}
    function grid(x0,w){
      ctx.strokeStyle=M.grid;ctx.lineWidth=.5;
      for(var i=Math.ceil(x0/20)*20;i<x0+w;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
      for(var j=0;j<H;j+=20){ctx.beginPath();ctx.moveTo(x0,j);ctx.lineTo(x0+w,j);ctx.stroke();}
    }
    // Erase the band ahead of the writer (background + grid), wrapping at W.
    function clearBand(x0,w){
      if(w<=0)return;
      x0=x0%W;
      if(x0+w<=W){ctx.fillStyle=M.body;ctx.fillRect(x0,0,w,H);grid(x0,w);}
      else{var w1=W-x0;ctx.fillStyle=M.body;ctx.fillRect(x0,0,w1,H);grid(x0,w1);clearBand(0,w-w1);}
    }
    function labels(){
      ctx.font="bold 10px sans-serif";
      ctx.fillStyle=M.trace;ctx.fillText("ECG",8,14);
      ctx.fillStyle=M.trace2;ctx.fillText("SpO₂",8,H*0.60);
    }
    // One complete static pass (initial fill + the reduced-motion frame).
    function fullPass(){
      ctx.fillStyle=M.body;ctx.fillRect(0,0,W,H);grid(0,W);
      ctx.strokeStyle=M.trace;ctx.lineWidth=1.8;ctx.beginPath();
      for(var k=0;k<W;k++){var y=y1At(k*SEC_PER_PX);k===0?ctx.moveTo(k,y):ctx.lineTo(k,y);}
      ctx.stroke();
      ctx.strokeStyle=M.trace2;ctx.lineWidth=1.6;ctx.beginPath();
      for(var m=0;m<W;m++){var yy=y2At(m*SEC_PER_PX);m===0?ctx.moveTo(m,yy):ctx.lineTo(m,yy);}
      ctx.stroke();
      labels();
    }
    if(reduceMotion){fullPass();return;}
    tR.current=W*SEC_PER_PX;
    fullPass();
    var writeX=W-1;
    var py1=y1At(tR.current);var py2=y2At(tR.current);
    function segment(color,width,glow,xa,ya,xb,yb){
      ctx.strokeStyle=color;ctx.lineWidth=width;
      if(glow){ctx.shadowColor=color;ctx.shadowBlur=5;}
      ctx.beginPath();ctx.moveTo(xa,ya);ctx.lineTo(xb,yb);ctx.stroke();
      ctx.shadowBlur=0;
    }
    lastR.current=null;
    var loop=function(ts){
      if(lastR.current==null)lastR.current=ts;
      var dt=(ts-lastR.current)/1000;lastR.current=ts;
      if(dt>0.1)dt=0.1;
      tR.current+=dt;
      var newX=writeX+dt/SEC_PER_PX;
      clearBand(Math.floor(newX)+1,GAP);
      var x0=Math.floor(writeX);var x1=Math.floor(newX);
      for(var x=x0+1;x<=x1;x++){
        var tCol=tR.current-(newX-x)*SEC_PER_PX;
        var ya=y1At(tCol);var yb=y2At(tCol);
        var xw=x%W;
        if(xw===0){py1=ya;py2=yb;}
        segment(M.trace,1.8,true,(xw===0?0:xw-1),py1,xw,ya);
        segment(M.trace2,1.6,false,(xw===0?0:xw-1),py2,xw,yb);
        py1=ya;py2=yb;
      }
      writeX=newX%W;
      labels();
      aR.current=requestAnimationFrame(loop);
    };
    aR.current=requestAnimationFrame(loop);
    return function(){cancelAnimationFrame(aR.current);};
  },[hrNum,t.mode]);
  var bp=_getBpDisplay(vitals);
  var tempV=vitals.temp;
  var tempStr=tempV==null?"":(typeof tempV==="object"?vStr(tempV):(typeof tempV==="number"?tempV.toFixed(1):String(tempV)));
  // The monitor tiles: HR, SpO₂, RR, BP, Temp. Capillary refill is deliberately
  // NOT here — it surfaces through the character findings (examine loop).
  var vs=[
    {l:"HR",k:"hr",v:vStr(vitals.hr),u:(typeof vitals.hr==="object"&&vitals.hr.unit)||"bpm",bad:vBad(vitals.hr)},
    {l:"SpO₂",k:"spo2",v:vStr(vitals.spo2),u:(typeof vitals.spo2==="object"&&vitals.spo2.unit)||"%",bad:vBad(vitals.spo2)},
    {l:"RR",k:"rr",v:vStr(vitals.rr),u:(typeof vitals.rr==="object"&&vitals.rr.unit)||"/min",bad:vBad(vitals.rr)},
    {l:"BP",k:"sbp",v:bp?bp.value:"",u:bp?bp.unit:"mmHg",bad:bp?bp.bad:false},
    {l:"Temp",k:"temp",v:tempStr,u:(typeof tempV==="object"&&tempV.unit)||"°C",bad:vBad(vitals.temp)}
  ];
  var level=flash?"critical":(attention?"attention":false);
  var dev=t.monitorDevice(level);
  var ledColor=level==="critical"?t.COLOR.critical:level==="attention"?t.COLOR.attention:t.COLOR.positive;
  // Expected-range band: quiet track + band segment + value marker. The marker
  // stays neutral until judged, then settles positive (in) or amber (out) — the
  // band is a cue, never a verdict, before commit.
  // Play-test fix 2026-07-29: a case marked temp 37.8 as `bad:false` while its
  // own norms capped temp at 37.5. The tile then drew the value marker OUTSIDE
  // the band and labelled it "in range" in the same breath. The band is what
  // the learner is actually shown, so a value numerically outside it can never
  // be called in-range: treat out-of-band as abnormal even if the case's flag
  // disagrees.
  function outOfBand(chKey,val){
    if(!ranges||!ranges[chKey])return false;
    var r=ranges[chKey];var n=firstNum(val);
    if(n==null||isNaN(n))return false;
    return n<r[0]||n>r[1];
  }
  function bandRow(chKey,val,unit,isJudged){
    if(!ranges||!ranges[chKey])return null;
    var r=ranges[chKey];
    var n=firstNum(val);
    var span=r[1]-r[0];if(span<=0)span=1;
    var lo=r[0]-span*0.6;var hi=r[1]+span*0.6;
    var pct=function(x){var p=(x-lo)/(hi-lo);if(p<0)p=0;if(p>1)p=1;return p*100;};
    var out=n<r[0]||n>r[1];
    var dot=isJudged?(out?t.COLOR.attention:t.COLOR.positive):M.bandText;
    return(<div style={{marginTop:6}}>
      <div style={{position:"relative",height:4,borderRadius:2,background:M.bandTrack}}>
        <div style={{position:"absolute",left:pct(r[0])+"%",width:(pct(r[1])-pct(r[0]))+"%",top:0,bottom:0,borderRadius:2,background:"rgba("+t.POS_RGB+",0.38)"}}/>
        <div style={{position:"absolute",left:"calc("+pct(n)+"% - 2.5px)",top:-1.5,width:5,height:7,borderRadius:2,background:dot,transition:"background 0.3s ease"}}/>
      </div>
      <div style={{fontSize:8.5,color:M.bandText,marginTop:3,fontFamily:t.FONT.body,whiteSpace:"nowrap"}}>{r[0]+"–"+r[1]+" "+unit}</div>
    </div>);
  }
  return(
    <div style={dev.outer}>
      <div style={dev.inner}>
        <canvas ref={cR} width={400} height={150} style={{width:"100%",height:120,display:"block"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,padding:8}}>
          {vs.map(function(v){
            var flagged=!!(flaggedKeys&&flaggedKeys[v.k]);
            var state="idle";
            // effBad: the case's own flag OR a value sitting outside the band we
            // display. Prevents the self-contradicting "in range" label.
            var effBad=v.bad||outOfBand(v.k,v.v);
            if(judged&&flaggedKeys){
              if(effBad&&flagged)state="caught";
              else if(effBad&&!flagged)state="missed";
              else if(!effBad&&flagged)state="inband";
            }else if(interactive){
              state=flagged?"flagged":"idle";
            }else if(isRevealed(v.k)&&effBad){
              state="attn";
            }
            var chip={position:"relative",borderRadius:10,padding:"7px 4px 8px",textAlign:"center",background:M.chipBg,border:M.chipBorder,transition:"all 0.18s ease"};
            if(state==="flagged")chip=Object.assign({},chip,{background:"rgba("+t.ACCENT_RGB+",0.10)",border:"1.5px solid rgba("+t.ACCENT_RGB+",0.60)"});
            if(state==="caught")chip=Object.assign({},chip,{background:"rgba("+t.POS_RGB+",0.10)",border:"1.5px solid rgba("+t.POS_RGB+",0.60)"});
            if(state==="missed"||state==="attn")chip=Object.assign({},chip,{background:"rgba("+t.ATTN_RGB+",0.10)",border:"1.5px solid rgba("+t.ATTN_RGB+",0.60)"});
            if(state==="inband")chip=Object.assign({},chip,{border:"1px dashed "+M.bandText});
            var canFlag=interactive&&!judged;
            var canWhy=judged&&effBad&&typeof onWhyKey==="function";
            if(canFlag||canWhy)chip=Object.assign({},chip,{cursor:"pointer"});
            var inner=(<div>
              <div style={{fontSize:8.5,letterSpacing:0.8,textTransform:"uppercase",color:M.label,fontWeight:700,fontFamily:t.FONT.body}}>{v.l}</div>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:3,marginTop:2}}>
                <span style={{fontSize:18,fontWeight:700,color:M.value,fontFamily:M.valueFont,fontFeatureSettings:M.valueFeature,lineHeight:1.1}}>{String(v.v)}</span>
                <span style={{fontSize:8.5,color:M.unit,fontFamily:t.FONT.body}}>{v.u}</span>
              </div>
              {showRanges&&bandRow(v.k,v.v,v.u,judged)}
              {state==="missed"&&<div style={{fontSize:8.5,color:t.COLOR.attention,fontWeight:700,marginTop:3,fontFamily:t.FONT.body}}>take a look</div>}
              {state==="inband"&&<div style={{fontSize:8.5,color:M.bandText,fontWeight:600,marginTop:3,fontFamily:t.FONT.body}}>in range</div>}
              {canWhy&&<div style={{fontSize:8.5,color:t.COLOR.attentionText,fontWeight:700,marginTop:3,fontFamily:t.FONT.body,textDecoration:"underline"}}>why?</div>}
              {state==="flagged"&&<Flag size={10} color={t.COLOR.accent} style={{position:"absolute",top:5,right:5}}/>}
              {state==="caught"&&<Check size={11} color={t.COLOR.positive} style={{position:"absolute",top:5,right:5}}/>}
            </div>);
            if(canFlag)return(<div key={v.l} className="bw-tap" onClick={function(){onFlagKey(v.k);}} style={chip}>{inner}</div>);
            if(canWhy)return(<div key={v.l} className="bw-tap" onClick={function(){onWhyKey(v.k);}} style={chip}>{inner}</div>);
            return(<div key={v.l} style={chip}>{inner}</div>);
          })}
        </div>
      </div>
      {/* Housing control strip: status light + model tag left, controls right. */}
      <div style={{position:"absolute",left:14,bottom:9,display:"flex",alignItems:"center",gap:5}}>
        <span style={{width:6,height:6,borderRadius:4,background:ledColor,boxShadow:"0 0 6px "+ledColor,transition:"background 0.3s ease"}}/>
        <span style={{fontSize:8,fontWeight:700,letterSpacing:1.2,color:M.housingInk,fontFamily:t.FONT.body}}>BW-06</span>
      </div>
      <div style={{position:"absolute",right:14,bottom:8,display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:20,height:10,borderRadius:5,background:M.housingDetail,border:"1px solid "+M.housingDetailBorder,boxShadow:"inset 0 1px 2px rgba(0,0,0,0.12)"}}/>
        <div style={{width:12,height:12,borderRadius:7,background:M.housingDetail,border:"1px solid "+M.housingDetailBorder,boxShadow:"inset 0 1px 2px rgba(0,0,0,0.15)"}}/>
      </div>
    </div>);
}
