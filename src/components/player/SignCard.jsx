import { useState } from "react";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";

export function SignCard(props){
  var s=props.s;var delay=props.delay||0;
  var _open=useState(false);var open=_open[0];var setOpen=_open[1];
  return(<div style={{marginBottom:6,opacity:0,animation:"fadeCard 0.4s ease-out "+delay+"s forwards"}}>
    <div style={{borderRadius:8,padding:10,background:"rgba(10,14,26,0.92)",border:"1.5px solid rgba(78,205,196,0.4)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
        <div style={{fontSize:12,fontWeight:700,color:"#4ECDC4",lineHeight:1.2}}>{s.label}</div>
        {s.why&&<WhyButton onClick={function(){setOpen(true);}} compact={true}/>}
      </div>
      <div style={{fontSize:11,color:"#bbc",lineHeight:1.4,marginTop:2}}>{s.finding}</div>
    </div>
    <WhyModal open={open} onClose={function(){setOpen(false);}} title={s.label} body={s.why}/>
  </div>);
}
