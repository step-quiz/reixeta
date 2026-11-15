/* Reixeta · Dos plecs i dos talls — instruccions dibuixades per fer la finestra d'una plantilla sense clavar les tisores al paper.
   Ronda 16 (el propietari, després de provar-ho amb paper de 80 g/m²): plec 1 i plec 2 per la meitat i, amb el paper plegat en
   quatre, dos talls rectes per les dues línies de la finestra; el quart de finestra cau sol. Abans eren tres plecs (el tercer per la
   bisectriu) i un tall: vuit gruixos de paper i més errors de plec. Ara són quatre gruixos.
   Val per a qualsevol plantilla rectangular amb una sola finestra rectangular centrada (el marc no cal que sigui igual pertot).
   Si la finestra no és al centre (g.fx, g.fy = la seva cantonada de dalt a l'esquerra) la recepta és la mateixa amb els plecs
   pels eixos de la finestra: llavors cal imprimir les línies de plec a la plantilla (marques).
   Funciona al navegador i a Node (tools/plec/check.js en comprova la geometria). Tot en mm. */
(function(G){
'use strict';
/* Simulació. Cada punt de la plantilla es porta al paquet plegat i el tall és una recta sencera (tot el que queda a un costat, cau).
   Torna quants punts de mostra queden mal classificats respecte de «és dins de la finestra» (ha de ser 0). */
function comprova(W,H,Wh,Hh,pas){pas=pas||.25;let mal=0,n=0;
  for(let x=pas/2;x<W;x+=pas)for(let y=pas/2;y<H;y+=pas){
    const u=Math.abs(x-W/2),v=Math.abs(y-H/2);               // plecs 1 i 2: distàncies als dos plecs
    const cau=u<Wh/2&&v<Hh/2,dins=Math.abs(x-W/2)<Wh/2&&Math.abs(y-H/2)<Hh/2;n++;if(cau!==dins)mal++;}   // talls: u = Wh/2 (fins a v = Hh/2) i v = Hh/2 (fins a u = Wh/2)
  return {mal,n,capes:4};}
/* El mateix amb la finestra a qualsevol lloc: (fx, fy) és la cantonada de dalt a l'esquerra de la finestra. */
function comprovaLliure(W,H,Wh,Hh,fx,fy,pas){pas=pas||.25;const hx=fx+Wh/2,hy=fy+Hh/2,a=Wh/2,b=Hh/2;let mal=0,n=0;
  for(let x=pas/2;x<W;x+=pas)for(let y=pas/2;y<H;y+=pas){
    const u=Math.abs(x-hx),v=Math.abs(y-hy);                 // plecs 1 i 2: pels eixos de la finestra
    const cau=u<a&&v<b,dins=x>fx&&x<fx+Wh&&y>fy&&y<fy+Hh;n++;if(cau!==dins)mal++;}   // els dos talls
  return {mal,n,capes:4};}
const serveixLliure=(W,H,Wh,Hh,fx,fy)=>Wh>0&&Hh>0&&fx>0&&fy>0&&fx+Wh<W&&fy+Hh<H;
/* La recepta serveix per a qualsevol plantilla amb la finestra centrada i més petita que la plantilla. */
const serveix=(W,H,Wh,Hh)=>Wh>0&&Hh>0&&Wh<W&&Hh<H;

const TITOL='Com retallar el quadrat interior amb dos plecs i dos talls',   // ronda 16; amb un forat rectangular, «rectangle» (titolDe)
      titolDe=g=>Math.abs(g.Wh-g.Hh)<1e-6?TITOL:TITOL.replace('el quadrat','el rectangle'),
  INTRO_C='Retalla primer el contorn. Plega sempre cap enrere, amb el dibuix a fora. Fes-ho abans de plastificar.',
  PASSOS_C=['Plega per la meitat.','Torna a plegar per la meitat.','Fes dos talls rectes, per les dues línies de la finestra.','Desplega.'];
const INTRO_L='Retalla primer el contorn. Plega per les línies de punts, sempre cap enrere, amb el dibuix a fora. Fes-ho abans de plastificar.',
  PASSOS_L=['Plega per una de les dues línies de punts.','Plega per l\'altra línia de punts.','Fes dos talls rectes, per les dues línies de la finestra.','Desplega.'];
const GRIS='#d4d4d4',n2=x=>(+x).toFixed(2);
/* Parteix un text en línies d'una amplada donada (amplada mitjana d'un caràcter d'Arial ≈ 0,5 × cos; 0,56 en negreta). */
function trenca(t,ample,cos,negreta){const max=Math.max(6,Math.floor(ample/(cos*(negreta?.57:.51)))),out=[];let l='';
  for(const w of t.split(' ')){if(l&&(l+' '+w).length>max){out.push(l);l=w;}else l=l?l+' '+w:w;}if(l)out.push(l);return out;}
const text=(x,y,linies,cos,negreta)=>linies.map((l,i)=>`<text x="${n2(x)}" y="${n2(y+cos*.8+i*cos*1.25)}" font-size="${cos}" font-family="Arial,Helvetica,sans-serif"${negreta?' font-weight="700"':''}>${l.replace(/&/g,'&amp;')}</text>`).join('');
const alt=(linies,cos)=>linies.length*cos*1.25;
let _id=0;
/* Dibuix del pas k (1…5) amb la cantonada de dalt a l'esquerra a (ox,oy) i escala s. g = {W,H,Wh,Hh,estrella:{x,y,r}|null,cols,files}. */
function pasCentrat(k,ox,oy,s,g){const {W,H,Wh,Hh}=g,f=(W-Wh)/2,cx=W/2,cy=H/2,e=Math.min(cx,cy),quad=cx>cy;
  const X=x=>n2(ox+x*s),Y=y=>n2(oy+y*s),pts=p=>p.map(q=>X(q[0])+','+Y(q[1])).join(' ');
  const pol=(p,fill,extra)=>`<polygon points="${pts(p)}" fill="${fill}" stroke="#000" stroke-width=".25" stroke-linejoin="round" ${extra||''}/>`;
  const lin=(a,b,w,dash)=>`<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" stroke="#000" stroke-width="${w}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
  const plec=(a,b)=>lin(a,b,.3,'1.6 1.1'),doblat=(a,b)=>lin(a,b,.9),m=(g.ext||2)/s;   // m: el que sobresurten les línies de plec (2 mm de paper), en unitats de plantilla
  const est=clip=>{if(!g.estrella)return '';const p=[],E=g.estrella;for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?E.r*.42:E.r;p.push([E.x+r*Math.cos(a),E.y+r*Math.sin(a)]);}
    return `<polygon points="${pts(p)}" fill="#000"${clip?` clip-path="url(#${clip})"`:''}/>`;};
  const fv=(H-Hh)/2;   // marc de dalt i de baix (pot ser diferent del dels costats)
  if(k===1)return pol([[0,0],[W,0],[W,H],[0,H]],GRIS)+pol([[f,fv],[W-f,fv],[W-f,H-fv],[f,H-fv]],'#fff')+est()+plec([cx,-m],[cx,H+m]);
  if(k===2)return pol([[0,0],[cx,0],[cx,H],[0,H]],GRIS)+pol([[f,fv],[cx,fv],[cx,H-fv],[f,H-fv]],'#fff')+est()+doblat([cx,0],[cx,H])+plec([-m,cy],[cx+m,cy]);
  if(k===3)return talls(pol,lin,doblat,X,Y,s,m,0,0,cx,cy,f,fv,cx,cy,est());
  /* 4: la plantilla acabada, amb les marques dels plecs i les línies de la graella que es veuen pel forat */
  let o=`<path d="M${X(0)},${Y(0)} L${X(W)},${Y(0)} L${X(W)},${Y(H)} L${X(0)},${Y(H)} Z M${X(f)},${Y(fv)} L${X(W-f)},${Y(fv)} L${X(W-f)},${Y(H-fv)} L${X(f)},${Y(H-fv)} Z" fill="${GRIS}" fill-rule="evenodd" stroke="#000" stroke-width=".25"/>`+est();
  for(const [a,b] of [[[cx,0],[cx,fv]],[[cx,H-fv],[cx,H]],[[0,cy],[f,cy]],[[W-f,cy],[W,cy]]])o+=lin(a,b,.2,'.7 .7');
  for(let i=1;i<(g.cols||2);i++){const x=f+i*Wh/(g.cols||2);o+=lin([x,f],[x,H-f],.15);}
  for(let i=1;i<(g.files||2);i++){const y=fv+i*Hh/(g.files||2);o+=lin([f,y],[W-f,y],.15);}
  return o;}
/* Pas 3 (les dues receptes): el paquet plegat en quatre (rectangle x0..x1 × y0..y1), amb els plecs a x = px i y = py; el quart de
   finestra va de la cantonada (qx, qy) fins als plecs; dos talls (línies gruixudes discontínues) des dels plecs fins a (qx, qy). */
function talls(pol,lin,doblat,X,Y,s,m,x0,y0,x1,y1,qx,qy,px,py,est){
  const sx=px>qx?1:-1,sy=py>qy?1:-1,ex=1.2/s;
  const tis=(x,y,rot)=>`<g transform="translate(${X(x)},${Y(y)}) rotate(${rot})" fill="none" stroke="#000" stroke-width=".3" stroke-linecap="round"><circle cx="-6.7" cy="-1.6" r="1.2"/><circle cx="-6.7" cy="1.6" r="1.2"/><path d="M-5.7,-1 L-1.5,.75 M-5.7,1 L-1.5,-.75"/></g>`;
  return pol([[x0,y0],[x1,y0],[x1,y1],[x0,y1]],GRIS)+pol([[qx,qy],[px,qy],[px,py],[qx,py]],'#fff','stroke-dasharray=".8 .8"')+est
    +doblat([px,Math.min(y0,y1)],[px,Math.max(y0,y1)])+doblat([Math.min(x0,x1),py],[Math.max(x0,x1),py])
    +lin([px+sx*m,qy],[qx-sx*ex,qy],.7,'2.2 1.2')+lin([qx,py+sy*m],[qx,qy-sy*ex],.7,'2.2 1.2')
    +tis(px+sx*m,qy,sx>0?180:0);}   // unes tisores al començament del primer tall (les del segon sortirien de la caixa, a sota)
/* ---------- finestra que no és al centre ---------- */
/* Geometria dels plecs: hx, hy = eixos de la finestra; sx, sy = cap a quin costat queda el tros gran (el que es veu després de
   plegar); coordenades locals (u, v) = distàncies als dos plecs, amb el tall sempre a v = b. P porta de locals a la plantilla. */
function geoLliure(g){const {W,H,Wh,Hh,fx,fy}=g,hx=fx+Wh/2,hy=fy+Hh/2,sx=hx>=W-hx?-1:1,sy=hy>=H-hy?-1:1,Up=Math.max(hx,W-hx),Vp=Math.max(hy,H-hy);
  const retalla=(pol,f)=>{const out=[];pol.forEach((p,i)=>{const q=pol[(i+1)%pol.length],fp=f(p),fq=f(q);if(fp>=0)out.push(p);if((fp>0&&fq<0)||(fp<0&&fq>0)){const t=fp/(fp-fq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}});return out;};
  const area=pol=>Math.abs(pol.reduce((z,p,i)=>{const q=pol[(i+1)%pol.length];return z+p[0]*q[1]-q[0]*p[1];},0))/2;
  let a=Wh/2,b=Hh/2,U=Up,V=Vp,tr=false;const rect=()=>[[0,0],[U,0],[U,V],[0,V]],f1=p=>p[1]-b-(p[0]-a);
  if(area(retalla(rect(),p=>-f1(p)))>area(retalla(rect(),f1))){tr=true;a=Hh/2;b=Wh/2;U=Vp;V=Up;}           // es queda a davant el tros més gran
  const f=p=>p[1]-b-(p[0]-a),S1=retalla(rect(),f),S2=retalla(rect(),p=>-f(p)),R=p=>[p[1]-b+a,p[0]-a+b];
  const P=p=>tr?[hx+sx*p[1],hy+sy*p[0]]:[hx+sx*p[0],hy+sy*p[1]];
  return {hx,hy,sx,sy,Up,Vp,a,b,U,V,tr,P,S1,S2r:S2.map(R),cau:retalla([[0,0],[a,0],[a,b],[0,b]],f),plec:S1.filter(p=>Math.abs(f(p))<1e-9)};}
function pasLliure(k,ox,oy,s,g){const {W,H,Wh,Hh,fx,fy}=g,Q=geoLliure(g),{hx,hy,sx,sy,P}=Q,xm=k===1||k===4?0:(sx<0?0:hx),ym=k===1||k===2||k===4?0:(sy<0?0:hy);
  const X=x=>n2(ox+(x-xm)*s),Y=y=>n2(oy+(y-ym)*s),pts=p=>p.map(q=>X(q[0])+','+Y(q[1])).join(' ');
  const pol=(p,fill,extra)=>`<polygon points="${pts(p)}" fill="${fill}" stroke="#000" stroke-width=".25" stroke-linejoin="round" ${extra||''}/>`;
  const lin=(a,b,w,dash)=>`<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" stroke="#000" stroke-width="${w}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
  const plec=(a,b)=>lin(a,b,.3,'1.6 1.1'),doblat=(a,b)=>lin(a,b,.9),m=(g.ext||2)/s,x0=sx<0?0:hx,x1=sx<0?hx:W,y0=sy<0?0:hy,y1=sy<0?hy:H;
  const est=(dx,dy)=>{const E=g.estrella;if(!E||(dx&&(E.x<x0||E.x>x1))||(dy&&(E.y<y0||E.y>y1)))return '';const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?E.r*.42:E.r;p.push([E.x+r*Math.cos(a),E.y+r*Math.sin(a)]);}return `<polygon points="${pts(p)}" fill="#000"/>`;};
  const forat=[[fx,fy],[fx+Wh,fy],[fx+Wh,fy+Hh],[fx,fy+Hh]],talla=(pl,xa,xb,ya,yb)=>pl.map(p=>[Math.min(xb,Math.max(xa,p[0])),Math.min(yb,Math.max(ya,p[1]))]);
  if(k===1)return pol([[0,0],[W,0],[W,H],[0,H]],GRIS)+pol(forat,'#fff')+est()+plec([hx,-m],[hx,H+m]);
  if(k===2)return pol([[x0,0],[x1,0],[x1,H],[x0,H]],GRIS)+pol(talla(forat,x0,x1,0,H),'#fff')+est(1)+doblat([hx,0],[hx,H])+plec([x0-m,hy],[x1+m,hy]);
  if(k===3){const qx=sx<0?fx:fx+Wh,qy=sy<0?fy:fy+Hh;return talls(pol,lin,doblat,X,Y,s,m,x0,y0,x1,y1,qx,qy,hx,hy,est(1,1));}
  let o=`<path d="M${X(0)},${Y(0)} L${X(W)},${Y(0)} L${X(W)},${Y(H)} L${X(0)},${Y(H)} Z M${pts(forat).split(' ').join(' L')} Z" fill="${GRIS}" fill-rule="evenodd" stroke="#000" stroke-width=".25"/>`+est();
  for(const [a,b] of [[[hx,0],[hx,fy]],[[hx,fy+Hh],[hx,H]],[[0,hy],[fx,hy]],[[fx+Wh,hy],[W,hy]]])o+=lin(a,b,.2,'.7 .7');
  for(let i=1;i<(g.cols||1);i++){const x=fx+i*Wh/g.cols;o+=lin([x,fy],[x,fy+Hh],.15);}
  for(let i=1;i<(g.files||1);i++){const y=fy+i*Hh/g.files;o+=lin([fx,y],[fx+Wh,y],.15);}
  return o;}
const midaPasLliure=(k,g)=>{const Q=geoLliure(g);return k===1||k===4?[g.W,g.H]:k===2?[Q.Up,g.H]:[Q.Up,Q.Vp];};
/* Línies de plec que s'imprimeixen a la plantilla quan la finestra no és al centre: els dos eixos de la finestra (només sobre el
   marc) i una marca en diagonal a cada cantonada de la finestra. (ox, oy) = cantonada de la plantilla a la pàgina; g.salt = mm de dalt
   que es deixen sense línia (hi va el text de la fitxa). */
function marques(g,ox,oy){const {W,H,Wh,Hh,fx,fy}=g,hx=fx+Wh/2,hy=fy+Hh/2,L=(a,b)=>`<line x1="${n2(ox+a[0])}" y1="${n2(oy+a[1])}" x2="${n2(ox+b[0])}" y2="${n2(oy+b[1])}" stroke="#000" stroke-width=".3" stroke-dasharray="1.6 1.4"/>`;
  let o=L([hx,Math.min(g.salt||0,fy)],[hx,fy])+L([hx,fy+Hh],[hx,H])+L([0,hy],[fx,hy])+L([fx+Wh,hy],[W,hy]);
  return `<g class="marques-plec">${o}</g>`;}
/* Mida (en unitats de plantilla) del dibuix de cada pas. */
const midaPasCentrat=(k,g)=>k===1||k===4?[g.W,g.H]:k===2?[g.W/2,g.H]:[g.W/2,g.H/2];
/* Instruccions dins de la caixa (x,y,w,h) de la pàgina; res no en surt (ho comprova tools/plec/prova.js).
   mode 'columna': dibuixos un sota l'altre amb el text a sota (caixes amples).
   mode 'tira': caixa estreta i alta; es dibuixa girada 90° (es llegeix de baix a dalt), amb el text al costat de cada dibuix.
   mode 'fila': caixa ampla i baixa; dibuixos de costat amb el text a sota.
   mode 'graella': caixa ampla i alta (sota una plantilla sola al full); dues files de passos (2 + 2), amb el text gran.
   Si g porta fx i fy (finestra que no és al centre) es fan servir els passos i els dibuixos generals. */
function instruccions(o){const g=o.g,LL=g.fx!==undefined;if(LL?!serveixLliure(g.W,g.H,g.Wh,g.Hh,g.fx,g.fy):!serveix(g.W,g.H,g.Wh,g.Hh))return '';const TITOL=titolDe(g);
  const PASSOS=LL?PASSOS_L:PASSOS_C,INTRO=LL?INTRO_L:INTRO_C,pas=LL?pasLliure:pasCentrat,midaPas=LL?midaPasLliure:midaPasCentrat;
  const obre=`<g class="plec" data-caixa="${[o.x,o.y,o.w,o.h].map(n2).join(' ')}" data-g="${[g.W,g.H,g.Wh,g.Hh].concat(LL?[g.fx,g.fy]:[]).join(' ')}">`;   // caixa i mides: les llegeix la prova de navegador
  if(o.mode==='fila'){/* dibuixos de costat, amb el text a sota (caixes amples i baixes) */
    const cos=2.7,ct=3.2,sep=4,ext=1.2,gg=Object.assign({},g,{ext}),T=trenca(TITOL,o.w,ct,true),I=trenca(INTRO,o.w,cos*.92),cap=.6+alt(T,ct)+1+alt(I,cos*.92)+3;
    const ample=(o.w-3*sep)/4,C=PASSOS.map(p=>trenca(p,ample-ct*1.1,cos)),altC=Math.max(...C.map(c=>alt(c,cos))),M=[1,2,3,4].map(k=>midaPas(k,g));
    const s=Math.min((ample-2*ext)/Math.max(...M.map(m=>m[0])),(o.h-cap-altC-2.5-2*ext)/Math.max(...M.map(m=>m[1])),o.smax||.5),altF=Math.max(...M.map(m=>m[1]))*s;
    let h=obre+text(o.x,o.y+.6,T,ct,true)+text(o.x,o.y+.6+alt(T,ct)+1,I,cos*.92);const y=o.y+cap+ext;
    for(let k=1;k<=4;k++){const x=o.x+(k-1)*(ample+sep);h+=pas(k,x+ext,y,s,gg)+text(x,y+altF+ext+2.5,[String(k)],ct,true)+text(x+ct*1.1,y+altF+ext+2.75,C[k-1],cos);}
    return h+'</g>';}
  if(o.mode==='graella'){/* ronda 16: una sola plantilla per full; els quatre passos en dues files (2 + 2), amb el text gran i els
     dibuixos un 30 % més petits que el màxim que hi cabria, perquè no es confonguin amb la plantilla que s'ha de retallar */
    const cos=o.cos||3.6,ct=cos*1.2,sepX=6,sepY=5,ext=1.5,gg=Object.assign({},g,{ext}),T=trenca(TITOL,o.w,ct*1.15,true),I=trenca(INTRO,o.w,cos),cap=5+alt(T,ct*1.15)+1.2+alt(I,cos)+4;
    const ample=(o.w-sepX)/2,C=PASSOS.map(p=>trenca(p,ample-ct*1.1,cos)),altC=Math.max(...C.map(c=>alt(c,cos))),M=[1,2,3,4].map(k=>midaPas(k,g));
    const mw=Math.max(...M.map(q=>q[0])),mh=Math.max(...M.map(q=>q[1]));
    const s=.7*Math.min((ample-2*ext)/mw,(o.h-cap-2*(altC+3+2*ext)-sepY)/(2*mh),o.smax||.8),altF=mh*s,fila=altF+2*ext+3+altC+sepY;
    let h=obre+`<line x1="${n2(o.x)}" y1="${n2(o.y)}" x2="${n2(o.x+o.w)}" y2="${n2(o.y)}" stroke="#000" stroke-width=".4"/>`+text(o.x,o.y+5,T,ct*1.15,true)+text(o.x,o.y+5+alt(T,ct*1.15)+1.2,I,cos);
    for(let k=1;k<=4;k++){const c=(k-1)%2,r=Math.floor((k-1)/2),x=o.x+c*(ample+sepX),y=o.y+cap+r*fila,mk=M[k-1];
      h+=pas(k,x+ext+(ample-2*ext-mk[0]*s)/2,y+ext+(altF-mk[1]*s),s,gg)+text(x,y+altF+2*ext+3,[String(k)],ct,true)+text(x+ct*1.1,y+altF+2*ext+3+.2,C[k-1],cos);}
    return h+'</g>';}
  if(o.mode==='tira'){const L=o.h,t=o.w,cos=2.6,ct=3.1,sep=4.5,buit=3,ext=1.2,gg=Object.assign({},g,{ext}),s=Math.min((t-2*ext)/g.H,.5),figs=[1,2,3,4].map(k=>midaPas(k,g)[0]*s),at=Math.max(34,L*.125);
    /* amplada de cada text: la que demana la paraula més llarga, i el que sobra es reparteix segons la llargada del text */
    const lliure=L-at-sep-figs.reduce((a,b)=>a+b,0)-4*buit-3*sep,base=PASSOS.map(p=>ct*.9+Math.max(...p.split(' ').map(w=>w.length))*cos*.58);
    const sobra=Math.max(0,lliure-base.reduce((a,b)=>a+b,0)),lletres=PASSOS.reduce((a,p)=>a+p.length,0),T=trenca(TITOL,at,ct,true),y0=(t-g.H*s)/2;
    let h=`${obre}<g transform="translate(${n2(o.x)},${n2(o.y+o.h)}) rotate(-90)">`+text(0,y0,T,ct,true)+text(0,y0+alt(T,ct)+1.5,trenca(INTRO,at,cos*.9),cos*.9),x=at+sep;
    for(let k=1;k<=4;k++){const hk=midaPas(k,g)[1],cw=base[k-1]+sobra*PASSOS[k-1].length/lletres;h+=pas(k,x,(t-hk*s)/2,s,gg);x+=figs[k-1]+buit;
      h+=text(x,y0,[String(k)],ct,true)+text(x+ct*.9,y0+.25,trenca(PASSOS[k-1],cw-ct*.9,cos),cos);x+=cw+sep;}
    return h+'</g></g>';}
  const cos=Math.min(3.1,Math.max(2.5,o.w/18)),ct=cos*1.18,ind=2.2,dalt=.6,T=trenca(TITOL,o.w,ct,true),I=trenca(INTRO,o.w,cos*.92),C=PASSOS.map(p=>trenca(p,o.w-ct*1.1,cos));
  const cap=dalt+alt(T,ct)+1.5+alt(I,cos*.92)+4,fix=cap+C.reduce((a,c)=>a+alt(c,cos)+2.8,0)+3*4.5;          // tot el que no són dibuixos
  const unitats=[1,2,3,4].reduce((a,k)=>a+midaPas(k,g)[1],0),s=Math.min((o.w-ind)/g.W,(o.h-fix)/unitats,o.smax||.5);
  let h=obre+text(o.x,o.y+dalt,T,ct,true)+text(o.x,o.y+dalt+alt(T,ct)+1.5,I,cos*.92),y=o.y+cap;
  for(let k=1;k<=4;k++){const hk=midaPas(k,g)[1];h+=pas(k,o.x+ind,y,s,g);y+=hk*s+2.8;h+=text(o.x,y,[String(k)],ct,true)+text(o.x+ct*1.1,y+.25,C[k-1],cos);y+=alt(C[k-1],cos)+4.5;}
  return h+'</g>';}
G.PLEC={comprova,comprovaLliure,serveix,serveixLliure,instruccions,marques,geoLliure,pas:pasCentrat,PASSOS:PASSOS_C,PASSOS_L,TITOL,INTRO:INTRO_C,INTRO_L};
})(typeof window!=='undefined'?window:globalThis);
