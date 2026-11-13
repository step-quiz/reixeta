/* Verifies the Cardano grille game. Usage: node tools/cardano/check.js [N]   (N generated sheets per level, default 200)
   1. The standard grille: 9 holes, one in each of the 9 rotation orbits of the 6×6 sheet; the four positions show the 36 cells
      exactly once; no two holes share a side. Hand-cutting at real size (sizes read from cardano/app.js): 36 straight cuts of the
      hole side (>= 5 mm), bars of at least 6 mm between holes, card not wider than 198 mm (printable on A4).
   2. Messages: the three examples and 300 random texts are written through the grille and read back with an independent
      implementation (explicit quarter turns of the whole sheet instead of the engine's position table); normalisation rules.
   3. "Four turns, four families": fixed sheets A–D and N generated per level. 36 different numbers in range; at every position
      exactly 8 numbers of the announced family and 1 intruder; the intruder belongs to no family of the level's catalogue; every
      other number belongs to exactly one of the four families of the sheet; at every position only ONE family of the whole
      catalogue holds 8 or more of the 9 numbers (unambiguous answer). All re-derived here, not with CARDANO.bo. Determinism.
   4. Design worksheets: in the 4×4 and 6×6 templates every group number appears exactly 4 times and the 4 cells are one orbit.
   Exit code 1 on failure. */
'use strict';
const path=require('path'),fs=require('fs');globalThis.window=globalThis;require(path.join(__dirname,'../../cardano/motor.js'));
const K=globalThis.CARDANO,NS=+(process.argv[2]||200);let bad=0;const err=m=>{bad++;console.log('ERROR '+m);};
// ---- 1. grille ----
const rot=([r,c],n)=>[c,n-1-r];
{const H=K.FORATS,n=6,seen=new Map();let h=H;
  for(let k=0;k<4;k++){for(const [r,c] of h)seen.set(r*n+c,(seen.get(r*n+c)||0)+1);h=h.map(p=>rot(p,n));}
  if(H.length!==9||seen.size!==36||[...seen.values()].some(v=>v!==1))err('the grille does not show every cell exactly once');
  const S=new Set(H.map(p=>p[0]*n+p[1]));let costat=0;for(const [r,c] of H){if(c<n-1&&S.has(r*n+c+1))costat++;if(r<n-1&&S.has((r+1)*n+c))costat++;}
  if(costat)err('two holes share a side');
  const src=fs.readFileSync(path.join(__dirname,'../../cardano/app.js'),'utf8'),m=/const CEL=([\d.]+),INSET=([\d.]+),FORAT=CEL-2\*INSET,MARC=([\d.]+)/.exec(src);
  if(!m)err('cannot read the sizes from cardano/app.js');
  else{const CEL=+m[1],INSET=+m[2],MARC=+m[3],forat=CEL-2*INSET,card=n*CEL+2*MARC;
    if(forat<5||2*INSET<6||card>198)err(`sizes: hole ${forat}, bar ${2*INSET}, card ${card}`);
    console.log(`grille: 9 holes, one per orbit, 36 cells shown once, no holes sharing a side; ${4*H.length} cuts of ${forat} mm, bars ${2*INSET} mm, card ${card} mm`);}}
