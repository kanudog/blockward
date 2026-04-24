export function ConfirmModal(props){
  var open=props.open;if(!open)return null;
  var title=props.title;var subtitle=props.subtitle;var warning=props.warning||"This cannot be undone.";
  var confirmLabel=props.confirmLabel||"Confirm";var cancelLabel=props.cancelLabel||"Cancel";
  var onConfirm=props.onConfirm;var onCancel=props.onCancel;
  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onCancel}>
    <div style={{background:"#1a1a3e",borderRadius:16,padding:24,maxWidth:340,width:"100%",border:"2px solid rgba(255,71,87,0.3)"}} onClick={function(e){e.stopPropagation();}}>
      <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>{title}</h3>
      {subtitle&&<p style={{fontSize:13,color:"#999",marginBottom:4}}>{subtitle}</p>}
      <p style={{fontSize:12,color:"#FF6B81",marginBottom:20}}>{warning}</p>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onCancel} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:"rgba(255,255,255,0.1)",color:"#999",border:"none",cursor:"pointer"}}>{cancelLabel}</button>
        <button onClick={onConfirm} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:"rgba(255,71,87,0.3)",color:"#FF6B81",border:"none",cursor:"pointer"}}>{confirmLabel}</button>
      </div>
    </div>
  </div>);
}
