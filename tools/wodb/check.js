/* Verifies wodb/bancs.js + wodb/motor.js. Usage: node check.js [N]   (N = generated sheets tested per bank, default 10)
   Checks, for every bank: each fixed sheet is valid in every position, has no repeated item and respects the bank's
   balance cap; "Full nou" (WODB.genera) is deterministic and returns valid sheets. Prints the balance and
   neighbour-rule figures. Exit code 1 on any failure. */
'use strict';
const path=require('path');globalThis.window=globalThis;
require(path.join(__dirname,'../../wodb/motor.js'));require(path.join(__dirname,'../../wodb/bancs.js'));
const W=globalThis.WODB,BANCS=globalThis.BANCS,NS=+(process.argv[2]||10);let bad=0;
for(const c of globalThis.BANCS_ORDRE){const B=BANCS[c],n=W.wins(B).length,[R,C]=W.dims(B),cap=W.objectiu(B),rule=Math.floor(5*n/12);
  const fixed=Object.entries(B.fulls).map(([k,A])=>{const ok=A.length===R*C&&W.bo(B,A,cap);if(!ok)bad++;return k+':'+W.valid(B,A)+'/'+n+(ok?'':' BAD');}).join(' ');
  const mx=Object.values(B.fulls).map(A=>W.maxMotiu(B,A)),nb=Object.values(B.fulls).map(A=>W.repVeins(B,A));
  let good=0,fb=0,fail=0,nbs=0;const seen=new Set(),t0=Date.now();
  for(let num=1000;num<1000+NS;num++){const T=W.genera(B,num),T2=W.genera(B,num);
    if(!T||W.valid(B,T)!==n||T.join()!==T2.join()){fail++;continue;}
    if(W.bo(B,T,cap)){good++;nbs+=W.repVeins(B,T);}else fb++;seen.add(T.join());}
  if(fail)bad++;
  console.log(`${c} ${R}x${C} props ${B.props.length} items ${B.items.length} | fixed ${fixed} | max reason ${Math.max(...mx)}/${n} (rule ${rule}) ${Math.max(...mx)<=rule?'OK':'above'} | neighbour repeats ${nb.join(',')} | Full nou: ${good}/${NS} searched, ${fb} fallback, ${fail} failed, ${seen.size} distinct, avg neighbour repeats ${good?(nbs/good).toFixed(0):'-'}, ${Math.round((Date.now()-t0)/NS/2)} ms`);}
console.log(bad?`FAILURES: ${bad}`:'ALL OK');process.exit(bad?1:0);
