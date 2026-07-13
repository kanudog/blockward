import { useTokens } from "../theme/themeStore.js";

export function Toast(props){
  var t=useTokens();
  var message=props.message;
  if(!message)return null;
  var pos=t.cta("positive");
  return(<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,padding:"10px 20px",borderRadius:t.RADIUS.md,background:pos.background,color:pos.color,fontWeight:700,fontSize:13,fontFamily:t.FONT.body,boxShadow:pos.boxShadow}}>{message}</div>);
}
