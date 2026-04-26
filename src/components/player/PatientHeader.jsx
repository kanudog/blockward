// Phase-3.0 change 1+2: compact patient header strip rendered at the
// top of Phase 1 (assess) and Phase 2 (act). Single row, small font,
// low visual weight — meant to anchor the user without dominating the
// screen. The narrative is rendered just below by the parent.
//
// Patient.name is not a structured field today (the AI puts the name
// in history prose), so the strip surfaces Age / Sex / Weight / CC.
// If a name field is added later this component picks it up.
export function PatientHeader(props){
  var patient=props.patient||{};
  var name=patient.name;
  var fields=[];
  if(patient.ageLabel)fields.push({k:"Age",v:patient.ageLabel});
  if(patient.sex)fields.push({k:"Sex",v:patient.sex});
  if(patient.weightKg)fields.push({k:"Wt",v:patient.weightKg+" kg"});
  if(patient.cc)fields.push({k:"CC",v:patient.cc});
  return(<div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",padding:"6px 10px",borderRadius:8,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",fontSize:11,color:"#bbb"}}>
    {name&&<span style={{fontWeight:700,color:"#ddd"}}>{name}</span>}
    {fields.map(function(f,i){return(<span key={i} style={{display:"inline-flex",alignItems:"center",gap:3}}>
      <span style={{color:"#666",fontWeight:600}}>{f.k}:</span>
      <span style={{color:"#ddd"}}>{f.v}</span>
      {i<fields.length-1&&<span style={{color:"#444",marginLeft:4}}>·</span>}
    </span>);})}
  </div>);
}
