// Lightweight markdown-lite renderer used throughout the player UI (Why?
// popups, intervention feedback, narratives, debrief deep-dives).
// Recognized syntax:
// - Inline **double-asterisks** render as accent-coloured bold (key terms pop).
// - Lines starting with "- ", "•", "–", or "1." render as accent bullets.
// - Blank lines render as paragraph gaps (preserved so prose doesn't become a
//   wall of text).
// - Plain lines render as paragraphs.

var ACCENT = "#4ECDC4";

function renderInline(text, keyPrefix){
  if(text.indexOf("**")<0)return text;
  var parts=text.split("**");
  return parts.map(function(p,i){
    if(i%2===1)return <strong key={keyPrefix+"-b-"+i} style={{color:ACCENT,fontWeight:700}}>{p}</strong>;
    return <span key={keyPrefix+"-s-"+i}>{p}</span>;
  });
}

export function TextBlock(props){
  var text=props.text||"";var style=props.style||{};
  var rawLines=text.split("\n");
  // Only switch to block layout when there's real structure (a bullet, a
  // numbered item, or a blank-line paragraph break); otherwise a lone line
  // renders as a single paragraph.
  var hasStructure=rawLines.some(function(l){
    var t=l.trim();
    return t===""||t.charAt(0)==="•"||t.charAt(0)==="-"||t.charAt(0)==="–"||/^\d+[\.\)]/.test(t);
  });
  if(!hasStructure)return(<p style={style}>{renderInline(text,"top")}</p>);
  return(<div style={style}>{rawLines.map(function(line,i){
    var trimmed=line.trim();
    if(trimmed==="")return <div key={i} style={{height:8}}/>;
    var isBullet=trimmed.charAt(0)==="•"||trimmed.charAt(0)==="-"||trimmed.charAt(0)==="–"||trimmed.match(/^\d+[\.\)]/);
    if(isBullet){
      var content=trimmed.replace(/^[•\-–]\s*/,"").replace(/^\d+[\.\)]\s*/,"");
      return(<div key={i} style={{display:"flex",gap:7,marginTop:3}}><span style={{color:ACCENT,flexShrink:0,fontWeight:700}}>{"•"}</span><span>{renderInline(content,"l"+i)}</span></div>);
    }
    return(<p key={i} style={{margin:0}}>{renderInline(trimmed,"l"+i)}</p>);
  })}</div>);
}
