/* Reixeta · Sanefa trencada — motor (motius, tipus de sanefa, generador i dibuix). Funciona al navegador i a Node. */
(function(G){
'use strict';
/* Motius: polígons en una caixa de 0 a 100 (y cap avall). Cap no té simetria (comprovat a tools/sanefa/check.js). */
const MOTIUS={
  BOT:{nom:'Bota',pts:[[22,6],[55,6],[55,50],[88,62],[95,78],[95,94],[52,94],[52,86],[40,86],[40,94],[22,94]]},
  BAN:{nom:'Bandera',pts:[[12,5],[28,5],[28,9],[94,31],[28,53],[28,95],[12,95]]},
  VEL:{nom:'Veler',pts:[[5,70],[40,70],[40,8],[46,8],[90,62],[46,62],[46,70],[95,70],[80,93],[20,93]]},
  ANE:{nom:'Ànec',pts:[[8,58],[30,50],[46,52],[50,30],[58,16],[74,14],[84,24],[97,30],[84,36],[80,52],[86,70],[72,90],[30,90],[14,78]]}};
const ORDRE=['BOT','BAN','VEL','ANE'];
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
const N=12;                                        // còpies per sanefa
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
function motiuSVG(motiu,o,x,y,m,estil){const u=m*ESC/100,ox=x+m*(1-ESC)/2,oy=y+m*(1-ESC)/2;
  return `<polygon points="${MOTIUS[motiu].pts.map(p=>{const q=gira(p,o);return f2(ox+q[0]*u)+','+f2(oy+q[1]*u);}).join(' ')}" ${estil||`fill="#d9d9d9" stroke="#000" stroke-width="${f2(m*.03)}" stroke-linejoin="round"`}/>`;}
/* Forat de la plantilla: el motiu engrandit des del centre de la caixa perquè hi hagi «joc» mm al voltant. */
function foratPunts(motiu,x,y,m,joc){const k=1+2*joc/(m*ESC),u=m*ESC/100*k,ox=x+m/2-50*u,oy=y+m/2-50*u;return MOTIUS[motiu].pts.map(p=>[f2(ox+p[0]*u),f2(oy+p[1]*u)]);}
G.SANEFA={MOTIUS,ORDRE,TIPUS,N,OSCA,POSNOM,VALIDES,patro,arreglos,genera,motiuSVG,foratPunts,gira,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
