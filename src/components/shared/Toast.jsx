export function Toast(props){
  var message=props.message;
  if(!message)return null;
  return(<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,padding:"10px 20px",borderRadius:12,background:"rgba(78,205,196,0.95)",color:"#0a0e1a",fontWeight:700,fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{message}</div>);
}
