/* Reixeta · Plegar i un sol tall — instruccions dibuixades per fer la finestra d'una plantilla sense clavar les tisores al paper.
   Val per a qualsevol plantilla rectangular amb una sola finestra centrada i el marc de la mateixa amplada als quatre costats:
   plec 1 i plec 2 per la meitat, plec 3 per la bisectriu de la cantonada exterior, i un tall recte seguint la línia de la finestra.
   Funciona al navegador i a Node (tools/plec/check.js en comprova la geometria). Tot en mm. */
(function(G){
'use strict';
/* Simulació. Cada punt de la plantilla es porta al paquet plegat i el tall és una recta sencera (tot el que queda a un costat, cau).
   Torna quants punts de mostra queden mal classificats respecte de «és dins de la finestra» (ha de ser 0). */
function comprova(W,H,Wh,Hh,pas){pas=pas||.25;const d=W/2-H/2;let mal=0,n=0;
  for(let x=pas/2;x<W;x+=pas)for(let y=pas/2;y<H;y+=pas){
    let u=Math.abs(x-W/2),v=Math.abs(y-H/2);                 // plecs 1 i 2: distàncies al centre
    if(v<u-d){const t=u;u=v+d;v=t-d;}                        // plec 3: simetria respecte de la bisectriu de la cantonada exterior
    const cau=v<Hh/2,dins=Math.abs(x-W/2)<Wh/2&&Math.abs(y-H/2)<Hh/2;n++;if(cau!==dins)mal++;}
  return {mal,n,capes:8,tall:Wh/2};}
/* La recepta només serveix si la plantilla és apaïsada o quadrada i el marc és igual pertot. */
const serveix=(W,H,Wh,Hh)=>W>=H&&Wh>0&&Hh>0&&Math.abs((W-Wh)-(H-Hh))<1e-9;

const TITOL='La finestra, amb 3 plecs i 1 tall',
  INTRO='Retalla primer el contorn. Plega sempre cap enrere, amb el dibuix a fora. Fes-ho abans de plastificar.',
  PASSOS=['Plega per la meitat.','Torna a plegar per la meitat.','Plega la cantonada de fora en diagonal: una vora exterior sobre l\'altra.','Un sol tall recte, per la línia de la finestra.','Desplega.'];
const GRIS='#d4d4d4',n2=x=>(+x).toFixed(2);
/* Parteix un text en línies d'una amplada donada (amplada mitjana d'un caràcter d'Arial ≈ 0,5 × cos; 0,56 en negreta). */
function trenca(t,ample,cos,negreta){const max=Math.max(6,Math.floor(ample/(cos*(negreta?.57:.51)))),out=[];let l='';
  for(const w of t.split(' ')){if(l&&(l+' '+w).length>max){out.push(l);l=w;}else l=l?l+' '+w:w;}if(l)out.push(l);return out;}
const text=(x,y,linies,cos,negreta)=>linies.map((l,i)=>`<text x="${n2(x)}" y="${n2(y+cos*.8+i*cos*1.25)}" font-size="${cos}" font-family="Arial,Helvetica,sans-serif"${negreta?' font-weight="700"':''}>${l.replace(/&/g,'&amp;')}</text>`).join('');
const alt=(linies,cos)=>linies.length*cos*1.25;
let _id=0;
/* Dibuix del pas k (1…5) amb la cantonada de dalt a l'esquerra a (ox,oy) i escala s. g = {W,H,Wh,Hh,estrella:{x,y,r}|null,cols,files}. */
function pas(k,ox,oy,s,g){const {W,H,Wh,Hh}=g,f=(W-Wh)/2,cx=W/2,cy=H/2,e=Math.min(cx,cy),quad=cx>cy;
  const X=x=>n2(ox+x*s),Y=y=>n2(oy+y*s),pts=p=>p.map(q=>X(q[0])+','+Y(q[1])).join(' ');
  const pol=(p,fill,extra)=>`<polygon points="${pts(p)}" fill="${fill}" stroke="#000" stroke-width=".25" stroke-linejoin="round" ${extra||''}/>`;
  const lin=(a,b,w,dash)=>`<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" stroke="#000" stroke-width="${w}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
  const plec=(a,b)=>lin(a,b,.3,'1.6 1.1'),doblat=(a,b)=>lin(a,b,.9),m=(g.ext||2)/s;   // m: el que sobresurten les línies de plec (2 mm de paper), en unitats de plantilla
  const est=clip=>{if(!g.estrella)return '';const p=[],E=g.estrella;for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?E.r*.42:E.r;p.push([E.x+r*Math.cos(a),E.y+r*Math.sin(a)]);}
    return `<polygon points="${pts(p)}" fill="#000"${clip?` clip-path="url(#${clip})"`:''}/>`;};
  if(k===1)return pol([[0,0],[W,0],[W,H],[0,H]],GRIS)+pol([[f,f],[W-f,f],[W-f,H-f],[f,H-f]],'#fff')+est()+plec([cx,-m],[cx,H+m]);
  if(k===2)return pol([[0,0],[cx,0],[cx,H],[0,H]],GRIS)+pol([[f,f],[cx,f],[cx,H-f],[f,H-f]],'#fff')+est()+doblat([cx,0],[cx,H])+plec([-m,cy],[cx+m,cy]);
  if(k===3)return pol([[0,0],[cx,0],[cx,cy],[0,cy]],GRIS)+pol([[f,f],[cx,f],[cx,cy],[f,cy]],'#fff')+est()+doblat([cx,0],[cx,cy])+doblat([0,cy],[cx,cy])+plec([-m*.7,-m*.7],[e+m*.7,e+m*.7]);
  if(k===4){const paq=quad?[[0,0],[cx,0],[cx,cy],[e,e]]:[[0,0],[cx,0],[cx,cy]],cau=quad?[[f,f],[cx,f],[cx,cy],[e,e]]:[[f,f],[cx,f],[cx,cy]],id='plec'+(++_id);
    const tx=ox+f*s-3.2,ty=oy+f*s;                                              // tisores: al començament del tall
    const tis=`<g fill="none" stroke="#000" stroke-width=".3" stroke-linecap="round"><circle cx="${n2(tx-3.5)}" cy="${n2(ty-1.6)}" r="1.2"/><circle cx="${n2(tx-3.5)}" cy="${n2(ty+1.6)}" r="1.2"/><path d="M${n2(tx-2.5)},${n2(ty-1)} L${n2(tx+1.7)},${n2(ty+.75)} M${n2(tx-2.5)},${n2(ty+1)} L${n2(tx+1.7)},${n2(ty-.75)}"/></g>`;
    return `<clipPath id="${id}"><polygon points="${pts(paq)}"/></clipPath>`+pol(paq,GRIS)+pol(cau,'#fff','stroke-dasharray=".8 .8"')+est(id)+doblat([cx,0],[cx,cy])+doblat([0,0],[e,e])+(quad?doblat([e,e],[cx,cy]):'')
      +lin([f-1.2/s,f],[cx+m,f],.7,'2.2 1.2')+tis;}
  /* 5: la plantilla acabada, amb les marques dels plecs i les línies de la graella que es veuen pel forat */
  let o=`<path d="M${X(0)},${Y(0)} L${X(W)},${Y(0)} L${X(W)},${Y(H)} L${X(0)},${Y(H)} Z M${X(f)},${Y(f)} L${X(W-f)},${Y(f)} L${X(W-f)},${Y(H-f)} L${X(f)},${Y(H-f)} Z" fill="${GRIS}" fill-rule="evenodd" stroke="#000" stroke-width=".25"/>`+est();
  for(const [a,b] of [[[cx,0],[cx,f]],[[cx,H-f],[cx,H]],[[0,cy],[f,cy]],[[W-f,cy],[W,cy]],[[0,0],[f,f]],[[W,0],[W-f,f]],[[0,H],[f,H-f]],[[W,H],[W-f,H-f]]])o+=lin(a,b,.2,'.7 .7');
  for(let i=1;i<(g.cols||2);i++){const x=f+i*Wh/(g.cols||2);o+=lin([x,f],[x,H-f],.15);}
  for(let i=1;i<(g.files||2);i++){const y=f+i*Hh/(g.files||2);o+=lin([f,y],[W-f,y],.15);}
  return o;}
/* Mida (en unitats de plantilla) del dibuix de cada pas. */
const midaPas=(k,g)=>k===1||k===5?[g.W,g.H]:k===2?[g.W/2,g.H]:[g.W/2,g.H/2];
/* Instruccions dins de la caixa (x,y,w,h) de la pàgina; res no en surt (ho comprova tools/plec/prova.js).
   mode 'columna': dibuixos un sota l'altre amb el text a sota (caixes amples).
   mode 'tira': caixa estreta i alta; es dibuixa girada 90° (es llegeix de baix a dalt), amb el text al costat de cada dibuix. */
function instruccions(o){const g=o.g;if(!serveix(g.W,g.H,g.Wh,g.Hh))return '';
  const obre=`<g class="plec" data-caixa="${[o.x,o.y,o.w,o.h].map(n2).join(' ')}" data-g="${[g.W,g.H,g.Wh,g.Hh].join(' ')}">`;   // caixa i mides: les llegeix la prova de navegador
  if(o.mode==='tira'){const L=o.h,t=o.w,cos=2.6,ct=3.1,sep=4.5,buit=3,ext=1.2,gg=Object.assign({},g,{ext}),s=Math.min((t-2*ext)/g.H,.5),figs=[1,2,3,4,5].map(k=>midaPas(k,g)[0]*s),at=Math.max(34,L*.125);
    /* amplada de cada text: la que demana la paraula més llarga, i el que sobra es reparteix segons la llargada del text */
    const lliure=L-at-sep-figs.reduce((a,b)=>a+b,0)-5*buit-4*sep,base=PASSOS.map(p=>ct*.9+Math.max(...p.split(' ').map(w=>w.length))*cos*.58);
    const sobra=Math.max(0,lliure-base.reduce((a,b)=>a+b,0)),lletres=PASSOS.reduce((a,p)=>a+p.length,0),T=trenca(TITOL,at,ct,true),y0=(t-g.H*s)/2;
    let h=`${obre}<g transform="translate(${n2(o.x)},${n2(o.y+o.h)}) rotate(-90)">`+text(0,y0,T,ct,true)+text(0,y0+alt(T,ct)+1.5,trenca(INTRO,at,cos*.9),cos*.9),x=at+sep;
    for(let k=1;k<=5;k++){const hk=midaPas(k,g)[1],cw=base[k-1]+sobra*PASSOS[k-1].length/lletres;h+=pas(k,x,(t-hk*s)/2,s,gg);x+=figs[k-1]+buit;
      h+=text(x,y0,[String(k)],ct,true)+text(x+ct*.9,y0+.25,trenca(PASSOS[k-1],cw-ct*.9,cos),cos);x+=cw+sep;}
    return h+'</g></g>';}
  const cos=Math.min(3.1,Math.max(2.5,o.w/18)),ct=cos*1.18,ind=2.2,dalt=.6,T=trenca(TITOL,o.w,ct,true),I=trenca(INTRO,o.w,cos*.92),C=PASSOS.map(p=>trenca(p,o.w-ct*1.1,cos));
  const cap=dalt+alt(T,ct)+1.5+alt(I,cos*.92)+4,fix=cap+C.reduce((a,c)=>a+alt(c,cos)+2.8,0)+4*4.5;          // tot el que no són dibuixos
  const unitats=[1,2,3,4,5].reduce((a,k)=>a+midaPas(k,g)[1],0),s=Math.min((o.w-ind)/g.W,(o.h-fix)/unitats,o.smax||.5);
  let h=obre+text(o.x,o.y+dalt,T,ct,true)+text(o.x,o.y+dalt+alt(T,ct)+1.5,I,cos*.92),y=o.y+cap;
  for(let k=1;k<=5;k++){const hk=midaPas(k,g)[1];h+=pas(k,o.x+ind,y,s,g);y+=hk*s+2.8;h+=text(o.x,y,[String(k)],ct,true)+text(o.x+ct*1.1,y+.25,C[k-1],cos);y+=alt(C[k-1],cos)+4.5;}
  return h+'</g>';}
G.PLEC={comprova,serveix,instruccions,pas,PASSOS,TITOL,INTRO};
})(typeof window!=='undefined'?window:globalThis);
