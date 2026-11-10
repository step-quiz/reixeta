/* Reixeta · Sanefa trencada — pàgina d'impressió */
(function(){
'use strict';
const S=window.SANEFA;
const $=s=>document.querySelector(s);
const M=16,GAP=3,MARC=12,JOC=.6,OSCA=6;          // mm: caixa del motiu, separació entre sanefes, marc de la plantilla, joc del forat, osca
const FIXOS=['1','2'];                           // fulls fixos de cada motiu
const st={motiu:'BOT',ver:'1',vista:'full',tria:new Set([].concat(...S.ORDRE.map(m=>FIXOS.map(v=>'SAN-'+m+v))))};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cache={};
function full(id){const m=/^SAN-([A-Z]{3})(\d+)$/.exec(id);return cache[id]||(cache[id]=S.genera(m[1],m[2]));}
const motiuDe=id=>id.slice(4,7);
/* ---------- full 1: set sanefes ---------- */
function fullSVG(id){const F=full(id),mo=motiuDe(id),w=S.N*M,files=F.reduce((a,s)=>a+s.cel.length,0),h=files*M+(F.length-1)*GAP,x0=(297-w)/2;let y=(210-h)/2+2;
  let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${x0+w}" y="${y-10.5}" font-size="4.8" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${id}</text>`;
  for(let i=0;i<S.N;i++)o+=`<text x="${x0+i*M+M/2}" y="${y-3.5}" font-size="5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${i+1}</text>`;
  F.forEach((s,k)=>{const hh=s.cel.length*M;o+=`<text x="${x0-7}" y="${y+hh/2+1.8}" font-size="5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${'ABCDEFG'[k]}</text>`;
    s.cel.forEach((f,r)=>f.forEach((or,i)=>{o+=S.motiuSVG(mo,or,x0+i*M,y+r*M,M);}));
    o+=`<rect x="${x0}" y="${y}" width="${w}" height="${hh}" fill="none" stroke="#000" stroke-width=".35"/>`;y+=hh+GAP;});
  return o+'</svg>';}
/* ---------- plantilla: targeta amb el forat del motiu i una osca a la cantonada de dalt a l'esquerra ---------- */
function plantillaCos(mo,ox,oy,laser){const Sz=M+2*MARC,pts=S.foratPunts(mo,ox+MARC,oy+MARC,M,JOC);
  const d=`M${ox+OSCA},${oy} L${ox+Sz},${oy} L${ox+Sz},${oy+Sz} L${ox},${oy+Sz} L${ox},${oy+OSCA} Z M${pts.map(p=>p.join(',')).join(' L')} Z`;
  return laser?`<path d="${d}" stroke="#FF0000" stroke-width="0.01" fill="none"/>`:`<path d="${d}" fill="#d4d4d4" fill-rule="evenodd" stroke="#000" stroke-width=".3"/>`;}
function plantillaSVG(){const Sz=M+2*MARC,n=4,gx=(210-n*Sz)/(n+1);let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`;
  S.ORDRE.forEach((mo,r)=>{const y=22+r*(Sz+24);o+=`<text x="${gx}" y="${y-4}" font-size="4.5" font-family="Arial,Helvetica,sans-serif">${esc(S.MOTIUS[mo].nom)} · fulls SAN-${mo}</text>`;
    for(let i=0;i<n;i++)o+=plantillaCos(mo,gx+i*(Sz+gx),y,false);});
  return o+'</svg>';}
function plantillaLaser(mo){const Sz=M+2*MARC;return `<svg xmlns="http://www.w3.org/2000/svg" width="${Sz}mm" height="${Sz}mm" viewBox="0 0 ${Sz} ${Sz}">${plantillaCos(mo,0,0,true)}</svg>`;}
/* ---------- solucionari ---------- */
function soluHTML(id){const F=full(id);let o=`<div class="ssolu"><div class="cap"><span class="codi">${esc(id)}</span><span class="nota">A cada sanefa hi ha una sola còpia que trenca el ritme. Les fletxes diuen a quina cantonada queda l'osca de la plantilla.</span></div><table>`;
  F.forEach((s,k)=>{const e=s.err,on=s.cel.length>1?(e.r?' (fila de baix)':' (fila de dalt)'):'';
    const osq=s.cel.map((f,r)=>f.map((or,i)=>r===e.r&&i===e.i?`<b>${S.OSCA[e.era]}</b>`:S.OSCA[or]).join('')).join('<br>');
    o+=`<tr><td class="s">${'ABCDEFG'[k]}</td><td class="e"><b>${'ABCDEFG'[k]}${e.i+1}</b>${on}<br>hi ha ${S.OSCA[e.es]}, hauria de ser ${S.OSCA[e.era]}</td><td>${esc(s.nom)}<div class="osq">${osq}</div></td></tr>`;});
  return o+`</table><p class="llegenda">Ritme correcte de cada sanefa (en negre, la còpia que al full està malament).<br>${S.OSCA.map((a,i)=>a+' '+S.POSNOM[i]).join(' · ')}</p></div>`;}
/* ---------- pintar ---------- */
function idActual(){return 'SAN-'+st.motiu+st.ver;}
function pinta(){const P=$('#pagines');let h='';
  $('#mida-pagina').textContent=st.vista==='plantilla'?'@page{size:A4 portrait;margin:0}':'@page{size:A4 landscape;margin:0}';
  if(st.vista==='full')h=`<div class="pagina h">${fullSVG(idActual())}</div>`;
  else if(st.vista==='plantilla')h=`<div class="pagina v">${plantillaSVG()}</div>`;
  else{const L=[...st.tria];for(let i=0;i<L.length;i+=2)h+=`<div class="pagina h"><div class="ssolus">${soluHTML(L[i])}${L[i+1]?soluHTML(L[i+1]):'<div class="ssolu"></div>'}</div></div>`;if(!L.length)h='<p>Tria almenys un full.</p>';}
  P.innerHTML=h;escala();pintaTria();}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const mm=pw.classList.contains('v')?210:297,px=mm*96/25.4;
  const z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function pintaTria(){const box=$('#tria');box.classList.toggle('amagat',st.vista!=='solu');if(st.vista!=='solu')return;
  box.innerHTML='<span>Solucionaris (dos per cara):</span>'+[...new Set([].concat(...S.ORDRE.map(m=>FIXOS.map(v=>'SAN-'+m+v)),[...st.tria]))].map(id=>`<label><input type="checkbox" value="${id}" ${st.tria.has(id)?'checked':''}> ${id}</label>`).join('');
  box.querySelectorAll('input').forEach(i=>i.onchange=()=>{i.checked?st.tria.add(i.value):st.tria.delete(i.value);pinta();});}
function estat(t){$('#estat').textContent=t||'';}
function actualitzaHash(){history.replaceState(null,'','#'+idActual()+(st.vista!=='full'?'/'+st.vista:''));}
function marca(){$('#vers').innerHTML=FIXOS.map(v=>`<button data-ver="${v}" class="${st.ver===v?'on':''}">${v}</button>`).join('');
  $('#vers').querySelectorAll('button').forEach(b=>b.onclick=()=>{st.ver=b.dataset.ver;estat('');marca();pinta();actualitzaHash();});
  document.querySelectorAll('[data-vista]').forEach(b=>b.classList.toggle('on',b.dataset.vista===st.vista));
  $('#motiu').value=st.motiu;if(!FIXOS.includes(st.ver))$('#num').value=st.ver;}
function nou(n){st.ver=String(n);st.tria.add(idActual());estat('Full '+idActual()+' generat. Amb el mateix número sempre surt el mateix full.');marca();pinta();actualitzaHash();}
/* ---------- inici ---------- */
$('#motiu').innerHTML=S.ORDRE.map(m=>`<option value="${m}">${m} · ${esc(S.MOTIUS[m].nom)}</option>`).join('');
$('#motiu').onchange=e=>{st.motiu=e.target.value;st.ver='1';estat('');marca();pinta();actualitzaHash();};
$('#btnGen').onclick=()=>{const n=parseInt($('#num').value,10);if(!(n>=1000&&n<=9999)){estat('Escriu un número entre 1000 i 9999.');return;}nou(n);};
$('#btnAtzar').onclick=()=>{const n=1000+Math.floor(Math.random()*9000);$('#num').value=n;nou(n);};
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;marca();pinta();actualitzaHash();});
$('#btnPrint').onclick=()=>window.print();
window.addEventListener('resize',escala);
window.addEventListener('beforeprint',()=>document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1)));
window.addEventListener('afterprint',escala);
function aplicaHash(){const m=/^#SAN-([A-Z]{3})(\d{1,4})(?:\/(full|plantilla|solu))?$/.exec(location.hash);
  if(m&&S.MOTIUS[m[1]]){st.motiu=m[1];st.ver=m[2];st.vista=m[3]||'full';if(!FIXOS.includes(st.ver))st.tria.add(idActual());}marca();pinta();}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,plantillaLaser,soluHTML,st,pinta,mides:{M,GAP,MARC}};
})();
