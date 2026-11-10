/* Verifies Pinta per sumes. Usage: node tools/pinta/check.js [N]  (N random drawing sets per sheet size, default 200).
   For the example sheets A–C and N random sets (0–3 drawings each, random density) on 10×10 and 8×8: the solver returns a
   sheet of two-digit numbers, no number repeated inside a mask position, and every drawing is recovered EXACTLY when
   repainted from the numbers with independent code. Also the URL encoding round-trips. Exit code 1 on failure. */
'use strict';
const path=require('path');globalThis.window=globalThis;require(path.join(__dirname,'../../pinta/motor.js'));
const P=globalThis.PINTA,NS=+(process.argv[2]||200);let bad=0,n=0;const MOD=[2,3,5];
function independent(T,N,D){   // own repaint: does not call PINTA.pinta / PINTA.comprova
  for(const row of T)for(const x of row)if(!Number.isInteger(x)||x<10||x>99)return false;
  for(let r=0;r+1<N;r++)for(let c=0;c+1<N;c++){const w=[T[r][c],T[r][c+1],T[r+1][c],T[r+1][c+1]];
    if(w[0]===w[1]||w[0]===w[2]||w[0]===w[3]||w[1]===w[2]||w[1]===w[3]||w[2]===w[3])return false;
    const s=w[0]+w[1]+w[2]+w[3];for(let k=0;k<3;k++)if(D[k].some(f=>f.includes('X'))&&((s%MOD[k]===0)!==(D[k][r][c]==='X')))return false;}
  return true;}
function prova(N,D,seed){n++;const T=P.resol(N,D,seed),T2=P.resol(N,D,seed);
  if(!T||JSON.stringify(T)!==JSON.stringify(T2)||!independent(T,N,D)){bad++;return;}
  const e=P.codifica(N,D,'7'),d=P.descodifica(e);if(!d||d.N!==N||JSON.stringify(d.dibuixos)!==JSON.stringify(D))bad++;}
for(const k of Object.keys(P.EX)){if(P.EX[k].some(D=>D.length!==9||D.some(f=>f.length!==9)))bad++;prova(10,P.EX[k],'ex'+k);}
const rnd=P.mulberry32(12345);
for(const N of [10,8])for(let i=0;i<NS;i++){const dens=rnd(),D=[0,1,2].map(()=>rnd()<.2?P.buit(N):Array.from({length:N-1},()=>Array.from({length:N-1},()=>rnd()<dens?'X':'.').join('')));prova(N,D,'r'+i);}
console.log(`sheets checked: ${n} (examples A–C + ${NS} random sets per size)`);
console.log(bad?`FAILURES: ${bad}`:'ALL OK');process.exit(bad?1:0);
