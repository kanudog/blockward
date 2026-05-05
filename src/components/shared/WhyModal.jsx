import { Modal } from "./Modal.jsx";
import { TextBlock } from "./TextBlock.jsx";
import { usePlayerStore } from "../../stores/playerStore.js";
import { expandSingleMarkedItem } from "../../lib/ai/client.js";

// WhyModal — pedagogy popup with optional Mark for Review toggle.
//
// Phase-2.6 group D: when item is provided, the modal shows a
// "Mark for Review" button that toggles the item into
// playerStore.markedForReview. The button reflects current state.
//
// Phase-5.2.5: items now carry slot references via item._slotRef
// instead of frozen originalWhy text. Debrief resolves the current
// why/fb text from the live scenario object at render time, so marks
// made while lazy fetch was still pending pick up the populated text
// once it lands. On the add transition (unmarked → marked), we also
// fire expandSingleMarkedItem to eagerly start deep-dive generation
// on Sonnet — by the time the user reaches debrief, the deep dive is
// usually ready in playerStore.deepDiveCache.
export function WhyModal(props){
  var open=props.open;var onClose=props.onClose;var title=props.title||"Why?";var body=props.body;var accent=props.accent||"#4ECDC4";
  var item=props.item;
  var marked=usePlayerStore(function(s){
    if(!item)return false;
    return s.markedForReview.some(function(x){return x.id===item.id;});
  });
  var toggle=usePlayerStore(function(s){return s.toggleMarkForReview;});
  function handleMark(){
    if(!item)return;
    var transition=toggle(item);
    if(transition!=="added")return;
    // Eager deep-dive — unawaited; result lands in playerStore.deepDiveCache.
    var sc=usePlayerStore.getState().activeScenario;
    if(!sc||!item._slotRef)return;
    expandSingleMarkedItem(sc,item).then(function(text){
      if(text)usePlayerStore.getState().setDeepDive(item.id,text);
    }).catch(function(err){
      console.warn("[eager deep-dive] "+item.id+" — "+(err&&err.message||err));
    });
  }
  // Phase-2.6.5 change 1: Mark for Review moved out of children and
  // into Modal's new sticky footer slot, so it stays reachable when
  // the body content scrolls.
  var footer=item?(<div>
    <button onClick={handleMark} style={{width:"100%",padding:"8px 12px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",background:marked?"rgba(254,202,87,0.2)":"rgba(255,255,255,0.06)",border:"1px solid "+(marked?"rgba(254,202,87,0.55)":"rgba(255,255,255,0.18)"),color:marked?"#FECA57":"#ddd"}}>{marked?"✓ Marked for Review":"Mark for Review"}</button>
    <p style={{fontSize:10,color:"#888",marginTop:6,textAlign:"center",lineHeight:1.4}}>{marked?"Will appear in the debrief with an expanded deep dive.":"Save this for a deeper review at the end of the scenario."}</p>
  </div>):null;
  return(<Modal open={open} onClose={onClose} title={title} accent={accent} footer={footer}>
    <TextBlock text={body||""} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/>
  </Modal>);
}

export function WhyButton(props){
  var onClick=props.onClick;var label=props.label||"Why?";var accent=props.accent||"#4ECDC4";var compact=props.compact;
  var padding=compact?"2px 8px":"4px 10px";var fontSize=compact?10:11;
  return(<button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:4,padding:padding,borderRadius:999,fontSize:fontSize,fontWeight:700,background:accent+"1a",border:"1px solid "+accent+"55",color:accent,cursor:"pointer",lineHeight:1}}>{label}</button>);
}
