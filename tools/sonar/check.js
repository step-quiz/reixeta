/* Verifies "El sonar". Usage: node tools/sonar/check.js [N]   (N generated sheets per level, default 40; must print ALL OK)
   Everything is recomputed here with its own code (cells as coordinates, not the engine's bit tables):
   1. The game: C(20,5) = 15 504 hideouts; 12 mask positions; how many hideouts are determined by the 12 answers (10 260);
      the smallest number of questions that can pin each of them down (level sizes 1 678 / 6 950 / 1 632); and a seeker that always
      asks the position leaving the smallest largest group needs 3–12 questions, 9.32 on average. These are the figures quoted on
      the page, in the README and in CLAUDE.md.
   2. Sheets (fixed A–D and N generated per level): 5 treasures; determined by the 12 answers; the printed answers are right; the
      printed set of questions really separates the hideout from every other one, no smaller set does, and its size is the level's.
      SONAR.determinat is compared with the recount for every hideout. Determinism.
   Exit code 1 on failure. */
'use strict';
const path=require('path');globalThis.window=globalThis;require(path.join(__dirname,'../../sonar/motor.js'));
const K=globalThis.SONAR,NS=+(process.argv[2]||40);let bad=0;const err=m=>{bad++;if(bad<25)console.log('ERROR '+m);};
// ---- own model: a hideout is a sorted list of 5 cells (0..19); a position is its top-left cell ----
const R=4,C=5,POS=[];for(let r=0;r<3;r++)for(let c=0;c<4;c++)POS.push([r,c]);
const HID=[];for(let a=0;a<20;a++)for(let b=a+1;b<20;b++)for(let c=b+1;c<20;c++)for(let d=c+1;d<20;d++)for(let e=d+1;e<20;e++)HID.push([a,b,c,d,e]);
const resp=h=>POS.map(([r,c])=>h.filter(x=>{const rr=Math.floor(x/C),cc=x%C;return rr>=r&&rr<=r+1&&cc>=c&&cc<=c+1;}).length);
const A=HID.map(resp),clauH=h=>h.reduce((m,x)=>m|1<<x,0),index=new Map(HID.map((h,i)=>[clauH(h),i]));
const grups=new Map();A.forEach((v,i)=>{const k=v.join('');grups.set(k,(grups.get(k)||0)+1);});
const det=A.map(v=>grups.get(v.join(''))===1),nDet=det.filter(Boolean).length;
if(HID.length!==15504||K.TOTS.length!==15504||POS.length!==12||K.POS.length!==12)err('counts');
if(nDet!==10260)err('determined hideouts: '+nDet);
let dif=0;HID.forEach((h,i)=>{if(K.determinat(clauH(h))!==det[i])dif++;});if(dif)err('SONAR.determinat differs from the recount in '+dif+' hideouts');
/* smallest separating set of every hideout: subsets by increasing size, a hideout is settled when its restricted answers are unique */
const pop=x=>{let k=0;while(x){k+=x&1;x>>=1;}return k;},SUBS=[];for(let s=1;s<4096;s++)SUBS.push(s);SUBS.sort((a,b)=>pop(a)-pop(b));
const minQ=new Array(HID.length).fill(99),unic=(s)=>{const idx=[];for(let p=0;p<12;p++)if(s>>p&1)idx.push(p);const keys=A.map(v=>{let k=0;for(const p of idx)k=k*5+v[p];return k;}),cnt=new Map();for(const k of keys)cnt.set(k,(cnt.get(k)||0)+1);return keys.map(k=>cnt.get(k)===1);};
for(const s of SUBS){const k=pop(s),u=unic(s);for(let i=0;i<u.length;i++)if(u[i]&&k<minQ[i])minQ[i]=k;}
const nivell=k=>k<=5?'SO1':k<=8?'SO2':'SO3',mida={SO1:0,SO2:0,SO3:0};minQ.forEach((k,i)=>{if(det[i])mida[nivell(k)]++;else if(k!==99)err('an undetermined hideout has a separating set');});
if(mida.SO1!==1678||mida.SO2!==6950||mida.SO3!==1632)err('level sizes '+JSON.stringify(mida));
for(const niv of K.ORDRE){const L=K.NIVELLS[niv],esp={SO1:[1,5],SO2:[6,8],SO3:[9,12]}[niv];if(L.min!==esp[0]||L.max!==esp[1])err('level bounds of '+niv);}
/* a seeker that always asks the position whose largest group of remaining hideouts is smallest */
const prof=new Array(HID.length).fill(-1);
(function arbre(S,fetes,d){if(S.length===1){prof[S[0]]=d;return;}let millor=-1,mb=1e9,mg=0;
  for(let p=0;p<12;p++){if(fetes>>p&1)continue;const b=[0,0,0,0,0];for(const i of S)b[A[i][p]]++;const mx=Math.max(...b),g=b.filter(Boolean).length;if(g<2)continue;if(mx<mb||(mx===mb&&g>mg)){mb=mx;mg=g;millor=p;}}
  if(millor<0)return;const parts=[[],[],[],[],[]];for(const i of S)parts[A[i][millor]].push(i);for(const part of parts)if(part.length)arbre(part,fetes|1<<millor,d+1);})(HID.map((_,i)=>i),0,0);
let sum=0,mn=99,mx=0;prof.forEach((d,i)=>{if(det[i]){if(d<0)err('strategy did not finish');sum+=d;mn=Math.min(mn,d);mx=Math.max(mx,d);}});
const mitjana=(sum/nDet).toFixed(2);if(mn!==3||mx!==12||mitjana!=='9.32')err(`strategy: ${mn}–${mx}, average ${mitjana}`);
if(!(5**5<15504&&15504<=5**6))err('information bound');
console.log(`game: 15504 hideouts, ${nDet} determined by the 12 answers; levels ${mida.SO1} / ${mida.SO2} / ${mida.SO3}; smallest-largest-group seeker: ${mn}–${mx} questions, average ${mitjana}`);
// ---- sheets ----
let n=0;
for(const niv of K.ORDRE)for(const id of [...K.FIXOS,...Array.from({length:NS},(_,i)=>String(1000+i))]){const F=K.genera(niv,id);n++;
  if(!F){err(`${niv}-${id}: no sheet`);continue;}
  if(JSON.stringify(F)!==JSON.stringify(K.genera(niv,id)))err(`${niv}-${id}: not deterministic`);
  const i=index.get(F.m);if(i===undefined||K.bits(F.m)!==5){err(`${niv}-${id}: not 5 treasures`);continue;}
  const set=F.minim.pos.reduce((s,nom)=>s|1<<K.POS.findIndex(p=>p.nom===nom),0);
  let ok=det[i]&&F.resp.join('')===A[i].join('')&&minQ[i]===F.minim.k&&nivell(F.minim.k)===niv&&pop(set)===F.minim.k&&unic(set)[i];
  if(ok&&K.caselles(F.m).join()!==HID[i].map(x=>'ABCD'[Math.floor(x/C)]+(x%C+1)).join())ok=false;
  if(!ok)err(`${niv}-${id}: wrong sheet`);}
console.log(`sheets checked: ${n} (answers, level and smallest set of questions)`);
console.log(bad?`FAILURES: ${bad}`:'ALL OK');process.exit(bad?1:0);
