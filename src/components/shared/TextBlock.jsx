export function TextBlock(props){
  var text=props.text||"";var style=props.style||{};
  var lines=text.split("\n").filter(function(l){return l.trim();});
  if(lines.length<=1)return(<p style={style}>{text}</p>);
  return(<div style={style}>{lines.map(function(line,i){
    var trimmed=line.trim();
    var isBullet=trimmed.charAt(0)==="\u2022"||trimmed.charAt(0)==="-"||trimmed.charAt(0)==="\u2013"||trimmed.match(/^\d+[\.\)]/);
    if(isBullet){
      var content=trimmed.replace(/^[\u2022\-\u2013]\s*/,"").replace(/^\d+[\.\)]\s*/,"");
      return(<div key={i} style={{display:"flex",gap:6,marginTop:i>0?3:0}}><span style={{color:"#4ECDC4",flexShrink:0}}>{"\u2022"}</span><span>{content}</span></div>);
    }
    return(<p key={i} style={{marginTop:i>0?6:0}}>{trimmed}</p>);
  })}</div>);
}
