import { useState } from "react";
export function LabPanel(props) {
  var labs = props.labs || [];
  var _openLab = useState(null);var openLab=_openLab[0];var setOpenLab=_openLab[1];
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
        {labs.some(function(l){return l.explain;})&&<div style={{fontSize:9,color:"#666"}}>Tap critical values for details</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {labs.map(function(lab,i) {
          var isCrit = lab.critical === true;
          var bg = isCrit ? "rgba(255,71,87,0.12)" : "rgba(255,255,255,0.04)";
          var brd = isCrit ? "1px solid rgba(255,71,87,0.25)" : "1px solid rgba(255,255,255,0.06)";
          var isOpen = openLab === i;
          var tappable = isCrit && lab.explain;
          return (
            <div key={i} onClick={tappable?function(){setOpenLab(isOpen?null:i);}:undefined} style={{borderRadius:8,padding:"8px 12px",background:bg,border:brd,cursor:tappable?"pointer":"default",gridColumn:isOpen?"1 / -1":"auto"}}>
              <div style={{fontSize:10,color:"#999",fontWeight:600}}>{lab.name}{tappable&&!isOpen?" \u24D8":""}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4}}>
                <span style={{fontSize:16,fontWeight:800,color:isCrit?"#ff7675":"#c8d6e5"}}>{lab.value}</span>
                <span style={{fontSize:9,color:"#666"}}>{lab.unit}</span>
              </div>
              <div style={{fontSize:9,color:"#555"}}>{"Ref: "+lab.ref}</div>
              {isOpen&&lab.explain&&<div style={{marginTop:4,paddingTop:4,borderTop:"1px solid rgba(255,255,255,0.08)",fontSize:11,color:"#ccc",lineHeight:1.5}}>{lab.explain}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
