// useModalGuard(open) — registers an overlay with the player store for as long
// as it is mounted and open, so ambient UI (the floating review-tray coach mark)
// can stand down while a dialog has focus.
//
// Added 2026-07-29: the tray coach mark rendered position:fixed at z-index 900
// and stayed visible through the 50%-opacity backdrop of an open card, landing
// on top of the teaching text the learner had just opened. Counting overlays is
// safer than a boolean because dialogs nest (an option card can open the Why
// modal on top of itself).
import { useEffect } from "react";
import { usePlayerStore } from "../../stores/playerStore.js";

export function useModalGuard(open) {
  useEffect(function () {
    if (!open) return undefined;
    var s = usePlayerStore.getState();
    s.pushModal();
    return function () { usePlayerStore.getState().popModal(); };
  }, [open]);
}
