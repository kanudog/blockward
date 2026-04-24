import { Modal } from "./Modal.jsx";
import { TextBlock } from "./TextBlock.jsx";

export function WhyModal(props){
  var open=props.open;var onClose=props.onClose;var title=props.title||"Why?";var body=props.body;var accent=props.accent||"#4ECDC4";
  return(<Modal open={open} onClose={onClose} title={title} accent={accent}>
    <TextBlock text={body||""} style={{fontSize:13,color:"#ddd",lineHeight:1.6}}/>
  </Modal>);
}

export function WhyButton(props){
  var onClick=props.onClick;var label=props.label||"Why?";var accent=props.accent||"#4ECDC4";var compact=props.compact;
  var padding=compact?"2px 8px":"4px 10px";var fontSize=compact?10:11;
  return(<button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:4,padding:padding,borderRadius:999,fontSize:fontSize,fontWeight:700,background:accent+"1a",border:"1px solid "+accent+"55",color:accent,cursor:"pointer",lineHeight:1}}>{label}</button>);
}
