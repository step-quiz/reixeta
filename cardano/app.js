/* Reixeta · La reixeta de Cardano — pàgina d'impressió i eina per al professorat (missatges, famílies de nombres, disseny de reixetes) */
(function(){
'use strict';
const K=window.CARDANO,N=K.N;
const $=s=>document.querySelector(s);
const CEL=26,INSET=3,FORAT=CEL-2*INSET,MARC=20,ESTRELLA=4.5;   // mm: casella, marge del forat (barres de 6 mm), forat, marc de la reixeta, radi de l'estrella
const S=N*CEL+2*MARC,X0=(210-N*CEL)/2,Y0=52;                   // reixeta de 196 mm; graella del full 1
const AR='font-family="Arial,Helvetica,sans-serif"';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const st={mode:'missatge',text:K.EX.A,ex:'A',niv:'CF1',ver:'A',vista:'full'};
/* ---------- full actual ---------- */
function actual(){
  if(st.mode==='missatge'){const T=K.xifra(st.text);return T?{T,codi:st.ex?'CAR-'+st.ex:K.codiMissatge(st.text)}:null;}
  if(st.mode==='families'){const F=K.genera(st.niv,st.ver);return F?{T:F.T,F,codi:st.niv+'-'+st.ver}:null;}
  return null;}
/* ---------- full 1: només la graella i el codi ---------- */
function fullSVG(A){const w=N*CEL,fs=A.F?10:13;let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${X0+w}" y="${Y0-8}" font-size="5.5" text-anchor="end" font-family="Courier New,monospace" font-weight="700">${esc(A.codi)}</text>`;
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){const x=X0+c*CEL,y=Y0+r*CEL,t=String(A.T[r][c]);
    o+=`<rect x="${x}" y="${y}" width="${CEL}" height="${CEL}" fill="#fff" stroke="#000" stroke-width=".35"/><text x="${x+CEL/2}" y="${y+CEL/2+fs*.36}" font-size="${fs}" text-anchor="middle" font-weight="700" ${AR}>${esc(t)}</text>`;}
  return o+`<rect x="${X0}" y="${Y0}" width="${w}" height="${w}" fill="none" stroke="#000" stroke-width=".8"/></svg>`;}
/* ---------- la reixeta (full 2): 9 forats, estrella a dalt a l'esquerra i una fletxa que diu cap on gira ---------- */
function estrella(cx,cy,R){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?R*.42:R;p.push((cx+r*Math.cos(a)).toFixed(2)+','+(cy+r*Math.sin(a)).toFixed(2));}return p.join(' ');}
const foratsMM=()=>K.FORATS.map(([r,c])=>[MARC+c*CEL+INSET,MARC+r*CEL+INSET,FORAT]);
function reixetaCos(ox,oy,laser){const cut=laser?'stroke="#FF0000" stroke-width="0.01" fill="none"':'fill="#d4d4d4" fill-rule="evenodd" stroke="#000" stroke-width=".3"';
  let d=`M${ox},${oy} h${S} v${S} h${-S} Z`;for(const [x,y,f] of foratsMM())d+=` M${ox+x},${oy+y} h${f} v${f} h${-f} Z`;
  /* fletxa: un arc cap a la dreta, al costat de l'estrella */
  const cx=ox+27,cy=oy+17,R=9,a0=-150*Math.PI/180,a1=-55*Math.PI/180,p0=[cx+R*Math.cos(a0),cy+R*Math.sin(a0)],p1=[cx+R*Math.cos(a1),cy+R*Math.sin(a1)],t=[-Math.sin(a1),Math.cos(a1)],n=[Math.cos(a1),Math.sin(a1)];
  const punta=[[p1[0]+t[0]*4,p1[1]+t[1]*4],[p1[0]+n[0]*2.1,p1[1]+n[1]*2.1],[p1[0]-n[0]*2.1,p1[1]-n[1]*2.1]].map(q=>q.map(v=>v.toFixed(2)).join(',')).join(' ');
  return `<path class="reixeta" d="${d}" ${cut}/><polygon points="${estrella(ox+MARC/2,oy+MARC/2,ESTRELLA)}" fill="#000"/>`
    +`<path d="M${p0[0].toFixed(2)},${p0[1].toFixed(2)} A${R},${R} 0 0 1 ${p1[0].toFixed(2)},${p1[1].toFixed(2)}" fill="none" stroke="${laser?'#0000FF':'#000'}" stroke-width="${laser?.01:.9}"/><polygon points="${punta}" fill="#000"/>`;}
