/* Reixeta · WODB — pàgina d'impressió */
(function(){
'use strict';
const W=window.WODB,BANCS=window.BANCS,ORDRE=window.BANCS_ORDRE;
const $=s=>document.querySelector(s);
const CEL=40,FORAT=37,MARGE=(CEL-FORAT)/2,ITEM=28,MARC=24;  // mm: casella, forat, marge del forat, dibuix, marc de la plantilla
const BARRA=6,ESTRELLA=4.9;                              // mm: barres del model de quatre forats; radi de l'estrella
const FIXOS=c=>Object.keys(BANCS[c].fulls);              // fulls fixos d'un banc: A, B, C, D
const generats={};               // 'NUM-4821' -> tauler
const st={banc:'NUM',ver:'A',vista:'full',model:'un',solu:new Set(ORDRE)};   // solu: temes (els 4 fulls fixos) i fulls generats triats
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function tauler(id){const [c,v]=id.split('-');return BANCS[c].fulls[v]||generats[id];}
/* ---------- full 1 ---------- */
function fullSVG(id){const [code]=id.split('-'),B=BANCS[code],T=tauler(id),[R,C]=W.dims(B);
  const w=C*CEL,h=R*CEL,x0=(297-w)/2,y0=(210-h)/2,it=B.caixa||ITEM;let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${x0+w}" y="${y0-15}" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${id}</text>`;
  for(let r=0;r<R;r++)o+=`<text x="${x0-8}" y="${y0+r*CEL+CEL/2+2.5}" font-size="7" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${'ABCDEFGH'[r]}</text>`;
  for(let c=0;c<C;c++)o+=`<text x="${x0+c*CEL+CEL/2}" y="${y0-5}" font-size="7" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${c+1}</text>`;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){const x=x0+c*CEL,y=y0+r*CEL;
    o+=`<rect x="${x}" y="${y}" width="${CEL}" height="${CEL}" fill="#fff" stroke="#000" stroke-width=".35"/>`;
    o+=`<svg x="${x+(CEL-it)/2}" y="${y+(CEL-it)/2}" width="${it}" height="${it}" viewBox="0 0 100 100">${W.dibuixa(B,T[r*C+c])}</svg>`;}
  o+=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="#000" stroke-width=".8"/></svg>`;return o;}
/* ---------- plantilla ---------- */
function estrella(cx,cy,R){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?R*.42:R;p.push((cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2));}return p.join(' ');}
/* Dos models: 'un' = un sol forat gran (per defecte: no té cap part fràgil); 'barres' = quatre forats separats per barres de BARRA mm. */
function plantillaCos(ox,oy,laser,model){const S=2*CEL+2*MARC,cut=laser?'stroke="#FF0000" stroke-width="0.01" fill="none"':'stroke="#000" stroke-width=".3"';
  let holes='';
  if(model==='barres'){const f=CEL-BARRA,m=BARRA/2;for(let i=0;i<2;i++)for(let j=0;j<2;j++){const x=ox+MARC+j*CEL+m,y=oy+MARC+i*CEL+m;holes+=` M${x},${y} h${f} v${f} h${-f} Z`;}}
  else{const f=2*CEL-2*MARGE;holes=` M${ox+MARC+MARGE},${oy+MARC+MARGE} h${f} v${f} h${-f} Z`;}
  let o=laser?`<path d="M${ox},${oy} h${S} v${S} h${-S} Z${holes}" ${cut}/>`:`<path d="M${ox},${oy} h${S} v${S} h${-S} Z${holes}" fill="#d4d4d4" fill-rule="evenodd" ${cut}/>`;
  const g=laser?'stroke="#0000FF" stroke-width="0.01"':'stroke="#000" stroke-width=".5"',L=6;
  for(const k of [0,1,2]){const t=MARC+k*CEL;   // marques guia: continuen les línies de la graella
    o+=`<line x1="${ox+t}" y1="${oy}" x2="${ox+t}" y2="${oy+L}" ${g}/><line x1="${ox+t}" y1="${oy+S-L}" x2="${ox+t}" y2="${oy+S}" ${g}/>`;
    o+=`<line x1="${ox}" y1="${oy+t}" x2="${ox+L}" y2="${oy+t}" ${g}/><line x1="${ox+S-L}" y1="${oy+t}" x2="${ox+S}" y2="${oy+t}" ${g}/>`;}
  o+=`<polygon points="${estrella(ox+MARC/2,oy+MARC/2,ESTRELLA)}" fill="#000"/>`;return o;}   // estrella centrada a la cantonada de dalt a l'esquerra
/* Dues plantilles per A4 vertical. Amb el model d'un sol forat van a l'esquerra i a la dreta hi ha com es fa la finestra plegant el paper (comu/plec.js). */
function plantillaSVG(model){const S=2*CEL+2*MARC,un=model!=='barres',x=un?10:(210-S)/2,g=(297-2*S)/3,bx=x+S+8,f=2*CEL-2*MARGE;
  const ins=un?PLEC.instruccions({x:bx,y:g,w:202-bx,h:297-2*g,g:{W:S,H:S,Wh:f,Hh:f,estrella:{x:MARC/2,y:MARC/2,r:ESTRELLA},cols:2,files:2}}):'';
  return `<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">${plantillaCos(x,g,false,model)}${plantillaCos(x,2*g+S,false,model)}${ins}</svg>`;}
function plantillaLaser(model){const S=2*CEL+2*MARC;return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}mm" height="${S}mm" viewBox="0 0 ${S} ${S}">${plantillaCos(0,0,true,model)}</svg>`;}
/* ---------- solucionari ---------- */
const FLETXA=['↖','↗','↙','↘'];
function soluHTML(id){const [code]=id.split('-'),B=BANCS[code],T=tauler(id),[R,C]=W.dims(B);
  let o=`<div class="solu"><div class="cap"><span class="codi">${esc(id)}</span><span class="nota">Motius garantits. N'hi pot haver d'altres: qualsevol argument correcte val.</span></div><table>`;
  for(const [r,c] of W.wins(B)){const ids=W.cellsOf(B,r,c).map(i=>T[i]);o+=`<tr><td class="pos">${'ABCDEFGH'[r]}${c+1}</td>`;
    for(let k=0;k<4;k++){const et=W.etiqueta(B,ids[k]);o+=`<td><span class="el">${esc(et!=null?et:FLETXA[k])}</span> ${esc(W.motiuCurt(B,ids,k)||'—')}</td>`;}
    o+='</tr>';}
  return o+'</table></div>';}
/* ---------- pintar ---------- */
function idActual(){return st.banc+'-'+st.ver;}
function pinta(){const P=$('#pagines');let h='';
  $('#mida-pagina').textContent=st.vista==='plantilla'?'@page{size:A4 portrait;margin:0}':'@page{size:A4 landscape;margin:0}';
  if(st.vista==='full'){if(!tauler(idActual())){P.innerHTML='';return;}h=`<div class="pagina h">${fullSVG(idActual())}</div>`;}
  else if(st.vista==='plantilla')h=`<div class="pagina v">${plantillaSVG(st.model)}</div>`;
  else{const gen=[...st.solu].filter(x=>generats[x]),L=[];   // una cara per tema (fulls A–D); els fulls generats, de 4 en 4
    for(const c of ORDRE)if(st.solu.has(c))L.push(FIXOS(c).map(v=>c+'-'+v));
    for(let i=0;i<gen.length;i+=4)L.push(gen.slice(i,i+4));
    for(const g of L){h+='<div class="pagina h"><div class="solus">';for(let i=0;i<4;i++)h+=g[i]?soluHTML(g[i]):'<div class="solu"></div>';h+='</div></div>';}
    if(!L.length)h='<p>Tria almenys un tema.</p>';}
  P.innerHTML=h;escala();pintaSolu();pintaModel();}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const mm=pw.classList.contains('v')?210:297;const px=mm*96/25.4;
  const z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function pintaSolu(){const box=$('#soluTria');box.classList.toggle('amagat',st.vista!=='solu');if(st.vista!=='solu')return;
  const tots=[...ORDRE,...Object.keys(generats)];
  box.innerHTML='<span>Solucionaris (una cara per tema, amb els fulls A–D; imprimeix a doble cara):</span>'+tots.map(id=>`<label><input type="checkbox" value="${id}" ${st.solu.has(id)?'checked':''}> ${id}</label>`).join('');
  box.querySelectorAll('input').forEach(i=>i.onchange=()=>{i.checked?st.solu.add(i.value):st.solu.delete(i.value);pinta();});}
function pintaModel(){const box=$('#modelTria');box.classList.toggle('amagat',st.vista!=='plantilla');
  box.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',b.dataset.model===st.model);b.onclick=()=>{st.model=b.dataset.model;pinta();actualitzaHash();};});}
function estat(t){$('#estat').textContent=t||'';}
function actualitzaHash(){history.replaceState(null,'','#'+idActual()+(st.vista!=='full'?'/'+st.vista+(st.vista==='plantilla'&&st.model==='barres'?'-barres':''):''));}
function genera(num){const B=BANCS[st.banc],id=st.banc+'-'+num;
  if(generats[id]){st.ver=String(num);st.solu.add(id);marca();pinta();actualitzaHash();return;}
  estat('Generant el full '+id+'… (pot trigar uns segons)');$('#btnGen').disabled=true;
  setTimeout(()=>{const T=W.genera(B,num);$('#btnGen').disabled=false;
    if(!T){estat('No he trobat cap full vàlid amb el número '+num+'. Prova un altre número.');return;}
    generats[id]=T;st.solu.add(id);st.ver=String(num);estat('Full '+id+' generat. Amb el mateix número sempre surt el mateix full.');marca();pinta();actualitzaHash();},30);}
function marca(){$('#vers').innerHTML=FIXOS(st.banc).map(v=>`<button data-ver="${v}" class="${st.ver===v?'on':''}">${v}</button>`).join('');
  $('#vers').querySelectorAll('button').forEach(b=>b.onclick=()=>{st.ver=b.dataset.ver;estat('');marca();pinta();actualitzaHash();});
  document.querySelectorAll('[data-vista]').forEach(b=>b.classList.toggle('on',b.dataset.vista===st.vista));
  $('#banc').value=st.banc;if(/^\d+$/.test(st.ver))$('#num').value=st.ver;}
/* ---------- inici ---------- */
$('#banc').innerHTML=ORDRE.map(c=>`<option value="${c}">${c} · ${esc(BANCS[c].nom)}</option>`).join('');
$('#banc').onchange=e=>{st.banc=e.target.value;st.ver='A';estat('');marca();pinta();actualitzaHash();};
$('#btnGen').onclick=()=>{const n=parseInt($('#num').value,10);if(!(n>=1000&&n<=9999)){estat('Escriu un número entre 1000 i 9999.');return;}genera(n);};
$('#btnAtzar').onclick=()=>{const n=1000+Math.floor(Math.random()*9000);$('#num').value=n;genera(n);};
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;marca();pinta();actualitzaHash();});
$('#btnPrint').onclick=()=>window.print();
window.addEventListener('resize',escala);
window.addEventListener('beforeprint',()=>document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1)));
window.addEventListener('afterprint',escala);
function aplicaHash(){const m=/^#([A-Z0-9]{3})-([A-Z]|\d{4})(?:\/(full|plantilla|plantilla-barres|solu))?$/.exec(location.hash);
  if(m&&BANCS[m[1]]&&(/\d/.test(m[2])||BANCS[m[1]].fulls[m[2]])){st.banc=m[1];st.vista=(m[3]||'full').replace('-barres','');st.model=m[3]==='plantilla-barres'?'barres':'un';if(BANCS[m[1]].fulls[m[2]]){st.ver=m[2];marca();pinta();}else{marca();genera(+m[2]);}}else{marca();pinta();}}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,plantillaLaser,soluHTML,generats,st,pinta};
})();
