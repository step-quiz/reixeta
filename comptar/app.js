/* Reixeta · Joc de comptar — pàgina d'impressió */
(function(){
'use strict';
const K=window.COMPTAR,FULLS=window.COMPTAR_FULLS;
const $=s=>document.querySelector(s);
const CEL=40,FORAT=37,MARGE=(CEL-FORAT)/2,ITEM=28,MARC=15;   // mm: casella, forat, marge del forat, nombre, marc de la plantilla
const generats={};                                           // 'CO1-4821' -> full
const FIXOS=n=>Object.keys(FULLS[n]);
const st={niv:'CO1',ver:'A',vista:'full',tria:new Set([].concat(...K.ORDRE.map(n=>FIXOS(n).map(v=>n+'-'+v))))};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function full(id){const [n,v]=id.split('-');return FULLS[n][v]||generats[id];}
/* ---------- full 1 ---------- */
function fullSVG(id){const T=full(id),R=K.R,C=K.C,w=C*CEL,h=R*CEL,x0=(297-w)/2,y0=(210-h)/2;
  let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${x0+w}" y="${y0-15}" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${id}</text>`;
  for(let r=0;r<R;r++)o+=`<text x="${x0-8}" y="${y0+r*CEL+CEL/2+2.5}" font-size="7" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${'ABCD'[r]}</text>`;
  for(let c=0;c<C;c++)o+=`<text x="${x0+c*CEL+CEL/2}" y="${y0-5}" font-size="7" text-anchor="middle" font-family="Arial,Helvetica,sans-serif">${c+1}</text>`;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){const x=x0+c*CEL,y=y0+r*CEL,t=String(T[r*C+c]),fs=Math.min(46,84/(t.length*.556))*ITEM/100;   // amplada ≤ 84 % del requadre de 28 mm
    o+=`<rect x="${x}" y="${y}" width="${CEL}" height="${CEL}" fill="#fff" stroke="#000" stroke-width=".35"/>`;
    o+=`<text x="${x+CEL/2}" y="${(y+CEL/2+fs*.36).toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700">${t}</text>`;}
  return o+`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="none" stroke="#000" stroke-width=".8"/></svg>`;}
/* ---------- plantilla de 3×2 ---------- */
function plantillaCos(ox,oy,laser){const W=3*CEL+2*MARC,H=2*CEL+2*MARC,cut=laser?'stroke="#FF0000" stroke-width="0.01" fill="none"':'stroke="#000" stroke-width=".3"';
  let holes='';for(let i=0;i<2;i++)for(let j=0;j<3;j++){const x=ox+MARC+j*CEL+MARGE,y=oy+MARC+i*CEL+MARGE;holes+=` M${x},${y} h${FORAT} v${FORAT} h${-FORAT} Z`;}
  let o=laser?`<path d="M${ox},${oy} h${W} v${H} h${-W} Z${holes}" ${cut}/>`:`<path d="M${ox},${oy} h${W} v${H} h${-W} Z${holes}" fill="#d4d4d4" fill-rule="evenodd" ${cut}/>`;
  const g=laser?'stroke="#0000FF" stroke-width="0.01"':'stroke="#000" stroke-width=".5"',L=6;   // marques guia: continuen les línies de la graella
  for(const k of [0,1,2,3]){const t=MARC+k*CEL;o+=`<line x1="${ox+t}" y1="${oy}" x2="${ox+t}" y2="${oy+L}" ${g}/><line x1="${ox+t}" y1="${oy+H-L}" x2="${ox+t}" y2="${oy+H}" ${g}/>`;}
  for(const k of [0,1,2]){const t=MARC+k*CEL;o+=`<line x1="${ox}" y1="${oy+t}" x2="${ox+L}" y2="${oy+t}" ${g}/><line x1="${ox+W-L}" y1="${oy+t}" x2="${ox+W}" y2="${oy+t}" ${g}/>`;}
  return o;}
function plantillaSVG(){const W=3*CEL+2*MARC,H=2*CEL+2*MARC,x=(210-W)/2,g=(297-2*H)/3;   // dues plantilles per A4 vertical
  return `<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">${plantillaCos(x,g,false)}${plantillaCos(x,2*g+H,false)}</svg>`;}
function plantillaLaser(){const W=3*CEL+2*MARC,H=2*CEL+2*MARC;return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">${plantillaCos(0,0,true)}</svg>`;}
/* ---------- guió de partida ---------- */
function guioHTML(id,k){const J=K.guio(full(id),id,k),fila=(j,i)=>`<tr><td class="n">${i+1}</td><td class="pos">${esc(j.pos)}</td><td>${esc(j.text)}</td><td class="res"><b>${j.resposta}</b>${j.nombres.length?` <span>(${j.nombres.join(', ')})</span>`:''}</td></tr>`;
  return `<div class="guio"><div class="cap"><span class="codi">${esc(id)} · guió ${k+1}</span><span class="nota">La posició és la casella que es veu a dalt a l'esquerra. Encert: +5 · Error: −10 · Es comença a 40 · Guanya qui arriba a 100.</span></div>
    <div class="cols"><table>${J.slice(0,20).map(fila).join('')}</table><table>${J.slice(20).map((j,i)=>fila(j,i+20)).join('')}</table></div></div>`;}
/* ---------- marcador ---------- */
function marcadorSVG(){const n=21,cw=12.5,x0=(297-n*cw)/2,ch=30;let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg" font-family="Arial,Helvetica,sans-serif">`;
  [['Equip A',48],['Equip B',118]].forEach(([nom,y])=>{o+=`<text x="${x0}" y="${y-5}" font-size="6.5" font-weight="700">${nom}</text>`;
    for(let i=0;i<n;i++){const v=i*5,x=x0+i*cw,fort=v===40||v===100;
      o+=`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="${v===100?'#d4d4d4':'#fff'}" stroke="#000" stroke-width="${fort?1:.35}"/><text x="${x+cw/2}" y="${y+ch-4}" font-size="5" text-anchor="middle" font-weight="${fort?700:400}">${v}</text>`;}
    o+=`<text x="${x0+8*cw+cw/2}" y="${y+ch+6}" font-size="4" text-anchor="middle">sortida</text><text x="${x0+20*cw+cw/2}" y="${y+ch+6}" font-size="4" text-anchor="middle">meta</text>`;});
  return o+`<text x="148.5" y="182" font-size="5.5" text-anchor="middle">Encert: +5 · Error: −10 · Es comença a 40 · Guanya qui arriba a 100</text></svg>`;}
/* ---------- pintar ---------- */
function idActual(){return st.niv+'-'+st.ver;}
function pinta(){const P=$('#pagines');let h='';
  $('#mida-pagina').textContent=st.vista==='plantilla'?'@page{size:A4 portrait;margin:0}':'@page{size:A4 landscape;margin:0}';
  if(st.vista==='full'){if(!full(idActual())){P.innerHTML='';return;}h=`<div class="pagina h">${fullSVG(idActual())}</div>`;}
  else if(st.vista==='plantilla')h=`<div class="pagina v">${plantillaSVG()}</div>`;
  else if(st.vista==='marcador')h=`<div class="pagina h">${marcadorSVG()}</div>`;
  else{const L=[...st.tria].filter(full);for(const id of L)for(const k of [0,1])h+=`<div class="pagina h">${guioHTML(id,k)}</div>`;if(!L.length)h='<p>Tria almenys un full.</p>';}
  P.innerHTML=h;escala();pintaTria();}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const mm=pw.classList.contains('v')?210:297,px=mm*96/25.4;
  const z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function pintaTria(){const box=$('#tria');box.classList.toggle('amagat',st.vista!=='guio');if(st.vista!=='guio')return;
  const tots=[].concat(...K.ORDRE.map(n=>FIXOS(n).map(v=>n+'-'+v)),Object.keys(generats));
  box.innerHTML='<span>Guions (dos per full, un per cara; imprimeix a doble cara):</span>'+tots.map(id=>`<label><input type="checkbox" value="${id}" ${st.tria.has(id)?'checked':''}> ${id}</label>`).join('');
  box.querySelectorAll('input').forEach(i=>i.onchange=()=>{i.checked?st.tria.add(i.value):st.tria.delete(i.value);pinta();});}
function estat(t){$('#estat').textContent=t||'';}
function actualitzaHash(){history.replaceState(null,'','#'+idActual()+(st.vista!=='full'?'/'+st.vista:''));}
function genera(num){const id=st.niv+'-'+num;
  if(generats[id]){st.ver=String(num);st.tria.add(id);marca();pinta();actualitzaHash();return;}
  estat('Generant el full '+id+'… (pot trigar uns segons)');$('#btnGen').disabled=true;
  setTimeout(()=>{const T=K.genera(st.niv,num);$('#btnGen').disabled=false;
    if(!T){estat('No he trobat cap full equilibrat amb el número '+num+'. Prova un altre número.');return;}
    generats[id]=T;st.tria.add(id);st.ver=String(num);estat('Full '+id+' generat. Amb el mateix número sempre surt el mateix full.');marca();pinta();actualitzaHash();},30);}
function marca(){$('#vers').innerHTML=FIXOS(st.niv).map(v=>`<button data-ver="${v}" class="${st.ver===v?'on':''}">${v}</button>`).join('');
  $('#vers').querySelectorAll('button').forEach(b=>b.onclick=()=>{st.ver=b.dataset.ver;estat('');marca();pinta();actualitzaHash();});
  document.querySelectorAll('[data-vista]').forEach(b=>b.classList.toggle('on',b.dataset.vista===st.vista));
  $('#nivell').value=st.niv;if(/^\d+$/.test(st.ver))$('#num').value=st.ver;}
/* ---------- inici ---------- */
$('#nivell').innerHTML=K.ORDRE.map(n=>`<option value="${n}">${n} · ${esc(K.NIVELLS[n].nom)}</option>`).join('');
$('#nivell').onchange=e=>{st.niv=e.target.value;st.ver='A';estat('');marca();pinta();actualitzaHash();};
$('#btnGen').onclick=()=>{const n=parseInt($('#num').value,10);if(!(n>=1000&&n<=9999)){estat('Escriu un número entre 1000 i 9999.');return;}genera(n);};
$('#btnAtzar').onclick=()=>{const n=1000+Math.floor(Math.random()*9000);$('#num').value=n;genera(n);};
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;marca();pinta();actualitzaHash();});
$('#btnPrint').onclick=()=>window.print();
window.addEventListener('resize',escala);
window.addEventListener('beforeprint',()=>document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1)));
window.addEventListener('afterprint',escala);
function aplicaHash(){const m=/^#(CO\d)-([A-Z]|\d{4})(?:\/(full|plantilla|guio|marcador))?$/.exec(location.hash);
  if(m&&FULLS[m[1]]&&(/\d/.test(m[2])||FULLS[m[1]][m[2]])){st.niv=m[1];st.vista=m[3]||'full';if(FULLS[m[1]][m[2]]){st.ver=m[2];marca();pinta();}else{marca();genera(+m[2]);}}else{marca();pinta();}}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,plantillaLaser,guioHTML,generats,st,pinta};
})();
