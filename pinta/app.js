/* Reixeta · Pinta per sumes — editor de dibuixos i pàgina d'impressió (eina per al professorat) */
(function(){
'use strict';
const P=window.PINTA;
const $=s=>document.querySelector(s);
const MARC=14,BARRA=6,MARGE=1.5,ESTRELLA=4;                  // mm: marc de la plantilla, barres, marge del forat, radi de l'estrella
const midesPl=()=>({CEL:P.CEL,MARC,BARRA,MARGE,ESTRELLA,FORAT:P.CEL-2*MARGE});   // per a comu/plantilla.js (casella de 19 mm, ronda 17)
const st={tema:'S',h:7,w:7,dib:P.EX.A.dib.map(d=>d.slice()),llavor:'1',ex:'A',vista:'editor',model:'un'};   // h × w: mida dels dibuixos; el full és de (h+1) × (w+1)
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const AR='font-family="Arial,Helvetica,sans-serif"';
let T=null;                                                  // full actual: una matriu de valors del tema
const M=()=>P.TEMES[st.tema];
const estatText=()=>P.codifica(st.tema,st.h,st.w,st.dib,st.llavor);
const codi=()=>st.ex?'PIN-'+st.ex:P.codiCurt(estatText());
function calcula(){T=P.resol(st.tema,st.h,st.w,st.dib,estatText());}
const lletres='ABCDEFGH';
const usats=()=>M().regles.map((_,k)=>k).filter(k=>P.teNegre(st.dib[k]));
const laberints=()=>usats().filter(k=>P.cami(st.dib[k]));
/* ---------- full 1 ---------- */
/* Un valor dins d'una casella de costat c centrada a (cx, cy): un nombre, o una fracció amb la ratlla horitzontal. */
function valorSVG(v,cx,cy,c){const llarg=Math.max(...M().valors.map(x=>x.s?x.s.length:0));
  if(v.f){const fs=c*.29,w=Math.max(String(v.f[0]).length,String(v.f[1]).length)*fs*.62+c*.06;
    return `<text x="${cx}" y="${(cy-c*.075).toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="middle" font-weight="700" ${AR}>${v.f[0]}</text><line x1="${(cx-w/2).toFixed(2)}" y1="${cy}" x2="${(cx+w/2).toFixed(2)}" y2="${cy}" stroke="#000" stroke-width="${(c*.028).toFixed(2)}"/><text x="${cx}" y="${(cy+c*.285).toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="middle" font-weight="700" ${AR}>${v.f[1]}</text>`;}
  const fs=c*(llarg<=2?.42:.36);return `<text x="${cx}" y="${(cy+fs*.36).toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="middle" font-weight="700" ${AR}>${esc(v.s)}</text>`;}
function fullSVG(){const R=st.h+1,C=st.w+1,c=P.CEL,w=C*c,hh=R*c,x0=(210-w)/2,y0=(297-hh)/2;
  let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="200" y="14" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${codi()}</text>`;
  o+=PLANTILLA.guies(x0,y0,R,C,midesPl(),lletres);   // guies als quatre costats, fora del marc de la plantilla (ronda 16)
  for(let r=0;r<R;r++)for(let k=0;k<C;k++)o+=`<rect x="${x0+k*c}" y="${y0+r*c}" width="${c}" height="${c}" fill="#fff" stroke="#000" stroke-width=".3"/>`+valorSVG(T[r][k],x0+k*c+c/2,y0+r*c+c/2,c);
  return o+`<rect x="${x0}" y="${y0}" width="${w}" height="${hh}" fill="none" stroke="#000" stroke-width=".7"/></svg>`;}
/* ---------- plantilla de 2×2: comu/plantilla.js amb la casella de Pinta i un marc de 14 mm; una per full A4 ---------- */
const plantillaSVG=()=>PLANTILLA.pagina(2,2,{model:st.model,m:midesPl()});
const plantillaLaser=()=>PLANTILLA.laser(2,2,{model:st.model,m:midesPl()});
/* ---------- full de respostes, full de laberints i solucionari: una graella per dibuix ---------- */
function trenca(t,max){const out=[];let l='';for(const w of t.split(' ')){if(l&&(l+' '+w).length>max){out.push(l);l=w;}else l=l?l+' '+w:w;}if(l)out.push(l);return out;}
/* mode: 'respostes' (graelles buides), 'laberint' (graelles buides amb entrada i sortida, només els dibuixos que són laberints)
   o 'solu' (dibuixos pintats a partir dels nombres del full; als laberints, el camí en blanc). */
function graellesSVG(mode){const nh=st.h,nw=st.w,us=mode==='laberint'?laberints():usats(),u=80/Math.max(nh,nw),w=nw*u,hh=nh*u,gx=(297-3*w)/4,ple=mode==='solu';
  let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">`;
  o+=`<text x="${297-gx}" y="16" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${codi()}${ple?' · solucionari':''}</text>`;
  if(mode==='laberint')o+=`<text x="${gx}" y="26" font-size="4.8">Comença amb la plantilla a la posició A1. Mou-la d'una casella en una, amunt, avall o de costat,</text><text x="${gx}" y="32.5" font-size="4.8">passant només per posicions que compleixin la regla, fins a arribar a ${lletres[nh-1]}${nw}. Marca el camí.</text>`;
  else o+=`<text x="${gx}" y="30" font-size="4.8">Posa la plantilla a cada posició i pinta la casella si es compleix la regla.</text>`;
  us.forEach((k,i)=>{const x0=gx+i*(w+gx),y0=74,D=ple?P.pinta(st.tema,T,k):null,C=P.cami(st.dib[k]),lab=mode==='laberint'||(ple&&C);
    const R=trenca((mode==='laberint'?'Només es pot passar si ':'Pinta si ')+M().regles[k].text.replace(/ \(.*$/,''),38);
    o+=`<text x="${x0}" y="${y0-24}" font-size="5.2" font-weight="700">${lab?'Laberint':'Dibuix'} ${i+1}</text>`+R.map((l,j)=>`<text x="${x0}" y="${y0-17.5+j*5.2}" font-size="4.3">${esc(l)}</text>`).join('');
    for(let j=0;j<nw;j++)o+=`<text x="${x0+j*u+u/2}" y="${y0-2.5}" font-size="3.6" text-anchor="middle">${j+1}</text>`;
    for(let j=0;j<nh;j++)o+=`<text x="${x0-3.5}" y="${y0+j*u+u/2+1.3}" font-size="3.6" text-anchor="middle">${lletres[j]}</text>`;
    for(let r=0;r<nh;r++)for(let c=0;c<nw;c++)o+=`<rect x="${x0+c*u}" y="${y0+r*u}" width="${u}" height="${u}" fill="${D&&D[r][c]==='X'?'#000':'#fff'}" stroke="#000" stroke-width=".25"/>`;
    o+=`<rect x="${x0}" y="${y0}" width="${w}" height="${hh}" fill="none" stroke="#000" stroke-width=".6"/>`;
    if(mode==='laberint')o+=`<text x="${x0+u/2}" y="${y0+u/2+1.5}" font-size="4" text-anchor="middle" font-weight="700">E</text><text x="${x0+w-u/2}" y="${y0+hh-u/2+1.5}" font-size="4" text-anchor="middle" font-weight="700">S</text>`;
    if(ple&&C)o+=`<polyline points="${C.map(([r,c])=>(x0+c*u+u/2).toFixed(2)+','+(y0+r*u+u/2).toFixed(2)).join(' ')}" fill="none" stroke="#fff" stroke-width="${(u*.2).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round"/>`
      +`<text x="${x0}" y="${y0+hh+6}" font-size="3.8">Camí de l'entrada a la sortida: ${C.length} posicions.</text>`;});
  const peu=mode==='laberint'?`E = entrada (A1), S = sortida (${lletres[nh-1]}${nw}). La posició és la casella que queda sota l'estrella de la plantilla.`:`La posició és la casella que queda sota l'estrella de la plantilla (a dalt a l'esquerra): de A1 a ${lletres[nh-1]}${nw}.`;
  return o+`<text x="${gx}" y="${74+hh+14}" font-size="4.3">${peu}</text></svg>`;}
/* ---------- editor ---------- */
let pintant=null;
function editorHTML(){const nh=st.h,nw=st.w,senar=nh%2&&nw%2;let h='<div class="editor">';
  M().regles.forEach((g,k)=>{h+=`<div class="dib"><h2>Dibuix ${k+1}: es pinta si ${esc(g.text)}</h2><div class="px" data-k="${k}" style="grid-template-columns:repeat(${nw},auto)">`;
    for(let r=0;r<nh;r++)for(let c=0;c<nw;c++)h+=`<button data-r="${r}" data-c="${c}" class="${st.dib[k][r][c]==='X'?'on':''}" aria-label="Fila ${r+1}, columna ${c+1}"></button>`;
    h+=`</div><div class="accions"><button data-a="buida" data-k="${k}">Esborra</button><button data-a="inverteix" data-k="${k}">Inverteix</button><button data-a="laberint" data-k="${k}" title="${senar?'Hi posa un laberint a l\'atzar':'Cal un nombre senar de files i de columnes'}"${senar?'':' disabled'}>Laberint</button></div></div>`;});
  return h+'</div><p class="ajuda">Clica o arrossega per pintar. Cap fila ni cap columna del dibuix no hauria de quedar en blanc. Un dibuix en blanc es canvia per un a l\'atzar. «Laberint» hi posa un laberint a l\'atzar: llavors apareix la vista «Full de laberints», on l\'alumnat ha d\'anar de A1 a l\'última posició movent la plantilla d\'una casella en una. Quan acabis, mira «Full 1»: els nombres ja amaguen els teus dibuixos. L\'adreça de la pàgina desa els dibuixos; copia-la per recuperar-los o compartir-los.</p>';}
function posa(k,r,c,v){const f=st.dib[k][r];if((f[c]==='X')===v)return;st.dib[k][r]=f.slice(0,c)+(v?'X':'.')+f.slice(c+1);st.ex='';}
function lligaEditor(){document.querySelectorAll('.px').forEach(box=>{const k=+box.dataset.k;
    const fes=e=>{const b=e.target.closest('button[data-r]');if(!b||pintant===null)return;posa(k,+b.dataset.r,+b.dataset.c,pintant);b.classList.toggle('on',pintant);};
    box.onpointerdown=e=>{const b=e.target.closest('button[data-r]');if(!b)return;e.preventDefault();pintant=!b.classList.contains('on');fes(e);};
    box.onpointerover=fes;
    box.onkeydown=e=>{if(e.key!==' '&&e.key!=='Enter')return;const b=e.target.closest('button[data-r]');if(!b)return;e.preventDefault();const v=!b.classList.contains('on');posa(k,+b.dataset.r,+b.dataset.c,v);b.classList.toggle('on',v);canvi();};});
  document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const k=+b.dataset.k,a=b.dataset.a;
    st.dib[k]=a==='buida'?P.buit(st.h,st.w):a==='laberint'?P.laberint(st.h,st.w,1+Math.floor(Math.random()*999999)):st.dib[k].map(f=>f.replace(/[X.]/g,ch=>ch==='X'?'.':'X'));st.ex='';canvi();pinta();});}
window.addEventListener('pointerup',()=>{if(pintant!==null){pintant=null;canvi();}});
function canvi(){calcula();marca();actualitzaHash();
  const buides=st.dib.map((d,k)=>P.teNegre(d)&&!P.senseBuides(d)?k+1:0).filter(Boolean);
  estat((T?'Codi del full: '+codi()+'.':'No he pogut generar el full. Prova «Altres nombres».')+(buides.length?` Atenció: el dibuix ${buides.join(' i el ')} té alguna fila o columna en blanc.`:''));}
/* ---------- pintar ---------- */
function pinta(){const Pg=$('#pagines');let h='';if(st.vista==='laberint'&&!laberints().length)st.vista='editor';
  $('#mida-pagina').textContent=(st.vista==='respostes'||st.vista==='solu'||st.vista==='laberint')?'@page{size:A4 landscape;margin:0}':'@page{size:A4 portrait;margin:0}';
  if(st.vista==='editor')h=editorHTML();
  else if(!T)h='<p>No hi ha cap full generat.</p>';
  else if(st.vista==='full')h=`<div class="pagina v">${fullSVG()}</div>`;
  else if(st.vista==='plantilla')h=`<div class="pagina v">${plantillaSVG()}</div>`;
  else h=`<div class="pagina h">${graellesSVG(st.vista)}</div>`;
  Pg.innerHTML=h;if(st.vista==='editor')lligaEditor();escala();marca();
  const box=$('#modelTria');box.classList.toggle('amagat',st.vista!=='plantilla');
  box.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',b.dataset.model===st.model);b.onclick=()=>{st.model=b.dataset.model;pinta();};});}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const mm=pw.classList.contains('v')?210:297,px=mm*96/25.4;
  const z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function estat(t){$('#estat').textContent=t||'';}
function actualitzaHash(){history.replaceState(null,'','#'+(st.ex?'PIN-'+st.ex:'p='+estatText())+(st.vista!=='editor'?'/'+st.vista+(st.vista==='plantilla'&&st.model==='barres'?'-barres':''):''));}
function marca(){$('#exemples').innerHTML=P.ORDRE_EX.map(k=>`<button data-ex="${k}" class="${st.ex===k?'on':''}" title="${esc(P.EX[k].nom)}">${k}</button>`).join('');
  $('#exemples').querySelectorAll('button').forEach(b=>b.onclick=()=>{carregaEx(b.dataset.ex);canvi();pinta();});
  document.querySelectorAll('[data-vista]').forEach(b=>{b.classList.toggle('on',b.dataset.vista===st.vista);if(b.dataset.vista==='laberint')b.classList.toggle('amagat',!laberints().length);});
  $('#mida').value=st.h+'x'+st.w;$('#tema').value=st.tema;}
function carregaEx(k){const E=P.EX[k];st.tema=E.tema;[st.h,st.w]=P.midaDe(E.dib[0]);st.dib=E.dib.map(d=>d.slice());st.llavor='1';st.ex=k;}
/* ---------- inici ---------- */
$('#tema').innerHTML=P.ORDRE_TEMES.map(t=>`<option value="${t}">${esc(P.TEMES[t].nom)}</option>`).join('');
/* mides dels dibuixos: de 2 × 2 a 7 × 7 (full de com a molt 8 × 8, ronda 17) */
{let o='';for(let h=P.MAX-1;h>=P.MIN-1;h--)for(let w=P.MAX-1;w>=P.MIN-1;w--)o+=`<option value="${h}x${w}">dibuixos de ${h} × ${w} · full de ${h+1} × ${w+1}</option>`;$('#mida').innerHTML=o;}
$('#tema').onchange=e=>{if(e.target.value===st.tema)return;st.tema=e.target.value;st.dib=[P.buit(st.h,st.w),P.buit(st.h,st.w),P.buit(st.h,st.w)];st.ex='';if(st.vista!=='plantilla')st.vista='editor';canvi();pinta();};
$('#mida').onchange=e=>{const [h,w]=e.target.value.split('x').map(Number);if(h===st.h&&w===st.w)return;st.h=h;st.w=w;st.dib=[P.buit(h,w),P.buit(h,w),P.buit(h,w)];st.ex='';canvi();pinta();};
$('#btnNou').onclick=()=>{st.llavor=String(1+Math.floor(Math.random()*999999));st.ex='';canvi();pinta();};
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;pinta();actualitzaHash();});
/* Des de la vista «Dibuixos» l'editor no s'imprimeix: s'imprimeix el joc complet del full (full de nombres, full de laberints si n'hi ha,
   full de respostes i solucionari), cada pàgina amb la seva orientació (pàgines amb nom a pinta.css). */
