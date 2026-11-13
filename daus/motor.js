/* Reixeta · Daus i successos — motor (successos, forma dels forats de cada fitxa i probabilitats). Funciona al navegador i a Node.
   El full 1 té les 36 tirades de dos daus: la fila és el primer dau i la columna el segon. Cada succés té una fitxa amb forats
   a les tirades on passa. Posar una fitxa sobre una altra és fer la intersecció. */
(function(G){
'use strict';
const N=6;
/* Catàleg de successos: f(i, j) amb i = primer dau i j = segon dau (d'1 a 6). */
const SUCCESSOS={
  A:{text:'El primer dau és parell',f:(i,j)=>i%2===0},
  B:{text:'El segon dau és un 5 o un 6',f:(i,j)=>j>=5},
  C:{text:'La suma és 7',f:(i,j)=>i+j===7},
  D:{text:'Surt un doble',f:(i,j)=>i===j},
  E:{text:'La suma és 10 o més',f:(i,j)=>i+j>=10},
  F:{text:'Surt algun 6',f:(i,j)=>i===6||j===6},
  G:{text:'El primer dau és un 1 o un 2',f:(i,j)=>i<=2},
  H:{text:'La suma és parella',f:(i,j)=>(i+j)%2===0},
  I:{text:'El primer dau és més gran que el segon',f:(i,j)=>i>j}};
const ORDRE=['A','B','C','D','E','F','G','H','I'],PER_DEFECTE=['A','B','C','D','E','F'];
/* Tirades d'un succés com a matriu de 6 × 6 (fila = primer dau − 1, columna = segon dau − 1). */
const caselles=id=>Array.from({length:N},(_,r)=>Array.from({length:N},(_,c)=>!!SUCCESSOS[id].f(r+1,c+1)));
const quantes=M=>M.flat().filter(Boolean).length;
const mcd=(a,b)=>b?mcd(b,a%b):a;
const frac=(a,b)=>{if(!b)return null;const d=mcd(a,b)||1;return [a/d,b/d];};       // fracció irreductible [numerador, denominador]
/* Tot el que es pregunta d'una parella de successos X i Y. */
function parella(x,y){const X=caselles(x),Y=caselles(y),nx=quantes(X),ny=quantes(Y);let nxy=0;for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(X[r][c]&&Y[r][c])nxy++;
  return {x,y,nx,ny,nxy,pxy:frac(nxy,36),pyx:frac(nxy,nx),pxy_y:frac(nxy,ny),independents:nxy*36===nx*ny,incompatibles:nxy===0};}
/* ---------- forma dels forats ----------
   Cada casella del succés és un forat de (cel − 2·inset) mm; dues caselles veïnes de costat s'ajunten en un sol forat (sense barra),
   i quatre en quadrat també n'omplen el centre. Es treballa amb una quadrícula d'11 × 11 trossos: índex parell = casella,
   índex senar = el tros de barra que hi ha entre dues caselles. Torna, en mm des de la cantonada de la graella:
   {trossos, vores: llista de polígons (el contorn de cada forat), talls: nombre de talls rectes, curt: el tall més curt}. */
function forats(M,cel,inset){const K=2*N-1,U=Array.from({length:K},()=>new Array(K).fill(false));
  for(let b=0;b<K;b++)for(let a=0;a<K;a++){const r=b>>1,c=a>>1;
    U[b][a]=b%2===0&&a%2===0?M[r][c]:b%2===0?M[r][c]&&M[r][c+1]:a%2===0?M[r][c]&&M[r+1][c]:M[r][c]&&M[r][c+1]&&M[r+1][c]&&M[r+1][c+1];}
  const P=i=>i%2===0?(i>>1)*cel+inset:(i>>1)*cel+cel-inset,dins=(a,b)=>a>=0&&b>=0&&a<K&&b<K&&U[b][a];
  /* arestes del contorn, orientades amb el forat a la dreta */
  const seg=new Map(),clau=p=>p[0]+','+p[1];
  for(let b=0;b<K;b++)for(let a=0;a<K;a++)if(U[b][a]){const x0=P(a),x1=P(a+1),y0=P(b),y1=P(b+1);
    if(!dins(a,b-1))seg.set(clau([x0,y0]),[x1,y0]);if(!dins(a+1,b))seg.set(clau([x1,y0]),[x1,y1]);if(!dins(a,b+1))seg.set(clau([x1,y1]),[x0,y1]);if(!dins(a-1,b))seg.set(clau([x0,y1]),[x0,y0]);}
  const vores=[];
  while(seg.size){const ini=seg.keys().next().value;let p=ini.split(',').map(Number);const pol=[];
    for(;;){const q=seg.get(clau(p));if(!q)break;seg.delete(clau(p));pol.push(p);p=q;if(clau(p)===ini)break;}
    /* treu els vèrtexs alineats */
    const net=pol.filter((v,i)=>{const u=pol[(i+pol.length-1)%pol.length],w=pol[(i+1)%pol.length];return (v[0]-u[0])*(w[1]-v[1])!==(v[1]-u[1])*(w[0]-v[0]);});vores.push(net);}
  let talls=0,curt=Infinity;for(const pol of vores)pol.forEach((v,i)=>{const w=pol[(i+1)%pol.length];talls++;curt=Math.min(curt,Math.abs(v[0]-w[0])+Math.abs(v[1]-w[1]));});
  /* la cartolina ha de quedar d'una sola peça: tot tros que no és forat ha d'arribar al marc sense passar per cap forat */
  const vist=Array.from({length:K+2},()=>new Array(K+2).fill(false)),cua=[[0,0]];vist[0][0]=true;let lliures=0;
  while(cua.length){const [a,b]=cua.pop();for(const [x,y] of [[a+1,b],[a-1,b],[a,b+1],[a,b-1]])if(x>=0&&y>=0&&x<K+2&&y<K+2&&!vist[y][x]&&!dins(x-1,y-1)){vist[y][x]=true;cua.push([x,y]);}}
  for(let b=0;b<K;b++)for(let a=0;a<K;a++)if(!U[b][a]&&!vist[b+1][a+1])lliures++;
  return {trossos:U,vores,talls,curt:vores.length?curt:0,illes:lliures};}
G.DAUS={N,SUCCESSOS,ORDRE,PER_DEFECTE,caselles,quantes,frac,parella,forats};
})(typeof window!=='undefined'?window:globalThis);
