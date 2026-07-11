// Light/dark theme toggle — minimal single icon button (shows the mode it
// switches TO). Placement: ONLY the main menu / case-selection screen; do
// not mount it inside the run.
import { Sun, Moon } from "lucide-react";
import { useThemeStore, useTokens } from "../theme/themeStore.js";

export function ThemeToggle() {
  var t = useTokens();
  var mode = useThemeStore(function (s) { return s.mode; });
  var setMode = useThemeStore(function (s) { return s.setMode; });
  var next = mode === "light" ? "dark" : "light";
  var Icon = mode === "light" ? Moon : Sun;
  return (<button className="bw-tap" title={"Switch to " + next + " theme"} aria-label={"Switch to " + next + " theme"}
    onClick={function () { setMode(next); }}
    style={{
      width: 32, height: 32, borderRadius: 16, display: "inline-flex",
      alignItems: "center", justifyContent: "center", flexShrink: 0,
      background: "transparent", border: "1px solid " + t.COLOR.hairline,
      color: t.COLOR.ink3, cursor: "pointer", transition: "all 0.15s ease", padding: 0
    }}>
    <Icon size={15}/>
  </button>);
}
