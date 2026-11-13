/* Reixeta · El sonar — pàgina d'impressió: full de l'amagatall, full de registre per a qui busca i solucionari */
(function(){
'use strict';
const K=window.SONAR,R=K.R,C=K.C,LL='ABCD';
const $=s=>document.querySelector(s);
const CEL=40,TRESOR=24;                                   // mm: casella (la del WODB: s'hi fa servir la mateixa plantilla) i dibuix del tresor
const AR='font-family="Arial,Helvetica,sans-serif"';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st={niv:'SO1',ver:'A',vista:'full'};
const cache={};
const actual=()=>{const id=st.niv+'-'+st.ver;return cache[id]||(cache[id]=K.genera(st.niv,st.ver));};
const codi=()=>st.niv+'-'+st.ver;
/* Tresor: una pedra tallada, dins d'una caixa de costat s amb la cantonada a (x, y). */
function tresor(x,y,s){const P=p=>p.map(([a,b])=>(x+a*s).toFixed(2)+','+(y+b*s).toFixed(2)).join(' '),w=(s*.03).toFixed(2);
  return `<polygon points="${P([[.25,.14],[.75,.14],[.96,.4],[.5,.9],[.04,.4]])}" fill="#d9d9d9" stroke="#000" stroke-width="${w}" stroke-linejoin="round"/>`
    +`<polyline points="${P([[.04,.4],[.96,.4]])}" fill="none" stroke="#000" stroke-width="${w}"/><polyline points="${P([[.25,.14],[.36,.4],[.5,.9],[.64,.4],[.75,.14]])}" fill="none" stroke="#000" stroke-width="${w}" stroke-linejoin="round"/><polyline points="${P([[.36,.4],[.5,.14],[.64,.4]])}" fill="none" stroke="#000" stroke-width="${w}" stroke-linejoin="round"/>`;}
/* ---------- full 1: l'amagatall (el té qui amaga i no l'ensenya) ---------- */
function fullSVG(){const F=actual(),w=C*CEL,h=R*CEL,x0=(297-w)/2,y0=(210-h)/2;let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${x0+w}" y="${y0-15}" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${codi()}</text>`;
  for(let r=0;r<R;r++)o+=`<text x="${x0-8}" y="${y0+r*CEL+CEL/2+2.5}" font-size="7" text-anchor="middle" ${AR}>${LL[r]}</text>`;
  for(let c=0;c<C;c++)o+=`<text x="${x0+c*CEL+CEL/2}" y="${y0-5}" font-size="7" text-anchor="middle" ${AR}>${c+1}</text>`;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){const x=x0+c*CEL,y=y0+r*CEL;
    o+=`<rect x="${x}" y="${y}" width="${CEL}" height="${CEL}" fill="#fff" stroke="#000" stroke-width=".35"/>`+(F.m>>(r*C+c)&1?tresor(x+(CEL-TRESOR)/2,y+(CEL-TRESOR)/2,TRESOR):'');}
  return o+`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="#000" stroke-width=".8"/></svg>`;}
/* ---------- tauler petit: graella de 5 × 4 amb un cercle a cada posició de la plantilla ---------- */
function tauler(x0,y0,u,F){let o='';const fs=u*.3;
  for(let r=0;r<R;r++)o+=`<text x="${(x0-u*.28).toFixed(2)}" y="${(y0+r*u+u/2+fs*.36).toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="middle" ${AR}>${LL[r]}</text>`;
  for(let c=0;c<C;c++)o+=`<text x="${(x0+c*u+u/2).toFixed(2)}" y="${(y0-u*.14).toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="middle" ${AR}>${c+1}</text>`;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++)o+=`<rect x="${x0+c*u}" y="${y0+r*u}" width="${u}" height="${u}" fill="#fff" stroke="#000" stroke-width=".25"/>`+(F&&F.m>>(r*C+c)&1?tresor(x0+c*u+u*.2,y0+r*u+u*.2,u*.6):'');
  o+=`<rect x="${x0}" y="${y0}" width="${C*u}" height="${R*u}" fill="none" stroke="#000" stroke-width=".6"/>`;
  K.POS.forEach((p,i)=>{const cx=x0+(p.c+1)*u,cy=y0+(p.r+1)*u,rr=u*.27;
    o+=`<circle cx="${cx}" cy="${cy}" r="${rr.toFixed(2)}" fill="#fff" stroke="#000" stroke-width=".3"/>`+(F?`<text x="${cx}" y="${(cy+rr*.42).toFixed(2)}" font-size="${(rr*1.25).toFixed(2)}" text-anchor="middle" font-weight="700" ${AR}>${F.resp[i]}</text>`:'');});
  return o;}
