/* Verifies "Daus i successos". Usage: node tools/daus/check.js   (must print ALL OK)
   1. Events: every event of the catalogue is recounted with predicates written again here, and against the known sizes.
   2. Pairs: for the 36 pairs of events, |X ∩ Y|, P(X and Y), P(Y | X), P(X | Y), independence and incompatibility are recomputed
      with exact integer arithmetic and compared with DAUS.parella (fractions must be in lowest terms).
   3. Masks, at the real size (read from daus/app.js): the hole outline of every event contains the centre of exactly the cells of
      the event; the hole area is the expected one (cells + merged bars); the card stays in one piece (no island); every cut is
      a straight horizontal or vertical segment of at least 20 mm; card not wider than 198 mm; the two dice of a cell fit the hole.
   Exit code 1 on failure. */
'use strict';
const path=require('path'),fs=require('fs');globalThis.window=globalThis;require(path.join(__dirname,'../../daus/motor.js'));
const K=globalThis.DAUS;let bad=0;const err=m=>{bad++;console.log('ERROR '+m);};
// ---- 1. events ----
const MEU={A:(a,b)=>[2,4,6].includes(a),B:(a,b)=>b===5||b===6,C:(a,b)=>a+b===7,D:(a,b)=>a===b,E:(a,b)=>a+b>9,F:(a,b)=>Math.max(a,b)===6,G:(a,b)=>a<3,H:(a,b)=>(a-b)%2===0,I:(a,b)=>a-b>0};
const MIDA={A:18,B:12,C:6,D:6,E:6,F:11,G:12,H:18,I:15};
if(K.ORDRE.join('')!==Object.keys(MEU).join(''))err('catalogue changed: update this check');
const SET={};
for(const id of K.ORDRE){const M=K.caselles(id);SET[id]=new Set();let ok=true;
  for(let a=1;a<=6;a++)for(let b=1;b<=6;b++){if(MEU[id](a,b))SET[id].add(a*10+b);if(M[a-1][b-1]!==MEU[id](a,b))ok=false;}
  if(!ok||SET[id].size!==MIDA[id]||K.quantes(M)!==MIDA[id])err('event '+id);}
if(!K.PER_DEFECTE.every(id=>K.ORDRE.includes(id)))err('default set');
console.log(`events: ${K.ORDRE.length} recounted (${K.ORDRE.map(id=>id+'='+MIDA[id]).join(', ')})`);
// ---- 2. pairs ----
const mcd=(a,b)=>b?mcd(b,a%b):a,igual=(f,a,b)=>b===0?f===null:(f&&f[0]*b===a*f[1]&&mcd(f[0],f[1])===1||(a===0&&f&&f[0]===0&&f[1]===1));
let np=0,ind=[],inc=[];
for(const x of K.ORDRE)for(const y of K.ORDRE){if(x>=y)continue;np++;const p=K.parella(x,y),nxy=[...SET[x]].filter(v=>SET[y].has(v)).length;
  if(p.nx!==SET[x].size||p.ny!==SET[y].size||p.nxy!==nxy||!igual(p.pxy,nxy,36)||!igual(p.pyx,nxy,SET[x].size)||!igual(p.pxy_y,nxy,SET[y].size)
    ||p.independents!==(nxy*36===SET[x].size*SET[y].size)||p.incompatibles!==(nxy===0))err('pair '+x+y);
  if(p.independents)ind.push(x+y);if(p.incompatibles)inc.push(x+y);}
if(!ind.includes('AC')||!inc.includes('CD'))err('known facts: A and C are independent, C and D are incompatible');
console.log(`pairs: ${np} checked; independent: ${ind.join(' ')}; incompatible: ${inc.join(' ')}`);
// ---- 3. masks ----
const src=fs.readFileSync(path.join(__dirname,'../../daus/app.js'),'utf8'),m=/const CEL=([\d.]+),INSET=([\d.]+),MARC=([\d.]+),ESTRELLA=[\d.]+,DAU=([\d.]+),SEP=([\d.]+)/.exec(src);
if(!m)err('cannot read the sizes from daus/app.js');
else{const CEL=+m[1],INSET=+m[2],MARC=+m[3],DAU=+m[4],SEP=+m[5],f=CEL-2*INSET;
  if(6*CEL+2*MARC>198||2*DAU+SEP>f||DAU>f)err('sizes');
  const dins=(pol,x,y)=>{let c=false;for(let i=0,j=pol.length-1;i<pol.length;j=i++){const [xi,yi]=pol[i],[xj,yj]=pol[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c;}return c;};
  const area=pol=>Math.abs(pol.reduce((s,p,i)=>{const q=pol[(i+1)%pol.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2;
  for(const id of K.ORDRE){const M=K.caselles(id),F=K.forats(M,CEL,INSET);let ok=F.illes===0&&F.curt>=20,talls=0;
    for(let r=0;r<6;r++)for(let c=0;c<6;c++){const k=F.vores.filter(pol=>dins(pol,c*CEL+CEL/2,r*CEL+CEL/2)).length;if(k!==(M[r][c]?1:0))ok=false;}
    let esperada=0;for(let r=0;r<6;r++)for(let c=0;c<6;c++)if(M[r][c]){esperada+=f*f;if(c<5&&M[r][c+1])esperada+=2*INSET*f;if(r<5&&M[r+1][c])esperada+=2*INSET*f;if(r<5&&c<5&&M[r][c+1]&&M[r+1][c]&&M[r+1][c+1])esperada+=4*INSET*INSET;}
    if(Math.abs(F.vores.reduce((s,p)=>s+area(p),0)-esperada)>1e-6)ok=false;
    for(const pol of F.vores)pol.forEach((p,i)=>{const q=pol[(i+1)%pol.length];talls++;if(p[0]!==q[0]&&p[1]!==q[1])ok=false;});
    if(talls!==F.talls)ok=false;
    if(!ok)err('mask '+id);console.log(`mask ${id}: ${F.vores.length} hole(s), ${F.talls} straight cuts, shortest ${F.curt} mm, card in one piece ${ok?'OK':'NOT OK'}`);}}
console.log(bad?`FAILURES: ${bad}`:'ALL OK');process.exit(bad?1:0);
