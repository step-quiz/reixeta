/* Reixeta · Pinta per sumes — editor de dibuixos i pàgina d'impressió (eina per al professorat) */
(function(){
'use strict';
const P=window.PINTA;
const $=s=>document.querySelector(s);
const MARC=14,BARRA=6,MARGE=1.5,ESTRELLA=4;                  // mm: marc de la plantilla, barres, marge del forat, radi de l'estrella
const st={tema:'S',N:10,dib:P.EX.A.dib.map(d=>d.slice()),llavor:'1',ex:'A',vista:'editor',model:'un'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const AR='font-family="Arial,Helvetica,sans-serif"';
let T=null;                                                  // full actual: una matriu de valors del tema
const M=()=>P.TEMES[st.tema];
const estatText=()=>P.codifica(st.tema,st.N,st.dib,st.llavor);
const codi=()=>st.ex?'PIN-'+st.ex:P.codiCurt(estatText());
function calcula(){T=P.resol(st.tema,st.N,st.dib,estatText());}
const lletres='ABCDEFGHIJ';
const usats=()=>M().regles.map((_,k)=>k).filter(k=>P.teNegre(st.dib[k]));
const laberints=()=>usats().filter(k=>P.cami(st.dib[k]));
/* ---------- full 1 ---------- */
/* Un valor dins d'una casella de costat c centrada a (cx, cy): un nombre, o una fracció amb la ratlla horitzontal. */
function valorSVG(v,cx,cy,c){const llarg=Math.max(...M().valors.map(x=>x.s?x.s.length:0));
  if(v.f){const fs=c*.29,w=Math.max(String(v.f[0]).length,String(v.f[1]).length)*fs*.62+c*.06;
    return `<text x="${cx}" y="${(cy-c*.075).toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="middle" font-weight="700" ${AR}>${v.f[0]}</text><line x1="${(cx-w/2).toFixed(2)}" y1="${cy}" x2="${(cx+w/2).toFixed(2)}" y2="${cy}" stroke="#000" stroke-width="${(c*.028).toFixed(2)}"/><text x="${cx}" y="${(cy+c*.285).toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="middle" font-weight="700" ${AR}>${v.f[1]}</text>`;}
  const fs=c*(llarg<=2?.42:.36);return `<text x="${cx}" y="${(cy+fs*.36).toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="middle" font-weight="700" ${AR}>${esc(v.s)}</text>`;}
function fullSVG(){const N=st.N,c=P.MIDES[N].cel,w=N*c,x0=(210-w)/2,y0=(297-w)/2;
  let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${x0+w}" y="${y0-13}" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${codi()}</text>`;
  for(let i=0;i<N;i++)o+=`<text x="${x0-6}" y="${y0+i*c+c/2+2}" font-size="5.5" text-anchor="middle" ${AR}>${lletres[i]}</text><text x="${x0+i*c+c/2}" y="${y0-4}" font-size="5.5" text-anchor="middle" ${AR}>${i+1}</text>`;
  for(let r=0;r<N;r++)for(let k=0;k<N;k++)o+=`<rect x="${x0+k*c}" y="${y0+r*c}" width="${c}" height="${c}" fill="#fff" stroke="#000" stroke-width=".3"/>`+valorSVG(T[r][k],x0+k*c+c/2,y0+r*c+c/2,c);
  return o+`<rect x="${x0}" y="${y0}" width="${w}" height="${w}" fill="none" stroke="#000" stroke-width=".7"/></svg>`;}
/* ---------- plantilla de 2×2 ---------- */
function estrella(cx,cy,R){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?R*.42:R;p.push((cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2));}return p.join(' ');}
function plantillaCos(ox,oy,laser){const c=P.MIDES[st.N].cel,S=2*c+2*MARC,cut=laser?'stroke="#FF0000" stroke-width="0.01" fill="none"':'stroke="#000" stroke-width=".3"';let holes='';
  if(st.model==='barres'){const f=c-BARRA,m=BARRA/2;for(let i=0;i<2;i++)for(let j=0;j<2;j++)holes+=` M${ox+MARC+j*c+m},${oy+MARC+i*c+m} h${f} v${f} h${-f} Z`;}
  else{const f=2*c-2*MARGE;holes=` M${ox+MARC+MARGE},${oy+MARC+MARGE} h${f} v${f} h${-f} Z`;}
  let o=laser?`<path d="M${ox},${oy} h${S} v${S} h${-S} Z${holes}" ${cut}/>`:`<path d="M${ox},${oy} h${S} v${S} h${-S} Z${holes}" fill="#d4d4d4" fill-rule="evenodd" ${cut}/>`;
  const g=laser?'stroke="#0000FF" stroke-width="0.01"':'stroke="#000" stroke-width=".5"',L=5;
  for(const k of [0,1,2]){const t=MARC+k*c;o+=`<line x1="${ox+t}" y1="${oy}" x2="${ox+t}" y2="${oy+L}" ${g}/><line x1="${ox+t}" y1="${oy+S-L}" x2="${ox+t}" y2="${oy+S}" ${g}/><line x1="${ox}" y1="${oy+t}" x2="${ox+L}" y2="${oy+t}" ${g}/><line x1="${ox+S-L}" y1="${oy+t}" x2="${ox+S}" y2="${oy+t}" ${g}/>`;}
  return o+`<polygon points="${estrella(ox+MARC/2,oy+MARC/2,ESTRELLA)}" fill="#000"/>`;}
/* Sis plantilles per A4. Amb el model d'un sol forat van a l'esquerra i a la dreta hi ha com es fa la finestra plegant el paper (comu/plec.js). */
function plantillaSVG(){const c=P.MIDES[st.N].cel,S=2*c+2*MARC,un=st.model!=='barres',gx=un?7:(210-2*S)/3,x0=un?8:gx,gy=(297-3*S)/4,bx=x0+2*S+gx+8,f=2*c-2*MARGE;
  let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`;
  for(let i=0;i<3;i++)for(let j=0;j<2;j++)o+=plantillaCos(x0+j*(S+gx),gy+i*(S+gy),false);
  if(un)o+=PLEC.instruccions({x:bx,y:gy,w:202-bx,h:297-2*gy,g:{W:S,H:S,Wh:f,Hh:f,estrella:{x:MARC/2,y:MARC/2,r:ESTRELLA},cols:2,files:2}});
  return o+'</svg>';}
function plantillaLaser(){const S=2*P.MIDES[st.N].cel+2*MARC;return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}mm" height="${S}mm" viewBox="0 0 ${S} ${S}">${plantillaCos(0,0,true)}</svg>`;}
/* ---------- full de respostes, full de laberints i solucionari: una graella per dibuix ---------- */
function trenca(t,max){const out=[];let l='';for(const w of t.split(' ')){if(l&&(l+' '+w).length>max){out.push(l);l=w;}else l=l?l+' '+w:w;}if(l)out.push(l);return out;}
/* mode: 'respostes' (graelles buides), 'laberint' (graelles buides amb entrada i sortida, només els dibuixos que són laberints)
   o 'solu' (dibuixos pintats a partir dels nombres del full; als laberints, el camí en blanc). */
function graellesSVG(mode){const n=st.N-1,us=mode==='laberint'?laberints():usats(),u=80/n,w=n*u,gx=(297-3*w)/4,ple=mode==='solu';
  let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">`;
  o+=`<text x="${297-gx}" y="16" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${codi()}${ple?' · solucionari':''}</text>`;
  if(mode==='laberint')o+=`<text x="${gx}" y="26" font-size="4.8">Comença amb la plantilla a la posició A1. Mou-la d'una casella en una, amunt, avall o de costat,</text><text x="${gx}" y="32.5" font-size="4.8">passant només per posicions que compleixin la regla, fins a arribar a ${lletres[n-1]}${n}. Marca el camí.</text>`;
  else o+=`<text x="${gx}" y="30" font-size="4.8">Posa la plantilla a cada posició i pinta la casella si es compleix la regla.</text>`;
  us.forEach((k,i)=>{const x0=gx+i*(w+gx),y0=74,D=ple?P.pinta(st.tema,T,st.N,k):null,C=P.cami(st.dib[k]),lab=mode==='laberint'||(ple&&C);
    const R=trenca((mode==='laberint'?'Només es pot passar si ':'Pinta si ')+M().regles[k].text.replace(/ \(.*$/,''),38);
    o+=`<text x="${x0}" y="${y0-24}" font-size="5.2" font-weight="700">${lab?'Laberint':'Dibuix'} ${i+1}</text>`+R.map((l,j)=>`<text x="${x0}" y="${y0-17.5+j*5.2}" font-size="4.3">${esc(l)}</text>`).join('');
    for(let j=0;j<n;j++)o+=`<text x="${x0+j*u+u/2}" y="${y0-2.5}" font-size="3.6" text-anchor="middle">${j+1}</text><text x="${x0-3.5}" y="${y0+j*u+u/2+1.3}" font-size="3.6" text-anchor="middle">${lletres[j]}</text>`;
    for(let r=0;r<n;r++)for(let c=0;c<n;c++)o+=`<rect x="${x0+c*u}" y="${y0+r*u}" width="${u}" height="${u}" fill="${D&&D[r][c]==='X'?'#000':'#fff'}" stroke="#000" stroke-width=".25"/>`;
    o+=`<rect x="${x0}" y="${y0}" width="${w}" height="${w}" fill="none" stroke="#000" stroke-width=".6"/>`;
    if(mode==='laberint')o+=`<text x="${x0+u/2}" y="${y0+u/2+1.5}" font-size="4" text-anchor="middle" font-weight="700">E</text><text x="${x0+w-u/2}" y="${y0+w-u/2+1.5}" font-size="4" text-anchor="middle" font-weight="700">S</text>`;
    if(ple&&C)o+=`<polyline points="${C.map(([r,c])=>(x0+c*u+u/2).toFixed(2)+','+(y0+r*u+u/2).toFixed(2)).join(' ')}" fill="none" stroke="#fff" stroke-width="${(u*.2).toFixed(2)}" stroke-linejoin="round" stroke-linecap="round"/>`
      +`<text x="${x0}" y="${y0+w+6}" font-size="3.8">Camí de l'entrada a la sortida: ${C.length} posicions.</text>`;});
  const peu=mode==='laberint'?`E = entrada (A1), S = sortida (${lletres[n-1]}${n}). La posició és la casella que queda sota l'estrella de la plantilla.`:`La posició és la casella que queda sota l'estrella de la plantilla (a dalt a l'esquerra): de A1 a ${lletres[n-1]}${n}.`;
  return o+`<text x="${gx}" y="${74+w+14}" font-size="4.3">${peu}</text></svg>`;}
/* ---------- editor ---------- */
let pintant=null;
function editorHTML(){const n=st.N-1;let h='<div class="editor">';
  M().regles.forEach((g,k)=>{h+=`<div class="dib"><h2>Dibuix ${k+1}: es pinta si ${esc(g.text)}</h2><div class="px" data-k="${k}" style="grid-template-columns:repeat(${n},auto)">`;
    for(let r=0;r<n;r++)for(let c=0;c<n;c++)h+=`<button data-r="${r}" data-c="${c}" class="${st.dib[k][r][c]==='X'?'on':''}" aria-label="Fila ${r+1}, columna ${c+1}"></button>`;
    h+=`</div><div class="accions"><button data-a="buida" data-k="${k}">Esborra</button><button data-a="inverteix" data-k="${k}">Inverteix</button><button data-a="laberint" data-k="${k}" title="Hi posa un laberint a l'atzar">Laberint</button></div></div>`;});
  return h+'</div><p class="ajuda">Clica o arrossega per pintar. Un dibuix en blanc no es fa servir. «Laberint» hi posa un laberint a l\'atzar: llavors apareix la vista «Full de laberints», on l\'alumnat ha d\'anar de A1 a l\'última posició movent la plantilla d\'una casella en una. Quan acabis, mira «Full 1»: els nombres ja amaguen els teus dibuixos. L\'adreça de la pàgina desa els dibuixos; copia-la per recuperar-los o compartir-los.</p>';}
function posa(k,r,c,v){const f=st.dib[k][r];if((f[c]==='X')===v)return;st.dib[k][r]=f.slice(0,c)+(v?'X':'.')+f.slice(c+1);st.ex='';}
function lligaEditor(){document.querySelectorAll('.px').forEach(box=>{const k=+box.dataset.k;
    const fes=e=>{const b=e.target.closest('button[data-r]');if(!b||pintant===null)return;posa(k,+b.dataset.r,+b.dataset.c,pintant);b.classList.toggle('on',pintant);};
    box.onpointerdown=e=>{const b=e.target.closest('button[data-r]');if(!b)return;e.preventDefault();pintant=!b.classList.contains('on');fes(e);};
    box.onpointerover=fes;
    box.onkeydown=e=>{if(e.key!==' '&&e.key!=='Enter')return;const b=e.target.closest('button[data-r]');if(!b)return;e.preventDefault();const v=!b.classList.contains('on');posa(k,+b.dataset.r,+b.dataset.c,v);b.classList.toggle('on',v);canvi();};});
  document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const k=+b.dataset.k,a=b.dataset.a;
    st.dib[k]=a==='buida'?P.buit(st.N):a==='laberint'?P.laberint(st.N,1+Math.floor(Math.random()*999999)):st.dib[k].map(f=>f.replace(/[X.]/g,ch=>ch==='X'?'.':'X'));st.ex='';canvi();pinta();});}
window.addEventListener('pointerup',()=>{if(pintant!==null){pintant=null;canvi();}});
function canvi(){calcula();marca();actualitzaHash();estat(T?'Codi del full: '+codi()+'.':'No he pogut generar el full. Prova «Altres nombres».');}
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
  $('#mida').value=String(st.N);$('#tema').value=st.tema;}
