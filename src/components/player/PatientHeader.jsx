// Phase-3.0 change 1+2: compact patient header strip rendered at the
// top of Phase 1 (assess) and Phase 2 (act). Single row, small font,
// low visual weight — meant to anchor the user without dominating the
// screen. The narrative is rendered just below by the parent.
//
// Patient.name is not a structured field today (the AI puts the name
// in history prose), so the strip surfaces Age / Sex / Weight / CC.
// If a name field is added later this component picks it up.
import { useTokens } from "../theme/themeStore.js";

export function PatientHeader(props){
  var t=useTokens();
  var patient=props.patient||{};
  var name=patient.name;
  var fields=[];
  if(patient.ageLabel)fields.push({k:"Age",v:patient.ageLabel});
  if(patient.sex)fields.push({k:"Sex",v:patient.sex});
  if(patient.weightKg)fields.push({k:"Wt",v:patient.weightKg+" kg"});
  if(patient.cc)fields.push({k:"CC",v:patient.cc});
  return(<div style={Object.assign({},t.tile("idle"),{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",padding:"7px 11px",fontSize:11,color:t.COLOR.ink2,fontFamily:t.FONT.body})}>
    {name&&<span style={{fontWeight:700,color:t.COLOR.ink}}>{name}</span>}
    {fields.map(function(f,i){return(<span key={i} style={{display:"inline-flex",alignItems:"center",gap:3}}>
      <span style={{color:t.COLOR.ink3,fontWeight:600}}>{f.k}:</span>
      <span style={{color:t.COLOR.ink}}>{f.v}</span>
      {i<fields.length-1&&<span style={{color:t.COLOR.ink3,marginLeft:4,opacity:0.5}}>·</span>}
    </span>);})}
  </div>);
}
