import { Check } from "lucide-react";
import { BuiltInBadge } from "./BuiltInBadge.jsx";

var BUILT_IN_IDS=["fussy-infant","vomiting-toddler","asthma-crisis"];

export function ScenarioCard(props){
  var s=props.s;var p=props.p;var variant=props.variant;var index=props.index||0;var onPlay=props.onPlay;var onDelete=props.onDelete;
  if(variant==="core"){
    var isBuiltIn=BUILT_IN_IDS.indexOf(s.id)>=0;
    return(<button key={s.id} onClick={function(){onPlay(s);}} className="fi bw-tap bw-glass" style={{width:"100%",textAlign:"left",borderRadius:16,padding:20,marginBottom:12,border:"2px solid rgba(78,205,196,0.2)",cursor:"pointer",color:"white",animationDelay:(0.25+index*0.05)+"s"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:32,flexShrink:0}}>{s.icon}</div><div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0}}>{s.title}</h3><span style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:"rgba(78,205,196,0.15)",color:"#4ECDC4"}}>{"Tier "+s.tier}</span>{isBuiltIn&&<BuiltInBadge/>}{p&&p.done&&<span style={{color:"#00b894"}}><Check size={18}/></span>}</div>
        <p style={{fontSize:13,color:"#999",marginTop:2}}>{s.tagline}</p>{p&&<div style={{fontSize:11,color:"#666",marginTop:4}}>{"Best: "+Math.round(p.best*100)+"% | "+p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div></button>);
  }
  return(<div key={s.id||index} className="fi bw-glass bw-tap" style={{borderRadius:16,padding:16,marginBottom:12,border:"2px solid rgba(165,94,234,0.2)",cursor:"pointer"}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:28,flexShrink:0}}>{s.icon||"\u{1F3E5}"}</div><div style={{flex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0}}>{s.title}</h3><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:"rgba(165,94,234,0.3)",color:"#c4b5fd"}}>AI Generated</span>{p&&p.done&&<span style={{color:"#00b894"}}><Check size={18}/></span>}</div>
      <p style={{fontSize:13,color:"#999",marginTop:2}}>{s.tagline||s.description}</p>{p&&<div style={{fontSize:11,color:"#666",marginTop:4}}>{"Best: "+Math.round(p.best*100)+"% | "+p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div>
    <div style={{display:"flex",gap:8,marginTop:12}}>
      <button onClick={function(){onPlay(s);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,color:"white",fontSize:13,background:"rgba(165,94,234,0.3)",border:"none",cursor:"pointer"}}>Play</button>
      <button onClick={function(){onDelete(s);}} style={{padding:"10px 16px",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba(255,71,87,0.15)",color:"#FF6B81",border:"none",cursor:"pointer"}}>X</button></div></div>);
}
