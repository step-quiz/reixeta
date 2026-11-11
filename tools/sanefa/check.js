/* Verifies Sanefa trencada. Usage: node tools/sanefa/check.js [N]  (N generated sheets per motif, default 50).
   1. Motifs: for the three frieze transforms (vertical mirror, horizontal mirror, half-turn) the fraction of area that
      cannot be matched by the original, even after the best translation, must be >= 0.20 (clearly asymmetric shapes).
   2. Sheets (fixed 1, 2 and N generated per motif): the 7 frieze types once each; each frieze differs from a correct
      frieze in exactly one copy, not in the first two columns; and that copy is the only single-copy fix, checked with
      an independent definition of "correct frieze" (isometry tests, not the generator's pattern table).
   3. Hand-cutting of the cards at real size (motif box 22 mm, as in sanefa/app.js): every cut of the motif is at least 5 mm long;
      a motif offered as an edge bite (scissors) is a convex polygon whose bottom side lies on the card edge, so every cut starts
      from the edge or from the end of the previous one and there is no inward corner; the hole model reports its inward corners.
   Exit code 1 on failure. */
'use strict';
const path=require('path');globalThis.window=globalThis;require(path.join(__dirname,'../../sanefa/motor.js'));
const S=globalThis.SANEFA,NS=+(process.argv[2]||50);let bad=0;
// ---- 1. asymmetry ----
const inside=(P,x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c;}return c;};
function raster(P){const g=new Uint8Array(140*140);let n=0;for(let y=0;y<100;y++)for(let x=0;x<100;x++)if(inside(P,x+.5,y+.5)){g[(y+20)*140+x+20]=1;n++;}return {g,n};}
function mism(A,B){let best=1e9;for(let dy=-20;dy<=20;dy++)for(let dx=-20;dx<=20;dx++){let d=0;for(let y=20;y<120;y++)for(let x=20;x<120;x++)if(A.g[y*140+x]!==B.g[(y+dy)*140+x+dx])d++;if(d<best)best=d;}return best/(A.n+B.n);}
for(const m of S.ORDRE){const P=S.MOTIUS[m].pts,A=raster(P),v=[1,2,3].map(o=>mism(A,raster(P.map(p=>S.gira(p,o)))));
  const ok=Math.min(...v)>=0.20;if(!ok)bad++;console.log(`motif ${m} (${S.MOTIUS[m].nom}): mismatch V ${v[0].toFixed(2)} H ${v[1].toFixed(2)} half-turn ${v[2].toFixed(2)} ${ok?'OK':'TOO SYMMETRIC'}`);}
// ---- 3. hand-cutting (owner's lesson of 2026-11-11: measure the cuts before proposing a mask) ----
{const fs=require('fs'),src=fs.readFileSync(path.join(__dirname,'../../sanefa/app.js'),'utf8'),mm=/const M=([\d.]+),GAP=[\d.]+,MARC=([\d.]+),JOC=([\d.]+),OSCA=([\d.]+),ALT=([\d.]+)/.exec(src);
  if(!mm){bad++;console.log('cannot read the card sizes from sanefa/app.js');}
  else{const Q={m:+mm[1],marc:+mm[2],joc:+mm[3],osca:+mm[4],alt:+mm[5]},len=t=>Math.hypot(t[0][0]-t[1][0],t[0][1]-t[1][1]);
    const girs=P=>{let a=0;for(let i=0;i<P.length;i++){const [x0,y0]=P[i],[x1,y1]=P[(i+1)%P.length];a+=x0*y1-x1*y0;}const sg=Math.sign(a);
      return P.map((p,i)=>{const q=P[(i+1)%P.length],r=P[(i+2)%P.length];return Math.sign((q[0]-p[0])*(r[1]-q[1])-(q[1]-p[1])*(r[0]-q[0]))*sg;});};
    for(const m of S.ORDRE)for(const model of ['vora','forat']){if(model==='vora'&&!S.MOTIUS[m].vora)continue;const t=S.targeta(m,model,0,0,Q),L=t.talls.map(len),mn=Math.min(...L),inward=girs(S.MOTIUS[m].pts).filter(v=>v<0).length;
      let ok=mn>=5&&t.model===model;
      if(model==='vora'){const P=S.MOTIUS[m].pts,yb=Math.max(...P.map(p=>p[1])),alt=(yb-Math.min(...P.map(p=>p[1])))*Q.m*.86/100;ok=ok&&inward===0&&P.filter(p=>p[1]===yb).length===2&&t.talls.length===P.length-1&&Q.alt-alt>=8;}   // at least 8 mm of card above the apex
      if(!ok)bad++;console.log(`card ${m} ${model}: ${t.talls.length} cuts, shortest ${mn.toFixed(1)} mm, inward corners ${inward}, card ${(t.caixa[2]-t.caixa[0]).toFixed(0)} × ${(t.caixa[3]-t.caixa[1]).toFixed(0)} mm ${ok?'OK':'NOT GOOD FOR HAND-CUTTING'}`);}}}
// ---- 2. sheets ----
// independent definition: a strip is correct iff it is invariant under one of the seven frieze groups with the smallest unit
function correct(cel){const n=cel[0].length;
  if(cel.length===1){const s=cel[0],per=k=>s.every((x,i)=>i+k>=n||s[i+k]===x);
    if(per(1))return true;                                                   // translation
    if(per(2)&&s[0]!==s[1])return true;                                      // two alternating positions: mirror, glide or half-turn
    return per(4)&&s.every((x,i)=>i+2>=n||s[i+2]===(x^2))&&s.every((x,i)=>i+1>=n||((x^s[i+1])&1)===1);}   // glide by two copies + a vertical mirror between neighbours
  const [a,b]=cel;if(!a.every((x,i)=>b[i]===(x^2)))return false;              // horizontal mirror between the two rows
  return a.every((x,i)=>i+1>=n||a[i+1]===x)||(a.every((x,i)=>i+2>=n||a[i+2]===x)&&(a[0]^a[1])===1);}
let sheets=0;
for(const m of S.ORDRE)for(const num of ['1','2',...Array.from({length:NS},(_,i)=>String(1000+i))]){const F=S.genera(m,num),F2=S.genera(m,num);sheets++;
  if(JSON.stringify(F)!==JSON.stringify(F2)||F.map(s=>s.tipus).sort().join()!==S.TIPUS.map(t=>t.id).sort().join()){bad++;continue;}
  for(const s of F){const c=s.cel.map(f=>f.slice()),fixes=[];
    if(correct(c)||s.err.i<2)bad++;
    for(let r=0;r<c.length;r++)for(let i=0;i<S.N;i++){const old=c[r][i];for(let o=0;o<4;o++)if(o!==old){c[r][i]=o;if(correct(c))fixes.push([r,i,o]);}c[r][i]=old;}
    if(fixes.length!==1||fixes[0][0]!==s.err.r||fixes[0][1]!==s.err.i||fixes[0][2]!==s.err.era)bad++;}}
console.log(`sheets checked: ${sheets} (7 friezes each)`);
console.log(bad?`FAILURES: ${bad}`:'ALL OK');process.exit(bad?1:0);
