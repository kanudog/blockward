export function loadS(k, fb) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch(e) { return fb; } }
export function saveS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) { console.error(e); } }