/* ---------- full de registre: sis partides per a qui busca ---------- */
const REGLES=['Per a dues persones. Qui amaga té un full amb 5 tresors i no l\'ensenya. Qui busca fa servir aquest full de registre.',
  'Qui busca diu una posició, per exemple B3. Qui amaga hi posa la plantilla, amb la casella B3 a dalt a l\'esquerra de la finestra, i diu quants tresors veu.',
  'Apunta la resposta al cercle que té aquesta casella a dalt a l\'esquerra: cada cercle toca les quatre caselles que s\'han vist.',
  'Quan sàpigues segur on són els 5 tresors, marca\'ls i compta les preguntes. Després canvieu els papers: guanya qui n\'ha necessitat menys.'];
function registreSVG(){const u=13,w=C*u,h=R*u,gx=(297-3*w)/4;let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${gx}" y="16" font-size="6.5" font-weight="700" ${AR}>El sonar · full de registre</text>`+REGLES.map((t,i)=>`<text x="${gx}" y="${24+i*5.4}" font-size="3.8" ${AR}>${esc(t)}</text>`).join('');
  for(let i=0;i<6;i++){const x=gx+(i%3)*(w+gx),y=58+Math.floor(i/3)*(h+26);
    o+=tauler(x,y,u,null)+`<text x="${x}" y="${y+h+8}" font-size="3.8" ${AR}>Full: __________   Preguntes fetes: ______</text>`;}
  return o+'</svg>';}
/* ---------- solucionari ---------- */
function soluSVG(){const F=actual(),u=22,x0=30,y0=44;let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${x0-6}" y="20" font-size="6.5" font-family="Courier New,monospace" font-weight="700">${codi()} · solucionari</text>`+tauler(x0,y0,u,F);
  const tx=x0+C*u+16,L=[['b','Tresors: '+K.caselles(F.m).join(', ')],['','Els cercles porten la resposta de cada posició.'],['',''],
    ['b',`Es pot trobar segur amb ${F.minim.k} preguntes:`],['',F.minim.pos.join(', ')],['','No n\'hi ha prou amb menys: sempre quedaria algun'],['','altre amagatall amb les mateixes respostes.'],['',''],
    ['b','Per al professorat'],['',`Hi ha ${K.TOTS.length.toLocaleString('ca')} maneres d'amagar 5 tresors en 20 caselles.`],['','Cada resposta pot ser 0, 1, 2, 3 o 4, i 5⁵ = 3.125:'],['','amb cinc preguntes no n\'hi pot haver prou sempre.'],
    ['','Els fulls només fan servir amagatalls que les 12'],['','respostes determinen del tot (dos de cada tres).']];
  o+=L.map(([b,t],i)=>t?`<text x="${tx}" y="${y0+4+i*6.6}" font-size="4.3"${b?' font-weight="700"':''} ${AR}>${esc(t)}</text>`:'').join('');   // les línies buides només fan d'espai
  return o+'</svg>';}
/* ---------- plantilla: la del WODB (un sol forat de 77 mm), amb els passos per fer la finestra plegant (comu/plec.js) ---------- */
const MARC=24,MARGE=1.5,ESTRELLA=4.9;
function estrella(cx,cy,Rr){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?Rr*.42:Rr;p.push((cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2));}return p.join(' ');}
function plantillaCos(ox,oy){const Sp=2*CEL+2*MARC,f=2*CEL-2*MARGE;let o=`<path d="M${ox},${oy} h${Sp} v${Sp} h${-Sp} Z M${ox+MARC+MARGE},${oy+MARC+MARGE} h${f} v${f} h${-f} Z" fill="#d4d4d4" fill-rule="evenodd" stroke="#000" stroke-width=".3"/>`;
  for(const k of [0,1,2]){const t=MARC+k*CEL,L=6,g='stroke="#000" stroke-width=".5"';o+=`<line x1="${ox+t}" y1="${oy}" x2="${ox+t}" y2="${oy+L}" ${g}/><line x1="${ox+t}" y1="${oy+Sp-L}" x2="${ox+t}" y2="${oy+Sp}" ${g}/><line x1="${ox}" y1="${oy+t}" x2="${ox+L}" y2="${oy+t}" ${g}/><line x1="${ox+Sp-L}" y1="${oy+t}" x2="${ox+Sp}" y2="${oy+t}" ${g}/>`;}
  return o+`<polygon points="${estrella(ox+MARC/2,oy+MARC/2,ESTRELLA)}" fill="#000"/>`;}
