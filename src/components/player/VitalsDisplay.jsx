import { useRef, useEffect } from "react";

function ecgPt(t,hr){var p=60/hr,x=(t%p)/p;if(x<.06)return 0;if(x<.08)return Math.sin((x-.06)/.02*Math.PI)*0.05;if(x<.10)return(x-.08)/.02*1.0;if(x<.12)return 1.0-(x-.10)/.02*1.0;if(x<.14)return 0;if(x<.30)return Math.sin((x-.14)/.16*Math.PI)*0.08;return 0;}
function plPt(t,hr){var p=60/hr,x=(t%p)/p;return(Math.sin(x*Math.PI*2-Math.PI/2)+1)/2*0.8;}
export function VitalsDisplay(props){
  var vitals=props.vitals;var flash=props.flash;
  var cR=useRef(null);var tR=useRef(0);var aR=useRef(null);
  useEffect(function(){var c=cR.current;if(!c)return;var ctx=c.getContext("2d");var W=c.width;var H=c.height;
    var draw=function(){tR.current+=.016;var t=tR.current;ctx.fillStyle="#0a0e1a";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(78,205,196,0.05)";ctx.lineWidth=.5;
      for(var i=0;i<W;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
      for(var j=0;j<H;j+=20){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke();}
      ctx.strokeStyle="#4ECDC4";ctx.lineWidth=2;ctx.shadowColor="#4ECDC4";ctx.shadowBlur=6;ctx.beginPath();
      for(var k=0;k<W;k++){var y=H*.25-ecgPt(t-(W-k)*.008,vitals.hr)*H*.2;k===0?ctx.moveTo(k,y):ctx.lineTo(k,y);}ctx.stroke();ctx.shadowBlur=0;
      ctx.strokeStyle="#FECA57";ctx.lineWidth=2;ctx.shadowColor="#FECA57";ctx.shadowBlur=6;ctx.beginPath();
      for(var m=0;m<W;m++){var yy=H*.7-plPt(t-(W-m)*.008,vitals.hr)*H*.15;m===0?ctx.moveTo(m,yy):ctx.lineTo(m,yy);}ctx.stroke();ctx.shadowBlur=0;
      ctx.font="bold 10px sans-serif";ctx.fillStyle="#4ECDC4";ctx.fillText("ECG II",8,16);ctx.fillStyle="#FECA57";ctx.fillText("SpO2",8,H*.57);
      aR.current=requestAnimationFrame(draw);};draw();return function(){cancelAnimationFrame(aR.current);};},[vitals.hr]);
  var bColor=flash?"#FF4757":"#555";
  var vs=[{l:"HR",v:vitals.hr,u:"bpm"},{l:"SpO2",v:vitals.spo2,u:"%"},{l:"RR",v:vitals.rr,u:"/min"},{l:"BP",v:vitals.sbp+"/"+vitals.dbp,u:"mmHg"},{l:"Temp",v:typeof vitals.temp==="number"?vitals.temp.toFixed(1):vitals.temp,u:"C"},{l:"Cap Refill",v:vitals.cap,u:"sec"}];
  return(
    <div style={{borderRadius:16,overflow:"hidden",border:"4px solid "+bColor,background:"#0a0e1a"}}>
      <canvas ref={cR} width={400} height={180} style={{width:"100%",height:150,display:"block"}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,padding:8,background:"#0d1117"}}>
        {vs.map(function(v){var vColor="#c8d6e5";if(v.l==="HR")vColor="#55efc4";else if(v.l==="SpO2")vColor="#fdcb6e";else if(v.l==="Temp"&&(v.v<36.5||v.v>37.5))vColor="#ff7675";return(
          <div key={v.l} style={{borderRadius:8,padding:4,textAlign:"center",background:"rgba(255,255,255,0.03)"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}}>{v.l}</div>
            <div style={{fontSize:20,fontWeight:900,color:vColor}}>{v.v}</div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.25)"}}>{v.u}</div>
          </div>);})}
      </div>
    </div>);
}
