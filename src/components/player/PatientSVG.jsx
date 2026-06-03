// LEGO-minifig patient avatar. Gown colored by sex (blue boys / pink
// girls), short sleeves, legs (tucked under the blanket in bed, shown
// on the recovery jump), an expressive sad/happy face, and a hairstyle
// chosen deterministically from the patient name (seed) so each patient
// looks distinct but stable across replays. The bed/crib, blanket,
// teddy, and IV are layered around the figure.

function _hash(s){var h=0,i;s=String(s||"x");for(i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))>>>0;}return h;}
var HAIR_COLORS=[["#2b2b2b","#111111"],["#5b3a22","#3f2817"],["#d9a441","#b07e26"],["#a8431f","#7d2f12"]];
var HAIR_GIRL=["long","bun","ponytail","curly","none"];
var HAIR_BOY=["short","sidePart","swoop","spiky","curly","quiff","none"];
var HAIR_NEUTRAL=["short","curly","swoop","none"];
function pickHair(seed,sex){
  var h=_hash(seed);
  var set=sex==="female"?HAIR_GIRL:sex==="male"?HAIR_BOY:HAIR_NEUTRAL;
  var c=HAIR_COLORS[(h>>>3)%HAIR_COLORS.length];
  return {style:set[h%set.length],col:c[0],col2:c[1]};
}
function _capD(hx,hy,hw,hh,dip){
  var cx=hx+hw/2,vt=hy-5,side=hy+hh*0.44,hl=hy+hh*dip;
  return "M"+(hx-2)+" "+side+" Q"+(hx-4)+" "+vt+" "+cx+" "+(vt-2)+" Q"+(hx+hw+4)+" "+vt+" "+(hx+hw+2)+" "+side+" Q"+cx+" "+hl+" "+(hx-2)+" "+side+" Z";
}
function hairPiece(style,hx,hy,hw,hh,col,col2){
  if(!style||style==="none")return null;
  var cx=hx+hw/2,vt=hy-5,side=hy+hh*0.44,fore=hy+hh*0.30;
  if(style==="short")return <path d={_capD(hx,hy,hw,hh,0.30)} fill={col}/>;
  if(style==="sidePart")return(<g><path d={_capD(hx,hy,hw,hh,0.27)} fill={col}/><path d={"M"+(hx+hw*0.30)+" "+(hy+hh*0.10)+" Q"+(hx+hw*0.62)+" "+(hy+hh*0.02)+" "+(hx+hw*0.66)+" "+(hy+hh*0.30)} fill="none" stroke={col2} strokeWidth="1.4"/></g>);
  if(style==="swoop")return <path d={"M"+(hx-2)+" "+side+" Q"+(hx-4)+" "+vt+" "+(hx+hw*0.45)+" "+(vt-3)+" Q"+(hx+hw+4)+" "+vt+" "+(hx+hw+2)+" "+side+" L"+(hx+hw*0.58)+" "+fore+" Q"+(hx+hw*0.28)+" "+(hy+hh*0.40)+" "+(hx-2)+" "+side+" Z"} fill={col}/>;
  if(style==="spiky"){
    var sideS=hy+hh*0.32,xs=[0.06,0.16,0.27,0.38,0.50,0.62,0.73,0.84,0.94],up=true,i;
    var p="M"+hx+" "+sideS+" L"+hx+" "+(hy+hh*0.12);
    for(i=0;i<xs.length;i++){p+=" L"+(hx+hw*xs[i])+" "+(up?(vt-13):(hy+hh*0.03));up=!up;}
    p+=" L"+(hx+hw)+" "+(hy+hh*0.12)+" L"+(hx+hw)+" "+sideS+" Q"+cx+" "+(hy+hh*0.24)+" "+hx+" "+sideS+" Z";
    return <path d={p} fill={col}/>;
  }
  if(style==="curly"){
    var p2="M"+(hx-2)+" "+side,bx=[0.05,0.2,0.38,0.56,0.74,0.92],j;
    for(j=0;j<bx.length;j++){p2+=" A6 6 0 0 1 "+(hx+hw*bx[j])+" "+(vt-1);}
    p2+=" Q"+(hx+hw+3)+" "+vt+" "+(hx+hw+2)+" "+side+" Q"+cx+" "+(hy+hh*0.32)+" "+(hx-2)+" "+side+" Z";
    return <path d={p2} fill={col}/>;
  }
  if(style==="quiff")return(<g><path d={_capD(hx,hy,hw,hh,0.26)} fill={col}/><path d={"M"+(hx+hw*0.18)+" "+(hy+hh*0.06)+" Q"+(hx+hw*0.4)+" "+(vt-8)+" "+(hx+hw*0.72)+" "+hy+" Q"+(hx+hw*0.45)+" "+(vt-2)+" "+(hx+hw*0.18)+" "+(hy+hh*0.06)+" Z"} fill={col}/></g>);
  if(style==="long")return(<g><path d={_capD(hx,hy,hw,hh,0.30)} fill={col}/><path d={"M"+(hx-2)+" "+side+" Q"+(hx-8)+" "+(hy+hh*0.8)+" "+(hx+1)+" "+(hy+hh*1.15)+" L"+(hx+hw*0.22)+" "+(hy+hh*1.08)+" Q"+(hx+hw*0.16)+" "+(hy+hh*0.7)+" "+(hx+hw*0.20)+" "+side+" Z"} fill={col}/><path d={"M"+(hx+hw+2)+" "+side+" Q"+(hx+hw+8)+" "+(hy+hh*0.8)+" "+(hx+hw-1)+" "+(hy+hh*1.15)+" L"+(hx+hw*0.78)+" "+(hy+hh*1.08)+" Q"+(hx+hw*0.84)+" "+(hy+hh*0.7)+" "+(hx+hw*0.80)+" "+side+" Z"} fill={col}/></g>);
  if(style==="bun")return(<g><path d={_capD(hx,hy,hw,hh,0.30)} fill={col}/><circle cx={cx} cy={vt-5} r={hw*0.17} fill={col}/><rect x={cx-hw*0.10} y={vt-3} width={hw*0.20} height="4" rx="2" fill={col2}/></g>);
  if(style==="ponytail")return(<g><path d={_capD(hx,hy,hw,hh,0.30)} fill={col}/><path d={"M"+(hx+hw+1)+" "+(hy+hh*0.30)+" Q"+(hx+hw+12)+" "+(hy+hh*0.5)+" "+(hx+hw+6)+" "+(hy+hh*0.95)+" Q"+(hx+hw+1)+" "+(hy+hh*0.7)+" "+(hx+hw-2)+" "+(hy+hh*0.42)+" Z"} fill={col}/></g>);
  return null;
}

