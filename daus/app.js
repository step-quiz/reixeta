/* Reixeta · Daus i successos — pàgina d'impressió: full de les 36 tirades, una fitxa per succés, full de preguntes i solucionari */
(function(){
'use strict';
const K=window.DAUS,N=K.N;
const $=s=>document.querySelector(s);
const CEL=26,INSET=3,MARC=20,ESTRELLA=4.5,DAU=8.5,SEP=1.5;       // mm: casella, marge del forat (barres de 6 mm), marc de la fitxa, estrella, costat i separació dels daus
const S=N*CEL+2*MARC,X0=(210-N*CEL)/2,Y0=52;                     // fitxa de 196 mm; graella del full 1
const AR='font-family="Arial,Helvetica,sans-serif"';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st={tria:K.PER_DEFECTE.slice(),vista:'full'};
const triats=()=>K.ORDRE.filter(id=>st.tria.includes(id));
/* ---------- full 1: les 36 tirades. El dau blanc és el primer i el gris, el segon ---------- */
const PUNTS={1:[[1,1]],2:[[0,0],[2,2]],3:[[0,0],[1,1],[2,2]],4:[[0,0],[2,0],[0,2],[2,2]],5:[[0,0],[2,0],[1,1],[0,2],[2,2]],6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]]};
function dau(x,y,v,fosc){let o=`<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${DAU}" height="${DAU}" rx="1.3" fill="${fosc?'#555':'#fff'}" stroke="#000" stroke-width=".3"/>`;
  for(const [a,b] of PUNTS[v])o+=`<circle cx="${(x+DAU*(.25+.25*a)).toFixed(2)}" cy="${(y+DAU*(.25+.25*b)).toFixed(2)}" r="${(DAU*.085).toFixed(2)}" fill="${fosc?'#fff':'#000'}"/>`;return o;}
function fullSVG(){const w=N*CEL;let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${X0+w}" y="${Y0-8}" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">DAUS</text>`;
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){const x=X0+c*CEL,y=Y0+r*CEL,dx=x+(CEL-2*DAU-SEP)/2,dy=y+(CEL-DAU)/2;
    o+=`<rect x="${x}" y="${y}" width="${CEL}" height="${CEL}" fill="#fff" stroke="#000" stroke-width=".35"/>`+dau(dx,dy,r+1,false)+dau(dx+DAU+SEP,dy,c+1,true);}
  return o+`<rect x="${X0}" y="${Y0}" width="${w}" height="${w}" fill="none" stroke="#000" stroke-width=".8"/></svg>`;}
/* ---------- fitxes: una per succés ---------- */
function estrella(cx,cy,R){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?R*.42:R;p.push((cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2));}return p.join(' ');}
const forma=id=>K.forats(K.caselles(id),CEL,INSET);
/* Si la fitxa té un sol forat rectangular es pot fer plegant i amb un sol tall (comu/plec.js): torna la geometria, o null. */
function plegable(id){const F=forma(id);if(F.vores.length!==1||F.vores[0].length!==4)return null;const xs=F.vores[0].map(p=>p[0]),ys=F.vores[0].map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
  return {W:S,H:S,Wh:w,Hh:h,fx:MARC+x,fy:MARC+y,salt:15,estrella:{x:MARC/2,y:MARC/2,r:ESTRELLA},cols:Math.round((w+2*INSET)/CEL),files:Math.round((h+2*INSET)/CEL)};}
function fitxaCos(id,ox,oy,laser){const F=forma(id);let d=`M${ox},${oy} h${S} v${S} h${-S} Z`;
  for(const pol of F.vores)d+=' M'+pol.map(p=>(ox+MARC+p[0])+','+(oy+MARC+p[1])).join(' L')+' Z';
  return `<path class="fitxa" data-id="${id}" d="${d}" ${laser?'stroke="#FF0000" stroke-width="0.01" fill="none"':'fill="#d4d4d4" fill-rule="evenodd" stroke="#000" stroke-width=".3"'}/><polygon points="${estrella(ox+MARC/2,oy+MARC/2,ESTRELLA)}" fill="#000"/>`
    +`<text x="${ox+MARC+2}" y="${oy+MARC/2+2.2}" font-size="6" font-weight="700" ${AR}>${id} · ${esc(K.SUCCESSOS[id].text)}</text>`;}
function fitxaSVG(id){const g=plegable(id),x=(210-S)/2,y=g?10:24,F=forma(id),yn=y+S+9+2*5.6+2;
  return `<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">${fitxaCos(id,x,y,false)}`
    +[`Fitxa del succés ${id}: té forat a les ${K.quantes(K.caselles(id))} tirades on passa. Es posa sobre el full amb l'estrella a dalt a l'esquerra.`,
      `Retalla el contorn i ${F.vores.length===1?'el forat':'els '+F.vores.length+' forats'} amb cúter i regle (${F.talls} talls rectes)${g?', amb la talladora làser o plegant-la com es veu a sota.':' o amb la talladora làser. Fes-ho abans de plastificar.'}`]
      .map((t,i)=>`<text x="${x}" y="${y+S+9+i*5.6}" font-size="3.8" ${AR}>${t}</text>`).join('')
    +(g?PLEC.marques(g,x,y)+PLEC.instruccions({mode:'fila',x,y:yn,w:S,h:291-yn,g}):'')+'</svg>';}