function totHTML(){if(!T)return '';const pag=(c,x)=>`<div class="pagina ${c}">${x}</div>`;
  return pag('v',fullSVG())+(laberints().length?pag('h',graellesSVG('laberint')):'')+pag('h',graellesSVG('respostes'))+pag('h',graellesSVG('solu'));}
function preparaImpressio(){const I=$('#impressio'),tot=st.vista==='editor'&&!!T;document.body.classList.toggle('imprimeix-tot',tot);if(tot){I.innerHTML=totHTML();I.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1));$('#mida-pagina').textContent='';}else I.innerHTML='';}
$('#btnPrint').onclick=()=>{preparaImpressio();window.print();};
window.addEventListener('resize',escala);
window.addEventListener('beforeprint',()=>{preparaImpressio();document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1));});
window.addEventListener('afterprint',()=>{$('#impressio').innerHTML='';document.body.classList.remove('imprimeix-tot');pinta();});
function aplicaHash(){const m=/^#(?:PIN-([A-Z])|p=([0-9a-fA-Zx.]+))(?:\/(editor|full|plantilla|plantilla-barres|respostes|laberint|solu))?$/.exec(location.hash);
  if(m){if(m[1]&&P.EX[m[1]])carregaEx(m[1]);else if(m[2]){const d=P.descodifica(m[2]);if(d){st.tema=d.tema;st.h=d.h;st.w=d.w;st.dib=d.dibuixos;st.llavor=d.llavor;st.ex='';}}
    st.vista=(m[3]||'editor').replace('-barres','');st.model=m[3]==='plantilla-barres'?'barres':'un';}
  calcula();pinta();estat(T?'Codi del full: '+codi()+'.':'');}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,plantillaLaser,st,pinta,laberints,preparaImpressio,get T(){return T;}};
})();
