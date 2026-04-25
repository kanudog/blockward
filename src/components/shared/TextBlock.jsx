// Lightweight markdown-lite renderer used throughout the player UI.
// Recognized syntax (phase-2.6):
// - Lines starting with "- ", "•", "–", or "1." render as bullets.
// - Inline **double-asterisks** render as <strong>.
// - Plain lines render as paragraphs.
// Anything else (including markdown headers and numbered nesting) is ignored.

function renderInline(text, keyPrefix){
  if(text.indexOf("**")<0)return text;
  var parts=text.split("**");
  return parts.map(function(p,i){
    if(i%2===1)return <strong key={keyPrefix+"-b-"+i}>{p}</strong>;
    return <span key={keyPrefix+"-s-"+i}>{p}</span>;
  });
}

export function TextBlock(props){
  var text=props.text||"";var style=props.style||{};
  var lines=text.split("\n").filter(function(l){return l.trim();});
  if(lines.length<=1)return(<p style={style}>{renderInline(text,"top")}</p>);
  return(<div style={style}>{lines.map(function(line,i){
    var trimmed=line.trim();
    var isBullet=trimmed.charAt(0)==="•"||trimmed.charAt(0)==="-"||trimmed.charAt(0)==="–"||trimmed.match(/^\d+[\.\)]/);
    if(isBullet){
      var content=trimmed.replace(/^[•\-–]\s*/,"").replace(/^\d+[\.\)]\s*/,"");
      return(<div key={i} style={{display:"flex",gap:6,marginTop:i>0?3:0}}><span style={{color:"#4ECDC4",flexShrink:0}}>{"•"}</span><span>{renderInline(content,"l"+i)}</span></div>);
    }
    return(<p key={i} style={{marginTop:i>0?6:0}}>{renderInline(trimmed,"l"+i)}</p>);
  })}</div>);
}
