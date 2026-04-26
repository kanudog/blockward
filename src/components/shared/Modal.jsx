// Phase-2.6.5 change 1: containment rewrite.
//
// Previous version: container was overflowY:auto with title and Close
// button inside the same scrolling region. With long content (canonical
// MTP teaching, expanded WhyModal bodies) the title scrolled out and
// the Close button could be pushed below the viewport, leaving no
// way to dismiss the modal.
//
// New structure: vertical flex with three regions inside a maxHeight:85vh
// container:
//   - Header (flex-shrink:0): title, never scrolls.
//   - Body (flex:1, overflowY:auto, minHeight:0): children scroll here.
//   - Footer (flex-shrink:0): optional `footer` prop content (e.g. Mark
//     for Review) plus the Close button. Always visible.
//
// Backdrop z-index 1000 keeps the modal above all Phase 2 content.
export function Modal(props){
  var open=props.open;if(!open)return null;
  var title=props.title;var accent=props.accent||"#4ECDC4";var onClose=props.onClose;
  var maxWidth=props.maxWidth||420;
  var footer=props.footer;
  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.72)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
    <div style={{display:"flex",flexDirection:"column",background:"#1a1a3e",borderRadius:16,maxWidth:maxWidth,width:"100%",maxHeight:"85vh",border:"2px solid "+accent+"40",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}} onClick={function(e){e.stopPropagation();}}>
      {title&&<div style={{padding:"16px 20px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
        <h3 style={{fontSize:16,fontWeight:800,margin:0,color:accent,display:"flex",alignItems:"center",gap:8}}>{title}</h3>
      </div>}
      <div style={{padding:"16px 20px",overflowY:"auto",flex:1,minHeight:0}}>{props.children}</div>
      <div style={{padding:"12px 20px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
        {footer}
        <button onClick={onClose} style={{marginTop:footer?12:0,width:"100%",padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba(255,255,255,0.08)",color:"#ddd",border:"none",cursor:"pointer"}}>Close</button>
      </div>
    </div>
  </div>);
}
