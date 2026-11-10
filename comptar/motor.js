/* Reixeta · Joc de comptar — motor (propietats, posicions, equilibri, generador i guions). Funciona al navegador i a Node. */
(function(G){
'use strict';
const R=4,C=6;                                   // full 1: 6 columnes × 4 files
const esPrimer=n=>{if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
const esQuadrat=n=>Math.round(Math.sqrt(n))**2===n;
const PROPS=[
  {id:'p',quants:'Quants primers?',suma:'Suma els primers',f:esPrimer},
  {id:'m',quants:'Quants múltiples de 3?',suma:'Suma els múltiples de 3',f:n=>n%3===0},
  {id:'q',quants:'Quants quadrats perfectes?',suma:'Suma els quadrats perfectes',f:esQuadrat}];
/* Nivells. min[j] = vegades que, com a mínim, ha de sortir cada resposta 0..kmax[j] de la pregunta j entre les 22 posicions.
   Al nivell 1 només hi ha sis quadrats perfectes (4…49): no s'exigeix que se'n vegin sis alhora. */
const NIVELLS={
  CO1:{nom:'Nivell 1 · nombres de 2 a 50',lo:2,hi:50,min:[1,1,1],kmax:[6,6,5]},
  CO2:{nom:'Nivell 2 · nombres de 2 a 150',lo:2,hi:150,min:[2,2,2],kmax:[6,6,6]}};
const ORDRE=['CO1','CO2'],MAXREP=6;              // cap resposta en més de MAXREP posicions
/* Posicions de la plantilla de 3×2: horitzontal (3 d'ample) i vertical (2 d'ample). El nom és la casella de dalt a l'esquerra. */
const POS=[];
for(const [o,h,w] of [['H',2,3],['V',3,2]])for(let r=0;r+h<=R;r++)for(let c=0;c+w<=C;c++){const cells=[];
  for(let i=0;i<h;i++)for(let j=0;j<w;j++)cells.push((r+i)*C+c+j);POS.push({o,r,c,cells,nom:'ABCD'[r]+(c+1)+(o==='H'?' horitzontal':' vertical')});}
/* Histograma de respostes de cada pregunta: h[j][v] = nombre de posicions on es veuen v nombres amb la propietat j. */
function histograma(T){return PROPS.map(p=>{const h=new Array(7).fill(0);for(const q of POS)h[q.cells.reduce((a,i)=>a+(p.f(T[i])?1:0),0)]++;return h;});}
/* Un full és bo si té 24 nombres diferents del nivell i cada pregunta té les respostes prou repartides. */
function bo(T,niv){const N=NIVELLS[niv];if(T.length!==R*C||new Set(T).size!==T.length||T.some(x=>x<N.lo||x>N.hi||x!==Math.floor(x)))return false;
  return histograma(T).every((h,j)=>{for(let v=0;v<=N.kmax[j];v++)if(h[v]<N.min[j])return false;return Math.max(...h)<=MAXREP;});}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
/* Cost: desviació de cada histograma respecte del repartiment uniforme, amb penalització per les respostes que falten. */
function cost(T,niv){const N=NIVELLS[niv],ideal=POS.length/7;let s=0;
  histograma(T).forEach((h,j)=>{for(let v=0;v<7;v++){s+=(h[v]-ideal)**2;if(v<=N.kmax[j]&&h[v]<N.min[j])s+=8*(N.min[j]-h[v]);if(h[v]>MAXREP)s+=8*(h[v]-MAXREP);}});return s;}
function recuit(niv,rnd,iters){const N=NIVELLS[niv],n=R*C,pool=[];for(let x=N.lo;x<=N.hi;x++)pool.push(x);
  let T=[];while(T.length<n){const x=pool[Math.floor(rnd()*pool.length)];if(!T.includes(x))T.push(x);}
  let cur=cost(T,niv),best=cur,bestT=T.slice(),temp=3;
  for(let it=0;it<iters;it++){const T2=T.slice(),i=Math.floor(rnd()*n);
    if(rnd()<.4){const j=Math.floor(rnd()*n);[T2[i],T2[j]]=[T2[j],T2[i]];}else{let x;do{x=pool[Math.floor(rnd()*pool.length)];}while(T2.includes(x));T2[i]=x;}
    const c2=cost(T2,niv);if(c2<=cur||rnd()<Math.exp((cur-c2)/temp)){T=T2;cur=c2;if(cur<best){best=cur;bestT=T.slice();}}
    temp=Math.max(.05,temp*0.99995);}
  return bestT;}
/* Genera el full número «num» del nivell. Sempre dona el mateix resultat per al mateix número. */
function genera(niv,num){for(let a=0;a<8;a++){const T=recuit(niv,mulberry32(hashSeed(niv+'-'+num+'-'+a)),60000);if(bo(T,niv))return T;}return null;}
/* Totes les jugades d'un full: 22 posicions × 3 preguntes × (comptar o sumar) = 132. */
function jugades(T){const out=[];for(const q of POS)for(const p of PROPS){const ns=q.cells.map(i=>T[i]).filter(p.f);
    out.push({pos:q.nom,text:p.quants,resposta:ns.length,nombres:ns});out.push({pos:q.nom,text:p.suma,resposta:ns.reduce((a,b)=>a+b,0),nombres:ns});}return out;}
/* Guió k (0, 1 o 2) d'un full: 40 jugades barrejades, sempre les mateixes per al mateix codi. */
function guio(T,codi,k){const J=jugades(T),rnd=mulberry32(hashSeed('guio-'+codi));
  for(let i=J.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[J[i],J[j]]=[J[j],J[i]];}return J.slice(k*40,k*40+40);}
G.COMPTAR={R,C,PROPS,NIVELLS,ORDRE,POS,MAXREP,histograma,bo,cost,genera,jugades,guio,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
