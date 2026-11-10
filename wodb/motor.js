/* Reixeta · WODB — motor comú (dibuix, motius i generador). Funciona al navegador i a Node. */
(function(G){
'use strict';
const dims=B=>[B.rows||4,B.cols||5];
function wins(B){const [R,C]=dims(B),W=[];for(let r=0;r<R-1;r++)for(let c=0;c<C-1;c++)W.push([r,c]);return W;}
const cellsOf=(B,r,c)=>{const C=dims(B)[1];return [r*C+c,r*C+c+1,(r+1)*C+c,(r+1)*C+c+1];};
const pop=x=>{let n=0;while(x){x&=x-1;n++;}return n;};
/* Posicions veïnes de cada posició (la plantilla es mou una casella amunt, avall, a l'esquerra o a la dreta). */
function veines(B){const [R,C]=dims(B),H=R-1,L=C-1,out=[];for(let r=0;r<H;r++)for(let c=0;c<L;c++){const v=[];if(r>0)v.push((r-1)*L+c);if(r<H-1)v.push((r+1)*L+c);if(c>0)v.push(r*L+c-1);if(c<L-1)v.push(r*L+c+1);out.push(v);}return out;}
/* ---------- motius ---------- */
function uniqMask(P,ids,k,ALL){let m=ALL;for(let i=0;i<4;i++)if(i!==k)m&=(P[ids[k]]^P[ids[i]]);return m;}
function motius(B,ids,k){const P=B.items.map(x=>x.p),ALL=(1<<B.props.length)-1,m=uniqMask(P,ids,k,ALL),out=[];
  B.props.forEach((p,j)=>{if((m>>j)&1){const yes=(P[ids[k]]>>j)&1;out.push(yes?p.si:p.no);}});return out;}
const curt=t=>t.replace(/^És /,'');
function motiuCurt(B,ids,k){const m=motius(B,ids,k).map(curt);m.sort((a,b)=>a.length-b.length);return m[0]||null;}
/* ---------- PRNG determinista ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
/* ---------- puntuació incremental ---------- */
/* Estat del recuit: desa la puntuació de cada finestra i els comptadors globals, i en canviar una casella
   només recalcula les (com a molt 4) finestres que la contenen. CAP = límit de posicions per motiu. */
function makeState(B,CAP,pen,opt){
  const P=B.items.map(x=>x.p),NP=B.props.length,ALL=(1<<NP)-1,o=Object.assign({},B.gen,opt),N=B.items.length;
  const W1=o.w1||25,BALW=o.balw||20,ADJW=o.adjw||0,maxrep=o.maxrep||3,cons=o.cons||[],gmax=o.gmax||0;
  const kid={},KI=B.items.map(x=>{if(!(x.k in kid))kid[x.k]=Object.keys(kid).length;return kid[x.k];});
  const gid={},GI=B.items.map(x=>{if(x.g==null)return -1;if(!(x.g in gid))gid[x.g]=Object.keys(gid).length;return gid[x.g];});
  const TG=cons.map(ct=>B.items.map(x=>x.t&&x.t.includes(ct.tag)?1:0));
  const W=wins(B).map(([r,c])=>cellsOf(B,r,c)),[R,C]=dims(B),NC=R*C,inW=Array.from({length:NC},()=>[]);
  W.forEach((w,wi)=>w.forEach(i=>inW[i].push(wi)));const NB=veines(B),act=new Uint8Array(W.length);
  const Bd=new Int32Array(NC).fill(-1),ws=new Float64Array(W.length),wt=new Int32Array(W.length),wp=new Uint8Array(W.length);
  const tc=new Int32Array(2*NP),cnt=new Int32Array(N),kc=new Int32Array(Object.keys(kid).length),tg=new Int32Array(cons.length),gc=new Int32Array(Object.keys(gid).length);
  let S=0,perf=0,dup=0,kpen=0,gpen=0,upen=0,adj=0;
  function evalWin(wi){const w=W[wi],a=Bd[w[0]],b=Bd[w[1]],c=Bd[w[2]],d=Bd[w[3]];
    if(a<0||b<0||c<0||d<0){ws[wi]=0;wt[wi]=0;wp[wi]=0;return;}
    const ka=KI[a],kb=KI[b],kcc=KI[c],kd=KI[d];
    if(ka===kb||ka===kcc||ka===kd||kb===kcc||kb===kd||kcc===kd){ws[wi]=-60;wt[wi]=0;wp[wi]=0;return;}
    const pa=P[a],pb=P[b],pc=P[c],pd=P[d];
    const m0=(pa^pb)&(pa^pc)&(pa^pd)&ALL,m1=(pb^pa)&(pb^pc)&(pb^pd)&ALL,m2=(pc^pa)&(pc^pb)&(pc^pd)&ALL,m3=(pd^pa)&(pd^pb)&(pd^pc)&ALL;
    const q0=pop(m0),q1=pop(m1),q2=pop(m2),q3=pop(m3),mn=Math.min(q0,q1,q2,q3),n1=(q0?1:0)+(q1?1:0)+(q2?1:0)+(q3?1:0);
    let t=0;const ms=[m0,m1,m2,m3],ps=[pa,pb,pc,pd];
    for(let k=0;k<4;k++){let m=ms[k];while(m){const j=31-Math.clz32(m&-m);t|=1<<(2*j+((ps[k]>>j)&1));m&=m-1;}}
    ws[wi]=W1*n1+Math.min(mn,3)*2+pop(m0|m1|m2|m3);wt[wi]=t;wp[wi]=mn>=1?1:0;}
  function addWin(wi,sg){S+=sg*ws[wi];perf+=sg*wp[wi];let t=wt[wi];while(t){const b=31-Math.clz32(t&-t);tc[b]+=sg;t&=t-1;}
    for(const nb of NB[wi])if(act[nb])adj+=sg*pop(wt[wi]&wt[nb]);act[wi]=sg>0?1:0;}
  function bump(x,sg){if(x<0)return;
    if(pen)upen+=sg*pen[x];
    const c0=cnt[x];cnt[x]+=sg;dup+=40*(Math.max(0,cnt[x]-1)-Math.max(0,c0-1));
    const k=KI[x],k0=kc[k];kc[k]+=sg;kpen+=25*(Math.max(0,kc[k]-maxrep)-Math.max(0,k0-maxrep));
    for(let i=0;i<cons.length;i++)tg[i]+=sg*TG[i][x];
    if(gmax&&GI[x]>=0){const g=GI[x],g0=gc[g];gc[g]+=sg;gpen+=30*(Math.max(0,gc[g]-gmax)-Math.max(0,g0-gmax));}}
  function set(i,x){const old=Bd[i];if(old===x)return;bump(old,-1);bump(x,1);
    for(const wi of inW[i])addWin(wi,-1);Bd[i]=x;for(const wi of inW[i]){evalWin(wi);addWin(wi,1);}}
  function total(){let s=S-dup-kpen-gpen-upen-ADJW*adj;
    for(let b=0;b<tc.length;b++)if(tc[b]>CAP)s-=BALW*(tc[b]-CAP);
    for(let i=0;i<cons.length;i++){const ct=cons[i],n=tg[i];if(ct.min!=null&&n<ct.min)s-=20*(ct.min-n);if(ct.max!=null&&n>ct.max)s-=20*(n-ct.max);}
    return s;}
  /* factible: totes les posicions vàlides, cap motiu per sobre del límit i cap element repetit */
  const factible=()=>{if(perf!==W.length||dup)return false;for(let b=0;b<tc.length;b++)if(tc[b]>CAP)return false;return true;};
  return {Bd,set,total,NC,N,factible};}
/* Recuit simulat. Torna el millor tauler trobat (primer els factibles; entre iguals, el de més puntuació).
   q: {cap, iters, t0, decay, pen, init, w1, balw, adjw}
   · pen[x]: penalització per fer servir l'element x (per no repetir elements entre fulls).
   · init: tauler de sortida (si no, a l'atzar).
   · adjw: pes de la regla dels veïns (motius repetits entre posicions veïnes). */
function anneal(B,rnd,q){const st=makeState(B,q.cap,q.pen,q),NC=st.NC,N=st.N,Bd=st.Bd;
  for(let i=0;i<NC;i++)st.set(i,q.init?q.init[i]:Math.floor(rnd()*N));
  let cur=st.total(),best=-Infinity,bestB=null,bestOk=false,T=q.t0||5;const decay=q.decay||0.99992;
  const keep=()=>{const ok=st.factible();if((ok&&!bestOk)||(ok===bestOk&&cur>best)){best=cur;bestB=Array.from(Bd);bestOk=ok;}};keep();
  for(let it=0,n=q.iters||120000;it<n;it++){let i,j=-1,xi,xj;
    if(rnd()<.5){i=Math.floor(rnd()*NC);j=Math.floor(rnd()*NC);xi=Bd[i];xj=Bd[j];st.set(i,xj);st.set(j,xi);}
    else{i=Math.floor(rnd()*NC);xi=Bd[i];st.set(i,Math.floor(rnd()*N));}
    const s2=st.total();
    if(s2>=cur||rnd()<Math.exp((s2-cur)/T)){cur=s2;keep();}
    else{st.set(i,xi);if(j>=0)st.set(j,xj);}
    T=Math.max(.05,T*decay);}
  return bestB;}
/* Un full en dues fases: (1) trobar un tauler vàlid i equilibrat; (2) polir-lo perquè les posicions veïnes
   repeteixin tan pocs motius com es pugui, sense deixar de ser vàlid ni equilibrat. Torna null si la fase 1 falla. */
const POLIT={w1:60,balw:30,adjw:8,t0:5,decay:0.99994,iters:150000};
function cercaFull(B,rnd,cap,pen,q){const o=B.gen||{};   // q (opcional): paràmetres de la fase 1 (cerca intensiva dels fulls fixos)
  const Bd=anneal(B,rnd,Object.assign({cap,pen,iters:o.iters,t0:o.t0,decay:o.decay},q));if(!bo(B,Bd,cap))return null;
  const B2=anneal(B,rnd,Object.assign({},POLIT,{cap,pen,init:Bd}));return bo(B,B2,cap)&&repVeins(B,B2)<=repVeins(B,Bd)?B2:Bd;}
function valid(B,Bd){const P=B.items.map(x=>x.p),ALL=(1<<B.props.length)-1;let n=0;
  for(const [r,c] of wins(B)){const ids=cellsOf(B,r,c).map(i=>Bd[i]);if(new Set(ids.map(i=>B.items[i].k)).size<4)continue;
    let ok=true;for(let k=0;k<4;k++)if(!uniqMask(P,ids,k,ALL)){ok=false;break;}if(ok)n++;}return n;}
/* Nombre màxim de posicions on surt un mateix motiu (regla d'equilibri: com a molt 5/12 de les posicions). */
function maxMotiu(B,Bd){const P=B.items.map(x=>x.p),ALL=(1<<B.props.length)-1,tc=new Map();
  for(const [r,c] of wins(B)){const ids=cellsOf(B,r,c).map(i=>Bd[i]),seen=new Set();
    for(let k=0;k<4;k++){const m=uniqMask(P,ids,k,ALL);for(let j=0;j<B.props.length;j++)if((m>>j)&1)seen.add(j*2+((P[ids[k]]>>j)&1));}
    for(const t of seen)tc.set(t,(tc.get(t)||0)+1);}
  return Math.max(0,...tc.values());}
/* Motius (propietat + sentit) de cada posició, com a màscara de bits. */
function tipus(B,Bd){const P=B.items.map(x=>x.p),ALL=(1<<B.props.length)-1;
  return wins(B).map(([r,c])=>{const ids=cellsOf(B,r,c).map(i=>Bd[i]);let t=0;
    for(let k=0;k<4;k++){const m=uniqMask(P,ids,k,ALL);for(let j=0;j<B.props.length;j++)if((m>>j)&1)t|=1<<(2*j+((P[ids[k]]>>j)&1));}return t;});}
/* Regla dels veïns: nombre de motius que es repeteixen entre dues posicions veïnes (sumat per a totes les parelles). */
function repVeins(B,Bd){const t=tipus(B,Bd),NB=veines(B);let n=0;NB.forEach((v,w)=>v.forEach(u=>{if(u>w)n+=pop(t[w]&t[u]);}));return n;}
/* Variant d'un full fix: simetria del tauler i substitució de cada element per un altre amb les mateixes propietats. */
function variantA(B,rnd){const [R,C]=dims(B),F=Object.keys(B.fulls),A=B.fulls[F[Math.floor(rnd()*F.length)]],P=B.items.map(x=>x.p),K=B.items.map(x=>x.k);
  const fr=rnd()<.5,fc=rnd()<.5;const Bd=A.map((_,i)=>{let r=Math.floor(i/C),c=i%C;if(fr)r=R-1-r;if(fc)c=C-1-c;return A[r*C+c];});
  const same={};B.items.forEach((x,i)=>{(same[x.p]=same[x.p]||[]).push(i);});
  const W=wins(B).map(([r,c])=>cellsOf(B,r,c)),inW=Bd.map((_,i)=>W.filter(w=>w.includes(i)));
  const order=Bd.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  for(const i of order){const cand=same[P[Bd[i]]];for(let t=0;t<6;t++){const x=cand[Math.floor(rnd()*cand.length)],old=Bd[i];Bd[i]=x;
      if(inW[i].every(w=>new Set(w.map(j=>K[Bd[j]])).size===4)&&Bd.filter(y=>y===x).length===1)break;Bd[i]=old;}}
  return Bd;}
/* Un full és bo si totes les posicions són vàlides, cap motiu no passa del límit i no repeteix cap element. */
const senseRepetits=(B,Bd)=>new Set(Bd).size===Bd.length||Bd.length>B.items.length;
function bo(B,Bd,cap){return valid(B,Bd)===wins(B).length&&maxMotiu(B,Bd)<=cap&&senseRepetits(B,Bd);}
/* Límit d'equilibri d'un full nou: mai no és menys equilibrat que el pitjor dels fulls fixos
   (ni cal que ho sigui més que la regla: cap motiu en més de 5/12 de les posicions).
   Excepció: els bancs amb gen.marge (fulls fixos trobats amb una cerca molt llarga) admeten aquest marge de més. */
const pitjorFix=B=>Math.max(...Object.values(B.fulls).map(A=>maxMotiu(B,A)));
function objectiu(B){return Math.max(Math.floor(5*wins(B).length/12),pitjorFix(B)+((B.gen||{}).marge||0));}
/* Genera el full número «num» del banc B. Sempre dona el mateix resultat per al mateix número. */
function genera(B,num){const o=B.gen||{},cap=objectiu(B);
  for(let a=0;a<(o.tries||6);a++){const Bd=cercaFull(B,mulberry32(hashSeed(B.code+'-'+num+'-'+a)),cap);if(Bd)return Bd;}
  const Bd=variantA(B,mulberry32(hashSeed(B.code+'-'+num+'-v')));return valid(B,Bd)===wins(B).length?Bd:null;}
/* ---------- dibuix (SVG, viewBox 0 0 100 100) ---------- */
const BCOL={vermell:'#e11d48',blau:'#2563eb',groc:'#eab308'},TRAMA={vermell:'url(#tr-ratlles)',blau:'url(#tr-quadricula)',groc:'url(#tr-punts)'};
const f1=x=>Math.round(x*10)/10;
/* Mida de lletra perquè el text (Arial negreta) no passi de 84 unitats d'amplada. */
const AMPLE={',':.278,'.':.278,'/':.278,'…':1,'-':.333};
function midaText(t,max){let w=0;for(const ch of String(t))w+=(ch in AMPLE)?AMPLE[ch]:.556;return Math.min(max,84/w);}
function dibuixa(B,id){const it=B.items[id],d=it.d;
  switch(B.tipus){
  case 'txt':{const fs=midaText(d,46);return `<text x="50" y="${50+fs*0.36}" font-size="${f1(fs)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700">${d}</text>`;}
  case 'fra':{if(typeof d==='string'){const per=d.endsWith('…'),t=per?d.slice(0,-1).replace(/(\d)\1*$/,'$1'):d,fs=Math.min(30,midaText(t,30)),w=[...t].reduce((a,ch)=>a+((ch in AMPLE)?AMPLE[ch]:.556),0)*fs,y=50+fs*0.36;
    let o=`<text x="50" y="${f1(y)}" font-size="${f1(fs)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700">${t}</text>`;
    if(per){const x2=50+w/2-.03*fs,x1=x2-.5*fs,yb=y-.86*fs;o+=`<line x1="${f1(x1)}" y1="${f1(yb)}" x2="${f1(x2)}" y2="${f1(yb)}" stroke="#000" stroke-width="3"/>`;}
    return o;}
    const w=Math.max(String(d[0]).length,String(d[1]).length)*16+8;return `<g font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="30" text-anchor="middle"><text x="50" y="42">${d[0]}</text><text x="50" y="82">${d[1]}</text></g><line x1="${50-w/2}" y1="52" x2="${50+w/2}" y2="52" stroke="#000" stroke-width="4"/>`;}
  case 'poly':return `<polygon points="${d.map(p=>f1(8+p[0]*84)+','+f1(8+p[1]*84)).join(' ')}" fill="#d9d9d9" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`;
  case 'blo':{const [s,col,g,fl]=d,bn=B.bn,k=g?.84:.5,c=BCOL[col];let sh;
    if(s==='cercle')sh=`<circle cx="50" cy="50" r="${k*50}"/>`;else if(s==='quadrat')sh=`<rect x="${50-k*50}" y="${50-k*50}" width="${k*100}" height="${k*100}"/>`;
    else if(s==='triangle')sh=`<polygon points="50,${50-k*50} ${50+k*50},${50+k*40} ${50-k*50},${50+k*40}"/>`;else sh=`<rect x="${50-k*50}" y="${50-k*28}" width="${k*100}" height="${f1(k*56)}"/>`;
    if(bn)return `<g fill="${TRAMA[col]}" stroke="#000" stroke-width="${fl?6:1.6}" stroke-linejoin="round">${sh}</g>`;
    return `<g fill="${fl?c:'#fff'}" stroke="${c}" stroke-width="5" stroke-linejoin="round">${sh}</g>`;}
  case 'let':return `<path d="${d}" fill="none" stroke="#000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  case 'ang':{   /* Mateixa escala a totes les caselles: un costat llarg (LL) i un de curt (LC), sector de radi RA, quadradet de costat RQ.
                     El dibuix només es desplaça per centrar-lo; no canvia mai de mida. Sense punt al vèrtex. */
    const [th,phi,l2]=d,a1=phi*Math.PI/180,a2=(phi+th)*Math.PI/180,LL=56,LC=40,RA=24,RQ=16,curt2=l2<1;
    const P1=[(curt2?LL:LC)*Math.cos(a1),(curt2?LL:LC)*Math.sin(a1)],P2=[(curt2?LC:LL)*Math.cos(a2),(curt2?LC:LL)*Math.sin(a2)],ap=[];
    if(th===90)ap.push([RQ*Math.cos(a1),RQ*Math.sin(a1)],[RQ*(Math.cos(a1)+Math.cos(a2)),RQ*(Math.sin(a1)+Math.sin(a2))],[RQ*Math.cos(a2),RQ*Math.sin(a2)]);
    else for(let i=0;i<=60;i++){const a=a1+(a2-a1)*i/60;ap.push([RA*Math.cos(a),RA*Math.sin(a)]);}
    const pts=[[0,0],P1,P2,...ap],xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),cx=(Math.max(...xs)+Math.min(...xs))/2,cy=(Math.max(...ys)+Math.min(...ys))/2;
    const T=p=>f1(50+p[0]-cx)+','+f1(50-(p[1]-cy)),O=T([0,0]),arc=ap.map(T).join(' ');
    return `<polygon points="${O} ${arc}" fill="#d0d0d0" stroke="none"/><polyline points="${arc}" fill="none" stroke="#000" stroke-width="1.5" stroke-linejoin="miter"/>`+
      `<polyline points="${T(P1)} ${O} ${T(P2)}" fill="none" stroke="#000" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>`;}
  case 'dots':{const g=d[0],X=v=>f1(12+v*76/g);let o='';for(let i=0;i<=g;i++)for(let j=0;j<=g;j++)o+=`<circle cx="${X(i)}" cy="${X(j)}" r="1.9" fill="#777"/>`;
    const pts=[];for(let i=1;i<d.length;i+=2)pts.push(X(d[i])+','+X(g-d[i+1]));return o+`<polygon points="${pts.join(' ')}" fill="#d9d9d9" fill-opacity=".85" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/>`;}
  case 'cells':{const w=Math.max(...d.map(p=>p[0]))+1,h=Math.max(...d.map(p=>p[1]))+1,s=Math.min(84/w,84/h,20),ox=50-w*s/2,oy=50-h*s/2;
    return d.map(([x,y])=>`<rect x="${f1(ox+x*s)}" y="${f1(oy+(h-1-y)*s)}" width="${f1(s)}" height="${f1(s)}" fill="#d9d9d9" stroke="#000" stroke-width="2.2"/>`).join('');}
  case 'svg':return d;}
  return '';}
const etiqueta=(B,id)=>{const d=B.items[id].d;if(B.tipus==='txt')return String(d);if(B.tipus==='fra')return typeof d==='string'?d:d[0]+'/'+d[1];return null;};
G.WODB={dims,wins,cellsOf,veines,tipus,repVeins,maxMotiu,motius,motiuCurt,genera,valid,bo,dibuixa,etiqueta,mulberry32,hashSeed,anneal,cercaFull,variantA,objectiu,pitjorFix};
})(typeof window!=='undefined'?window:globalThis);