export function PatientSVG(props){
  var status=props.status||"stable";
  var rr=props.rr||30;
  var ageGroup=props.ageGroup||"infant";
  var sex=props.sex||"neutral";
  var visuals=props.visuals||[];
  var emotion=props.emotion||"neutral";
  var pose=props.pose||"rest";
  var seed=props.seed||"";
  var sk=status==="critical"?"#dbb8b8":status==="declining"?"#f0ccb0":"#ffcc99";
  var ST="#d8a86a";
  var mo=status==="critical"?0.55:status==="declining"?0.25:0;
  var eyesClosed=status==="critical";
  var cyanotic=status==="critical";
  var isHappy=emotion==="happy";
  var isSad=emotion==="sad";
  var jump=pose==="jump";
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
  var mouthY=headY+headH*0.70;
  var mouthCX=headX+headW*0.5;
  var hcx=headX+headW/2;
  // Gown color by sex.
  var GOWN=sex==="female"?"#f4b8d0":"#bcd9f2";
  var GOWN2=sex==="female"?"#e58fb5":"#93b9e0";
  // Hair (name-seeded). Suppressed when a head bandage is present.
  var hairPick=pickHair(seed,sex);
  // Visual keywords.
  var hasV=function(keyword){return visuals.some(function(v){return v.toLowerCase().indexOf(keyword)>=0;});};
  var flushed=hasV("flushed")||hasV("febrile")||hasV("fever");
  var diaphoretic=hasV("diaphor")||hasV("sweat");
  var lipSwelling=hasV("lip swelling")||hasV("swollen lip")||hasV("lip swell")||hasV("angioedema");
  var petechiae=hasV("petechia")||hasV("petechial")||hasV("purpura")||hasV("non-blanching")||hasV("nonblanching");
  var woundDressing=hasV("wound dressing")||hasV("gauze")||hasV("dressing")||hasV("bandaged wound");
  var crutches=hasV("crutch");
  var castLeft=hasV("cast left arm")||hasV("left arm cast")||hasV("broken left arm")||hasV("fractured left arm");
  var castRight=hasV("cast right arm")||hasV("right arm cast")||hasV("broken right arm")||hasV("fractured right arm");
  var castLeg=hasV("cast leg")||hasV("leg cast")||hasV("broken leg")||hasV("fractured leg");
  var headBandage=hasV("head bandage")||hasV("head wrap")||hasV("head injury")||hasV("head trauma");
  var wheelchair=hasV("wheelchair");
  var oxygenCannula=hasV("nasal cannula")||hasV("oxygen cannula")||hasV("o2 cannula");
  var oxygenMask=hasV("oxygen mask")||hasV("o2 mask")||hasV("non-rebreather");
  var hives=(hasV("hives")||hasV("urticaria")||hasV("rash")||hasV("allergic"))&&!petechiae;
  var neckBrace=hasV("c-collar")||hasV("neck brace")||hasV("cervical collar");
  var armSling=hasV("sling")||hasV("arm sling");
  var eyePatch=hasV("eye patch")||hasV("eye bandage");
  // Bed/crib geometry (figure sits on the mattress at the hip line).
  var isCrib=isInfant||isToddler;
  var sitLine=bodyY+bodyH;
  var matTop=sitLine-2;
  var bedBlanketTop=matTop+10;
  var cribTopY=headY-14;
  var cribSlatY=cribTopY+8;
  var cribSlatH=(sitLine-10)-cribSlatY;
  var cribSlatXs=[24,40,56,72,88,104,120,136,152,168];
  var cribFrontRailY=sitLine+16;
  var cribFrontXs=[26,44,62,80,98,116,134,152,170];
  var cribBlanketTop=Math.round(bodyY+bodyH*0.55);
  var teddyY=sitLine-43;
  // Minifig figure metrics.
  var cx=bodyX+bodyW/2;
  var shoulderHalf=bodyW*0.46;
  var hipHalf=bodyW*0.58;
  var SY=bodyY+3;
  var SLx=cx-shoulderHalf;
  var SRx=cx+shoulderHalf;
  var armLen=Math.round(bodyH*0.55)+8;
  var legW=Math.round(bodyW*0.30);
  var legH=isInfant?16:isToddler?24:isChild?32:46;
  var foot=isInfant?5:isTeen?6:5;
  var legTop=bodyY+bodyH;
  var legGap=3;
  var laAng=jump?135:16;
  var raAng=jump?-135:-16;
  // Wheelchair geometry (front view): edge-on tires as two dark bars
  // flanking the child, a chair back, armrests, and a seat a touch wider
  // than the body. Parameterized to the figure so it scales by age.
  var wcSeatW=bodyW+16;
  var wcLeft=cx-wcSeatW/2;
  var wcRight=cx+wcSeatW/2;
  var wcTireW=9;
  var wcSeatY=sitLine;
  var wcBot=legTop+legH+6;
  var wcTireTop=bodyY-6;

  function renderLeg(lx,sign,cast){
    var splay=jump?12:0;
    var inner=(<g>
      <rect x={lx} y={legTop} width={legW} height={legH} rx="5" fill={sk} stroke={ST} strokeWidth="0.7"/>
      <rect x={lx-1} y={legTop+legH-1} width={legW+2} height={foot} rx="3" fill="#eef4fd" stroke={GOWN2} strokeWidth="0.6"/>
      {cast&&<rect x={lx-1} y={legTop+legH*0.4} width={legW+2} height={legH*0.6} rx="4" fill="white" stroke="#ccc" strokeWidth="1"/>}
    </g>);
    if(splay)return <g transform={"rotate("+(sign*splay)+" "+(lx+legW/2)+" "+legTop+")"}>{inner}</g>;
    return inner;
  }
  function renderArm(sx,ang,sign,cast){
    var ax=sign<0?sx-9:sx;
    var hxc=sign<0?sx-4.5:sx+4.5;
    return(
      <g transform={"rotate("+ang+" "+sx+" "+SY+")"}>
        <rect x={ax} y={SY} width="9" height={armLen} rx="4" fill={sk} stroke={ST} strokeWidth="0.7"/>
        <rect x={ax-0.5} y={SY-0.5} width="10" height="9" rx="4" fill={GOWN} stroke={GOWN2} strokeWidth="0.6"/>
        {cast&&<rect x={ax-1} y={SY+armLen*0.4} width="11" height={armLen*0.6+3} rx="4" fill="white" stroke="#ccc" strokeWidth="1"/>}
        {!cast&&mo>0&&<g opacity={mo}><circle cx={ax+4.5} cy={SY+armLen*0.6} r="2" fill="#8070a0"/><circle cx={ax+4} cy={SY+armLen*0.82} r="1.6" fill="#8070a0"/></g>}
        <circle cx={hxc} cy={SY+armLen+3} r="4" fill="none" stroke={sk} strokeWidth="3"/>
      </g>
    );
  }

  // Arm sling: replaces the left arm with a forearm bent across the lower
  // chest inside a fabric pouch, plus a strap to the opposite shoulder.
  function renderSling(){
    var foreY=bodyY+bodyH*0.62;
    var elbowX=SLx-4;
    var handX=cx+bodyW*0.14;
    var pouch="M"+(elbowX-3)+" "+(foreY-6)
      +" L"+(handX+4)+" "+(foreY-6)
      +" Q"+(handX+8)+" "+(foreY+7)+" "+(handX-3)+" "+(foreY+10)
      +" L"+(elbowX+2)+" "+(foreY+10)
      +" Q"+(elbowX-7)+" "+(foreY+4)+" "+(elbowX-3)+" "+(foreY-6)+" Z";
    return(
      <g>
        <rect x={SLx-4} y={SY} width="9" height={(foreY)-SY} rx="4" fill={sk} stroke={ST} strokeWidth="0.7"/>
        <rect x={elbowX} y={foreY-4} width={handX-elbowX} height="9" rx="4" fill={sk} stroke={ST} strokeWidth="0.7"/>
        <path d={pouch} fill="#3a4250"/>
        <circle cx={handX} cy={foreY+1} r="4.5" fill={sk} stroke={ST} strokeWidth="0.7"/>
        <path d={"M"+(elbowX+1)+" "+(foreY-3)+" L"+(cx+bodyW*0.30)+" "+(bodyY-3)} fill="none" stroke="#3a4250" strokeWidth="4" strokeLinecap="round"/>
      </g>
    );
  }

  // Gown torso path (rounded bottom) + V-neck + ties.
  var torsoD="M"+(cx-shoulderHalf)+" "+bodyY+" L"+(cx+shoulderHalf)+" "+bodyY+
    " L"+(cx+hipHalf)+" "+(sitLine-4)+" Q"+(cx+hipHalf)+" "+(sitLine+2)+" "+(cx+hipHalf-5)+" "+(sitLine+2)+
    " Q"+cx+" "+(sitLine+6)+" "+(cx-hipHalf+5)+" "+(sitLine+2)+
    " Q"+(cx-hipHalf)+" "+(sitLine+2)+" "+(cx-hipHalf)+" "+(sitLine-4)+" Z";

  return(
    <svg viewBox="0 0 200 260" style={{width:"100%",maxWidth:200,display:"block",margin:"0 auto",filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.2))"}}>
      {/* Wheelchair (front view; drawn behind the figure). Edge-on tires
          read as two dark vertical bars on either side of the child. */}
      {wheelchair&&(
        <g>
          {/* tires (edge-on) */}
          <rect x={wcLeft-wcTireW-3} y={wcTireTop} width={wcTireW} height={wcBot-wcTireTop} rx={wcTireW/2} fill="#2f2f2f"/>
          <rect x={wcRight+3} y={wcTireTop} width={wcTireW} height={wcBot-wcTireTop} rx={wcTireW/2} fill="#2f2f2f"/>
          <circle cx={wcLeft-wcTireW/2-3} cy={(wcTireTop+wcBot)/2} r="3" fill="#8b8f96"/>
          <circle cx={wcRight+wcTireW/2+3} cy={(wcTireTop+wcBot)/2} r="3" fill="#8b8f96"/>
          {/* push handles */}
          <rect x={cx-bodyW/2-4} y={bodyY-16} width="4" height="10" rx="2" fill="#9aa5b1"/>
          <rect x={cx+bodyW/2} y={bodyY-16} width="4" height="10" rx="2" fill="#9aa5b1"/>
          {/* chair back */}
          <rect x={cx-bodyW/2-3} y={bodyY-10} width={bodyW+6} height={wcSeatY-(bodyY-10)} rx="6" fill="#9b6f47"/>
          {/* armrests */}
          <rect x={wcLeft-3} y={bodyY+bodyH*0.5} width="12" height="5" rx="2" fill="#9b6f47"/>
          <rect x={wcRight-9} y={bodyY+bodyH*0.5} width="12" height="5" rx="2" fill="#9b6f47"/>
          {/* seat — just wider than the child */}
          <rect x={wcLeft} y={wcSeatY} width={wcSeatW} height="9" rx="3" fill="#8a5f3c"/>
          {/* footplate */}
          <rect x={cx-14} y={wcBot-5} width="28" height="5" rx="2" fill="#9aa5b1"/>
        </g>
      )}
      {/* Bed / crib back layers (drawn before the figure). */}
      {!wheelchair&&isCrib&&(
        <g>
          <rect x="6" y={sitLine-4} width="188" height={260-(sitLine-4)} rx="12" fill="#3f63b8"/>
          <rect x="10" y={sitLine-8} width="180" height="16" rx="8" fill="#eef4fd"/>
          {cribSlatXs.map(function(bx){return <rect key={"cs"+bx} x={bx} y={cribSlatY} width="3" height={cribSlatH} rx="1.5" fill="#5B86E5" opacity="0.5"/>;})}
          <rect x="8" y={cribTopY} width="184" height="8" rx="4" fill="#5B86E5"/>
          <rect x="6" y={cribTopY} width="9" height={(sitLine+12)-cribTopY} rx="4" fill="#5B86E5"/>
          <rect x="185" y={cribTopY} width="9" height={(sitLine+12)-cribTopY} rx="4" fill="#5B86E5"/>
          <circle cx="10.5" cy={cribTopY} r="6" fill="#6f97e8"/>
          <circle cx="189.5" cy={cribTopY} r="6" fill="#6f97e8"/>
        </g>
      )}
      {!wheelchair&&!isCrib&&(
        <g>
          <rect x="4" y={matTop+16} width="192" height={260-(matTop+16)} rx="12" fill="#3f63b8"/>
          <rect x="8" y={matTop} width="184" height="22" rx="10" fill="#eef4fd"/>
          <rect x="2" y={matTop-8} width="9" height="36" rx="4" fill="#5B86E5"/>
          <rect x="189" y={matTop-8} width="9" height="36" rx="4" fill="#5B86E5"/>
        </g>
      )}
      {/* ---- Minifig figure (breathes; bounces on the recovery jump) ---- */}
      <g>
        <animateTransform attributeName="transform" type="translate" values={jump?"0,0;0,-14;0,0;0,-8;0,0":"0,0;0,-1.5;0,0"} dur={jump?"0.85s":dur} repeatCount="indefinite" additive="sum"/>
        {/* legs (leg cast rides on the left leg, inside the figure group) */}
        {renderLeg(cx-legGap-legW,-1,castLeg)}
        {renderLeg(cx+legGap,1,false)}
        {/* gown torso */}
        <path d={torsoD} fill={GOWN} stroke={GOWN2} strokeWidth="0.8" strokeLinejoin="round"/>
        <path d={"M"+(cx-9)+" "+bodyY+" L"+cx+" "+(bodyY+10)+" L"+(cx+9)+" "+bodyY+" Z"} fill={sk}/>
        <path d={"M"+(cx-9)+" "+bodyY+" L"+cx+" "+(bodyY+10)+" L"+(cx+9)+" "+bodyY} fill="none" stroke={GOWN2} strokeWidth="1.2"/>
        <circle cx={cx-7} cy={bodyY+bodyH*0.5} r="1.5" fill={GOWN2}/>
        <circle cx={cx+7} cy={bodyY+bodyH*0.66} r="1.5" fill={GOWN2}/>
        {/* arms (sleeves + skin forearm + C-hands); casts ride in the group.
            A sling replaces the left arm with a bent-in-sling pose. */}
        {armSling?renderSling():renderArm(SLx,laAng,-1,castLeft)}
        {renderArm(SRx,raAng,1,castRight)}
        {/* neck stud */}
        <rect x={cx-headW*0.16} y={headY+headH-3} width={headW*0.32} height="6" rx="2" fill={sk} stroke={ST} strokeWidth="0.5"/>
        {/* head stud + head */}
        <rect x={hcx-headW*0.16} y={headY-7} width={headW*0.32} height="8" rx="3" fill={sk} stroke={ST} strokeWidth="0.6"/>
        <rect x={headX} y={headY} width={headW} height={headH} rx={headRx} fill={sk} stroke={ST} strokeWidth="0.8"/>
        {/* hair (infants are bald by default; suppressed by a head bandage) */}
        {!headBandage&&!isInfant&&hairPiece(hairPick.style,headX,headY,headW,headH,hairPick.col,hairPick.col2)}
        {/* head bandage */}
        {headBandage&&(
          <g>
            <rect x={headX-2} y={headY+2} width={headW+4} height="10" rx="4" fill="white" stroke="#ddd" strokeWidth="0.5" opacity="0.95"/>
            <circle cx={headX+headW*0.75} cy={headY+7} r="3" fill="#ff6b6b" opacity="0.5"/>
          </g>
        )}
        {/* c-collar */}
        {neckBrace&&<rect x={headX+2} y={headY+headH-4} width={headW-4} height="10" rx="3" fill="#f0e6d2" stroke="#d4c4a8" strokeWidth="0.8"/>}
        {/* flushed/febrile cheeks */}
        {flushed&&(
          <g>
            <circle cx={headX+headW*0.22} cy={eyeY+6} r={isInfant?6:5} fill="#ff7a7a" opacity="0.45"/>
            <circle cx={headX+headW*0.78} cy={eyeY+6} r={isInfant?6:5} fill="#ff7a7a" opacity="0.45"/>
          </g>
        )}
        {/* wound dressing (taped gauze on the cheek) */}
        {woundDressing&&(
          <g>
            <rect x={headX+headW*0.54} y={eyeY+3} width="12" height="10" rx="2" fill="#ffffff" stroke="#dcdcdc" strokeWidth="0.6"/>
            <line x1={headX+headW*0.54} y1={eyeY+5} x2={headX+headW*0.54+12} y2={eyeY+11} stroke="#e6e6e6" strokeWidth="1"/>
            <line x1={headX+headW*0.54} y1={eyeY+11} x2={headX+headW*0.54+12} y2={eyeY+5} stroke="#e6e6e6" strokeWidth="1"/>
          </g>
        )}
        {/* ---- face ---- */}
        {/* brows */}
        {isHappy?(
          <g>
            <path d={"M"+(eyeLX-5)+" "+(eyeY-7)+" Q"+eyeLX+" "+(eyeY-10)+" "+(eyeLX+5)+" "+(eyeY-7)} fill="none" stroke="#1a1a1a" strokeWidth="2.3" strokeLinecap="round"/>
            <path d={"M"+(eyeRX-5)+" "+(eyeY-7)+" Q"+eyeRX+" "+(eyeY-10)+" "+(eyeRX+5)+" "+(eyeY-7)} fill="none" stroke="#1a1a1a" strokeWidth="2.3" strokeLinecap="round"/>
          </g>
        ):isSad?(
          <g>
            <line x1={eyeLX-5} y1={eyeY-5} x2={eyeLX+5} y2={eyeY-9} stroke="#1a1a1a" strokeWidth="2.3" strokeLinecap="round"/>
            <line x1={eyeRX+5} y1={eyeY-5} x2={eyeRX-5} y2={eyeY-9} stroke="#1a1a1a" strokeWidth="2.3" strokeLinecap="round"/>
          </g>
        ):(
          <g>
            <path d={"M"+(eyeLX-5)+" "+(eyeY-7)+" Q"+eyeLX+" "+(eyeY-8)+" "+(eyeLX+5)+" "+(eyeY-7)} fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
            <path d={"M"+(eyeRX-5)+" "+(eyeY-7)+" Q"+eyeRX+" "+(eyeY-8)+" "+(eyeRX+5)+" "+(eyeY-7)} fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
          </g>
        )}
        {/* eyes */}
        {eyesClosed?(
          <g>
            <line x1={eyeLX-3} y1={eyeY} x2={eyeLX+3} y2={eyeY} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
            <line x1={eyeRX-3} y1={eyeY} x2={eyeRX+3} y2={eyeY} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
          </g>
        ):(
          <g>
            <ellipse cx={eyeLX} cy={eyeY} rx={eyeR*0.62} ry={eyeR*0.8} fill="#1a1a1a"/>
            <ellipse cx={eyeRX} cy={eyeY} rx={eyeR*0.62} ry={eyeR*0.8} fill="#1a1a1a"/>
            <circle cx={eyeLX-0.8} cy={eyeY-1.3} r="0.9" fill="#fff"/>
            <circle cx={eyeRX-0.8} cy={eyeY-1.3} r="0.9" fill="#fff"/>
          </g>
        )}
        {/* eye patch */}
        {eyePatch&&(
          <g>
            <ellipse cx={eyeLX} cy={eyeY} rx={eyeR+2} ry={eyeR+1} fill="#444" opacity="0.85"/>
            <line x1={eyeLX} y1={eyeY-eyeR-1} x2={headX+headW*0.7} y2={headY+4} stroke="#444" strokeWidth="1.5"/>
          </g>
        )}
        {/* mouth (hidden behind the mask) */}
        {!oxygenMask&&(cyanotic?(
          <ellipse cx={mouthCX} cy={mouthY} rx="5" ry="3.2" fill="#8888bb"/>
        ):isHappy?(
          <g>
            <path d={"M"+(mouthCX-9)+" "+(mouthY-1)+" L"+(mouthCX+9)+" "+(mouthY-1)+" Q"+(mouthCX+9)+" "+(mouthY+9)+" "+mouthCX+" "+(mouthY+9)+" Q"+(mouthCX-9)+" "+(mouthY+9)+" "+(mouthCX-9)+" "+(mouthY-1)+" Z"} fill="#c0392b"/>
            <rect x={mouthCX-7.5} y={mouthY-1} width="15" height="3.4" rx="1" fill="#fff"/>
          </g>
        ):isSad?(
          <g>
            <path d={"M"+(mouthCX-6)+" "+(mouthY+3)+" Q"+mouthCX+" "+(mouthY-2)+" "+(mouthCX+6)+" "+(mouthY+3)} fill="none" stroke="#2d3436" strokeWidth="1.8" strokeLinecap="round"/>
            <path d={"M"+(eyeRX+1)+" "+(eyeY+5)+" q -2 5 0 7 q 2 -2 0 -7 Z"} fill="#74b9ff"/>
          </g>
        ):(
          <path d={"M"+(mouthCX-6)+" "+mouthY+" Q"+mouthCX+" "+(mouthY+(status==="declining"?3:5))+" "+(mouthCX+6)+" "+mouthY} fill="none" stroke={status==="declining"?"#9b6b50":"#2d3436"} strokeWidth="1.7" strokeLinecap="round"/>
        ))}
        {/* hives on the face */}
        {hives&&(
          <g opacity="0.7">
            <circle cx={headX+12} cy={headY+headH*0.42} r="2" fill="#ff6b6b"/>
            <circle cx={headX+headW-12} cy={headY+headH*0.38} r="1.8" fill="#ff6b6b"/>
            <circle cx={mouthCX-3} cy={mouthY+6} r="1.6" fill="#ff6b6b"/>
          </g>
        )}
        {/* petechiae / purpura — pinpoint non-blanching dots, clustered */}
        {petechiae&&(
          <g fill="#8e2a4f">
            <circle cx={headX+headW*0.20} cy={eyeY+5} r="1"/>
            <circle cx={headX+headW*0.26} cy={eyeY+8} r="1"/>
            <circle cx={headX+headW*0.22} cy={eyeY+11} r="0.9"/>
            <circle cx={headX+headW*0.30} cy={eyeY+6} r="0.8"/>
            <circle cx={headX+headW*0.74} cy={eyeY+5} r="1"/>
            <circle cx={headX+headW*0.80} cy={eyeY+8} r="1"/>
            <circle cx={headX+headW*0.76} cy={eyeY+11} r="0.9"/>
            <circle cx={headX+headW*0.70} cy={eyeY+7} r="0.8"/>
            <circle cx={cx-6} cy={bodyY+bodyH*0.42} r="1"/>
            <circle cx={cx+5} cy={bodyY+bodyH*0.5} r="1"/>
            <circle cx={cx-2} cy={bodyY+bodyH*0.58} r="0.9"/>
            <circle cx={cx+9} cy={bodyY+bodyH*0.4} r="0.9"/>
          </g>
        )}
        {/* diaphoresis — sweat droplets on the forehead/temples */}
        {diaphoretic&&(
          <g fill="#9ed0ff" opacity="0.95">
            <path d={"M"+(headX+headW*0.18)+" "+(headY+headH*0.20)+" q -2.5 4 0 6 q 2.5 -2 0 -6 Z"}/>
            <path d={"M"+(headX+headW*0.83)+" "+(headY+headH*0.18)+" q -2.5 4 0 6 q 2.5 -2 0 -6 Z"}/>
            <path d={"M"+(headX+headW*0.32)+" "+(headY+headH*0.12)+" q -2 3.4 0 5 q 2 -1.6 0 -5 Z"}/>
          </g>
        )}
        {/* lip swelling / angioedema — puffy lips over the mouth */}
        {lipSwelling&&!oxygenMask&&(
          <g>
            <ellipse cx={mouthCX} cy={mouthY+1} rx={isInfant?9:8} ry="5" fill="#e89a9a" stroke="#d98787" strokeWidth="0.6"/>
            <line x1={mouthCX-6} y1={mouthY+1} x2={mouthCX+6} y2={mouthY+1} stroke="#c97f7f" strokeWidth="1"/>
          </g>
        )}
        {/* nasal cannula */}
        {oxygenCannula&&(
          <g>
            <path d={"M"+(mouthCX-8)+" "+(mouthY-8)+" Q"+mouthCX+" "+(mouthY-12)+" "+(mouthCX+8)+" "+(mouthY-8)} fill="none" stroke="#70a0d0" strokeWidth="1.5"/>
            <circle cx={mouthCX-6} cy={mouthY-7} r="1.5" fill="#70a0d0"/>
            <circle cx={mouthCX+6} cy={mouthY-7} r="1.5" fill="#70a0d0"/>
            <line x1={mouthCX-8} y1={mouthY-8} x2={headX-4} y2={mouthY-5} stroke="#70a0d0" strokeWidth="1"/>
            <line x1={mouthCX+8} y1={mouthY-8} x2={headX+headW+4} y2={mouthY-5} stroke="#70a0d0" strokeWidth="1"/>
          </g>
        )}
        {/* oxygen mask / NRB */}
        {oxygenMask&&(
          <g>
            <ellipse cx={mouthCX} cy={mouthY-3} rx="10" ry="8" fill="rgba(112,160,208,0.3)" stroke="#70a0d0" strokeWidth="1.5"/>
            <line x1={mouthCX-10} y1={mouthY-3} x2={headX-4} y2={mouthY-3} stroke="#70a0d0" strokeWidth="1"/>
            <line x1={mouthCX+10} y1={mouthY-3} x2={headX+headW+4} y2={mouthY-3} stroke="#70a0d0" strokeWidth="1"/>
          </g>
        )}
      </g>
      {/* Blanket over the lap (hidden on the jump so the legs show). */}
      {!wheelchair&&!jump&&isCrib&&(
        <g>
          <rect x="9" y={cribBlanketTop} width="182" height={260-cribBlanketTop} rx="12" fill="#6e93de"/>
          <rect x="9" y={cribBlanketTop} width="182" height="10" rx="5" fill="#a9c2ee"/>
        </g>
      )}
      {!wheelchair&&!jump&&!isCrib&&(
        <g>
          <rect x="10" y={bedBlanketTop} width="180" height={260-bedBlanketTop} rx="12" fill="#6e93de"/>
          <rect x="10" y={bedBlanketTop} width="180" height="10" rx="5" fill="#a9c2ee"/>
        </g>
      )}
      {/* Crib dropped front rail (over the blanket). */}
      {!wheelchair&&!jump&&isCrib&&(
        <g>
          <rect x="8" y={cribFrontRailY} width="184" height="7" rx="3" fill="#7ba0ec"/>
          {cribFrontXs.map(function(fx){return <rect key={"cf"+fx} x={fx} y={cribFrontRailY+6} width="3" height="26" rx="1.5" fill="#7ba0ec"/>;})}
        </g>
      )}
      {/* Stuffed teddy on the bed surface. */}
      {!wheelchair&&(
        <g transform={"translate(120,"+teddyY+")"}>
          <ellipse cx="20" cy="27" rx="13" ry="14" fill="#d9a45b"/>
          <ellipse cx="13" cy="39" rx="5" ry="4" fill="#cf9850"/>
          <ellipse cx="27" cy="39" rx="5" ry="4" fill="#cf9850"/>
          <ellipse cx="8" cy="25" rx="4.5" ry="6" fill="#cf9850"/>
          <ellipse cx="32" cy="25" rx="4.5" ry="6" fill="#cf9850"/>
          <circle cx="20" cy="10" r="10" fill="#d9a45b"/>
          <circle cx="12" cy="3" r="4" fill="#d9a45b"/>
          <circle cx="28" cy="3" r="4" fill="#d9a45b"/>
          <circle cx="12" cy="3" r="2" fill="#cf9850"/>
          <circle cx="28" cy="3" r="2" fill="#cf9850"/>
          <ellipse cx="20" cy="13" rx="5" ry="4" fill="#f0d2a0"/>
          <circle cx="20" cy="12" r="1.6" fill="#5b3d2e"/>
          <circle cx="16" cy="8" r="1.6" fill="#2d3436"/>
          <circle cx="24" cy="8" r="1.6" fill="#2d3436"/>
        </g>
      )}
      {/* Forearm crutches propped at the left side (cuff + grip + shaft + tip). */}
      {crutches&&(function(){
        var floor=250;
        function crutch(x){
          return(
            <g key={"cr"+x}>
              <rect x={x-1.5} y={bodyY+6} width="3" height={floor-(bodyY+6)} rx="1.5" fill="#aab2bd"/>
              <rect x={x-3} y={floor-2} width="8" height="4" rx="2" fill="#444"/>
              <rect x={x-5} y={bodyY+bodyH*0.7} width="11" height="3" rx="1.5" fill="#8b96a3"/>
              <path d={"M"+(x-4)+" "+(bodyY+8)+" a4 3.5 0 0 1 8 0"} fill="none" stroke="#8b96a3" strokeWidth="2"/>
            </g>
          );
        }
        return(<g>{crutch(15)}{crutch(25)}</g>);
      })()}
      {/* IV: floor-standing pole, bag above head height, tubing to forearm.
          Hidden on the recovery jump — it sits outside the bouncing figure
          group, so its tubing/cannula would float while the child jumps. */}
      {!jump&&(function(){
        var poleX=181,bagTop=34,bagX=poleX-22;
        var dripCx=poleX-12,dripTop=bagTop+36,dripBot=dripTop+10;
        var insX=bodyX+bodyW+7,insY=bodyY+14;
        return(
          <g>
            <rect x={poleX-1} y="30" width="4" height="222" rx="2" fill="#b8c2cf"/>
            <rect x={poleX-9} y="248" width="20" height="5" rx="2" fill="#9aa5b1"/>
            <path d={"M"+(poleX+1)+" 30 q0 -8 -10 -8"} fill="none" stroke="#b8c2cf" strokeWidth="3"/>
            <rect x={bagX} y={bagTop} width="20" height="34" rx="5" fill="#e8f2fd" stroke="#9bb8de" strokeWidth="1"/>
            <rect x={bagX+2} y={bagTop+13} width="16" height="19" rx="3" fill="#bcd8f5"/>
            <rect x={bagX+7} y={bagTop-4} width="6" height="6" rx="1" fill="#9bb8de"/>
            <rect x={dripCx-3} y={dripTop} width="6" height="10" rx="2" fill="#eaf3fd" stroke="#9bb8de" strokeWidth="0.8"/>
            <circle cx={dripCx} cy={dripTop+5} r="1.2" fill="#74b9ff"/>
            <path d={"M"+dripCx+" "+dripBot+" C "+(dripCx-8)+" "+(dripBot+55)+", "+(insX+44)+" "+(insY-26)+", "+insX+" "+insY} fill="none" stroke="#9bb8de" strokeWidth="1.8"/>
            <rect x={insX-4} y={insY-4} width="10" height="8" rx="2" fill="#ffffff" opacity="0.92" stroke="#cdd8e6" strokeWidth="0.6"/>
            <line x1={insX+5} y1={insY} x2={insX-4} y2={insY} stroke="#9bb8de" strokeWidth="1.4"/>
          </g>
        );
      })()}
    </svg>
  );
}
