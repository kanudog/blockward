import { SignCard } from "./SignCard.jsx";
import { PatientSVG } from "./PatientSVG.jsx";
export function PatientView(props){
  var status=props.status;var rr=props.rr;var signs=props.signs||[];
  var ageGroup=props.ageGroup||"infant";var sex=props.sex||"neutral";
  var visuals=props.visuals||[];var emotion=props.emotion||"neutral";
  var seed=props.seed||"";var pose=props.pose||"rest";
  var leftSigns=signs.filter(function(_,i){return i%2===0;});
  var rightSigns=signs.filter(function(_,i){return i%2===1;});
  return(
    <div>
      <div style={{display:"flex",alignItems:"flex-start",gap:4}}>
        <div style={{flex:1,paddingTop:8,minWidth:0}}>
          {leftSigns.map(function(s,i){return <SignCard key={i} s={s} delay={i*0.15}/>;})}</div>
        <div style={{width:180,flexShrink:0}}>
          <PatientSVG status={status} rr={rr} ageGroup={ageGroup} sex={sex} visuals={visuals} emotion={emotion} seed={seed} pose={pose}/></div>
        <div style={{flex:1,paddingTop:8,minWidth:0}}>
          {rightSigns.map(function(s,i){return <SignCard key={i} s={s} delay={i*0.15+0.1}/>;})}</div>
      </div>
    </div>);
}