function plantillaSVG(){const Sp=2*CEL+2*MARC,x=10,gy=(297-2*Sp)/3,bx=x+Sp+8,f=2*CEL-2*MARGE;
  return `<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">${plantillaCos(x,gy)}${plantillaCos(x,2*gy+Sp)}`
    +PLEC.instruccions({x:bx,y:gy,w:202-bx,h:297-2*gy,g:{W:Sp,H:Sp,Wh:f,Hh:f,estrella:{x:MARC/2,y:MARC/2,r:ESTRELLA},cols:2,files:2}})+'</svg>';}
/* ---------- pintar ---------- */
function pinta(){const P=$('#pagines'),F=actual();
  $('#mida-pagina').textContent=st.vista==='plantilla'?'@page{size:A4 portrait;margin:0}':'@page{size:A4 landscape;margin:0}';
  P.innerHTML=st.vista==='plantilla'?`<div class="pagina v">${plantillaSVG()}</div>`:!F?'<p class="buit">No he pogut generar el full.</p>':`<div class="pagina h">${st.vista==='registre'?registreSVG():st.vista==='solu'?soluSVG():fullSVG()}</div>`;escala();marca();}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const px=(pw.classList.contains('v')?210:297)*96/25.4,z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function estat(t){$('#estat').textContent=t||'';}
function marca(){document.querySelectorAll('[data-vista]').forEach(b=>b.classList.toggle('on',b.dataset.vista===st.vista));$('#nivell').value=st.niv;
  $('#vers').innerHTML=K.FIXOS.map(v=>`<button data-ver="${v}" class="${st.ver===v?'on':''}">${v}</button>`).join('');
  $('#vers').querySelectorAll('button').forEach(b=>b.onclick=()=>{st.ver=b.dataset.ver;estat('');pinta();actualitzaHash();});}
function actualitzaHash(){history.replaceState(null,'','#'+codi()+(st.vista!=='full'?'/'+st.vista:''));}
$('#nivell').innerHTML=K.ORDRE.map(k=>`<option value="${k}">${k} · ${esc(K.NIVELLS[k].nom)}</option>`).join('');
$('#nivell').onchange=e=>{st.niv=e.target.value;st.ver='A';estat('');pinta();actualitzaHash();};
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;pinta();actualitzaHash();});
$('#btnGen').onclick=()=>{const n=parseInt($('#num').value,10);if(!(n>=1000&&n<=9999)){estat('Escriu un número entre 1000 i 9999.');return;}st.ver=String(n);estat('Full '+codi()+' generat. Amb el mateix número sempre surt el mateix full.');pinta();actualitzaHash();};
$('#btnAtzar').onclick=()=>{const n=1000+Math.floor(Math.random()*9000);$('#num').value=n;$('#btnGen').onclick();};
$('#btnPrint').onclick=()=>window.print();
window.addEventListener('resize',escala);
window.addEventListener('beforeprint',()=>document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1)));
window.addEventListener('afterprint',escala);
function aplicaHash(){const m=/^#(SO\d)-([A-D]|\d{4})(?:\/(full|plantilla|registre|solu))?$/.exec(location.hash);
  if(m&&K.NIVELLS[m[1]]){st.niv=m[1];st.ver=m[2];st.vista=m[3]||'full';if(/\d/.test(m[2]))$('#num').value=m[2];}pinta();}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,registreSVG,soluSVG,actual,st,pinta,mides:{CEL,TRESOR}};
})();
