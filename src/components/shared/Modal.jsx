export function Modal(props){
  var open=props.open;if(!open)return null;
  var title=props.title;var accent=props.accent||"#4ECDC4";var onClose=props.onClose;
  var maxWidth=props.maxWidth||420;
  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.72)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
    <div style={{background:"#1a1a3e",borderRadius:16,padding:20,maxWidth:maxWidth,width:"100%",maxHeight:"86vh",overflowY:"auto",border:"2px solid "+accent+"40",boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}} onClick={function(e){e.stopPropagation();}}>
      {title&&<h3 style={{fontSize:16,fontWeight:800,marginBottom:12,color:accent,display:"flex",alignItems:"center",gap:8}}>{title}</h3>}
      {props.children}
      <button onClick={onClose} style={{marginTop:16,width:"100%",padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:13,background:"rgba(255,255,255,0.08)",color:"#ddd",border:"none",cursor:"pointer"}}>Close</button>
    </div>
  </div>);
}