function reixetaSVG(){const x=(210-S)/2,y=24;
  return `<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">${reixetaCos(x,y,false)}`
    +[`Reixeta de Cardano: la mateixa per a tots els fulls.`,`Es posa amb l'estrella a dalt a l'esquerra; després es gira tres vegades un quart de volta cap a la dreta.`,
      `Retalla el contorn i els nou quadrats blancs amb cúter i regle (36 talls de ${FORAT} mm) o amb la talladora làser.`,`Fes-ho abans de plastificar.`]
      .map((t,i)=>`<text x="${x}" y="${y+S+9+i*5.6}" font-size="3.8" ${AR}>${t}</text>`).join('')+'</svg>';}
function reixetaLaser(){return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${S}mm" height="${S}mm" viewBox="0 0 ${S} ${S}">${reixetaCos(0,0,true)}</svg>`;}
/* ---------- solucionari: les quatre posicions en petit ---------- */
function soluSVG(A){const u=7,w=N*u,gap=(210-4*w)/5,y=48;let o=`<svg class="full" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${gap}" y="24" font-size="6.5" font-family="Courier New,monospace" font-weight="700">${esc(A.codi)}</text><text x="${gap}" y="33" font-size="4" ${AR}>Solucionari. En gris, les caselles que es veuen pels forats a cada posició de la reixeta.</text>`;
  const llegit=K.llegeix(A.T);
  K.POSICIONS.forEach((pos,i)=>{const x=gap+i*(w+gap),set=new Set(pos.map(p=>p[0]*N+p[1]));
    o+=`<text x="${x}" y="${y-3}" font-size="4" font-weight="700" ${AR}>${i?'Gir '+i:'Posició inicial'}</text>`;
    for(let r=0;r<N;r++)for(let c=0;c<N;c++){const f=set.has(r*N+c),t=String(A.T[r][c]),intr=A.F&&A.T[r][c]===A.F.intrusos[i]&&f;
      o+=`<rect x="${x+c*u}" y="${y+r*u}" width="${u}" height="${u}" fill="${intr?'#000':f?'#d4d4d4':'#fff'}" stroke="#000" stroke-width=".15"/>`;
      if(f)o+=`<text x="${x+c*u+u/2}" y="${y+r*u+u/2+(t.length>=3?1.05:1.3)}" font-size="${t.length>=3?2.9:3.6}" text-anchor="middle" font-weight="700" fill="${intr?'#fff':'#000'}" ${AR}>${esc(t)}</text>`;}
    if(A.F){o+=`<text x="${x}" y="${y+w+6}" font-size="3.6" font-weight="700" ${AR}>${esc(K.FAMILIES[A.F.fam[i]].nom)}</text><text x="${x}" y="${y+w+11.5}" font-size="3.6" ${AR}>Intrús: ${A.F.intrusos[i]}</text>`;}
    else o+=`<text x="${x}" y="${y+w+6.5}" font-size="4.6" font-weight="700" font-family="Courier New,monospace">${esc(llegit[i])}</text>`;});
  const yy=y+w+24;
  if(A.F)o+=`<text x="${gap}" y="${yy}" font-size="4.2" ${AR}>A cada posició, vuit nombres són de la família i un no és de cap família del full (en negre).</text><text x="${gap}" y="${yy+7}" font-size="4.2" font-weight="700" ${AR}>Suma dels quatre intrusos: ${A.F.intrusos.join(' + ')} = ${A.F.intrusos.reduce((a,b)=>a+b,0)}</text>`;
  else{const m=K.normalitza(st.text);o+=`<text x="${gap}" y="${yy}" font-size="4.2" ${AR}>Missatge (${m.length} caràcters${m.length<N*N?'; la resta són lletres de farciment':''}):</text><text x="${gap}" y="${yy+8}" font-size="5" font-weight="700" font-family="Courier New,monospace">${esc(m)}</text>`;}
  return o+'</svg>';}
/* Com es fa un forat amb tisores: es plega el full pel mig de la casella i es talla mig quadrat des del plec. */
const FORAT_TISORES=(()=>{const t=(x,y,z)=>`<text x="${x}" y="${y}" font-size="6.5" font-weight="700" ${AR}>${z}</text>`;
  let o=`<svg class="tisores" viewBox="0 0 76 30" xmlns="http://www.w3.org/2000/svg">`+t(0,9,'1');
  o+=`<rect x="7" y="2" width="30" height="24" fill="#d4d4d4" stroke="#000" stroke-width=".25"/><rect x="15" y="7" width="14" height="14" fill="#fff" stroke="#000" stroke-width=".25" stroke-dasharray="1.2 .9"/><line x1="22" y1="0" x2="22" y2="28" stroke="#000" stroke-width=".35" stroke-dasharray="1.6 1.1"/>`+t(44,9,'2');
  o+=`<rect x="51" y="2" width="15" height="24" fill="#d4d4d4" stroke="#000" stroke-width=".25"/><rect x="59" y="7" width="7" height="14" fill="#fff" stroke="none"/><line x1="66" y1="2" x2="66" y2="26" stroke="#000" stroke-width=".9" stroke-linecap="round"/><polyline points="66,7 59,7 59,21 66,21" fill="none" stroke="#000" stroke-width=".7" stroke-dasharray="2.2 1.2"/>`
    +`<g transform="translate(69,7) rotate(180)" fill="none" stroke="#000" stroke-width=".3" stroke-linecap="round"><circle cx="-6.7" cy="-1.6" r="1.2"/><circle cx="-6.7" cy="1.6" r="1.2"/><path d="M-5.7,-1 L-1.5,.75 M-5.7,1 L-1.5,-.75"/></g>`;
  return o+'</svg>';})();
/* ---------- dissenya la teva reixeta: plantilla numerada per grups, graella buida i passos ---------- */
function dissenyaHTML(n){const c=n===4?26:18,m=12,Sd=n*c+2*m,G=K.grups(n),num=Array.from({length:n},()=>new Array(n).fill(0));G.forEach((g,i)=>g.forEach(([r,q])=>num[r][q]=i+1));
  const ox=12,oy=24,bx=ox+Sd+12,by=oy+m;let o=`<svg class="full" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">`;
  o+=`<text x="${ox}" y="14" font-size="6" font-weight="700" ${AR}>Dissenya la teva reixeta · ${n} × ${n}</text>`;
  o+=`<rect x="${ox}" y="${oy}" width="${Sd}" height="${Sd}" fill="#d4d4d4" stroke="#000" stroke-width=".3"/><polygon points="${estrella(ox+m/2,oy+m/2,m*.3)}" fill="#000"/>`;
  for(let r=0;r<n;r++)for(let q=0;q<n;q++){const x=ox+m+q*c+INSET,y=oy+m+r*c+INSET,f=c-2*INSET;
    o+=`<rect x="${x}" y="${y}" width="${f}" height="${f}" fill="#fff" stroke="#000" stroke-width=".25" stroke-dasharray="1.2 .9"/><text x="${x+f/2}" y="${y+f/2+f*.17}" font-size="${f*.48}" text-anchor="middle" fill="#555" ${AR}>${num[r][q]}</text>`;}
  for(let r=0;r<n;r++)for(let q=0;q<n;q++)o+=`<rect x="${bx+q*c}" y="${by+r*c}" width="${c}" height="${c}" fill="#fff" stroke="#000" stroke-width=".35"/>`;
  o+=`<rect x="${bx}" y="${by}" width="${n*c}" height="${n*c}" fill="none" stroke="#000" stroke-width=".8"/><text x="${bx}" y="${by-3}" font-size="3.6" ${AR}>La graella del missatge</text><text x="${ox}" y="${oy-3}" font-size="3.6" ${AR}>La reixeta: retalla'n el contorn</text></svg>`;
  const top=oy+Sd+7,k=G.length;
  return `<div class="pagina h">${o}<div class="dtext" style="top:${top}mm;left:${ox}mm;width:${(297-2*ox)}mm">
   <div><h3>Com es fa</h3><ol><li>Les caselles que tenen el mateix número són les que el gir intercanvia. Tria'n <b>una de cada número</b> (${k} en total) i retalla-la: surti com surti, la reixeta funcionarà.</li>
   <li>Posa la reixeta sobre la graella buida, amb l'estrella a dalt a l'esquerra, i escriu el començament del missatge als forats, fila per fila.</li>
   <li>Gira-la un quart de volta cap a la dreta i continua escrivint. Després de quatre posicions, la graella és plena.</li>
   <li>Passa la graella a algú altre: només la podrà llegir amb una reixeta igual que la teva.</li></ol></div>
   <div><h3>Per pensar</h3><ul><li>Quantes reixetes diferents es poden fer amb aquesta plantilla?</li><li>Per què no pot quedar cap casella sense lletra, ni cap amb dues?</li><li>Amb un full de 5 × 5 caselles no funciona. Per què?</li></ul>
   <div class="tis"><p>Per fer un forat amb tisores: plega el full pel mig de la casella (1) i talla mig quadrat des del plec (2).</p>${FORAT_TISORES}</div></div></div></div>`;}
/* ---------- pintar ---------- */
function pinta(){const P=$('#pagines');let h='';
  $('#mida-pagina').textContent=st.mode==='dissenya'?'@page{size:A4 landscape;margin:0}':'@page{size:A4 portrait;margin:0}';
  if(st.mode==='dissenya')h=dissenyaHTML(4)+dissenyaHTML(6);
  else if(st.vista==='reixeta')h=`<div class="pagina v">${reixetaSVG()}</div>`;
  else{const A=actual();h=!A?'<p class="buit">Escriu un missatge d\'entre 1 i 36 lletres o xifres.</p>':`<div class="pagina v">${st.vista==='solu'?soluSVG(A):fullSVG(A)}</div>`;}
  P.innerHTML=h;escala();marca();}
function escala(){const pw=document.querySelector('.pagina');if(!pw)return;const mm=pw.classList.contains('v')?210:297,px=mm*96/25.4;
  const z=Math.min(1,(document.documentElement.clientWidth-28)/px);document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',z));}
function estat(t){$('#estat').textContent=t||'';}
function marca(){document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('on',b.dataset.mode===st.mode));
  document.querySelectorAll('[data-vista]').forEach(b=>b.classList.toggle('on',b.dataset.vista===st.vista));
  $('#filaMissatge').classList.toggle('amagat',st.mode!=='missatge');$('#filaFamilies').classList.toggle('amagat',st.mode!=='families');$('#filaVistes').classList.toggle('amagat',st.mode==='dissenya');
  $('#btnLaser').classList.toggle('amagat',st.mode==='dissenya'||st.vista!=='reixeta');
  document.querySelectorAll('[data-ex]').forEach(b=>b.classList.toggle('on',st.mode==='missatge'&&b.dataset.ex===st.ex));
  $('#vers').innerHTML=K.FIXOS.map(v=>`<button data-ver="${v}" class="${st.ver===v?'on':''}">${v}</button>`).join('');
  $('#vers').querySelectorAll('button').forEach(b=>b.onclick=()=>{st.ver=b.dataset.ver;estat('');pinta();actualitzaHash();});
  $('#nivell').value=st.niv;const m=K.normalitza(st.text);$('#compta').textContent=m.length+' de 36';$('#compta').classList.toggle('mal',m.length>36||!m.length);
  if(document.activeElement!==$('#text'))$('#text').value=st.text;}
function actualitzaHash(){const A=st.mode==='dissenya'?'dissenya':st.mode==='families'?st.niv+'-'+st.ver:st.ex?'CAR-'+st.ex:'m='+encodeURIComponent(st.text);
  history.replaceState(null,'','#'+A+(st.mode!=='dissenya'&&st.vista!=='full'?'/'+st.vista:''));}
/* ---------- inici ---------- */
$('#nivell').innerHTML=K.ORDRE.map(k=>`<option value="${k}">${k} · ${esc(K.NIVELLS[k].nom)}</option>`).join('');
$('#nivell').onchange=e=>{st.niv=e.target.value;st.ver='A';estat('');pinta();actualitzaHash();};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{st.mode=b.dataset.mode;if(st.mode==='dissenya')st.vista='full';estat('');pinta();actualitzaHash();});
document.querySelectorAll('[data-vista]').forEach(b=>b.onclick=()=>{st.vista=b.dataset.vista;pinta();actualitzaHash();});
document.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>{st.ex=b.dataset.ex;st.text=K.EX[st.ex];$('#text').value=st.text;estat('');pinta();actualitzaHash();});
$('#text').oninput=e=>{st.text=e.target.value;st.ex='';const n=K.normalitza(st.text).length;estat(n>36?'El missatge és massa llarg: hi caben 36 lletres o xifres.':'');pinta();actualitzaHash();};
$('#btnGen').onclick=()=>{const n=parseInt($('#num').value,10);if(!(n>=1000&&n<=9999)){estat('Escriu un número entre 1000 i 9999.');return;}st.ver=String(n);estat('Full '+st.niv+'-'+st.ver+' generat. Amb el mateix número sempre surt el mateix full.');pinta();actualitzaHash();};
$('#btnAtzar').onclick=()=>{const n=1000+Math.floor(Math.random()*9000);$('#num').value=n;$('#btnGen').onclick();};
$('#btnLaser').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([reixetaLaser()],{type:'image/svg+xml'}));a.download='reixeta-cardano-tall-laser.svg';document.body.appendChild(a);a.click();a.remove();};
$('#btnPrint').onclick=()=>window.print();
window.addEventListener('resize',escala);
window.addEventListener('beforeprint',()=>document.querySelectorAll('.pagina').forEach(p=>p.style.setProperty('--z',1)));
window.addEventListener('afterprint',escala);
function aplicaHash(){let h=location.hash.slice(1),v='full';const m=/^(.*)\/(full|reixeta|solu)$/.exec(h);if(m){h=m[1];v=m[2];}
  if(h==='dissenya'){st.mode='dissenya';}
  else if(/^CAR-[A-C]$/.test(h)){st.mode='missatge';st.ex=h.slice(4);st.text=K.EX[st.ex];st.vista=v;}
  else if(h.startsWith('m=')){st.mode='missatge';st.ex='';try{st.text=decodeURIComponent(h.slice(2));}catch(e){st.text='';}st.vista=v;}
  else{const f=/^(CF\d)-([A-D]|\d{4})$/.exec(h);if(f&&K.NIVELLS[f[1]]){st.mode='families';st.niv=f[1];st.ver=f[2];st.vista=v;if(/\d/.test(f[2]))$('#num').value=f[2];}}
  pinta();}
window.addEventListener('hashchange',aplicaHash);aplicaHash();
window.__reixeta={fullSVG,reixetaSVG,reixetaLaser,soluSVG,actual,st,pinta,mides:{CEL,INSET,FORAT,MARC,S,X0,Y0},foratsMM};
})();
