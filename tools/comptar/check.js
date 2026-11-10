/* Verifies the counting game. Usage: node tools/comptar/check.js [N]  (N generated sheets per level, default 10).
   Fixed sheets: 24 distinct numbers of the level and balanced answers (COMPTAR.bo); the answers of every play of every
   script are recomputed independently. "Full nou": deterministic and good. Exit code 1 on failure. */
'use strict';
const path=require('path');globalThis.window=globalThis;
require(path.join(__dirname,'../../comptar/motor.js'));require(path.join(__dirname,'../../comptar/fulls.js'));
const K=globalThis.COMPTAR,F=globalThis.COMPTAR_FULLS,NS=+(process.argv[2]||10);let bad=0;
const prime=n=>{if(n<2)return false;for(let d=2;d<n;d++)if(n%d===0)return false;return true;},sq=n=>{for(let k=1;k*k<=n;k++)if(k*k===n)return true;return false;};
const TEST={'primers':prime,'múltiples de 3':n=>n%3===0,'quadrats perfectes':sq};
function plays(T,code){let n=0;const s5=code.startsWith('CS'),C=s5?5:6;for(let k=0;k<4;k++)for(const j of K.guio(T,code,k)){n++;
    const m=/^([A-D])(\d)(?: (horitzontal|vertical))?$/.exec(j.pos),r='ABCD'.indexOf(m[1]),c=+m[2]-1,h=m[3]==='vertical'?3:2,w=s5?2:m[3]==='horitzontal'?3:2,vis=[];
    if(s5!==(m[3]===undefined))bad++;
    for(let i=0;i<h;i++)for(let jj=0;jj<w;jj++)vis.push(T[(r+i)*C+c+jj]);
    const key=Object.keys(TEST).find(x=>j.text.includes(x)),ns=vis.filter(TEST[key]),exp=j.text.startsWith('Quants')?ns.length:ns.reduce((a,b)=>a+b,0);
    if(exp!==j.resposta||r+h>4||c+w>C)bad++;}if(n!==(s5?72:132))bad++;return n;}
for(const niv of K.ORDRE){const line=[];
  for(const [nm,T] of Object.entries(F[niv])){const ok=K.bo(T,niv);if(!ok)bad++;line.push(nm+(ok?'':' BAD')+' '+K.histograma(T,niv).map(h=>h.join('')).join('/')+' plays '+plays(T,niv+'-'+nm));}
  if(new Set(Object.values(F[niv]).map(T=>T.join())).size!==Object.keys(F[niv]).length)bad++;   // fixed sheets must differ
  let good=0;const seen=new Set(),t0=Date.now();
  for(let n=1000;n<1000+NS;n++){const T=K.genera(niv,n),T2=K.genera(niv,n);if(!T||!K.bo(T,niv)||T.join()!==T2.join()){bad++;continue;}good++;seen.add(T.join());plays(T,niv+'-'+n);}
  console.log(`${niv} | fixed ${line.join(' | ')} | Full nou: ${good}/${NS} good, ${seen.size} distinct, ${Math.round((Date.now()-t0)/NS/2)} ms`);}
console.log(bad?`FAILURES: ${bad}`:'ALL OK');process.exit(bad?1:0);
