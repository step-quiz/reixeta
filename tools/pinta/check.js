/* Verifies Pinta per sumes. Usage: node tools/pinta/check.js [N]  (N random drawing sets per theme and sheet size, default 200).
   1. For every example sheet and N random sets on 10×10 and 8×8, in the four themes (two-digit sums, integers, fractions, perfect
      squares): the solver returns a sheet, no value is repeated inside a mask position, and every drawing is recovered EXACTLY when
      repainted with independent arithmetic on the PRINTED values (real products of integers, exact sums of fractions, exact
      BigInt square test) — not with the class tables of the engine. The URL encoding round-trips, theme included.
   2. Mazes: 200 seeds per size give a bitmap whose black cells form a tree with exactly one path from A1 to the last position
      (counted here by exhaustive search); PINTA.cami returns that path; bitmaps with a loop or in two pieces are refused.
   Exit code 1 on failure. */
'use strict';
const path=require('path');globalThis.window=globalThis;require(path.join(__dirname,'../../pinta/motor.js'));
const P=globalThis.PINTA,NS=+(process.argv[2]||200);let bad=0,n=0;const err=m=>{bad++;if(bad<20)console.log('ERROR '+m);};
const mcd=(a,b)=>b?mcd(b,a%b):a,enter=s=>{const t=String(s).replace('−','-');return /^-?\d+$/.test(t)?parseInt(t,10):NaN;};
const quadrat=x=>{if(x<0n)return false;let r=BigInt(Math.floor(Math.sqrt(Number(x))));while(r*r>x)r--;while((r+1n)*(r+1n)<=x)r++;return r*r===x;};
/* Does rule k of the theme hold for the four printed values w? Returns null if a value is not what the theme may print. */
const REGLA={
  S:(w,k)=>{const v=w.map(x=>enter(x.s));if(v.some(x=>!(x>=10&&x<=99)))return null;return v.reduce((a,b)=>a+b,0)%[2,3,5][k]===0;},
  E:(w,k)=>{const v=w.map(x=>enter(x.s));if(v.some(x=>!Number.isInteger(x)||x===0||Math.abs(x)>45))return null;
    return k===0?v[0]*v[1]*v[2]*v[3]>0:(((v.reduce((a,b)=>a+b,0)%[0,3,5][k])+[0,3,5][k])%[0,3,5][k])===0;},
  F:(w,k)=>{const v=w.map(x=>x.f?x.f:[enter(x.s),1]);if(v.some(([a,b])=>!Number.isInteger(a)||!Number.isInteger(b)||a<1||b<1||mcd(a,b)!==1||![1,2,3,6].includes(b)||a/b>3))return null;
    const num=v.reduce((s,[a,b])=>s+a*(6/b),0);return num%6===0;},                      // exact: everything in sixths
  Q:(w,k)=>{const v=w.map(x=>enter(x.s));if(v.some(x=>!(x>=2&&x<=150)))return null;return quadrat(v.reduce((a,b)=>a*BigInt(b),1n));}};
function independent(tema,T,N,D){const R=P.TEMES[tema].regles.length;
  for(let r=0;r+1<N;r++)for(let c=0;c+1<N;c++){const w=[T[r][c],T[r][c+1],T[r+1][c],T[r+1][c+1]],ks=w.map(x=>x.s||x.f.join('/'));
    if(new Set(ks).size<4)return false;
    for(let k=0;k<R;k++){const v=REGLA[tema](w,k);if(v===null)return false;if(D[k]&&D[k].some(f=>f.includes('X'))&&(v!==(D[k][r][c]==='X')))return false;}}
  return true;}
function prova(tema,N,D,seed){n++;const T=P.resol(tema,N,D,seed),T2=P.resol(tema,N,D,seed);
  if(!T||JSON.stringify(T)!==JSON.stringify(T2)||!independent(tema,T,N,D)){err(`${tema} ${N} ${seed}`);return;}
  const e=P.codifica(tema,N,D,'7'),d=P.descodifica(e);if(!d||d.tema!==tema||d.N!==N||JSON.stringify(d.dibuixos)!==JSON.stringify(D))err('URL round trip '+tema);}
for(const k of P.ORDRE_EX){const E=P.EX[k];if(E.dib.length!==3||E.dib.some(D=>D.length!==9||D.some(f=>f.length!==9||/[^X.]/.test(f))))err('example '+k+' is not 3 drawings of 9×9');prova(E.tema,10,E.dib,'ex'+k);}
if(Object.keys(P.EX).sort().join()!==P.ORDRE_EX.slice().sort().join())err('ORDRE_EX');
const rnd=P.mulberry32(12345);const perTema={};
for(const tema of P.ORDRE_TEMES){const R=P.TEMES[tema].regles.length;perTema[tema]=0;
  for(const N of [10,8])for(let i=0;i<NS;i++){const dens=rnd(),D=[0,1,2].map(k=>k>=R||rnd()<.2?P.buit(N):Array.from({length:N-1},()=>Array.from({length:N-1},()=>rnd()<dens?'X':'.').join('')));prova(tema,N,D,'r'+i);perTema[tema]++;}}
console.log(`sheets checked: ${n} (examples ${P.ORDRE_EX.join(', ')} + ${NS} random sets per size in each theme: ${P.ORDRE_TEMES.join(', ')})`);
// ---- mazes ----
function camins(D){const n=D.length,vist=Array.from({length:n},()=>new Array(n).fill(false));let k=0;   // number of simple paths A1 -> last cell through black cells
  (function dfs(r,c){if(r<0||c<0||r>=n||c>=n||D[r][c]!=='X'||vist[r][c])return;if(r===n-1&&c===n-1){k++;return;}vist[r][c]=true;dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);vist[r][c]=false;})(0,0);return k;}
let labs=0;
for(const N of [10,8])for(let s=1;s<=200;s++){const D=P.laberint(N,s),C=P.cami(D),m=N/2,negres=D.join('').split('X').length-1;labs++;
  if(JSON.stringify(D)!==JSON.stringify(P.laberint(N,s))||negres!==2*m*m-1||camins(D)!==1||!C||C[0].join()!=='0,0'||C[C.length-1].join()!==`${N-2},${N-2}`
    ||C.some(([r,c],i)=>D[r][c]!=='X'||(i&&Math.abs(r-C[i-1][0])+Math.abs(c-C[i-1][1])!==1)))err(`maze ${N} ${s}`);}
if(P.cami(['XX.','XX.','.XX'])!==null||P.cami(['X..','...','..X'])!==null||P.cami(['.X.','XXX','.XX'])!==null)err('cami() must refuse loops, separate pieces and a white entrance');
if(P.cami(P.EX.A.dib[0])!==null)err('the heart is not a maze');
console.log(`mazes checked: ${labs} (one single path each)`);
console.log(bad?`FAILURES: ${bad}`:'ALL OK');process.exit(bad?1:0);
