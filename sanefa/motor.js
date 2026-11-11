/* Reixeta · Sanefa trencada — motor (motius, tipus de sanefa, generador i dibuix). Funciona al navegador i a Node. */
(function(G){
'use strict';
/* Motius: polígons de pocs talls rectes i llargs en una caixa de 0 a 100 (y cap avall), amb el dibuix a dins (det: 'l' línia, 'c' cercle).
   Cap no té simetria (comprovat a tools/sanefa/check.js, que també en mesura els talls). vora = es pot fer com una mossegada a la vora
   de la targeta, amb tisores: el costat de baix del motiu queda a la vora i la resta no té cap racó cap endins. */
const MOTIUS={
  VEL:{nom:'Vela',vora:true,pts:[[22,6],[22,94],[88,94]],det:[['l',[[22,40],[47.5,40]]],['l',[[22,67],[67.75,67]]]]},
  FOR:{nom:'Formatge',vora:true,pts:[[8,80],[92,80],[80,22]],det:[['c',[40,68],5],['c',[62,58],4],['c',[74,42],3.5],['c',[24,74],3]]},
  CAS:{nom:'Caseta',vora:true,pts:[[14,92],[86,92],[86,10],[14,62]],det:[['l',[[60,92],[60,60],[76,60],[76,92]]],['l',[[24,70],[38,70],[38,82],[24,82],[24,70]]]]},
  BOT:{nom:'Bota',vora:false,pts:[[24,6],[56,6],[56,58],[92,58],[92,94],[24,94]],det:[['l',[[24,86],[92,86]]],['l',[[24,18],[56,18]]]]}};
const ORDRE=['VEL','FOR','CAS','BOT'];
/* Posicions del motiu: 0 tal com és, 1 mirall vertical, 2 mirall horitzontal, 3 mitja volta. Componen amb XOR.
   Amb la plantilla, cada posició deixa l'osca en una cantonada diferent. */
const OSCA=['↖','↗','↙','↘'],POSNOM=['tal com és','mirall vertical','mirall horitzontal','mitja volta'];
const gira=(p,o)=>[o&1?100-p[0]:p[0],o&2?100-p[1]:p[1]];
/* Els set tipus de sanefa. files = patró periòdic de cada fila. */
const TIPUS=[
  {id:'T',nom:'translació',files:[[0]]},
  {id:'V',nom:'miralls verticals',files:[[0,1]]},
  {id:'L',nom:'reflexió amb lliscament',files:[[0,2]]},
  {id:'R',nom:'mitges voltes',files:[[0,3]]},
  {id:'VR',nom:'miralls verticals i mitges voltes',files:[[0,1,2,3]]},
  {id:'H',nom:'mirall horitzontal',files:[[0],[2]]},
  {id:'VH',nom:'miralls verticals i horitzontal',files:[[0,1],[2,3]]}];
const N=8;                                         // còpies per sanefa (dos períodes sencers de la sanefa de ritme més llarg)
const clau=cel=>cel.map(f=>f.join('')).join('/');
function patro(t,g,s){return t.files.map(f=>Array.from({length:N},(_,i)=>f[(i+s)%f.length]^g));}
/* Totes les sanefes correctes d'una fila i de dues files (qualsevol tipus, posició de sortida i desfasament). */
const VALIDES={1:new Set(),2:new Set()};
for(const t of TIPUS)for(let g=0;g<4;g++)for(let s=0;s<t.files[0].length;s++)VALIDES[t.files.length].add(clau(patro(t,g,s)));
/* Maneres d'arreglar una sanefa canviant una sola còpia: han de ser exactament una. */
function arreglos(cel){const out=[],c=cel.map(f=>f.slice());
  for(let r=0;r<c.length;r++)for(let i=0;i<N;i++){const old=c[r][i];for(let o=0;o<4;o++)if(o!==old){c[r][i]=o;if(VALIDES[c.length].has(clau(c)))out.push({r,i,o});}c[r][i]=old;}
  return out;}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
/* Genera el full «num» d'un motiu: les set sanefes en ordre barrejat, cadascuna amb una còpia errònia
   (mai a les dues primeres columnes) que és l'única manera d'arreglar-la. Mateix número, mateix full. */
function genera(motiu,num){const rnd=mulberry32(hashSeed('SAN-'+motiu+num)),ri=n=>Math.floor(rnd()*n);
  const ord=TIPUS.map((_,i)=>i);for(let i=ord.length-1;i>0;i--){const j=ri(i+1);[ord[i],ord[j]]=[ord[j],ord[i]];}
  return ord.map(k=>{const t=TIPUS[k];
    for(;;){const cel=patro(t,ri(4),ri(t.files[0].length)),r=ri(cel.length),i=2+ri(N-2),era=cel[r][i],es=era^(1+ri(3));cel[r][i]=es;
      const a=arreglos(cel);if(a.length===1&&a[0].r===r&&a[0].i===i&&a[0].o===era)return {tipus:t.id,nom:t.nom,cel,err:{r,i,era,es}};}});}
/* ---------- dibuix ---------- */
const ESC=.86,f2=x=>Math.round(x*100)/100;
function motiuSVG(motiu,o,x,y,m,estil){const u=m*ESC/100,ox=x+m*(1-ESC)/2,oy=y+m*(1-ESC)/2,M=MOTIUS[motiu],t=p=>{const q=gira(p,o);return f2(ox+q[0]*u)+','+f2(oy+q[1]*u);};
  let s=`<polygon points="${M.pts.map(t).join(' ')}" ${estil||`fill="#d9d9d9" stroke="#000" stroke-width="${f2(m*.03)}" stroke-linejoin="round"`}/>`;
  if(!estil)for(const e of M.det||[])s+=e[0]==='l'?`<polyline points="${e[1].map(t).join(' ')}" fill="none" stroke="#000" stroke-width="${f2(m*.02)}" stroke-linejoin="round"/>`
    :`<circle cx="${t(e[1]).split(',')[0]}" cy="${t(e[1]).split(',')[1]}" r="${f2(e[2]*u)}" fill="#fff" stroke="#000" stroke-width="${f2(m*.018)}"/>`;
  return s;}
/* Forat de la plantilla: el motiu engrandit des del centre de la caixa perquè hi hagi «joc» mm al voltant. */
function foratPunts(motiu,x,y,m,joc){const k=1+2*joc/(m*ESC),u=m*ESC/100*k,ox=x+m/2-50*u,oy=y+m/2-50*u;return MOTIUS[motiu].pts.map(p=>[f2(ox+p[0]*u),f2(oy+p[1]*u)]);}
/* Targeta (full 2) per a la còpia que té la caixa a (x,y), en la posició «tal com és». q = {m, marc, joc, osca, alt}.
   model 'vora': targeta de (m + 2·marc) × alt posada per sobre de la còpia; el motiu és una mossegada a la vora de baix (tisores).
   model 'forat': targeta quadrada de m + 2·marc amb el motiu foradat a dins (cúter o làser).
   Les dues tenen la cantonada de dalt a l'esquerra tallada (osca). Torna {out, forats, talls}: talls = els segments que cal tallar del motiu. */
function targeta(motiu,model,x,y,q){const h=foratPunts(motiu,x,y,q.m,q.joc),n=h.length,a=x-q.marc,b=x+q.m+q.marc,seg=(P,tancat)=>P.slice(0,tancat?P.length:P.length-1).map((p,i)=>[p,P[(i+1)%P.length]]);
  if(model==='vora'&&MOTIUS[motiu].vora){const yb=Math.max(...h.map(p=>p[1])),top=f2(yb-q.alt);let i=0;while(!(h[i][1]===yb&&h[(i+1)%n][1]===yb))i++;
    const P=[];for(let k=1;k<=n;k++)P.push(h[(i+k)%n]);if(P[0][0]<P[n-1][0])P.reverse();        // contorn sense la base, de l'extrem dret de la base a l'esquerre
    return {model:'vora',out:[[a+q.osca,top],[b,top],[b,yb],...P,[a,yb],[a,f2(top+q.osca)]],forats:[],talls:seg(P,false),caixa:[a,top,b,yb]};}
  const c=y-q.marc,d=y+q.m+q.marc;return {model:'forat',out:[[a+q.osca,c],[b,c],[b,d],[a,d],[a,c+q.osca]],forats:[h],talls:seg(h,true),caixa:[a,c,b,d]};}
G.SANEFA={MOTIUS,ORDRE,TIPUS,N,OSCA,POSNOM,VALIDES,patro,arreglos,genera,motiuSVG,foratPunts,targeta,gira,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
