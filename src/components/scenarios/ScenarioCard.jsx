import { Check } from "lucide-react";
import { BuiltInBadge } from "./BuiltInBadge.jsx";
import { useTokens } from "../theme/themeStore.js";

var BUILT_IN_IDS=["fussy-infant","vomiting-toddler","asthma-crisis"];

export function ScenarioCard(props){
  var t=useTokens();
  var s=props.s;var p=props.p;var variant=props.variant;var index=props.index||0;var onPlay=props.onPlay;var onDelete=props.onDelete;
  if(variant==="core"){
    var isBuiltIn=BUILT_IN_IDS.indexOf(s.id)>=0;
    return(<button key={s.id} onClick={function(){onPlay(s);}} className="fi bw-tap" style={Object.assign({},t.surface("card"),{width:"100%",textAlign:"left",padding:20,marginBottom:12,cursor:"pointer",color:t.COLOR.ink,animationDelay:(0.25+index*0.05)+"s"})}>
      <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:32,flexShrink:0}}>{s.icon}</div><div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0,fontFamily:t.FONT.display,color:t.COLOR.ink}}>{s.title}</h3><span style={t.chip("accent")}>{"Tier "+s.tier}</span>{isBuiltIn&&<BuiltInBadge/>}{p&&p.done&&<span style={{color:t.COLOR.positive}}><Check size={18}/></span>}</div>
        <p style={{fontSize:13,color:t.COLOR.ink3,marginTop:2}}>{s.tagline}</p>{p&&<div style={{fontSize:11,color:t.COLOR.ink3,marginTop:4}}>{p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div></button>);
  }
  var playBtn=Object.assign({},t.cta("positive"),{flex:1,width:"auto",padding:"10px 0",fontSize:13});
  return(<div key={s.id||index} className="fi bw-tap" style={Object.assign({},t.surface("card"),{padding:16,marginBottom:12,cursor:"pointer"})}>
    <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{fontSize:28,flexShrink:0}}>{s.icon||"\u{1F3E5}"}</div><div style={{flex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h3 style={{fontWeight:700,margin:0,fontFamily:t.FONT.display,color:t.COLOR.ink}}>{s.title}</h3><span style={t.chip("positive")}>AI Generated</span>{p&&p.done&&<span style={{color:t.COLOR.positive}}><Check size={18}/></span>}</div>
      <p style={{fontSize:13,color:t.COLOR.ink3,marginTop:2}}>{s.tagline||s.description}</p>{p&&<div style={{fontSize:11,color:t.COLOR.ink3,marginTop:4}}>{p.n+" attempt"+(p.n!==1?"s":"")}</div>}</div></div>
    <div style={{display:"flex",gap:8,marginTop:12}}>
      <button onClick={function(){onPlay(s);}} style={playBtn}>Play</button>
      <button onClick={function(){onDelete(s);}} style={{padding:"10px 16px",borderRadius:t.RADIUS.md,fontWeight:700,fontSize:13,background:"rgba("+t.CRIT_RGB+",0.14)",color:t.COLOR.critical,border:"1px solid rgba("+t.CRIT_RGB+",0.30)",cursor:"pointer"}}>X</button></div></div>);
}
