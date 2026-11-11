/* Reixeta · Sanefa trencada — pàgina d'impressió */
(function(){
'use strict';
const S=window.SANEFA;
const $=s=>document.querySelector(s);
const M=22,GAP=4,MARC=15,JOC=.6,OSCA=8,ALT=30;   // mm: caixa del motiu, separació entre sanefes, marc de la targeta, joc del forat, osca, alçada de la targeta de mossegada
const Q={m:M,marc:MARC,joc:JOC,osca:OSCA,alt:ALT};
const FIXOS=['1','2'];                           // fulls fixos de cada motiu
const st={motiu:S.ORDRE[0],ver:'1',vista:'full',model:'vora',tria:new Set([].concat(...S.ORDRE.map(m=>FIXOS.map(v=>'SAN-'+m+v))))};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cache={};
function full(id){const m=/^SAN-([A-Z]{3})(\d+)$/.exec(id);return cache[id]||(cache[id]=S.genera(m[1],m[2]));}
const motiuDe=id=>id.slice(4,7);
/* ---------- full 1: set sanefes ---------- */
function fullSVG(id){const F=full(id),mo=motiuDe(id),w=S.N*M,files=F.reduce((a,s)=>a+s.cel.length,0),h=files*M+(F.length-1)*GAP,x0=(210-w)/2;let y=(297-h)/2+2;
  let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${x0+w}" y="${y-10.5}" font-size="4.8" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${id}</text>`;
  for(let i=0;i<S.N;i++)o+=`<text x="${x0+i*M+M/2}" y="${y-3.5}" font-size="5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${i+1}</text>`;
  F.forEach((s,k)=>{const hh=s.cel.length*M;o+=`<text x="${x0-7}" y="${y+hh/2+1.8}" font-size="5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${'ABCDEFG'[k]}</text>`;
    s.cel.forEach((f,r)=>f.forEach((or,i)=>{o+=S.motiuSVG(mo,or,x0+i*M,y+r*M,M);}));
    o+=`<rect x="${x0}" y="${y}" width="${w}" height="${hh}" fill="none" stroke="#000" stroke-width=".35"/>`;y+=hh+GAP;});
  return o+'</svg>';}
/* ---------- plantilla: targetes amb la cantonada de dalt a l'esquerra tallada ----------
   Dos models (S.targeta): 'vora' = el motiu és una mossegada a la vora, es talla amb tisores (per defecte); 'forat' = el motiu foradat a dins.
   La bota només té el model de forat. */
const cami=P=>'M'+P.map(p=>p.join(',')).join(' L')+' Z';
function plantillaCos(mo,ox,oy,laser,model){const t=S.targeta(mo,model,0,0,Q),dx=ox-t.caixa[0],dy=oy-t.caixa[1],mou=P=>P.map(p=>[+(p[0]+dx).toFixed(2),+(p[1]+dy).toFixed(2)]);
  const d=cami(mou(t.out))+t.forats.map(h=>' '+cami(mou(h))).join('');
  return laser?`<path d="${d}" stroke="#FF0000" stroke-width="0.01" fill="none"/>`:`<path class="targeta" d="${d}" fill="#d4d4d4" fill-rule="evenodd" stroke="#000" stroke-width=".3"/>`;}
const mida=(mo,model)=>{const c=S.targeta(mo,model,0,0,Q).caixa;return [+(c[2]-c[0]).toFixed(2),+(c[3]-c[1]).toFixed(2)];};
function plantillaSVG(model){const n=3,w=M+2*MARC,gx=(210-n*w)/(n+1);let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`,y=22;
  o+=`<text x="${gx}" y="12" font-size="3.6" font-family="Arial,Helvetica,sans-serif">${model==='vora'?'Targetes per tallar amb tisores: el motiu és una mossegada a la vora. Talla també la cantonada.':'Targetes amb el motiu foradat a dins: per a cúter i regle, o talladora làser. Talla també la cantonada.'}</text>`;
  for(const mo of S.ORDRE){const h=mida(mo,model)[1],sense=model==='vora'&&!S.MOTIUS[mo].vora;
    o+=`<text x="${gx}" y="${y-3.5}" font-size="4.5" font-family="Arial,Helvetica,sans-serif">${esc(S.MOTIUS[mo].nom)} · fulls SAN-${mo}${sense?' · només amb el forat a dins (cúter o làser)':''}</text>`;
    for(let i=0;i<n;i++)o+=plantillaCos(mo,gx+i*(w+gx),y,false,model);y+=h+15;}
  return o+'</svg>';}
function plantillaLaser(mo,model){const t=S.targeta(mo,model||'forat',0,0,Q),[w,h]=mida(mo,model||'forat');return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}">${plantillaCos(mo,0,0,true,model||'forat')}</svg>`;}
/* ---------- solucionari ---------- */
function soluHTML(id){const F=full(id);let o=`<div class="ssolu"><div class="cap"><span class="codi">${esc(id)}</span><span class="nota">A cada sanefa hi ha una sola còpia que trenca el ritme. Les fletxes diuen a quina cantonada queda la cantonada tallada de la targeta.</span></div><table>`;
  F.forEach((s,k)=>{const e=s.err,on=s.cel.length>1?(e.r?' (fila de baix)':' (fila de dalt)'):'';
    const osq=s.cel.map((f,r)=>f.map((or,i)=>r===e.r&&i===e.i?`<b>${S.OSCA[e.era]}</b>`:S.OSCA[or]).join('')).join('<br>');
    o+=`<tr><td class="s">${'ABCDEFG'[k]}</td><td class="e"><b>${'ABCDEFG'[k]}${e.i+1}</b>${on}<br>hi ha ${S.OSCA[e.es]}, hauria de ser ${S.OSCA[e.era]}</td><td>${esc(s.nom)}<div class="osq">${osq}</div></td></tr>`;});
  return o+`</table><p class="llegenda">Ritme correcte de cada sanefa (en negre, la còpia que al full està malament).<br>${S.OSCA.map((a,i)=>a+' '+S.POSNOM[i]).join(' · ')}</p></div>`;}
/* ---------- pintar ---------- */
function idActual(){return 'SAN-'+st.motiu+st.ver;}
function pinta(){const P=$('#pagines');let h='';
  $('#mida-pagina').textContent=st.vista==='solu'?'@page{size:A4 landscape;margin:0}':'@page{size:A4 portrait;margin:0}';
  if(st.vista==='full')h=`<div class="pagina v">${fullSVG(idActual())}</div>`;
  else if(st.vista==='plantilla')h=`<div class="pagina v">${plantillaSVG(st.model)}</div>`;
  else{const L=[...st.tria];for(let i=0;i<L.length;i+=2)h+=`<div class="pagina h"><div class="ssolus">${soluHTML(L[i])}${L[i+1]?soluHTML(L[i+1]):'<div class="ssolu"></div>'}</div></div>`;if(!L.length)h='<p>Tria almenys un full.</p>';}
  P.innerHTML=h;escala();pintaTria();
  const box=$('#modelTria');box.classList.toggle('amagat',st.vista!=='plantilla');
  box.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',b.dataset.model===st.model);b.onclick=()=>{st.model=b.dataset.model;pinta();actualitzaHash();};});}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const mm=pw.classList.contains('v')?210:297,px=mm*96/25.4;
  const z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function pintaTria(){const box=$('#tria');box.classList.toggle('amagat',st.vista!=='solu');if(st.vista!=='solu')return;
  box.innerHTML='<span>Solucionaris (dos per cara):</span>'+[...new Set([].concat(...S.ORDRE.map(m=>FIXOS.map(v=>'SAN-'+m+v)),[...st.tria]))].map(id=>`<label><input type="checkbox" value="${id}" ${st.tria.has(id)?'checked':''}> ${id}</label>`).join('');
  box.querySelectorAll('input').forEach(i=>i.onchange=()=>{i.checked?st.tria.add(i.value):st.tria.delete(i.value);pinta();});}
function estat(t){$('#estat').textContent=t||'';}
function actualitzaHash(){history.replaceState(null,'','#'+idActual()+(st.vista!=='full'?'/'+st.vista+(st.vista==='plantilla'&&st.model==='forat'?'-forat':''):''));}
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
function aplicaHash(){const m=/^#SAN-([A-Z]{3})(\d{1,4})(?:\/(full|plantilla|plantilla-forat|solu))?$/.exec(location.hash);
  if(m&&S.MOTIUS[m[1]]){st.motiu=m[1];st.ver=m[2];st.vista=(m[3]||'full').replace('-forat','');st.model=m[3]==='plantilla-forat'?'forat':'vora';if(!FIXOS.includes(st.ver))st.tria.add(idActual());}marca();pinta();}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,plantillaLaser,soluHTML,st,pinta,mides:{M,GAP,MARC,JOC,OSCA,ALT},Q};
})();
