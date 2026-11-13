/* Reixeta · El sonar — motor (amagatalls, respostes, quantes preguntes poden bastar i generador). Funciona al navegador i a Node.
   Un jugador amaga 5 tresors en un full de 5 × 4 caselles. L'altre diu posicions de la plantilla de 2 × 2 (la del WODB, 12 posicions)
   i li responen quants tresors s'hi veuen. Un amagatall es guarda com un nombre de 20 bits: el bit fila·5 + columna és un tresor. */
(function(G){
'use strict';
const R=4,C=5,K=5,LL='ABCD';
/* Les 12 posicions: la casella de dalt a l'esquerra dona el nom (A1…C4). */
const POS=[];for(let r=0;r<R-1;r++)for(let c=0;c<C-1;c++)POS.push({nom:LL[r]+(c+1),r,c,cel:[r*C+c,r*C+c+1,(r+1)*C+c,(r+1)*C+c+1]});
const NP=POS.length;
/* Tots els amagatalls (15.504) i les seves 12 respostes. */
const TOTS=[];(function rec(i,k,m){if(k===K){TOTS.push(m);return;}if(i>=R*C)return;rec(i+1,k+1,m|1<<i);rec(i+1,k,m);})(0,0,0);
const respostes=m=>POS.map(p=>p.cel.reduce((a,i)=>a+(m>>i&1),0));
const RESP=TOTS.map(respostes);
const bits=x=>{let k=0;while(x){k+=x&1;x>>=1;}return k;};
/* Per a un amagatall m: de cada altre amagatall, el conjunt de posicions (12 bits) on la resposta és diferent. */
function diferencies(m){const a=respostes(m),S=new Set();for(let j=0;j<TOTS.length;j++){if(TOTS[j]===m)continue;const b=RESP[j];let d=0;for(let p=0;p<NP;p++)if(a[p]!==b[p])d|=1<<p;S.add(d);}return [...S];}
/* Un amagatall és bo si les 12 respostes només corresponen a ell (qui busca sempre el pot acabar trobant). */
const determinat=m=>!diferencies(m).includes(0);
/* El mínim de preguntes que poden bastar per saber segur on són els tresors, i un conjunt de posicions que ho aconsegueix:
   el conjunt més petit que distingeix m de tots els altres amagatalls. Torna null si l'amagatall no és bo. */
const SUBS=[];for(let s=1;s<1<<NP;s++)SUBS.push(s);SUBS.sort((a,b)=>bits(a)-bits(b)||a-b);
function minim(m){const D=diferencies(m);if(D.includes(0))return null;for(const s of SUBS)if(D.every(d=>d&s))return {k:bits(s),pos:POS.filter((_,p)=>s>>p&1).map(p=>p.nom)};return null;}
/* Nivells segons el mínim de preguntes que poden bastar. */
const NIVELLS={SO1:{nom:'Nivell 1 · es pot trobar amb 5 preguntes o menys',min:1,max:5},SO2:{nom:'Nivell 2 · calen 6, 7 o 8 preguntes',min:6,max:8},SO3:{nom:'Nivell 3 · calen 9 preguntes o més',min:9,max:12}};
const ORDRE=['SO1','SO2','SO3'],FIXOS=['A','B','C','D'];
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
/* Amagatall «id» d'un nivell (A–D són els fixos; qualsevol número és un «full nou»). Mateix id, mateix full. */
function genera(niv,id){const L=NIVELLS[niv];if(!L)return null;const rnd=mulberry32(hashSeed(niv+'-'+id));
  for(let a=0;a<3000;a++){const m=TOTS[Math.floor(rnd()*TOTS.length)],q=minim(m);if(q&&q.k>=L.min&&q.k<=L.max)return {m,resp:respostes(m),minim:q};}
  return null;}
const caselles=m=>{const out=[];for(let i=0;i<R*C;i++)if(m>>i&1)out.push(LL[Math.floor(i/C)]+(i%C+1));return out;};
G.SONAR={R,C,K,POS,TOTS,RESP,respostes,diferencies,determinat,minim,NIVELLS,ORDRE,FIXOS,genera,caselles,bits,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
