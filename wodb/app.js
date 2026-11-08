/* Reixeta · WODB — pàgina d'impressió */
(function(){
'use strict';
const W=window.WODB,BANCS=window.BANCS,ORDRE=window.BANCS_ORDRE;
const $=s=>document.querySelector(s);
const CEL=26,FORAT=23,MARGE=(CEL-FORAT)/2;
const generats={};               // 'NUM-4821' -> tauler
const st={banc:'NUM',ver:'A',vista:'full',solu:new Set(ORDRE.map(c=>c+'-A'))};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function tauler(id){const [c,v]=id.split('-');return v==='A'?BANCS[c].fulls.A:generats[id];}
/* ---------- full 1 ---------- */
function fullSVG(id){const [code]=id.split('-'),B=BANCS[code],T=tauler(id),[R,C]=W.dims(B);
  const w=C*CEL,h=R*CEL,x0=(297-w)/2,y0=(210-h)/2;let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${x0+w}" y="${y0-12}" font-size="4.6" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${id}</text>`;
  for(let r=0;r<R;r++)o+=`<text x="${x0-6}" y="${y0+r*CEL+CEL/2+2}" font-size="5.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${'ABCDEFGH'[r]}</text>`;
  for(let c=0;c<C;c++)o+=`<text x="${x0+c*CEL+CEL/2}" y="${y0-4}" font-size="5.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${c+1}</text>`;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){const x=x0+c*CEL,y=y0+r*CEL;
    o+=`<rect x="${x}" y="${y}" width="${CEL}" height="${CEL}" fill="#fff" stroke="#000" stroke-width=".3"/>`;
    o+=`<svg x="${x+MARGE+.6}" y="${y+MARGE+.6}" width="${FORAT-1.2}" height="${FORAT-1.2}" viewBox="0 0 100 100">${W.dibuixa(B,T[r*C+c])}</svg>`;}
  o+=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="#000" stroke-width=".7"/></svg>`;return o;}
/* ---------- plantilla ---------- */
function estrella(cx,cy,R){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?R*.42:R;p.push((cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2));}return p.join(' ');}
function plantillaCos(ox,oy,laser){const S=4*CEL,cut=laser?'stroke="#FF0000" stroke-width="0.01" fill="none"':'stroke="#000" stroke-width=".3"';
  let holes='';for(let i=0;i<2;i++)for(let j=0;j<2;j++){const x=ox+CEL+j*CEL+MARGE,y=oy+CEL+i*CEL+MARGE;holes+=` M${x},${y} h${FORAT} v${FORAT} h${-FORAT} Z`;}
  let o=laser?`<path d="M${ox},${oy} h${S} v${S} h${-S} Z${holes}" ${cut}/>`:`<path d="M${ox},${oy} h${S} v${S} h${-S} Z${holes}" fill="#d4d4d4" fill-rule="evenodd" ${cut}/>`;
  const g=laser?'stroke="#0000FF" stroke-width="0.01"':'stroke="#000" stroke-width=".5"';
  for(const k of [1,2,3]){const t=k*CEL;
    o+=`<line x1="${ox+t}" y1="${oy}" x2="${ox+t}" y2="${oy+8}" ${g}/><line x1="${ox+t}" y1="${oy+S-8}" x2="${ox+t}" y2="${oy+S}" ${g}/>`;
    o+=`<line x1="${ox}" y1="${oy+t}" x2="${ox+8}" y2="${oy+t}" ${g}/><line x1="${ox+S-8}" y1="${oy+t}" x2="${ox+S}" y2="${oy+t}" ${g}/>`;}
  o+=`<polygon points="${estrella(ox+19,oy+19,3.6)}" fill="#000"/>`;return o;}
function plantillaSVG(){return `<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">${plantillaCos(53,28,false)}${plantillaCos(53,165,false)}</svg>`;}
function plantillaLaser(){return `<svg xmlns="http://www.w3.org/2000/svg" width="104mm" height="104mm" viewBox="0 0 104 104">${plantillaCos(0,0,true)}</svg>`;}
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
  else if(st.vista==='plantilla')h=`<div class="pagina v">${plantillaSVG()}</div>`;
  else{const L=[...st.solu].filter(tauler);for(let i=0;i<L.length;i+=2)h+=`<div class="pagina h"><div class="solus">${soluHTML(L[i])}${L[i+1]?soluHTML(L[i+1]):'<div class="solu"></div>'}</div></div>`;
    if(!L.length)h='<p>Tria almenys un full.</p>';}
  P.innerHTML=h;escala();pintaSolu();}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const mm=pw.classList.contains('v')?210:297;const px=mm*96/25.4;
  const z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function pintaSolu(){const box=$('#soluTria');box.classList.toggle('amagat',st.vista!=='solu');if(st.vista!=='solu')return;
  const tots=[...ORDRE.map(c=>c+'-A'),...Object.keys(generats)];
  box.innerHTML='<span>Solucionaris (2 per cara; imprimeix a doble cara, gir per la vora curta):</span>'+tots.map(id=>`<label><input type="checkbox" value="${id}" ${st.solu.has(id)?'checked':''}> ${id}</label>`).join('');
  box.querySelectorAll('input').forEach(i=>i.onchange=()=>{i.checked?st.solu.add(i.value):st.solu.delete(i.value);pinta();});}
function estat(t){$('#estat').textContent=t||'';}
function actualitzaHash(){history.replaceState(null,'','#'+idActual()+(st.vista!=='full'?'/'+st.vista:''));}
function genera(num){const B=BANCS[st.banc],id=st.banc+'-'+num;
  if(generats[id]){st.ver=String(num);marca();pinta();actualitzaHash();return;}
  estat('Generant el full '+id+'… (pot trigar uns segons)');$('#btnGen').disabled=true;
  setTimeout(()=>{const T=W.genera(B,num);$('#btnGen').disabled=false;
    if(!T){estat('No he trobat cap full vàlid amb el número '+num+'. Prova un altre número.');return;}
    generats[id]=T;st.solu.add(id);st.ver=String(num);estat('Full '+id+' generat. Amb el mateix número sempre surt el mateix full.');marca();pinta();actualitzaHash();},30);}
function marca(){$('#btnA').classList.toggle('on',st.ver==='A');document.querySelectorAll('[data-vista]').forEach(b=>b.classList.toggle('on',b.dataset.vista===st.vista));
  $('#banc').value=st.banc;if(st.ver!=='A')$('#num').value=st.ver;}
/* ---------- inici ---------- */
$('#banc').innerHTML=ORDRE.map(c=>`<option value="${c}">${c} · ${esc(BANCS[c].nom)}</option>`).join('');
$('#banc').onchange=e=>{st.banc=e.target.value;st.ver='A';estat('');marca();pinta();actualitzaHash();};
$('#btnA').onclick=()=>{st.ver='A';estat('');marca();pinta();actualitzaHash();};
$('#btnGen').onclick=()=>{const n=parseInt($('#num').value,10);if(!(n>=1000&&n<=9999)){estat('Escriu un número entre 1000 i 9999.');return;}genera(n);};
$('#btnAtzar').onclick=()=>{const n=1000+Math.floor(Math.random()*9000);$('#num').value=n;genera(n);};
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;marca();pinta();actualitzaHash();});
$('#btnPrint').onclick=()=>window.print();
window.addEventListener('resize',escala);
window.addEventListener('beforeprint',()=>document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1)));
window.addEventListener('afterprint',escala);
function aplicaHash(){const m=/^#([A-Z0-9]{3})-(A|\d{4})(?:\/(full|plantilla|solu))?$/.exec(location.hash);
  if(m&&BANCS[m[1]]){st.banc=m[1];st.vista=m[3]||'full';if(m[2]==='A'){st.ver='A';marca();pinta();}else{marca();genera(+m[2]);}}else{marca();pinta();}}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,plantillaLaser,soluHTML,generats,st,pinta};
})();
