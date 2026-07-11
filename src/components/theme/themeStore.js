// Theme mode store + useTokens() hook. The ONLY stateful piece of the theme
// system — tokens.js stays pure. The light/dark toggle control itself lives
// in the main menu (app shell): render <ThemeToggle/>
// (components/shared/ThemeToggle.jsx) there.
//
// Default mode follows the device preference on first launch, then persists
// the explicit user choice.
import { create } from "zustand";
import { getTokens } from "./tokens.js";

var STORAGE_KEY = "bw-theme-mode";

function initialMode() {
  try {
    var saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch (e) { /* SSR / privacy mode: fall through to light */ }
  return "light";
}

export var useThemeStore = create(function (set) {
  return {
    mode: initialMode(),
    setMode: function (mode) {
      try { window.localStorage.setItem(STORAGE_KEY, mode); } catch (e) { /* non-blocking */ }
      set({ mode: mode });
    }
  };
});

// The one call components make: returns the active theme's full token object.
export function useTokens() {
  var mode = useThemeStore(function (s) { return s.mode; });
  return getTokens(mode);
}