function fitxaLaser(id){return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${S}mm" height="${S}mm" viewBox="0 0 ${S} ${S}">${fitxaCos(id,0,0,true)}</svg>`;}
/* ---------- full de preguntes i solucionari ---------- */
const fr=f=>f?(f[1]===1?String(f[0]):f[0]+'/'+f[1]):'';
function taules(ple){const T=triats(),pars=[];for(let a=0;a<T.length;a++)for(let b=a+1;b<T.length;b++)pars.push(K.parella(T[a],T[b]));
  const cap=`<div class="cap"><span class="codi">DAUS${ple?' · solucionari':''}</span><span class="nota">Dos daus: 36 tirades igual de probables. Cada fitxa té forat a les tirades on passa el seu succés.</span></div>`;
  const t1=`<table class="un"><tr><th>Fitxa</th><th>Succés</th><th>Tirades (forats)</th><th>Probabilitat</th></tr>`+T.map(id=>{const n=K.quantes(K.caselles(id));
    return `<tr><td class="id">${id}</td><td class="t">${esc(K.SUCCESSOS[id].text)}</td><td>${ple?n:''}</td><td>${ple?fr(K.frac(n,36)):''}</td></tr>`;}).join('')+'</table>';
  const capP=`<tr><th>Fitxes</th><th>Es veuen<br>(X i Y)</th><th>P(X i Y)</th><th>P(Y | X)</th><th>P(X | Y)</th><th>Independents?</th><th>Incompatibles?</th></tr>`;
  const fila=p=>`<tr><td class="id">X = ${p.x}, Y = ${p.y}</td><td>${ple?p.nxy:''}</td><td>${ple?fr(p.pxy):''}</td><td>${ple?fr(p.pyx):''}</td><td>${ple?fr(p.pxy_y):''}</td><td>${ple?(p.independents?'sí':'no'):''}</td><td>${ple?(p.incompatibles?'sí':'no'):''}</td></tr>`;
  const ajuda=`<p class="ajuda">Posa la fitxa X sobre el full i, a sobre, la fitxa Y: només es veuen les tirades on passen totes dues coses. P(Y | X) és el que es veu dividit pels forats de X. Dos successos són independents si P(X i Y) = P(X) · P(Y), i incompatibles si no poden passar alhora.</p>`;
  const repte=T.includes('A')?`<p class="ajuda"><b>Repte.</b> Dissenya una fitxa de 12 forats que sigui independent de la fitxa A. Quants forats ha de tenir a les files parelles?${ple?' <b>Resposta:</b> 6 a les files parelles i 6 a les senars, perquè P(X i A) ha de ser 12/36 · 18/36 = 6/36.':''}</p>`:'';
  const pags=[];let i=0;const primer=15,resta=26;
  pags.push(`<div class="pagina v"><div class="dtaules">${cap}${t1}${pars.length?ajuda+`<table class="dos">${capP}${pars.slice(0,primer).map(fila).join('')}</table>`:''}${pars.length<=primer?repte:''}</div></div>`);
  for(i=primer;i<pars.length;i+=resta)pags.push(`<div class="pagina v"><div class="dtaules">${cap}<table class="dos">${capP}${pars.slice(i,i+resta).map(fila).join('')}</table>${i+resta>=pars.length?repte:''}</div></div>`);
  return pags.join('');}
/* ---------- pintar ---------- */
function pinta(){const P=$('#pagines'),T=triats();let h='';
  if(st.vista==='full')h=`<div class="pagina v">${fullSVG()}</div>`;
  else if(!T.length)h='<p class="buit">Tria almenys un succés.</p>';
  else if(st.vista==='fitxes')h=T.map(id=>`<div class="pagina v">${fitxaSVG(id)}</div>`).join('');
  else h=taules(st.vista==='solu');
  P.innerHTML=h;escala();marca();}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const px=210*96/25.4,z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function marca(){document.querySelectorAll('[data-vista]').forEach(b=>b.classList.toggle('on',b.dataset.vista===st.vista));
  $('#tria').innerHTML='<span>Successos:</span>'+K.ORDRE.map(id=>`<label title="${esc(K.SUCCESSOS[id].text)}"><input type="checkbox" value="${id}" ${st.tria.includes(id)?'checked':''}> ${id} · ${esc(K.SUCCESSOS[id].text)}</label>`).join('');
  $('#tria').querySelectorAll('input').forEach(i=>i.onchange=()=>{if(i.checked)st.tria.push(i.value);else st.tria=st.tria.filter(x=>x!==i.value);pinta();actualitzaHash();});
  $('#laser').innerHTML=st.vista==='fitxes'?'<span>SVG per al làser:</span>'+triats().map(id=>`<button data-laser="${id}">${id}</button>`).join(''):'';
  $('#laser').querySelectorAll('button').forEach(b=>b.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([fitxaLaser(b.dataset.laser)],{type:'image/svg+xml'}));a.download='daus-fitxa-'+b.dataset.laser+'-tall-laser.svg';document.body.appendChild(a);a.click();a.remove();});}
function actualitzaHash(){history.replaceState(null,'','#s='+triats().join('')+(st.vista!=='full'?'/'+st.vista:''));}
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;pinta();actualitzaHash();});
$('#btnPrint').onclick=()=>window.print();
window.addEventListener('resize',escala);
window.addEventListener('beforeprint',()=>document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1)));
window.addEventListener('afterprint',escala);
function aplicaHash(){const m=/^#(?:s=([A-I]*))?(?:\/(full|fitxes|preguntes|solu))?$/.exec(location.hash);
  if(m){if(m[1]!==undefined)st.tria=K.ORDRE.filter(id=>m[1].includes(id));st.vista=m[2]||'full';}pinta();}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,fitxaSVG,fitxaLaser,forma,plegable,st,pinta,mides:{CEL,INSET,MARC,S,X0,Y0,DAU,SEP}};
})();
