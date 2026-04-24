export function PatientSVG(props){
  var status=props.status||"stable";
  var rr=props.rr||30;
  var ageGroup=props.ageGroup||"infant";
  var sex=props.sex||"neutral";
  var visuals=props.visuals||[];
  var emotion=props.emotion||"neutral";
  var sk=status==="critical"?"#dbb8b8":status==="declining"?"#f0ccb0":"#ffcc99";
  var ch=status==="critical"?"#b09090":status==="declining"?"#e8a080":"#ff9999";
  var mo=status==="critical"?0.55:status==="declining"?0.25:0;
  var eyesClosed=status==="critical";
  var isHappy=emotion==="happy";
  var isSad=emotion==="sad";
  var cyanotic=status==="critical";
  var dur=(60/rr)+"s";
  var isInfant=ageGroup==="infant";
  var isToddler=ageGroup==="toddler";
  var isChild=ageGroup==="child";
  var isTeen=ageGroup==="teen";
  var headW=isInfant?60:isTeen?50:isChild?52:56;
  var headH=isInfant?55:isTeen?50:isChild?48:52;
  var headRx=isInfant?18:isTeen?14:isChild?15:16;
  var headX=isInfant?30:isTeen?35:isChild?34:32;
  var headY=isInfant?112:isTeen?92:isChild?98:105;
  var bodyW=isInfant?50:isTeen?65:isChild?58:54;
  var bodyH=isInfant?30:isTeen?45:isChild?38:34;
  var bodyX=isInfant?35:isTeen?28:isChild?31:33;
  var bodyY=isInfant?165:isTeen?140:isChild?144:158;
  var eyeY=headY+headH*0.45;
  var eyeLX=headX+headW*0.28;
  var eyeRX=headX+headW*0.72;
  var eyeR=isInfant?5:isTeen?4.5:isChild?4.5:5;
  var mouthY=headY+headH*0.72;
  var mouthCX=headX+headW*0.5;
  var cheekR=isInfant?7:5;
  var cheekLX=headX+headW*0.2;
  var cheekRX=headX+headW*0.8;
  var cheekY=headY+headH*0.65;
  var hairColor=sex==="female"?"#8B4513":"#b8860b";
  var hasLongHair=sex==="female";
  // Parse visuals for equipment/features
  var hasV=function(keyword){return visuals.some(function(v){return v.toLowerCase().indexOf(keyword)>=0;});};
  var castLeft=hasV("cast left arm")||hasV("left arm cast")||hasV("broken left arm")||hasV("fractured left arm");
  var castRight=hasV("cast right arm")||hasV("right arm cast")||hasV("broken right arm")||hasV("fractured right arm");
  var castLeg=hasV("cast leg")||hasV("leg cast")||hasV("broken leg")||hasV("fractured leg");
  var headBandage=hasV("head bandage")||hasV("head wrap")||hasV("head injury")||hasV("head trauma");
  var wheelchair=hasV("wheelchair");
  var oxygenCannula=hasV("nasal cannula")||hasV("oxygen cannula")||hasV("o2 cannula");
  var oxygenMask=hasV("oxygen mask")||hasV("o2 mask")||hasV("non-rebreather");
  var hives=hasV("hives")||hasV("urticaria")||hasV("rash")||hasV("allergic");
  var neckBrace=hasV("c-collar")||hasV("neck brace")||hasV("cervical collar");
  var armSling=hasV("sling")||hasV("arm sling");
  var eyePatch=hasV("eye patch")||hasV("eye bandage");
  var armLX=bodyX-8;
  var armRX=bodyX+bodyW+2;
  var armY=bodyY+4;
  return(
    <svg viewBox="0 0 200 260" style={{width:"100%",maxWidth:200,display:"block",margin:"0 auto",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.2))"}}>
      <style>{"@keyframes fadeCard{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}"}</style>
      {/* Wheelchair (behind bed) */}
      {wheelchair&&(
        <g>
          <circle cx="50" cy="240" r="18" fill="none" stroke="#666" strokeWidth="2.5"/>
          <circle cx="140" cy="240" r="18" fill="none" stroke="#666" strokeWidth="2.5"/>
          <circle cx="50" cy="240" r="3" fill="#666"/>
          <circle cx="140" cy="240" r="3" fill="#666"/>
          <rect x="30" y="170" width="130" height="6" rx="3" fill="#888"/>
          <line x1="40" y1="176" x2="50" y2="222" stroke="#666" strokeWidth="2"/>
          <line x1="150" y1="176" x2="140" y2="222" stroke="#666" strokeWidth="2"/>
          <rect x="25" y="165" width="8" height="50" rx="3" fill="#888"/>
          <rect x="157" y="165" width="8" height="50" rx="3" fill="#888"/>
        </g>
      )}
      {/* Bed (skip if wheelchair) */}
      {!wheelchair&&(
        <g>
          <rect x="10" y="188" width="180" height="58" rx="14" fill="#5B86E5"/>
          <rect x="15" y="192" width="170" height="50" rx="10" fill="#E8F0FE"/>
          <rect x="20" y="196" width="55" height="38" rx="8" fill="white"/>
          <rect x="60" y="201" width="120" height="32" rx="8" fill="#FF6B81" opacity="0.75"/>
        </g>
      )}
      {/* Body */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-1.5;0,0" dur={dur} repeatCount="indefinite" additive="sum"/>
        <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={10} fill={sk}/>
        <rect x={bodyX+2} y={bodyY+2} width={bodyW-4} height={bodyH-4} rx={8} fill="#E8F0FE" opacity="0.4"/>
      </g>
      {/* Arms (simple blocky stubs) */}
      <rect x={armLX} y={armY} width={10} height={20} rx={4} fill={sk}/>
      <rect x={armRX} y={armY} width={10} height={20} rx={4} fill={sk}/>
      {/* Hives/rash overlay */}
      {hives&&(
        <g opacity="0.7">
          <circle cx={bodyX+8} cy={bodyY+8} r="3" fill="#ff6b6b"/>
          <circle cx={bodyX+bodyW-12} cy={bodyY+12} r="2.5" fill="#ff6b6b"/>
          <circle cx={bodyX+bodyW/2} cy={bodyY+5} r="2" fill="#ff6b6b"/>
          <circle cx={armLX+5} cy={armY+6} r="2" fill="#ff6b6b"/>
          <circle cx={armRX+5} cy={armY+8} r="2.5" fill="#ff6b6b"/>
          <circle cx={headX+12} cy={headY+headH*0.4} r="2" fill="#ff6b6b"/>
          <circle cx={headX+headW-12} cy={headY+headH*0.35} r="1.8" fill="#ff6b6b"/>
          <circle cx={bodyX+15} cy={bodyY+bodyH-8} r="2.5" fill="#ff6b6b"/>
        </g>
      )}
      {/* Cast left arm */}
      {castLeft&&(
        <rect x={armLX-1} y={armY-1} width={12} height={22} rx={4} fill="white" stroke="#ccc" strokeWidth="1"/>
      )}
      {/* Cast right arm */}
      {castRight&&(
        <rect x={armRX-1} y={armY-1} width={12} height={22} rx={4} fill="white" stroke="#ccc" strokeWidth="1"/>
      )}
      {/* Arm sling */}
      {armSling&&(
        <g>
          <path d={"M"+(headX+headW*0.3)+" "+(headY+headH+2)+" L"+(bodyX+bodyW*0.3)+" "+(bodyY+bodyH*0.8)+" L"+(bodyX+bodyW*0.7)+" "+(bodyY+bodyH*0.8)+" L"+(headX+headW*0.7)+" "+(headY+headH+2)} fill="#4a90d9" opacity="0.6"/>
        </g>
      )}
      {/* Cast leg */}
      {castLeg&&(
        <rect x={bodyX+bodyW*0.1} y={bodyY+bodyH-2} width={bodyW*0.35} height={18} rx={4} fill="white" stroke="#ccc" strokeWidth="1"/>
      )}
      {/* Mottling */}
      {mo>0&&(
        <g opacity={mo}>
          <circle cx={bodyX+8} cy={bodyY+bodyH*0.5} r="4" fill="#8070a0"/>
          <circle cx={bodyX+18} cy={bodyY+bodyH*0.7} r="3" fill="#8070a0"/>
          <circle cx={bodyX+bodyW-10} cy={bodyY+bodyH*0.4} r="3.5" fill="#8070a0"/>
        </g>
      )}
      {/* Head */}
      <rect x={headX} y={headY} width={headW} height={headH} rx={headRx} fill={sk} stroke="#e0b878" strokeWidth="0.8"/>
      {/* Head bandage */}
      {headBandage&&(
        <g>
          <rect x={headX-2} y={headY+2} width={headW+4} height={10} rx={4} fill="white" stroke="#ddd" strokeWidth="0.5" opacity="0.9"/>
          <circle cx={headX+headW*0.75} cy={headY+7} r="3" fill="#ff6b6b" opacity="0.5"/>
        </g>
      )}
      {/* Neck brace / C-collar */}
      {neckBrace&&(
        <rect x={headX+2} y={headY+headH-4} width={headW-4} height={10} rx={3} fill="#f0e6d2" stroke="#d4c4a8" strokeWidth="0.8"/>
      )}
      {/* Cheeks */}
      <circle cx={cheekLX} cy={cheekY} r={cheekR} fill={ch} opacity="0.4"/>
      <circle cx={cheekRX} cy={cheekY} r={cheekR} fill={ch} opacity="0.4"/>
      {/* Eyes */}
      {eyesClosed?(
        <g>
          <line x1={eyeLX-eyeR} y1={eyeY} x2={eyeLX+eyeR} y2={eyeY} stroke="#2d3436" strokeWidth="2" strokeLinecap="round"/>
          <line x1={eyeRX-eyeR} y1={eyeY} x2={eyeRX+eyeR} y2={eyeY} stroke="#2d3436" strokeWidth="2" strokeLinecap="round"/>
        </g>
      ):(
        <g>
          <circle cx={eyeLX} cy={eyeY} r={eyeR} fill="white"/>
          <circle cx={eyeRX} cy={eyeY} r={eyeR} fill="white"/>
          <circle cx={eyeLX+1} cy={eyeY} r={eyeR*0.6} fill="#2d3436"/>
          <circle cx={eyeRX+1} cy={eyeY} r={eyeR*0.6} fill="#2d3436"/>
          <circle cx={eyeLX+1.5} cy={eyeY-1} r={1} fill="white"/>
          <circle cx={eyeRX+1.5} cy={eyeY-1} r={1} fill="white"/>
        </g>
      )}
      {/* Eye patch */}
      {eyePatch&&(
        <g>
          <ellipse cx={eyeLX} cy={eyeY} rx={eyeR+2} ry={eyeR+1} fill="#444" opacity="0.85"/>
          <line x1={eyeLX} y1={eyeY-eyeR-1} x2={headX+headW*0.7} y2={headY+4} stroke="#444" strokeWidth="1.5"/>
        </g>
      )}
      {/* Nasal cannula */}
      {oxygenCannula&&(
        <g>
          <path d={"M"+(mouthCX-8)+" "+(mouthY-8)+" Q"+mouthCX+" "+(mouthY-12)+" "+(mouthCX+8)+" "+(mouthY-8)} fill="none" stroke="#70a0d0" strokeWidth="1.5"/>
          <circle cx={mouthCX-6} cy={mouthY-7} r="1.5" fill="#70a0d0"/>
          <circle cx={mouthCX+6} cy={mouthY-7} r="1.5" fill="#70a0d0"/>
          <line x1={mouthCX-8} y1={mouthY-8} x2={headX-4} y2={mouthY-5} stroke="#70a0d0" strokeWidth="1"/>
          <line x1={mouthCX+8} y1={mouthY-8} x2={headX+headW+4} y2={mouthY-5} stroke="#70a0d0" strokeWidth="1"/>
        </g>
      )}
      {/* Oxygen mask / NRB */}
      {oxygenMask&&(
        <g>
          <ellipse cx={mouthCX} cy={mouthY-3} rx={10} ry={8} fill="rgba(112,160,208,0.3)" stroke="#70a0d0" strokeWidth="1.5"/>
          <line x1={mouthCX-10} y1={mouthY-3} x2={headX-4} y2={mouthY-3} stroke="#70a0d0" strokeWidth="1"/>
          <line x1={mouthCX+10} y1={mouthY-3} x2={headX+headW+4} y2={mouthY-3} stroke="#70a0d0" strokeWidth="1"/>
        </g>
      )}
      {/* Mouth */}
      {!oxygenMask&&(cyanotic?(
        <ellipse cx={mouthCX} cy={mouthY} rx="6" ry="3.5" fill="#8888bb"/>
      ):isHappy?(
        <g>
          <path d={"M"+(mouthCX-8)+" "+(mouthY-2)+" Q"+mouthCX+" "+(mouthY+10)+" "+(mouthCX+8)+" "+(mouthY-2)} fill="#c08060" opacity="0.3" stroke="#c08060" strokeWidth="1.5"/>
        </g>
      ):isSad?(
        <g>
          <path d={"M"+(mouthCX-6)+" "+(mouthY+3)+" Q"+mouthCX+" "+(mouthY-4)+" "+(mouthCX+6)+" "+(mouthY+3)} fill="none" stroke="#c09878" strokeWidth="1.5"/>
          <circle cx={eyeLX+2} cy={eyeY+eyeR+4} r="1.5" fill="#70a0d0" opacity="0.7"/>
          <circle cx={eyeRX-1} cy={eyeY+eyeR+5} r="1.2" fill="#70a0d0" opacity="0.6"/>
        </g>
      ):(
        <path d={"M"+(mouthCX-7)+" "+mouthY+" Q"+mouthCX+" "+(mouthY+(status==="declining"?4:6))+" "+(mouthCX+7)+" "+mouthY} fill="none" stroke={status==="declining"?"#c09878":"#c08060"} strokeWidth="1.5"/>
      ))}
      {/* Happy bounce animation */}
      {isHappy&&(
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0;0,-5;0,0" dur="0.8s" repeatCount="indefinite" additive="sum"/>
      )}
      {/* Hair */}
      {isInfant&&(
        <g>
          <path d={"M"+(headX+5)+" "+(headY+10)+" Q"+(headX+15)+" "+(headY-5)+" "+(headX+25)+" "+(headY+3)} fill="none" stroke={hairColor} strokeWidth="2"/>
          <path d={"M"+(headX+20)+" "+(headY+5)+" Q"+(headX+30)+" "+(headY-8)+" "+(headX+40)+" "+(headY)} fill="none" stroke={hairColor} strokeWidth="2"/>
        </g>
      )}
      {isToddler&&(
        <g>
          <path d={"M"+(headX+2)+" "+(headY+12)+" Q"+(headX+10)+" "+(headY-6)+" "+(headX+headW/2)+" "+(headY-2)} fill="none" stroke={hairColor} strokeWidth="2.5"/>
          <path d={"M"+(headX+headW/2)+" "+(headY-2)+" Q"+(headX+headW-10)+" "+(headY-6)+" "+(headX+headW-2)+" "+(headY+12)} fill="none" stroke={hairColor} strokeWidth="2.5"/>
          {hasLongHair&&<path d={"M"+(headX+headW-2)+" "+(headY+12)+" Q"+(headX+headW+5)+" "+(headY+30)+" "+(headX+headW-2)+" "+(headY+headH-5)} fill="none" stroke={hairColor} strokeWidth="2.5"/>}
        </g>
      )}
      {(isChild||isTeen)&&!headBandage&&(
        <g>
          <rect x={headX+2} y={headY-2} width={headW-4} height={headH*0.3} rx={headRx-2} fill={hairColor} opacity="0.85"/>
          {hasLongHair&&(
            <g>
              <path d={"M"+(headX+2)+" "+(headY+headH*0.2)+" Q"+(headX-5)+" "+(headY+headH*0.6)+" "+(headX)+" "+(headY+headH)} fill="none" stroke={hairColor} strokeWidth="3"/>
              <path d={"M"+(headX+headW-2)+" "+(headY+headH*0.2)+" Q"+(headX+headW+5)+" "+(headY+headH*0.6)+" "+(headX+headW)+" "+(headY+headH)} fill="none" stroke={hairColor} strokeWidth="3"/>
            </g>
          )}
        </g>
      )}
      {/* IV line */}
      <line x1={bodyX+bodyW} y1={bodyY+5} x2="145" y2={headY-10} stroke="#70a0d0" strokeWidth="1.5" strokeDasharray="4,3"/>
      <rect x="140" y={headY-30} width="14" height="28" rx="3" fill="#70a0d0" opacity="0.5"/>
      {/* Stuffed animal */}
      <g transform="translate(130,208) scale(0.4)">
        <circle cx="20" cy="20" r="15" fill="#FFD93D"/>
        <circle cx="12" cy="15" r="3" fill="#2d3436"/>
        <circle cx="28" cy="15" r="3" fill="#2d3436"/>
        <ellipse cx="20" cy="24" rx="4" ry="2.5" fill="#FF9F43"/>
        <circle cx="8" cy="6" r="7" fill="#FFD93D"/>
        <circle cx="32" cy="6" r="7" fill="#FFD93D"/>
      </g>
    </svg>
  );
}