// ---- 2. messages ----
function llegeixIndep(T){/* turn the SHEET a quarter turn to the left each time, look through the fixed holes, and read what is seen in the
     reading order of the sheet (each letter remembers where it was written) */
  const n=6;let G=T.map((f,r)=>f.map((ch,c)=>({ch,r,c})));const out=[];
  for(let k=0;k<4;k++){out.push(K.FORATS.map(([r,c])=>G[r][c]).sort((a,b)=>a.r-b.r||a.c-b.c).map(x=>x.ch).join(''));
    const R=Array.from({length:n},()=>new Array(n));for(let r=0;r<n;r++)for(let c=0;c<n;c++)R[n-1-c][r]=G[r][c];G=R;}   // sheet turned left = grille turned right
  return out;}
{let s=4242;const rnd=()=>(s=(s*1103515245+12345)%2147483648)/2147483648,AB='ABCDEFGHIJKLMNOPQRSTUVWXYZÇ0123456789 àéíòúï·-';
  const textos=Object.values(K.EX);for(let i=0;i<300;i++){let t='';const L=1+Math.floor(rnd()*36);while(K.normalitza(t).length<L)t+=AB[Math.floor(rnd()*AB.length)];textos.push(t);}
  let n=0;for(const t of textos){const m=K.normalitza(t),T=K.xifra(t);if(!T){err('no sheet for: '+t);continue;}n++;
    const a=llegeixIndep(T).join(''),b=K.llegeix(T).join('');
    if(a!==b||!a.startsWith(m)||a.length!==36||JSON.stringify(K.xifra(t))!==JSON.stringify(T))err('message not recovered: '+t);
    if(/[^A-ZÇ0-9]/.test(a))err('unexpected character in the sheet of: '+t);}
  if(K.xifra('')!==null||K.xifra('A'.repeat(37))!==null)err('empty or too long messages must be refused');
  if(K.normalitza('L·l, àÉç 9!')!=='LLAEÇ9')err('normalisation');
  console.log(`messages: ${n} texts written and read back through the grille`);}
// ---- 3. families ----
{const POS=[];let h=K.FORATS;for(let k=0;k<4;k++){POS.push(h.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]));h=h.map(p=>rot(p,6));}
  for(const niv of K.ORDRE){const L=K.NIVELLS[niv];let n=0;const combos=new Set();
    for(const id of [...K.FIXOS,...Array.from({length:NS},(_,i)=>String(1000+i))]){const F=K.genera(niv,id);n++;
      if(!F){err(`${niv}-${id}: no sheet`);continue;}
      if(JSON.stringify(F)!==JSON.stringify(K.genera(niv,id)))err(`${niv}-${id}: not deterministic`);
      const tots=F.T.flat();let ok=tots.length===36&&new Set(tots).size===36&&tots.every(v=>Number.isInteger(v)&&v>=L.lo&&v<=L.hi)&&new Set(F.fam).size===4&&F.fam.every(k=>L.cat.includes(k));
      POS.forEach((pos,i)=>{const vs=pos.map(([r,c])=>F.T[r][c]),f=K.FAMILIES[F.fam[i]].f,dins=vs.filter(f),fora=vs.filter(v=>!f(v));
        if(dins.length!==8||fora.length!==1||fora[0]!==F.intrusos[i])ok=false;
        else{if(L.cat.some(k=>K.FAMILIES[k].f(fora[0])))ok=false;
          if(dins.some(v=>F.fam.filter(k=>K.FAMILIES[k].f(v)).length!==1))ok=false;
          if(L.cat.filter(k=>vs.filter(K.FAMILIES[k].f).length>=8).length!==1)ok=false;}});
      if(!ok||!K.bo(F,niv))err(`${niv}-${id}: not a good sheet`);combos.add(F.fam.slice().sort().join('+'));}
    console.log(`families ${niv} (${L.lo}–${L.hi}): ${n} sheets checked, ${combos.size} different sets of four families`);}}
// ---- 4. design templates ----
for(const n of [4,6]){const G=K.grups(n),num=new Map();let ok=G.length===n*n/4;
  for(const g of G){if(g.length!==4)ok=false;let p=g[0];for(let k=0;k<4;k++){if(!g.some(q=>q[0]===p[0]&&q[1]===p[1]))ok=false;num.set(p[0]*n+p[1],1);p=rot(p,n);}}
  if(!ok||num.size!==n*n)err(`design template ${n}×${n}`);else console.log(`design template ${n}×${n}: ${G.length} groups of 4 cells, ${4**G.length} possible grilles`);}
console.log(bad?`FAILURES: ${bad}`:'ALL OK');process.exit(bad?1:0);
