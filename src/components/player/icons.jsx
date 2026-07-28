import {
  Activity, Airplay, AirVent, Anchor, ArrowUpFromLine, AudioLines, AudioWaveform,
  Baby, Bandage, Beaker, Bed, BellRing, Bone, Brain, Cable, ClipboardList, Container,
  Cross, Crosshair, Cylinder, Drill, Droplet, Droplets, Eye, Fan, Filter, Fingerprint,
  Flame, Flashlight, FlaskConical, FlaskRound, Funnel, Gauge, GitBranch, Heart, HeartPulse,
  Layers, Milk, MonitorDot, Phone, PhoneCall, PhoneOutgoing, Pill, Pipette, PlugZap, Radar,
  Radiation, Radio, RadioTower, Route, Scan, ScanEye, ScanLine, ScanSearch, Search, Shield,
  ShieldAlert, ShieldCheck, Siren, Spline, Stethoscope, Syringe, Target, TestTube, TestTubes,
  Thermometer, Timer, TrendingDown, Waves, Waypoints, Wind, Zap
} from "lucide-react";

export function ToolIcon({name, size=24, color="#4ECDC4"}) {
  var s = {width:size,height:size,flexShrink:0};
  switch(name) {
    case "glucometer": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><line x1="10" y1="8" x2="14" y2="8"/><circle cx="12" cy="14" r="2"/><line x1="12" y1="22" x2="12" y2="20"/></svg>;
    case "stethoscope": return <Stethoscope size={size} color={color} strokeWidth={2}/>;
    case "bvm": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="12" rx="6" ry="5"/><path d="M16 12h4c1 0 2-1 2-2V8"/><path d="M4 12c-1 0-2 1-2 2v1"/></svg>;
    case "bvmReady": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="10" cy="12" rx="6" ry="5"/><path d="M16 12h4c1 0 2-1 2-2V8"/><path d="M4 12c-1 0-2 1-2 2v1"/><circle cx="20" cy="6" r="2.5" fill={color} stroke="none"/></svg>;
    case "suction": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v6"/><path d="M8 8h8l-1 10H9L8 8z"/><path d="M10 18v4"/><path d="M14 18v4"/></svg>;
    case "o2Mask": // canonical tool id; shares the hand-drawn mask below
    case "o2mask": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s-2 2-2 4a4 4 0 008 0c0-2-2-4-2-4"/><ellipse cx="12" cy="10" rx="5" ry="6"/><line x1="12" y1="4" x2="12" y2="2"/><path d="M7 10H3"/><path d="M21 10h-4"/></svg>;
    case "ivKit": return <Syringe size={size} color={color} strokeWidth={2}/>;
    case "defib": return <Zap size={size} color={color} strokeWidth={2}/>;
    case "thermometer": return <Thermometer size={size} color={color} strokeWidth={2}/>;
    case "capRefill": return <Timer size={size} color={color} strokeWidth={2}/>;
    case "needleDecomp": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="16"/><path d="M8 12l4 4 4-4"/><circle cx="12" cy="20" r="2"/></svg>;
    case "pupilCheck": return <Eye size={size} color={color} strokeWidth={2}/>;
    case "epiPen": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="16" rx="2"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="9" y1="6" x2="15" y2="6"/><circle cx="12" cy="10" r="1" fill={color}/></svg>;
    case "peakFlow": return <Wind size={size} color={color} strokeWidth={2}/>;
    // --- Airway / breathing ---
    case "hfnc": return <Fan size={size} color={color} strokeWidth={2}/>;
    case "nebSetup": return <Waves size={size} color={color} strokeWidth={2}/>;
    case "cpap": return <Airplay size={size} color={color} strokeWidth={2}/>;
    case "bipap": return <AirVent size={size} color={color} strokeWidth={2}/>;
    case "intubationKit": return <Flashlight size={size} color={color} strokeWidth={2}/>;
    case "etco2": return <AudioLines size={size} color={color} strokeWidth={2}/>;
    case "npa": return <Spline size={size} color={color} strokeWidth={2}/>;
    case "opa": return <Route size={size} color={color} strokeWidth={2}/>;
    case "lma": return <Cylinder size={size} color={color} strokeWidth={2}/>;
    case "vsMonitor": return <MonitorDot size={size} color={color} strokeWidth={2}/>;
    case "pulseOx": return <Fingerprint size={size} color={color} strokeWidth={2}/>;
    // --- Cardiac / monitoring ---
    case "ecg12Lead": return <AudioWaveform size={size} color={color} strokeWidth={2}/>;
    case "cardiacMonitor": return <HeartPulse size={size} color={color} strokeWidth={2}/>;
    case "transcutaneousPace": return <PlugZap size={size} color={color} strokeWidth={2}/>;
    case "aLine": return <Waypoints size={size} color={color} strokeWidth={2}/>;
    case "centralLine": return <Cable size={size} color={color} strokeWidth={2}/>;
    case "usVascular": return <Crosshair size={size} color={color} strokeWidth={2}/>;
    case "valsalva": return <TrendingDown size={size} color={color} strokeWidth={2}/>;
    case "bpCuff": return <Gauge size={size} color={color} strokeWidth={2}/>;
    // --- Vascular access / lines ---
    case "ioAccess": return <Drill size={size} color={color} strokeWidth={2}/>;
    case "usGuidedPIV": return <Target size={size} color={color} strokeWidth={2}/>;
    // --- Neuro ---
    case "gcsAssessment": return <Brain size={size} color={color} strokeWidth={2}/>;
    case "headOfBedElevation": return <Bed size={size} color={color} strokeWidth={2}/>;
    case "seizurePrecautions": return <ShieldAlert size={size} color={color} strokeWidth={2}/>;
    case "cSpine": return <ShieldCheck size={size} color={color} strokeWidth={2}/>;
    case "fundoscopy": return <ScanEye size={size} color={color} strokeWidth={2}/>;
    case "lumbarPuncture": return <Pipette size={size} color={color} strokeWidth={2}/>;
    // --- Trauma ---
    case "tourniquet": return <Bandage size={size} color={color} strokeWidth={2}/>;
    case "pelvicBinder": return <Anchor size={size} color={color} strokeWidth={2}/>;
    case "pressureDressing": return <Cross size={size} color={color} strokeWidth={2}/>;
    case "woundPacking": return <Layers size={size} color={color} strokeWidth={2}/>;
    case "extremityElevation": return <ArrowUpFromLine size={size} color={color} strokeWidth={2}/>;
    case "chestTube": return <GitBranch size={size} color={color} strokeWidth={2}/>;
    case "fastExam": return <Search size={size} color={color} strokeWidth={2}/>;
    case "eFastExam": return <Radar size={size} color={color} strokeWidth={2}/>;
    case "splint": return <Bone size={size} color={color} strokeWidth={2}/>;
    case "cCollar": return <Shield size={size} color={color} strokeWidth={2}/>;
    // --- Resuscitation / blood ---
    case "mtpActivation": return <ClipboardList size={size} color={color} strokeWidth={2}/>;
    case "bloodWarmer": return <Flame size={size} color={color} strokeWidth={2}/>;
    case "rapidInfuser": return <Droplets size={size} color={color} strokeWidth={2}/>;
    case "bloodCultures": return <FlaskConical size={size} color={color} strokeWidth={2}/>;
    case "pelvicExam": return <Baby size={size} color={color} strokeWidth={2}/>;
    // --- GI / GU tubes ---
    case "ngTube": return <Milk size={size} color={color} strokeWidth={2}/>;
    case "ogTube": return <Funnel size={size} color={color} strokeWidth={2}/>;
    case "foleyCatheter": return <Droplet size={size} color={color} strokeWidth={2}/>;
    case "gastricLavage": return <Filter size={size} color={color} strokeWidth={2}/>;
    case "enemaSetup": return <Container size={size} color={color} strokeWidth={2}/>;
    // --- Labs ---
    case "urinalysis": return <TestTube size={size} color={color} strokeWidth={2}/>;
    case "abgKit": return <FlaskRound size={size} color={color} strokeWidth={2}/>;
    case "vbgKit": return <TestTubes size={size} color={color} strokeWidth={2}/>;
    case "pocLactate": return <Beaker size={size} color={color} strokeWidth={2}/>;
    // --- Imaging ---
    case "chestXray": return <Scan size={size} color={color} strokeWidth={2}/>;
    case "abdomenXray": return <ScanLine size={size} color={color} strokeWidth={2}/>;
    case "headCt": return <ScanSearch size={size} color={color} strokeWidth={2}/>;
    case "abdomenCt": return <Radiation size={size} color={color} strokeWidth={2}/>;
    case "mri": return <Radio size={size} color={color} strokeWidth={2}/>;
    case "pocUltrasound": return <RadioTower size={size} color={color} strokeWidth={2}/>;
    case "echocardiogram": return <Heart size={size} color={color} strokeWidth={2}/>;
    // --- Team calls / escalation ---
    case "callRapidResponse": return <Siren size={size} color={color} strokeWidth={2}/>;
    case "callAnesthesia": return <Phone size={size} color={color} strokeWidth={2}/>;
    case "callSurgery": return <PhoneCall size={size} color={color} strokeWidth={2}/>;
    case "callBloodBank": return <PhoneOutgoing size={size} color={color} strokeWidth={2}/>;
    case "callPoisonControl": return <BellRing size={size} color={color} strokeWidth={2}/>;
    default: return <Activity size={size} color={color} strokeWidth={2}/>;
  }
}
export function MedIcon({type, size=22, color="#74b9ff"}) {
  var s = {width:size,height:size,flexShrink:0};
  switch(type) {
    case "neb": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 18v-2a4 4 0 018 0v2"/><rect x="6" y="18" width="12" height="4" rx="1"/><path d="M12 8v4"/><circle cx="12" cy="6" r="2"/><path d="M9 3l3 3 3-3"/></svg>;
    case "oral": return <Pill size={size} color={color} strokeWidth={2}/>;
    // IV infusion (the default med route): hanging fluid bag + drip + line to
    // the patient. medType(id) returns "iv" for most meds and falls back to it.
    case "iv": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><rect x="7" y="4" width="10" height="8" rx="2"/><line x1="7" y1="7.5" x2="17" y2="7.5"/><path d="M12 12v3"/><path d="M12 15c-1.2 1.6-1.2 3 0 3s1.2-1.4 0-3z"/><path d="M12 18v4"/></svg>;
    case "push": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="14" rx="2"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="10" y1="6" x2="14" y2="6"/><path d="M10 2v-0"/><circle cx="12" cy="10" r="1.5" fill={color}/></svg>;
    // Phase-2.6.3 change 2: protocol icon (clipboard) for meta-actions
    // like Activate Pediatric MTP. Distinguishes from individual meds.
    case "protocol": return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><rect x="9" y="1.5" width="6" height="3" rx="1" fill={color}/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>;
    default: return <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v5"/><path d="M5 12h14"/><rect x="5" y="7" width="14" height="14" rx="2"/><circle cx="12" cy="15" r="2"/></svg>;
  }
}
