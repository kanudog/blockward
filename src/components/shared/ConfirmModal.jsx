import { useTokens } from "../theme/themeStore.js";

export function ConfirmModal(props){
  var t=useTokens();
  var open=props.open;if(!open)return null;
  var title=props.title;var subtitle=props.subtitle;var warning=props.warning||"This cannot be undone.";
  var confirmLabel=props.confirmLabel||"Confirm";var cancelLabel=props.cancelLabel||"Cancel";
  var onConfirm=props.onConfirm;var onCancel=props.onCancel;
  var card=Object.assign({},t.surface("pop"),{padding:24,maxWidth:340,width:"100%",fontFamily:t.FONT.body,border:"1px solid rgba("+t.CRIT_RGB+",0.35)"});
  return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(15,18,21,0.5)",zIndex:998,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onCancel}>
    <div style={card} onClick={function(e){e.stopPropagation();}}>
      <h3 style={{fontSize:18,fontWeight:600,marginBottom:8,fontFamily:t.FONT.display,color:t.COLOR.ink}}>{title}</h3>
      {subtitle&&<p style={{fontSize:13,color:t.COLOR.ink3,marginBottom:4}}>{subtitle}</p>}
      <p style={{fontSize:12,color:t.COLOR.critical,marginBottom:20}}>{warning}</p>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onCancel} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:t.COLOR.btnNeutralBg,color:t.COLOR.btnNeutralInk,border:"1px solid "+t.COLOR.hairline,cursor:"pointer"}}>{cancelLabel}</button>
        <button onClick={onConfirm} style={{flex:1,padding:"10px 0",borderRadius:10,fontWeight:700,fontSize:14,background:"rgba("+t.CRIT_RGB+",0.14)",color:t.COLOR.critical,border:"1px solid rgba("+t.CRIT_RGB+",0.35)",cursor:"pointer"}}>{confirmLabel}</button>
      </div>
    </div>
  </div>);
}
