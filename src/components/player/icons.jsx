import { Activity, Eye, Pill, Stethoscope, Syringe, Thermometer, Timer, Wind, Zap } from "lucide-react";

export function ToolIcon({name, size=24, color="#4ECDC4"}) {
  var s = {width:size,height:size,flexShrink:0};
  switch(name) {
    case "glucometer": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><line x1="10" y1="8" x2="14" y2="8"/><circle cx="12" cy="14" r="2"/><line x1="12" y1="22" x2="12" y2="20"/></svg>;
    case "stethoscope": return <Stethoscope size={size} color={color} strokeWidth={2}/>;
    case "bvm": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="12" rx="6" ry="5"/><path d="M16 12h4c1 0 2-1 2-2V8"/><path d="M4 12c-1 0-2 1-2 2v1"/></svg>;
    case "bvmReady": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="12" rx="6" ry="5"/><path d="M16 12h4c1 0 2-1 2-2V8"/><path d="M4 12c-1 0-2 1-2 2v1"/><circle cx="20" cy="6" r="2.5" fill={color} stroke="none"/></svg>;
    case "suction": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><path d="M8 8h8l-1 10H9L8 8z"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>;
    case "o2mask": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s-2 2-2 4a4 4 0 008 0c0-2-2-4-2-4"/><ellipse cx="12" cy="10" rx="5" ry="6"/><line x1="12" y1="4" x2="12" y2="2"/><path d="M7 10H3"/><path d="M21 10h-4"/></svg>;
    case "ivKit": return <Syringe size={size} color={color} strokeWidth={2}/>;
    case "defib": return <Zap size={size} color={color} strokeWidth={2}/>;
    case "thermometer": return <Thermometer size={size} color={color} strokeWidth={2}/>;
    case "capRefill": return <Timer size={size} color={color} strokeWidth={2}/>;
    case "needleDecomp": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="16"/><path d="M8 12l4 4 4-4"/><circle cx="12" cy="20" r="2"/></svg>;
    case "pupilCheck": return <Eye size={size} color={color} strokeWidth={2}/>;
    case "epiPen": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="16" rx="2"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="9" y1="6" x2="15" y2="6"/><circle cx="12" cy="10" r="1" fill={color}/></svg>;
    case "peakFlow": return <Wind size={size} color={color} strokeWidth={2}/>;
    default: return <Activity size={size} color={color} strokeWidth={2}/>;
  }
}
export function MedIcon({type, size=22, color="#74b9ff"}) {
  var s = {width:size,height:size,flexShrink:0};
  switch(type) {
    case "neb": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 18v-2a4 4 0 018 0v2"/><rect x="6" y="18" width="12" height="4" rx="1"/><path d="M12 8v4"/><circle cx="12" cy="6" r="2"/><path d="M9 3l3 3 3-3"/></svg>;
    case "oral": return <Pill size={size} color={color} strokeWidth={2}/>;
    case "push": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="14" rx="2"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="10" y1="6" x2="14" y2="6"/><path d="M10 2v-0"/><circle cx="12" cy="10" r="1.5" fill={color}/></svg>;
    // Phase-2.6.3 change 2: protocol icon (clipboard) for meta-actions
    // like Activate Pediatric MTP. Distinguishes from individual meds.
    case "protocol": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><rect x="9" y="1.5" width="6" height="3" rx="1" fill={color}/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>;
    default: return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v5"/><path d="M5 12h14"/><rect x="5" y="7" width="14" height="14" rx="2"/><circle cx="12" cy="15" r="2"/></svg>;
  }
}
