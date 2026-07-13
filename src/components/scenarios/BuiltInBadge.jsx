import { useTokens } from "../theme/themeStore.js";

export function BuiltInBadge(){
  var t=useTokens();
  return <span style={t.chip("positive")}>Clinically Reviewed</span>;
}
