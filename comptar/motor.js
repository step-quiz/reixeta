/* Reixeta · Joc de comptar — motor (propietats, posicions, equilibri, generador i guions). Funciona al navegador i a Node. */
(function(G){
'use strict';
const esPrimer=n=>{if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
const esQuadrat=n=>Math.round(Math.sqrt(n))**2===n;
const PROPS=[
  {id:'p',quants:'Quants primers?',suma:'Suma els primers',f:esPrimer},
  {id:'m',quants:'Quants múltiples de 3?',suma:'Suma els múltiples de 3',f:n=>n%3===0},
  {id:'q',quants:'Quants quadrats perfectes?',suma:'Suma els quadrats perfectes',f:esQuadrat}];
/* Nivells. Cada nivell té el seu full (R files × C columnes) i les formes de plantilla que s'hi fan servir.
   min[j] = vegades que, com a mínim, ha de sortir cada resposta 0..kmax[j] de la pregunta j entre totes les posicions;
   maxrep = cap resposta en més posicions que això. Al nivell 1 només hi ha sis quadrats perfectes (4…49).
   CO = full de 6×4 amb la plantilla de 3×2 (horitzontal i vertical, 22 posicions, respostes de 0 a 6).
   CS = versió senzilla: full de 5×4 amb la plantilla de 2×2 del WODB (12 posicions, respostes de 0 a 4). */
const F6={R:4,C:6,formes:[['H',2,3],['V',3,2]],maxrep:6},F5={R:4,C:5,formes:[['',2,2]],maxrep:4};
const NIVELLS={
  CO1:Object.assign({nom:'Nivell 1 · 2 a 50 · plantilla de 3×2',lo:2,hi:50,min:[1,1,1],kmax:[6,6,5]},F6),
  CO2:Object.assign({nom:'Nivell 2 · 2 a 150 · plantilla de 3×2',lo:2,hi:150,min:[2,2,2],kmax:[6,6,6]},F6),
  CS1:Object.assign({nom:'Nivell 1 · 2 a 50 · plantilla de 2×2 (senzill)',lo:2,hi:50,min:[1,1,1],kmax:[4,4,4]},F5),
  CS2:Object.assign({nom:'Nivell 2 · 2 a 150 · plantilla de 2×2 (senzill)',lo:2,hi:150,min:[2,2,2],kmax:[4,4,4]},F5)};
const ORDRE=['CO1','CO2','CS1','CS2'];
/* Posicions de la plantilla en un nivell. El nom és la casella de dalt a l'esquerra (i l'orientació, si n'hi ha dues). */
const _pos={};
function posicions(niv){if(_pos[niv])return _pos[niv];const N=NIVELLS[niv],out=[];
  for(const [o,h,w] of N.formes)for(let r=0;r+h<=N.R;r++)for(let c=0;c+w<=N.C;c++){const cells=[];
    for(let i=0;i<h;i++)for(let j=0;j<w;j++)cells.push((r+i)*N.C+c+j);out.push({o,r,c,cells,nom:'ABCD'[r]+(c+1)+(o==='H'?' horitzontal':o==='V'?' vertical':'')});}
  return _pos[niv]=out;}
const nivellDe=codi=>String(codi).split('-')[0];
/* Histograma de respostes de cada pregunta: h[j][v] = nombre de posicions on es veuen v nombres amb la propietat j. */
function histograma(T,niv){const k=Math.max(...NIVELLS[niv].kmax)+(niv[1]==='O'?0:0),n=NIVELLS[niv].formes[0][1]*NIVELLS[niv].formes[0][2];
  return PROPS.map(p=>{const h=new Array(n+1).fill(0);for(const q of posicions(niv))h[q.cells.reduce((a,i)=>a+(p.f(T[i])?1:0),0)]++;return h;});}
/* Un full és bo si té nombres diferents del nivell i cada pregunta té les respostes prou repartides. */
function bo(T,niv){const N=NIVELLS[niv];if(T.length!==N.R*N.C||new Set(T).size!==T.length||T.some(x=>x<N.lo||x>N.hi||x!==Math.floor(x)))return false;
  return histograma(T,niv).every((h,j)=>{for(let v=0;v<=N.kmax[j];v++)if(h[v]<N.min[j])return false;return Math.max(...h)<=N.maxrep;});}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
/* Cost: desviació de cada histograma respecte del repartiment uniforme, amb penalització per les respostes que falten. */
function cost(T,niv){const N=NIVELLS[niv],H=histograma(T,niv),ideal=posicions(niv).length/H[0].length;let s=0;
  H.forEach((h,j)=>{for(let v=0;v<h.length;v++){s+=(h[v]-ideal)**2;if(v<=N.kmax[j]&&h[v]<N.min[j])s+=8*(N.min[j]-h[v]);if(h[v]>N.maxrep)s+=8*(h[v]-N.maxrep);}});return s;}
function recuit(niv,rnd,iters){const N=NIVELLS[niv],n=N.R*N.C,pool=[];for(let x=N.lo;x<=N.hi;x++)pool.push(x);
  let T=[];while(T.length<n){const x=pool[Math.floor(rnd()*pool.length)];if(!T.includes(x))T.push(x);}
  let cur=cost(T,niv),best=cur,bestT=T.slice(),temp=3;
  for(let it=0;it<iters;it++){const T2=T.slice(),i=Math.floor(rnd()*n);
    if(rnd()<.4){const j=Math.floor(rnd()*n);[T2[i],T2[j]]=[T2[j],T2[i]];}else{let x;do{x=pool[Math.floor(rnd()*pool.length)];}while(T2.includes(x));T2[i]=x;}
    const c2=cost(T2,niv);if(c2<=cur||rnd()<Math.exp((cur-c2)/temp)){T=T2;cur=c2;if(cur<best){best=cur;bestT=T.slice();}}
    temp=Math.max(.05,temp*0.99995);}
  return bestT;}
/* Genera el full número «num» del nivell. Sempre dona el mateix resultat per al mateix número. */
function genera(niv,num){for(let a=0;a<8;a++){const T=recuit(niv,mulberry32(hashSeed(niv+'-'+num+'-'+a)),60000);if(bo(T,niv))return T;}return null;}
/* Totes les jugades d'un full: posicions × 3 preguntes × (comptar o sumar). 132 amb la plantilla de 3×2 i 72 amb la de 2×2. */
function jugades(T,niv){const out=[];for(const q of posicions(niv))for(const p of PROPS){const ns=q.cells.map(i=>T[i]).filter(p.f);
    out.push({pos:q.nom,text:p.quants,resposta:ns.length,nombres:ns});out.push({pos:q.nom,text:p.suma,resposta:ns.reduce((a,b)=>a+b,0),nombres:ns});}return out;}
/* Guió k d'un full: fins a 40 jugades barrejades, sempre les mateixes per al mateix codi (el codi comença pel nivell). */
function guio(T,codi,k){const J=jugades(T,nivellDe(codi)),rnd=mulberry32(hashSeed('guio-'+codi));
  for(let i=J.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[J[i],J[j]]=[J[j],J[i]];}return J.slice(k*40,k*40+40);}
G.COMPTAR={PROPS,NIVELLS,ORDRE,posicions,nivellDe,histograma,bo,cost,genera,jugades,guio,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
