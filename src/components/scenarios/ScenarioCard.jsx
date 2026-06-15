import { Check } from "lucide-react";
import { BuiltInBadge } from "./BuiltInBadge.jsx";
import { COLOR, chip } from "../../lib/design/tokens.js";

var BUILT_IN_IDS=["fussy-infant","vomiting-toddler","asthma-crisis"];

export function ScenarioCard(props){
  var s=props.s;var p=props.p;var variant=props.variant;var index=props.index||0;var onPlay=props.onPlay;var onDelete=props.onDelete;
  if(variant==="core"){
    var isBuiltIn=BUILT_IN_IDS.indexOf(s.id)>=0;
    return(<button key={s.id} onClick={function(){onPlay(s);}} className="fi bw-tap bw-glass" style={{width:"100%",textAlign:"left",borderRadius:18,padding:20,marginBottom:12,border:"1px solid rgba(34,211,238,0.22)",cursor:"pointer",color:"white",animationDelay:(0.25+index*0.05)+"s"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:32,flexShrink:0}}>{s.icon}</div><div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0}}>{s.title}</h3><span style={chip("accent")}>{"Tier "+s.tier}</span>{isBuiltIn&&<BuiltInBadge/>}{p&&p.done&&<span style={{color:COLOR.ok}}><Check size={18}/></span>}</div>
        <p style={{fontSize:13,color:COLOR.ink3,marginTop:2}}>{s.tagline}</p>{p&&<div style={{fontSize:11,color:COLOR.ink4,marginTop:4}}>{p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div></button>);
  }
  return(<div key={s.id||index} className="fi bw-glass bw-tap" style={{borderRadius:18,padding:16,marginBottom:12,border:"1px solid rgba(129,140,248,0.22)",cursor:"pointer"}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:28,flexShrink:0}}>{s.icon||"\u{1F3E5}"}</div><div style={{flex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0}}>{s.title}</h3><span style={chip("indigo")}>AI Generated</span>{p&&p.done&&<span style={{color:COLOR.ok}}><Check size={18}/></span>}</div>
      <p style={{fontSize:13,color:COLOR.ink3,marginTop:2}}>{s.tagline||s.description}</p>{p&&<div style={{fontSize:11,color:COLOR.ink4,marginTop:4}}>{p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div>
    <div style={{display:"flex",gap:8,marginTop:12}}>
      <button onClick={function(){onPlay(s);}} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,color:"#fff",fontSize:13,background:"rgba(129,140,248,0.32)",border:"1px solid rgba(129,140,248,0.4)",cursor:"pointer"}}>Play</button>
      <button onClick={function(){onDelete(s);}} style={{padding:"10px 16px",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba(255,71,87,0.15)",color:COLOR.danger,border:"none",cursor:"pointer"}}>X</button></div></div>);
}
