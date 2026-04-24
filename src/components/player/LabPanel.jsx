import { useState } from "react";
import { WhyModal, WhyButton } from "../shared/WhyModal.jsx";

export function LabPanel(props) {
  var labs = props.labs || [];
  var _why=useState(null);var whyTarget=_why[0];var setWhyTarget=_why[1];
  if (labs.length === 0) return null;
  return (
    <div style={{marginTop:8,marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <svg viewBox="0 0 24 40" style={{width:18,height:30,flexShrink:0}}>
          <rect x="6" y="0" width="12" height="6" rx="2" fill="#a0a0a0"/>
          <rect x="4" y="5" width="16" height="32" rx="4" fill="#e8e8ee" stroke="#bbb" strokeWidth="0.5"/>
          <rect x="5" y="18" width="14" height="18" rx="3" fill="#d63031" opacity="0.8">
            <animate attributeName="height" values="18;16;18" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="y" values="18;20;18" dur="2s" repeatCount="indefinite"/>
          </rect>
        </svg>
        <div style={{fontSize:12,fontWeight:700,color:"#ff7675"}}>Lab Results</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {labs.map(function(lab,i) {
          var isCrit = lab.critical === true;
          var bg = isCrit ? "rgba(255,71,87,0.12)" : "rgba(255,255,255,0.04)";
          var brd = isCrit ? "1px solid rgba(255,71,87,0.25)" : "1px solid rgba(255,255,255,0.06)";
          var hasWhy = !!lab.why;
          return (
            <div key={i} style={{borderRadius:8,padding:"8px 12px",background:bg,border:brd}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                <div style={{fontSize:10,color:"#999",fontWeight:600}}>{lab.name}</div>
                {hasWhy&&<WhyButton onClick={function(){setWhyTarget(lab);}} compact={true} accent={isCrit?"#ff7675":"#4ECDC4"}/>}
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                <span style={{fontSize:16,fontWeight:800,color:isCrit?"#ff7675":"#c8d6e5"}}>{lab.value}</span>
                <span style={{fontSize:9,color:"#666"}}>{lab.unit}</span>
              </div>
              <div style={{fontSize:9,color:"#555"}}>{"Ref: "+lab.ref}</div>
            </div>
          );
        })}
      </div>
      <WhyModal open={!!whyTarget} onClose={function(){setWhyTarget(null);}} title={whyTarget?whyTarget.name+": "+whyTarget.value+" "+(whyTarget.unit||""):""} body={whyTarget?whyTarget.why:""} accent={whyTarget&&whyTarget.critical?"#ff7675":"#4ECDC4"}/>
    </div>
  );
}
