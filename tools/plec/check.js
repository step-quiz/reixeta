/* Checks the fold-and-one-cut recipe of comu/plec.js. Usage: node tools/plec/check.js   (must print ALL OK)
   1. For every mask geometry of the repo (WODB, counting game 3×2 and 2×2, Pinta per sumes N = 10 and 8, every grid and frame
      of the WODB builder) and for 200 random masks with a uniform frame: after the three folds, one complete straight cut along the
      window line removes exactly the window. Checked twice: with PLEC.comprova and with an independent model written here
      (explicit reflections, origin at the outer corner) on a 0.25 mm lattice.
   2. Negative controls: with a non-uniform frame or an off-centre window the recipe must fail (PLEC.serveix false and points misclassified).
   3. PLEC.instruccions returns drawings for both layouts and nothing when the recipe does not apply. */
'use strict';
const path=require('path');require(path.join(__dirname,'../../comu/plec.js'));const PLEC=globalThis.PLEC;
let bad=0;const err=m=>{bad++;console.log('ERROR '+m);};
/* Independent model. Folds: 1) x > W/2 onto x < W/2; 2) y > H/2 onto y < H/2; 3) across the bisector y = x of the outer corner (0,0).
   Cut: the whole line y = f (f = frame width); everything beyond it falls. (ox,oy) = top-left corner of the window. */
function independent(W,H,Wh,Hh,ox,oy,pas){const f=oy;let mal=0;
  for(let x=pas/2;x<W;x+=pas)for(let y=pas/2;y<H;y+=pas){let a=x>W/2?W-x:x,b=y>H/2?H-y:y;if(b>a){const t=a;a=b;b=t;}
    const cau=b>f,dins=x>ox&&x<ox+Wh&&y>oy&&y<oy+Hh;if(cau!==dins)mal++;}
  return mal;}
const masks=[['WODB',128,128,77,77],['counting game 3×2',168,128,117,77],['counting game 2×2',128,128,77,77],['Pinta N=10',64,64,33,33],['Pinta N=8',72,72,41,41]];
for(const m of [15,20,24])for(let C=2;C<=7;C++)for(let R=2;R<=5;R++){const cel=Math.floor(2*Math.min(40,(297-2*m)/C,(210-2*Math.max(m,19))/R))/2,S=2*cel+2*m;
  masks.push([`builder ${C}×${R} frame ${m}`,S,S,2*cel-3,2*cel-3]);}
let s=12345;const rnd=()=>(s=(s*1103515245+12345)%2147483648)/2147483648;
for(let i=0;i<200;i++){const H=40+Math.floor(rnd()*160),W=H+Math.floor(rnd()*120),f=4+Math.floor(rnd()*(H/2-8));masks.push([`random ${W}×${H} frame ${f}`,W,H,W-2*f,H-2*f]);}
const vistes=new Set();let n=0;
for(const [nom,W,H,Wh,Hh] of masks){const k=[W,H,Wh,Hh].join();if(vistes.has(k))continue;vistes.add(k);n++;
  if(!PLEC.serveix(W,H,Wh,Hh))err(nom+': serveix() says the recipe does not apply');
  const a=PLEC.comprova(W,H,Wh,Hh,.25).mal,b=independent(W,H,Wh,Hh,(W-Wh)/2,(H-Hh)/2,.25);
  if(a||b)err(`${nom}: ${a} / ${b} points misclassified`);}
console.log(`${n} different masks: the cut removes exactly the window`);
/* negative controls */
for(const [nom,W,H,Wh,Hh,ox,oy] of [['frame wider at the sides',168,128,100,77,34,25.5],['frame wider on top and bottom',128,128,77,60,25.5,34],['window off centre',128,128,77,77,20,25.5]]){
  const b=independent(W,H,Wh,Hh,ox,oy,.25),centrada=ox===(W-Wh)/2&&oy===(H-Hh)/2;
  if(!b)err(nom+': the independent model should fail');
  if(centrada&&PLEC.serveix(W,H,Wh,Hh))err(nom+': serveix() should say no');
  if(centrada&&!PLEC.comprova(W,H,Wh,Hh,.25).mal)err(nom+': comprova() should fail');}
if(PLEC.serveix(128,168,77,117))err('portrait masks are not supported and serveix() must say so');
console.log('negative controls: the recipe fails when the frame is not uniform or the window is off centre');
/* drawings */
const g={W:168,H:128,Wh:117,Hh:77,estrella:null,cols:3,files:2};
for(const mode of ['columna','tira']){const h=PLEC.instruccions({mode,x:150,y:10,w:mode==='tira'?24:52,h:277,g});
  if(!/class="plec"/.test(h)||(h.match(/<text/g)||[]).length<7||/NaN|undefined/.test(h))err('instruccions('+mode+') is wrong');}
if(PLEC.instruccions({x:0,y:0,w:50,h:270,g:{W:128,H:128,Wh:77,Hh:60}})!=='')err('instruccions() must return nothing when the recipe does not apply');
console.log('drawings: both layouts produced');
console.log(bad?bad+' ERROR(S)':'ALL OK');process.exit(bad?1:0);
