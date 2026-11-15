/* Reixeta · Full de joc i plantilla plegable, comuns a tots els jocs on una plantilla es mou sobre un full (ronda 16, 2026-11-15).
   - guies(): les lletres i els números de les files i les columnes, als quatre costats de la graella i més lluny que el marc de la
     plantilla (GUIA = marc + 5 mm), perquè la plantilla no les tapi mai, sigui on sigui.
   - cos(): la plantilla. Al model d'un sol forat, marques de plec discontínues a la meitat de cada costat (travessen el marc i fan
     de guia: no hi ha marques curtes); al de barres, marques guia a les línies de la graella; una estrella a la cantonada de dalt a l'esquerra i una fletxa que va cap a la cantonada de la
     finestra més propera, sense arribar-hi (3 mm abans).
   - pagina(): una sola plantilla per full A4 vertical, a dalt, i a sota les instruccions de plegar (comu/plec.js) en gran.
   Tot en mm. Funciona al navegador i a Node. */
(function(G){
'use strict';
/* Mides del WODB, el joc de comptar i el sonar (comparteixen plantilla). Casella i marc triats pel propietari a la ronda 16. */
const MIDES={CEL:30,MARGE:1.5,MARC:24,BARRA:6,ESTRELLA:4.9};   // ronda 16 (2a prova en paper): casella 30
MIDES.FORAT=MIDES.CEL-2*MIDES.MARGE;MIDES.ITEM=21;
/* Ronda 16 (3a prova en paper): la finestra del model d'un sol forat és un 5 % més gran (a cada costat), i el marc perd aquest gruix. */
const AMPLIA=1.05;
const n2=x=>(+x).toFixed(2),AR='font-family="Arial,Helvetica,sans-serif"';
function estrella(cx,cy,r){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.42:r;p.push(n2(cx+rr*Math.cos(a))+','+n2(cy+rr*Math.sin(a)));}return p.join(' ');}
const GUIA=m=>m.MARC+5;
/* Guies als quatre costats. lletres = 'ABCD…' (o una funció r -> text). */
function guies(x0,y0,R,C,m,lletres){const cel=m.CEL,d=GUIA(m),w=C*cel,h=R*cel,L=typeof lletres==='function'?lletres:(r=>(lletres||'ABCDEFGHIJ')[r]);let o='';
  const T=(x,y,t)=>`<text x="${n2(x)}" y="${n2(y+2.5)}" font-size="7" text-anchor="middle" ${AR}>${t}</text>`;
  for(let r=0;r<R;r++){const y=y0+r*cel+cel/2;o+=T(x0-d,y,L(r))+T(x0+w+d,y,L(r));}
  for(let c=0;c<C;c++){const x=x0+c*cel+cel/2;o+=T(x,y0-d,c+1)+T(x,y0+h+d,c+1);}
  return o;}
/* La plantilla amb la cantonada de dalt a l'esquerra a (ox, oy): nc columnes × nr files de finestra.
   op: {laser, model:'un'|'barres', estrella (per defecte sí), m (mides)} */
function cos(ox,oy,nc,nr,op){op=op||{};const m=op.m||MIDES,cel=m.CEL,M=m.MARC,W=nc*cel+2*M,H=nr*cel+2*M,laser=!!op.laser,barres=op.model==='barres';
  const cut=laser?'stroke="#FF0000" stroke-width="0.01" fill="none"':'stroke="#000" stroke-width=".3"';let holes='';const forats=[];
  if(barres){const f=cel-m.BARRA,b=m.BARRA/2;for(let i=0;i<nr;i++)for(let j=0;j<nc;j++){const x=ox+M+j*cel+b,y=oy+M+i*cel+b;holes+=` M${n2(x)},${n2(y)} h${n2(f)} v${n2(f)} h${n2(-f)} Z`;forats.push([x,y]);}}
  else{const fw=(nc*cel-2*m.MARGE)*AMPLIA,fh=(nr*cel-2*m.MARGE)*AMPLIA,x=ox+W/2-fw/2,y=oy+H/2-fh/2;holes=` M${n2(x)},${n2(y)} h${n2(fw)} v${n2(fh)} h${n2(-fw)} Z`;forats.push([x,y]);}
  let o=`<path d="M${n2(ox)},${n2(oy)} h${n2(W)} v${n2(H)} h${n2(-W)} Z${holes}" ${laser?'':'fill="#d4d4d4" fill-rule="evenodd"'} ${cut}/>`;
  const g=laser?'stroke="#0000FF" stroke-width="0.01"':'stroke="#000" stroke-width=".5"',L=6,plecs=!barres&&!laser;
  const dash='stroke="#000" stroke-width=".4" stroke-dasharray="1.8 1.3"',[fx,fy]=forats[0],fx2=ox+W-(fx-ox),fy2=oy+H-(fy-oy);
  const tick=(x1,y1,x2,y2)=>`<line x1="${n2(x1)}" y1="${n2(y1)}" x2="${n2(x2)}" y2="${n2(y2)}" ${g}/>`;
  if(barres){for(let k=0;k<=nc;k++){const x=ox+M+k*cel;o+=tick(x,oy,x,oy+L)+tick(x,oy+H-L,x,oy+H);}       // marques guia (només al model de barres): continuen les línies de la graella
    for(let k=0;k<=nr;k++){const y=oy+M+k*cel;o+=tick(ox,y,ox+L,y)+tick(ox+W-L,y,ox+W,y);}}
  else if(laser){const cx=ox+W/2,cy=oy+H/2;o+=tick(cx,oy,cx,oy+L)+tick(cx,oy+H-L,cx,oy+H)+tick(ox,cy,ox+L,cy)+tick(ox+W-L,cy,ox+W,cy);}   // làser: marques a la meitat de cada costat
  /* Model d'un sol forat: sense marques guia (ronda 16, el propietari): les línies discontínues de plegar ja fan de guia. */
  if(plecs){const cx=ox+W/2,cy=oy+H/2,ln=(a,b,c,d)=>`<line x1="${n2(a)}" y1="${n2(b)}" x2="${n2(c)}" y2="${n2(d)}" ${dash}/>`;   // marques de plec: la meitat de cada costat
    o+=ln(cx,oy,cx,fy)+ln(cx,fy2,cx,oy+H)+ln(ox,cy,fx,cy)+ln(fx2,cy,ox+W,cy);}
  if(op.estrella!==false){const sx=ox+M/2,sy=oy+M/2,r=m.ESTRELLA,fill=laser?'fill="#000"':'fill="#000"';
    o+=`<polygon points="${estrella(sx,sy,r)}" ${fill}/>`;
    const [hx,hy]=forats.reduce((a,b)=>Math.hypot(b[0]-sx,b[1]-sy)<Math.hypot(a[0]-sx,a[1]-sy)?b:a);   // cantonada de forat més propera
    const dx=hx-sx,dy=hy-sy,D=Math.hypot(dx,dy),ux=dx/D,uy=dy/D,a0=r+1.8,a1=D-3;                       // la fletxa comença 1,8 mm fora de l'estrella i s'atura 3 mm abans del vèrtex
    if(a1-a0>3){const bx=sx+ux*a1,by=sy+uy*a1,cl=2.4,cw=1.1,px=sx+ux*(a1-cl),py=sy+uy*(a1-cl);
      o+=`<line x1="${n2(sx+ux*a0)}" y1="${n2(sy+uy*a0)}" x2="${n2(px)}" y2="${n2(py)}" stroke="#000" stroke-width=".5"/>`
        +`<path d="M${n2(bx)},${n2(by)} L${n2(px-uy*cw)},${n2(py+ux*cw)} L${n2(px+uy*cw)},${n2(py-ux*cw)} Z" fill="#000"/>`;}}
  return o;}
const mida=(nc,nr,m)=>{m=m||MIDES;return [nc*m.CEL+2*m.MARC,nr*m.CEL+2*m.MARC];};
/* Pàgina A4 vertical amb una sola plantilla (a dalt, centrada) i, al model d'un sol forat, les instruccions de plegar a sota. */
function pagina(nc,nr,op){op=op||{};const m=op.m||MIDES,[W,H]=mida(nc,nr,m),x=(210-W)/2,y=14;
  let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`+(op.cap||'')+cos(x,y,nc,nr,Object.assign({},op,{m}));const yi=y+H+26;   // instruccions més avall (ronda 16)
  if(op.model!=='barres'&&G.PLEC){const f=m.MARGE;
    o+=G.PLEC.instruccions({mode:'graella',x:14,y:yi,w:182,h:297-yi-12,
      g:{W,H,Wh:(nc*m.CEL-2*f)*AMPLIA,Hh:(nr*m.CEL-2*f)*AMPLIA,estrella:op.estrella===false?null:{x:m.MARC/2,y:m.MARC/2,r:m.ESTRELLA},cols:nc,files:nr}});}
  return o+(op.peu||'')+'</svg>';}
function laser(nc,nr,op){op=op||{};const m=op.m||MIDES,[W,H]=mida(nc,nr,m);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">${cos(0,0,nc,nr,Object.assign({},op,{laser:true,m}))}</svg>`;}
G.PLANTILLA={MIDES,AMPLIA,GUIA,guies,cos,pagina,laser,mida,estrella};
})(typeof window!=='undefined'?window:globalThis);
