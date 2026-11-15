/* Checks the two-folds-two-cuts recipe of comu/plec.js (round 16; before: three folds and one cut). Usage: node tools/plec/check.js
   1. For every mask geometry of the repo (WODB, counting game 3×2 and 2×2, Pinta, every grid and frame of the WODB builder) and for
      200 random masks with a centred window (any frame, portrait or landscape): after the two folds, the two straight cuts from the
      folds to the window corner remove exactly the window. Checked twice: with PLEC.comprova and with an independent model written
      here (explicit reflections, origin at the outer corner) on a 0.25 mm lattice.
   2. Negative control: with an off-centre window the centred recipe must fail.
   3. PLEC.instruccions returns drawings for both layouts and nothing when the recipe does not apply. */
'use strict';
const path=require('path');require(path.join(__dirname,'../../comu/plec.js'));const PLEC=globalThis.PLEC;
let bad=0;const err=m=>{bad++;console.log('ERROR '+m);};
/* Independent model. Folds: 1) x > W/2 onto x < W/2; 2) y > H/2 onto y < H/2. Cuts: along x = (W-Wh)/2 and y = (H-Hh)/2 of the
   folded package, from the folds to their crossing; the corner piece beyond both lines falls. (ox,oy) = top-left corner of the window. */
function independent(W,H,Wh,Hh,ox,oy,pas){const cx=(W-Wh)/2,cy=(H-Hh)/2;let mal=0;
  for(let x=pas/2;x<W;x+=pas)for(let y=pas/2;y<H;y+=pas){const a=x>W/2?W-x:x,b=y>H/2?H-y:y;
    const cau=a>cx&&b>cy,dins=x>ox&&x<ox+Wh&&y>oy&&y<oy+Hh;if(cau!==dins)mal++;}
  return mal;}
const masks=[['WODB',128,128,77,77],['counting game 3×2',168,128,117,77],['counting game 2×2',128,128,77,77],['Pinta N=10',64,64,33,33],['Pinta N=8',72,72,41,41]];
for(const m of [15,20,24])for(let C=2;C<=7;C++)for(let R=2;R<=5;R++){const cel=Math.floor(2*Math.min(40,(297-2*m)/C,(210-2*Math.max(m,19))/R))/2,S=2*cel+2*m;
  masks.push([`builder ${C}×${R} frame ${m}`,S,S,2*cel-3,2*cel-3]);}
let s=12345;const rnd=()=>(s=(s*1103515245+12345)%2147483648)/2147483648;
for(let i=0;i<200;i++){const W=40+Math.floor(rnd()*200),H=40+Math.floor(rnd()*200),fx=4+Math.floor(rnd()*(W/2-8)),fy=4+Math.floor(rnd()*(H/2-8));masks.push([`random ${W}×${H} frame ${fx}/${fy}`,W,H,W-2*fx,H-2*fy]);}
const vistes=new Set();let n=0;
for(const [nom,W,H,Wh,Hh] of masks){const k=[W,H,Wh,Hh].join();if(vistes.has(k))continue;vistes.add(k);n++;
  if(!PLEC.serveix(W,H,Wh,Hh))err(nom+': serveix() says the recipe does not apply');
  const a=PLEC.comprova(W,H,Wh,Hh,.25).mal,b=independent(W,H,Wh,Hh,(W-Wh)/2,(H-Hh)/2,.25);
  if(a||b)err(`${nom}: ${a} / ${b} points misclassified`);}
console.log(`${n} different masks: the two cuts remove exactly the window`);
/* negative control */
if(!independent(128,128,77,77,20,25.5,.25))err('window off centre: the independent model should fail');
console.log('negative control: the centred recipe fails when the window is off centre');
/* drawings */
const g={W:168,H:128,Wh:117,Hh:77,estrella:null,cols:3,files:2};
for(const mode of ['columna','tira','fila','graella']){const h=PLEC.instruccions({mode,x:mode==='fila'||mode==='graella'?10:150,y:10,w:mode==='tira'?24:mode==='fila'||mode==='graella'?190:52,h:mode==='fila'?70:277,g});
  if(!/class="plec"/.test(h)||(h.match(/<text/g)||[]).length<6||/NaN|undefined/.test(h))err('instruccions('+mode+') is wrong');}
if(PLEC.instruccions({x:0,y:0,w:50,h:270,g:{W:128,H:128,Wh:128,Hh:60}})!=='')err('instruccions() must return nothing when the recipe does not apply');
console.log('drawings: the four layouts produced');
/* window that is not centred: folds along the two axes of the window, then the two cuts */
function indepLliure(W,H,Wh,Hh,fx,fy,pas){const hx=fx+Wh/2,hy=fy+Hh/2;let mal=0;
  for(let x=pas/2;x<W;x+=pas)for(let y=pas/2;y<H;y+=pas){const a=(x>hx?2*hx-x:x)-fx,b=(y>hy?2*hy-y:y)-fy;   // after folds 1 and 2, measured from the top-left window corner
    const cau=a>0&&b>0,dins=x>fx&&x<fx+Wh&&y>fy&&y<fy+Hh;if(cau!==dins)mal++;}
  return mal;}
{let s2=777;const r2=()=>(s2=(s2*1103515245+12345)%2147483648)/2147483648,casos=[[196,196,46,150,127,23],[196,196,150,46,23,23]];
  for(let i=0;i<200;i++){const W=60+Math.floor(r2()*200),H=60+Math.floor(r2()*200),Wh=10+Math.floor(r2()*(W-30)),Hh=10+Math.floor(r2()*(H-30));casos.push([W,H,Wh,Hh,5+Math.floor(r2()*(W-Wh-10)),5+Math.floor(r2()*(H-Hh-10))]);}
  for(const c of casos){if(!PLEC.serveixLliure(...c)||PLEC.comprovaLliure(...c,.5).mal||indepLliure(...c,.5))err('off-centre window '+c.join(' '));}
  const h=PLEC.instruccions({mode:'fila',x:7,y:229,w:196,h:62,g:{W:196,H:196,Wh:150,Hh:46,fx:23,fy:23}});
  if(!/class="plec"/.test(h)||/NaN|undefined/.test(h)||(PLEC.marques({W:196,H:196,Wh:150,Hh:46,fx:23,fy:23},0,0).match(/<line/g)||[]).length!==4)err('drawings for an off-centre window');
  console.log(`${casos.length} masks with the window off centre (dice masks B and G + 200 random): the two cuts remove exactly the window`);}
console.log(bad?bad+' ERROR(S)':'ALL OK');process.exit(bad?1:0);
