/* Reixeta · Constructor de WODB — eina per al professorat: graella pròpia, full fet a mà o automàtic, i plantilla pròpia. */
(function(){
'use strict';
const W=window.WODB,BANCS=window.BANCS,ORDRE=window.BANCS_ORDRE;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st={banc:'NUM',R:4,C:5,T:new Array(20).fill(-1),sel:0,pos:-1,model:'un',marc:24,estrella:true,vista:'editor'};
const LL='ABCDE',BARRA=6,MARGE=1.5;
const B=()=>BANCS[st.banc];
/* ---------- mides (mm): la casella és tan gran com permet el paper amb la plantilla a les posicions extremes ---------- */
function mides(){const m=st.marc,dalt=Math.max(m,19);                       // a dalt calen 19 mm per a les coordenades i el codi
  const cel=Math.floor(2*Math.min(40,(297-2*m)/st.C,(210-2*dalt)/st.R))/2,k=cel/40;
  return {cel,k,item:cel*((B().caixa||28)/40),w:st.C*cel,h:st.R*cel,x0:(297-st.C*cel)/2,y0:(210-st.R*cel)/2,S:2*cel+2*m};}
/* ---------- posicions ---------- */
const posicions=()=>{const out=[];for(let r=0;r<st.R-1;r++)for(let c=0;c<st.C-1;c++)out.push([r,c]);return out;};
const cells=(r,c)=>[r*st.C+c,r*st.C+c+1,(r+1)*st.C+c,(r+1)*st.C+c+1];
function estatPos(r,c){const ids=cells(r,c).map(i=>st.T[i]);if(ids.some(x=>x<0))return {t:'buit',ids};
  const claus=new Set(ids.map(i=>B().items[i].k)).size===4,mot=ids.map((_,k)=>W.motius(B(),ids,k));
  return {t:claus&&mot.every(m=>m.length)?'ok':'no',ids,mot,claus};}
function resum(){const P=posicions().map(([r,c])=>estatPos(r,c)),tc={};
  for(const p of P)if(p.t!=='buit'){const seen=new Set([].concat(...p.mot));for(const t of seen)tc[t]=(tc[t]||0)+1;}
  const top=Object.entries(tc).sort((a,b)=>b[1]-a[1])[0],plens=st.T.filter(x=>x>=0);
  return {n:P.length,ok:P.filter(p=>p.t==='ok').length,no:P.filter(p=>p.t==='no').length,top,rep:plens.length-new Set(plens).size,buides:st.T.length-plens.length,limit:Math.max(1,Math.floor(5*P.length/12))};}
/* ---------- codi i adreça ---------- */
const estatText=()=>[st.banc,st.C+'x'+st.R,st.model,st.marc,st.estrella?1:0,st.T.map(x=>x<0?'_':x.toString(36)).join('-')].join('.');
const codi=()=>st.banc+'-'+(W.hashSeed(estatText())%1679616).toString(36).toUpperCase().padStart(4,'0');
function llegeix(s){const p=s.split('.');if(p.length!==6||!BANCS[p[0]])return false;const g=/^(\d)x(\d)$/.exec(p[1]);if(!g)return false;const C=+g[1],R=+g[2];
  if(C<2||C>7||R<2||R>5)return false;const T=p[5].split('-').map(x=>x==='_'?-1:parseInt(x,36));
  if(T.length!==R*C||T.some(x=>!(x>=-1&&x<BANCS[p[0]].items.length)))return false;
  Object.assign(st,{banc:p[0],C,R,T,model:p[2]==='barres'?'barres':'un',marc:[15,20,24].includes(+p[3])?+p[3]:24,estrella:p[4]==='1',sel:0,pos:-1});return true;}
function desa(){history.replaceState(null,'','#c='+estatText()+(st.vista!=='editor'?'/'+st.vista:''));}
/* ---------- full 1 ---------- */
function fullSVG(){const M=mides(),{cel,k,x0,y0,w,h,item}=M,f=Math.max(4.5,7*k);
  let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${x0+w}" y="${y0-5-f-3}" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${codi()}</text>`;
  for(let r=0;r<st.R;r++)o+=`<text x="${x0-8}" y="${y0+r*cel+cel/2+f*.36}" font-size="${f}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${LL[r]}</text>`;
  for(let c=0;c<st.C;c++)o+=`<text x="${x0+c*cel+cel/2}" y="${y0-5}" font-size="${f}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${c+1}</text>`;
  for(let r=0;r<st.R;r++)for(let c=0;c<st.C;c++){const x=x0+c*cel,y=y0+r*cel,id=st.T[r*st.C+c];
    o+=`<rect x="${x}" y="${y}" width="${cel}" height="${cel}" fill="#fff" stroke="#000" stroke-width=".35"/>`;
    if(id>=0)o+=`<svg x="${x+(cel-item)/2}" y="${y+(cel-item)/2}" width="${item}" height="${item}" viewBox="0 0 100 100">${W.dibuixa(B(),id)}</svg>`;}
  return o+`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="#000" stroke-width=".8"/></svg>`;}
/* ---------- plantilla ---------- */
function estrella(cx,cy,R){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?R*.42:R;p.push((cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2));}return p.join(' ');}
function plantillaCos(ox,oy,laser){const {cel,S}=mides(),m=st.marc,cut=laser?'stroke="#FF0000" stroke-width="0.01" fill="none"':'stroke="#000" stroke-width=".3"';let holes='';
  if(st.model==='barres'){const f=cel-BARRA,b=BARRA/2;for(let i=0;i<2;i++)for(let j=0;j<2;j++)holes+=` M${ox+m+j*cel+b},${oy+m+i*cel+b} h${f} v${f} h${-f} Z`;}
  else{const f=2*cel-2*MARGE;holes=` M${ox+m+MARGE},${oy+m+MARGE} h${f} v${f} h${-f} Z`;}
  let o=laser?`<path d="M${ox},${oy} h${S} v${S} h${-S} Z${holes}" ${cut}/>`:`<path d="M${ox},${oy} h${S} v${S} h${-S} Z${holes}" fill="#d4d4d4" fill-rule="evenodd" ${cut}/>`;
  const g=laser?'stroke="#0000FF" stroke-width="0.01"':'stroke="#000" stroke-width=".5"',L=Math.min(6,m/2.5);
  for(const k of [0,1,2]){const t=m+k*cel;o+=`<line x1="${ox+t}" y1="${oy}" x2="${ox+t}" y2="${oy+L}" ${g}/><line x1="${ox+t}" y1="${oy+S-L}" x2="${ox+t}" y2="${oy+S}" ${g}/><line x1="${ox}" y1="${oy+t}" x2="${ox+L}" y2="${oy+t}" ${g}/><line x1="${ox+S-L}" y1="${oy+t}" x2="${ox+S}" y2="${oy+t}" ${g}/>`;}
  if(st.estrella)o+=`<polygon points="${estrella(ox+m/2,oy+m/2,m*.2)}" fill="#000"/>`;return o;}
function plantillaSVG(){const S=mides().S,n=Math.max(1,Math.floor(297/(S+8))),x=(210-S)/2,g=(297-n*S)/(n+1);let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`;
  for(let i=0;i<n;i++)o+=plantillaCos(x,g+i*(S+g),false);return o+'</svg>';}
function plantillaLaser(){const S=mides().S;return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${S}mm" height="${S}mm" viewBox="0 0 ${S} ${S}">${plantillaCos(0,0,true)}</svg>`;}
/* ---------- solucionari ---------- */
const FLETXA=['↖','↗','↙','↘'];
function soluHTML(){const P=posicions(),fs=P.length<=12?3.4:P.length<=18?2.9:2.5;
  let o=`<div class="csolu"><div class="cap"><span class="codi">${esc(codi())}</span><span class="nota">Motius garantits. N'hi pot haver d'altres: qualsevol argument correcte val.</span></div><table style="font-size:${fs}mm;line-height:${fs*1.15}mm">`;
  for(const [r,c] of P){const e=estatPos(r,c);o+=`<tr><td class="p">${LL[r]}${c+1}</td>`;
    if(e.t==='buit')o+='<td colspan="4">(posició incompleta)</td>';
    else for(let k=0;k<4;k++){const et=W.etiqueta(B(),e.ids[k]);o+=`<td><span class="el">${esc(et!=null?et:FLETXA[k])}</span> ${esc(W.motiuCurt(B(),e.ids,k)||'— sense motiu a la llista')}</td>`;}
    o+='</tr>';}
  return o+'</table></div>';}
/* ---------- editor ---------- */
function editorHTML(){const cont=document.documentElement.clientWidth,s=Math.max(44,Math.min(88,Math.floor((Math.min(cont,640)-40)/st.C)));
  let h=`<div class="cons"><div class="tauler" style="grid-template-columns:repeat(${st.C},${s}px);grid-auto-rows:${s}px">`;
  const vis=st.pos>=0?cells(...posicions()[st.pos]):[];
  for(let i=0;i<st.R*st.C;i++){const id=st.T[i];h+=`<button class="cas${i===st.sel?' sel':''}${vis.includes(i)?' vista':''}" data-i="${i}" aria-label="Casella ${LL[Math.floor(i/st.C)]}${i%st.C+1}">${id>=0?`<svg viewBox="0 0 100 100">${W.dibuixa(B(),id)}</svg>`:''}</button>`;}
  posicions().forEach(([r,c],k)=>{const e=estatPos(r,c);h+=`<button class="pos ${e.t}${k===st.pos?' act':''}" data-p="${k}" style="left:${(c+1)*s}px;top:${(r+1)*s}px" title="Posició ${LL[r]}${c+1}" aria-label="Posició ${LL[r]}${c+1}">${e.t==='ok'?'✓':e.t==='no'?'✗':''}</button>`;});
  h+='</div><div class="panell">'+panellHTML()+'</div></div>';return h;}
function panellHTML(){const R=resum();let h=`<div class="resum"><span>Posicions vàlides: <b>${R.ok} de ${R.n}</b></span>${R.no?`<span class="cap">No vàlides: ${R.no}</span>`:''}${R.buides?`<span>Caselles buides: <b>${R.buides}</b></span>`:''}${R.rep?`<span class="cap">Elements repetits: ${R.rep}</span>`:''}</div>`;
  if(R.top)h+=`<p style="margin:0 0 8px">Motiu que més surt: «${esc(R.top[0].replace(/^És /,''))}», en <b>${R.top[1]}</b> de ${R.n} posicions (regla dels 5/12: com a molt ${R.limit}).</p>`;
  if(st.pos<0)return h+'<p>Clica una casella i després un element de la llista de sota per posar-l\'hi. Els cercles marquen cada posició de la plantilla: verd si és un WODB vàlid, vermell si no. Clica un cercle per veure\'n els motius.</p>';
  const [r,c]=posicions()[st.pos],e=estatPos(r,c);h+=`<h2>Posició ${LL[r]}${c+1}</h2>`;
  if(e.t==='buit')return h+'<p>Falten elements en aquesta posició.</p>';
  if(!e.claus)h+='<p class="cap">Hi ha dos elements iguals.</p>';
  e.ids.forEach((id,k)=>{h+=`<div class="it"><svg viewBox="0 0 100 100">${W.dibuixa(B(),id)}</svg><div>${e.mot[k].length?'<ul>'+e.mot[k].map(m=>`<li>${esc(m)}</li>`).join('')+'</ul>':'<span class="cap">Cap motiu de la llista el distingeix dels altres tres.</span>'}</div></div>`;});
  return h;}
function paletaHTML(){return `<div class="paleta"><h2>Elements de «${esc(B().nom)}» (${B().items.length}). Els que ja són al full surten apagats.</h2><div class="els">${B().items.map((_,i)=>`<button data-el="${i}" class="${st.T.includes(i)?'usat':''}"><svg viewBox="0 0 100 100">${W.dibuixa(B(),i)}</svg></button>`).join('')}</div></div>`;}
let paletaBanc=null;
function pintaEditor(){const P=$('#pagines');
  if(paletaBanc!==st.banc||!P.querySelector('.paleta')){P.innerHTML='<div id="zona"></div>'+paletaHTML();paletaBanc=st.banc;
    P.querySelector('.paleta').onclick=e=>{const b=e.target.closest('[data-el]');if(!b)return;st.T[st.sel]=+b.dataset.el;const n=st.T.indexOf(-1,st.sel+1);st.sel=n>=0?n:(st.T.indexOf(-1)>=0?st.T.indexOf(-1):Math.min(st.sel+1,st.T.length-1));canvi();};}
  else P.querySelectorAll('.paleta [data-el]').forEach(b=>b.classList.toggle('usat',st.T.includes(+b.dataset.el)));
  const z=$('#zona');z.innerHTML=editorHTML();
  z.querySelectorAll('.cas').forEach(b=>b.onclick=()=>{st.sel=+b.dataset.i;pintaEditor();});
  z.querySelectorAll('.cas').forEach(b=>b.ondblclick=()=>{st.T[+b.dataset.i]=-1;canvi();});
  z.querySelectorAll('.pos').forEach(b=>b.onclick=()=>{st.pos=st.pos===+b.dataset.p?-1:+b.dataset.p;pintaEditor();});}
/* ---------- pintar ---------- */
function pinta(){const P=$('#pagines');
  $('#mida-pagina').textContent=st.vista==='plantilla'?'@page{size:A4 portrait;margin:0}':'@page{size:A4 landscape;margin:0}';
  $('#btnLaser').classList.toggle('amagat',st.vista!=='plantilla');
  if(st.vista==='editor'){pintaEditor();return;}
  paletaBanc=null;
  P.innerHTML=st.vista==='full'?`<div class="pagina h">${fullSVG()}</div>`:st.vista==='plantilla'?`<div class="pagina v">${plantillaSVG()}</div>`:`<div class="pagina h">${soluHTML()}</div>`;escala();}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const mm=pw.classList.contains('v')?210:297,px=mm*96/25.4;
  const z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function estat(t){$('#estat').textContent=t||'';}
function missatge(){const R=resum(),M=mides();
  estat(`Codi ${codi()} · casella de ${M.cel} mm, plantilla de ${M.S} mm. `+(R.buides?`Falten ${R.buides} caselles.`:R.ok===R.n?'Totes les posicions són vàlides.':`Hi ha ${R.n-R.ok} posicions que no són un WODB vàlid.`));}
function canvi(){desa();marca();pinta();missatge();}
function marca(){$('#banc').value=st.banc;$('#cols').value=st.C;$('#files').value=st.R;$('#model').value=st.model;$('#marc').value=st.marc;$('#estrella').checked=st.estrella;
  document.querySelectorAll('[data-vista]').forEach(b=>b.classList.toggle('on',b.dataset.vista===st.vista));}
function nouTauler(){st.T=new Array(st.R*st.C).fill(-1);st.sel=0;st.pos=-1;}
/* Omple sol: mateix cercador que «Full nou», amb el límit d'equilibri més baix que trobi per a aquesta graella. */
function omple(){const B2=Object.assign({},B(),{rows:st.R,cols:st.C}),n=W.wins(B2).length,llavor=Math.floor(Math.random()*1e9);
  for(let cap=Math.max(1,Math.floor(5*n/12));cap<=n;cap++)for(let a=0;a<3;a++){const Bd=W.cercaFull(B2,W.mulberry32(W.hashSeed(llavor+'-'+cap+'-'+a)),cap);if(Bd){st.T=Bd;st.sel=0;st.pos=-1;return true;}}
  return false;}
/* ---------- inici ---------- */
$('#banc').innerHTML=ORDRE.map(c=>`<option value="${c}">${c} · ${esc(BANCS[c].nom)}</option>`).join('');
$('#cols').innerHTML=[2,3,4,5,6,7].map(n=>`<option>${n}</option>`).join('');$('#files').innerHTML=[2,3,4,5].map(n=>`<option>${n}</option>`).join('');
$('#banc').onchange=e=>{st.banc=e.target.value;nouTauler();canvi();};
$('#cols').onchange=e=>{st.C=+e.target.value;nouTauler();canvi();};
$('#files').onchange=e=>{st.R=+e.target.value;nouTauler();canvi();};
$('#model').onchange=e=>{st.model=e.target.value;canvi();};
$('#marc').onchange=e=>{st.marc=+e.target.value;canvi();};
$('#estrella').onchange=e=>{st.estrella=e.target.checked;canvi();};
$('#btnBuida').onclick=()=>{nouTauler();canvi();};
$('#btnOmple').onclick=()=>{estat('Buscant un full…');$('#btnOmple').disabled=true;setTimeout(()=>{const ok=omple();$('#btnOmple').disabled=false;canvi();if(!ok)estat('No he trobat cap full amb totes les posicions vàlides per a aquesta graella. Prova-ho una altra vegada o fes-la més petita.');},30);};
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;canvi();});
$('#btnPrint').onclick=()=>window.print();
$('#btnLaser').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([plantillaLaser()],{type:'image/svg+xml'}));a.download='plantilla-'+codi()+'.svg';document.body.appendChild(a);a.click();a.remove();};
window.addEventListener('resize',()=>{if(st.vista==='editor')pintaEditor();else escala();});
window.addEventListener('beforeprint',()=>document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1)));
window.addEventListener('afterprint',escala);
function aplicaHash(){const m=/^#c=([^/]+)(?:\/(editor|full|plantilla|solu))?$/.exec(location.hash);if(m&&llegeix(decodeURIComponent(m[1])))st.vista=m[2]||'editor';marca();pinta();missatge();}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__constructor={st,resum,mides,omple,canvi,estatText,codi,plantillaLaser,estatPos,posicions};
})();
