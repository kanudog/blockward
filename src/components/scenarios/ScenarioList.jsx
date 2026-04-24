import { ScenarioCard } from "./ScenarioCard.jsx";

export function ScenarioList(props){
  var built=props.built;var cust=props.cust;var prog=props.prog;var onPlay=props.onPlay;var onDelete=props.onDelete;
  return(<div>
    <h2 className="fi" style={{fontSize:17,fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginBottom:12,animationDelay:".2s"}}>Core Scenarios</h2>
    {built.map(function(s,i){return <ScenarioCard key={s.id} s={s} p={prog[s.id]} variant="core" index={i} onPlay={onPlay}/>;})}
    {cust.length>0&&(<div><h2 className="fi" style={{fontSize:17,fontWeight:700,fontFamily:"'Fredoka',sans-serif",marginTop:24,marginBottom:12}}>Custom Scenarios</h2>
      {cust.map(function(s,i){return <ScenarioCard key={s.id||i} s={s} p={prog[s.id]} variant="custom" index={i} onPlay={onPlay} onDelete={onDelete}/>;})}</div>)}
  </div>);
}
