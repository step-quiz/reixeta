/* Reixeta · Joc de comptar — motor (propietats, posicions, equilibri, generador i guions). Funciona al navegador i a Node. */
(function(G){
'use strict';
const esPrimer=n=>{if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
const esQuadrat=n=>Math.round(Math.sqrt(n))**2===n;
const esTriangular=n=>esQuadrat(8*n+1);
/* Ronda 18 (2026-11-15, el propietari): preguntes de comptar (85 %) i de sumar (15 %). Els múltiples de 5 només es pregunten
   sumant (pes 10 %); les altres sis propietats es pregunten sobretot comptant (pes 15 % cadascuna, de la qual 1/18 sumant).
   Total de sumes: 10 % + 5 % = 15 %. «Divisors de…» depèn del nivell (36 al nivell 1, 60 al nivell 2). */
const PROPS=[
  {id:'p',quants:'Quants primers?',suma:'Suma els primers',f:esPrimer,pes:.15},
  {id:'m',quants:'Quants múltiples de 3?',suma:'Suma els múltiples de 3',f:n=>n%3===0,pes:.15},
  {id:'m4',quants:'Quants múltiples de 4?',suma:'Suma els múltiples de 4',f:n=>n%4===0,pes:.15},
  {id:'q',quants:'Quants quadrats perfectes?',suma:'Suma els quadrats perfectes',f:esQuadrat,pes:.15},
  {id:'t',quants:'Quants nombres triangulars?',suma:'Suma els nombres triangulars',f:esTriangular,pes:.15},
  {id:'d',quants:'Quants divisors de D?',suma:'Suma els divisors de D',div:true,pes:.15},
  {id:'m5',quants:null,suma:'Suma els múltiples de 5',f:n=>n%5===0,pes:.10,nomesSuma:true}];
const P_SUMA=.05/.90;   // probabilitat de «suma» a les propietats que no són els múltiples de 5
/* Les propietats d'un nivell, amb el text i la funció de «divisors de D» ja posats. */
const _props={};
function propsDe(niv){if(_props[niv])return _props[niv];const D=NIVELLS[niv].div;
  return _props[niv]=PROPS.map(p=>p.div?Object.assign({},p,{quants:p.quants.replace('D',D),suma:p.suma.replace('D',D),f:n=>D%n===0}):p);}
/* Les que es compten (les que entren a l'equilibri del full): totes menys els múltiples de 5. */
const comptades=niv=>propsDe(niv).filter(p=>!p.nomesSuma);
/* Nivells. Cada nivell té el seu full (R files × C columnes) i les formes de plantilla que s'hi fan servir.
   min[j] = vegades que, com a mínim, ha de sortir cada resposta 0..kmax[j] de la propietat comptada j (p, m3, m4, q, t, d);
   maxrep = cap resposta en més posicions que això. Ronda 18: nivell 1 de 2 a 36, nivell 2 de 2 a 120.
   CO = full de 6×4 amb la plantilla de 3×2 (horitzontal i vertical, 22 posicions, respostes de 0 a 6).
   CS = versió senzilla: full de 5×4 amb la plantilla de 2×2 del WODB (12 posicions, respostes de 0 a 4). */
const F6={R:4,C:6,formes:[['H',2,3],['V',3,2]],maxrep:6},F5={R:4,C:5,formes:[['',2,2]],maxrep:4};
const NIVELLS={
  CO1:Object.assign({nom:'Nivell 1 · 2 a 36 · plantilla de 3×2',lo:2,hi:36,div:36,min:[1,1,1,1,1,1],kmax:[5,5,3,2,3,3]},F6),
  CO2:Object.assign({nom:'Nivell 2 · 2 a 120 · plantilla de 3×2',lo:2,hi:120,div:60,min:[1,1,1,1,1,1],kmax:[5,4,3,2,3,4]},F6),
  CS1:Object.assign({nom:'Nivell 1 · 2 a 36 · plantilla de 2×2 (senzill)',lo:2,hi:36,div:36,min:[1,1,1,1,1,1],kmax:[3,3,2,2,2,2]},F5),
  CS2:Object.assign({nom:'Nivell 2 · 2 a 120 · plantilla de 2×2 (senzill)',lo:2,hi:120,div:60,min:[1,1,1,1,1,1],kmax:[4,3,2,2,2,3]},F5)};
const ORDRE=['CO1','CO2','CS1','CS2'];
/* Posicions de la plantilla en un nivell. El nom és la casella de dalt a l'esquerra (i l'orientació, si n'hi ha dues). */
const _pos={};
function posicions(niv){if(_pos[niv])return _pos[niv];const N=NIVELLS[niv],out=[];
  for(const [o,h,w] of N.formes)for(let r=0;r+h<=N.R;r++)for(let c=0;c+w<=N.C;c++){const cells=[];
    for(let i=0;i<h;i++)for(let j=0;j<w;j++)cells.push((r+i)*N.C+c+j);out.push({o,r,c,cells,nom:'ABCD'[r]+(c+1)+(o==='H'?' horitzontal':o==='V'?' vertical':'')});}
  return _pos[niv]=out;}
const nivellDe=codi=>String(codi).split('-')[0];
/* Histograma de respostes de cada pregunta: h[j][v] = nombre de posicions on es veuen v nombres amb la propietat j. */
function histograma(T,niv){const n=NIVELLS[niv].formes[0][1]*NIVELLS[niv].formes[0][2];
  return comptades(niv).map(p=>{const h=new Array(n+1).fill(0);for(const q of posicions(niv))h[q.cells.reduce((a,i)=>a+(p.f(T[i])?1:0),0)]++;return h;});}
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
/* Totes les jugades possibles d'un full: posicions × propietats × (comptar o sumar; els múltiples de 5 només sumar). */
function jugada(T,q,p,suma){const ns=q.cells.map(i=>T[i]).filter(p.f);return {pos:q.nom,prop:p.id,suma,text:suma?p.suma:p.quants,resposta:suma?ns.reduce((a,b)=>a+b,0):ns.length,nombres:ns};}
function jugades(T,niv){const out=[];for(const q of posicions(niv))for(const p of propsDe(niv)){if(!p.nomesSuma)out.push(jugada(T,q,p,false));out.push(jugada(T,q,p,true));}return out;}
/* Guions d'un full: el k-èsim té 40 jugades. Cada jugada tria la propietat amb els pesos de PROPS i, si no és la dels múltiples de 5,
   suma amb probabilitat P_SUMA. Les posicions es van fent servir totes abans de repetir-ne cap; cap jugada es repeteix dins d'un
   mateix guió (entre guions sí: són partides diferents). Sempre les mateixes per al mateix codi (el codi comença pel nivell). */
const _guions={};
function guio(T,codi,k){const clau=codi+'|'+T.join();if(!_guions[clau]){const niv=nivellDe(codi),P=propsDe(niv),Q=posicions(niv),rnd=mulberry32(hashSeed('guio-'+codi)),out=[],fet=new Set();
    let cua=[];const pos=()=>{if(!cua.length){cua=Q.slice();for(let i=cua.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[cua[i],cua[j]]=[cua[j],cua[i]];}}return cua.pop();};
    const tot=P.reduce((a,p)=>a+p.pes,0);
    while(out.length<160){if(out.length%40===0)fet.clear();const q=pos();let jg=null;
      for(let a=0;a<50&&!jg;a++){let x=rnd()*tot,p=P[P.length-1];for(const c of P){x-=c.pes;if(x<=0){p=c;break;}}
        const suma=p.nomesSuma||rnd()<P_SUMA,id=q.nom+'|'+p.id+'|'+suma;if(!fet.has(id)){fet.add(id);jg=jugada(T,q,p,suma);}}
      if(jg)out.push(jg);}
    _guions[clau]=out;}
  return _guions[clau].slice(k*40,k*40+40);}
G.COMPTAR={PROPS,P_SUMA,propsDe,comptades,NIVELLS,ORDRE,posicions,nivellDe,histograma,bo,cost,genera,jugades,guio,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