function carregaEx(k){const E=P.EX[k];st.tema=E.tema;st.N=10;st.dib=E.dib.map(d=>d.slice());st.llavor='1';st.ex=k;}
/* ---------- inici ---------- */
$('#tema').innerHTML=P.ORDRE_TEMES.map(t=>`<option value="${t}">${esc(P.TEMES[t].nom)}</option>`).join('');
$('#tema').onchange=e=>{if(e.target.value===st.tema)return;st.tema=e.target.value;st.dib=[P.buit(st.N),P.buit(st.N),P.buit(st.N)];st.ex='';if(st.vista!=='plantilla')st.vista='editor';canvi();pinta();};
$('#mida').onchange=e=>{const N=+e.target.value;if(N===st.N)return;st.N=N;st.dib=[P.buit(N),P.buit(N),P.buit(N)];st.ex='';canvi();pinta();};
$('#btnNou').onclick=()=>{st.llavor=String(1+Math.floor(Math.random()*999999));st.ex='';canvi();pinta();};
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;pinta();actualitzaHash();});
$('#btnPrint').onclick=()=>window.print();
window.addEventListener('resize',escala);
window.addEventListener('beforeprint',()=>document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1)));
window.addEventListener('afterprint',escala);
function aplicaHash(){const m=/^#(?:PIN-([A-Z])|p=([0-9a-fA-Z.]+))(?:\/(editor|full|plantilla|plantilla-barres|respostes|laberint|solu))?$/.exec(location.hash);
  if(m){if(m[1]&&P.EX[m[1]])carregaEx(m[1]);else if(m[2]){const d=P.descodifica(m[2]);if(d){st.tema=d.tema;st.N=d.N;st.dib=d.dibuixos;st.llavor=d.llavor;st.ex='';}}
    st.vista=(m[3]||'editor').replace('-barres','');st.model=m[3]==='plantilla-barres'?'barres':'un';}
  calcula();pinta();estat(T?'Codi del full: '+codi()+'.':'');}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,plantillaLaser,st,pinta,laberints,get T(){return T;}};
})();
