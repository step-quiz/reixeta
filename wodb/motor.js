/* Reixeta · WODB — motor comú (dibuix, motius i generador). Funciona al navegador i a Node. */
(function(G){
'use strict';
const dims=B=>[B.rows||5,B.cols||10];
function wins(B){const [R,C]=dims(B),W=[];for(let r=0;r<R-1;r++)for(let c=0;c<C-1;c++)W.push([r,c]);return W;}
const cellsOf=(B,r,c)=>{const C=dims(B)[1];return [r*C+c,r*C+c+1,(r+1)*C+c,(r+1)*C+c+1];};
const pop=x=>{let n=0;while(x){x&=x-1;n++;}return n;};
/* ---------- motius ---------- */
function uniqMask(P,ids,k,ALL){let m=ALL;for(let i=0;i<4;i++)if(i!==k)m&=(P[ids[k]]^P[ids[i]]);return m;}
function motius(B,ids,k){const P=B.items.map(x=>x.p),ALL=(1<<B.props.length)-1,m=uniqMask(P,ids,k,ALL),out=[];
  B.props.forEach((p,j)=>{if((m>>j)&1){const yes=(P[ids[k]]>>j)&1;out.push(yes?p.si:p.no);}});return out;}
const curt=t=>t.replace(/^És /,'');
function motiuCurt(B,ids,k){const m=motius(B,ids,k).map(curt);m.sort((a,b)=>a.length-b.length);return m[0]||null;}
/* ---------- PRNG determinista ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
/* ---------- puntuació (la mateixa que el cercador en Python) ---------- */
function makeScorer(B){
  const P=B.items.map(x=>x.p),K=B.items.map(x=>x.k),ALL=(1<<B.props.length)-1,o=B.gen||{};
  const W1=o.w1||10,maxrep=o.maxrep||3,cons=o.cons||[],gmax=o.gmax||0;
  const kid={};K.forEach(k=>{if(!(k in kid))kid[k]=Object.keys(kid).length;});const KI=K.map(k=>kid[k]);
  const W=wins(B).map(([r,c])=>cellsOf(B,r,c)),CAP=Math.floor(5*W.length/12),NP=B.props.length;
  return function(Bd){let s=0,perf=0;const tc=new Map();
    for(const cw of W){const ids=cw.map(i=>Bd[i]);const a=KI[ids[0]],b=KI[ids[1]],cc=KI[ids[2]],d=KI[ids[3]];
      if(a===b||a===cc||a===d||b===cc||b===d||cc===d){s-=60;continue;}
      let n1=0,mn=99,uni=0;for(let k=0;k<4;k++){const m=uniqMask(P,ids,k,ALL),q=pop(m);if(q)n1++;if(q<mn)mn=q;uni|=m;}
      if(mn>=1)perf++;s+=W1*n1+Math.min(mn,3)*2+pop(uni);
      const seen=new Set();for(let k=0;k<4;k++){const m=uniqMask(P,ids,k,ALL);for(let j=0;j<NP;j++)if((m>>j)&1)seen.add(j*2+((P[ids[k]]>>j)&1));}
      for(const t of seen)tc.set(t,(tc.get(t)||0)+1);}
    for(const v of tc.values())if(v>CAP)s-=20*(v-CAP);
    const cnt=new Map(),kc=new Map();for(const x of Bd){cnt.set(x,(cnt.get(x)||0)+1);kc.set(KI[x],(kc.get(KI[x])||0)+1);}
    for(const v of cnt.values())if(v>1)s-=40*(v-1);for(const v of kc.values())if(v>maxrep)s-=25*(v-maxrep);
    for(const ct of cons){let n=0;for(const x of Bd)if(B.items[x].t&&B.items[x].t.includes(ct.tag))n++;if(ct.min!=null&&n<ct.min)s-=20*(ct.min-n);if(ct.max!=null&&n>ct.max)s-=20*(n-ct.max);}
    if(gmax){const gc=new Map();for(const x of Bd){const g=B.items[x].g;if(g!=null)gc.set(g,(gc.get(g)||0)+1);}for(const v of gc.values())if(v>gmax)s-=30*(v-gmax);}
    return [s,perf];};}
function anneal(B,rnd,iters,T0,decay){const N=B.items.length,score=makeScorer(B),[R,C]=dims(B),NC=R*C;
  let Bd=Array.from({length:NC},()=>Math.floor(rnd()*N));let [cur]=score(Bd),best=cur,bestB=Bd.slice(),T=T0;
  for(let it=0;it<iters;it++){const B2=Bd.slice();
    if(rnd()<.5){const i=Math.floor(rnd()*NC),j=Math.floor(rnd()*NC);const t=B2[i];B2[i]=B2[j];B2[j]=t;}else B2[Math.floor(rnd()*NC)]=Math.floor(rnd()*N);
    const [s2]=score(B2);if(s2>=cur||rnd()<Math.exp((s2-cur)/T)){Bd=B2;cur=s2;if(cur>best){best=cur;bestB=Bd.slice();}}
    T=Math.max(.05,T*decay);}
  return bestB;}
function valid(B,Bd){const P=B.items.map(x=>x.p),ALL=(1<<B.props.length)-1;let n=0;
  for(const [r,c] of wins(B)){const ids=cellsOf(B,r,c).map(i=>Bd[i]);if(new Set(ids.map(i=>B.items[i].k)).size<4)continue;
    let ok=true;for(let k=0;k<4;k++)if(!uniqMask(P,ids,k,ALL)){ok=false;break;}if(ok)n++;}return n;}
/* Genera el full número «num» del banc B. Sempre dona el mateix resultat per al mateix número. */
/* Nombre màxim de posicions on surt un mateix motiu (regla d'equilibri: com a molt 5/12 de les posicions). */
function maxMotiu(B,Bd){const P=B.items.map(x=>x.p),ALL=(1<<B.props.length)-1,tc=new Map();
  for(const [r,c] of wins(B)){const ids=cellsOf(B,r,c).map(i=>Bd[i]),seen=new Set();
    for(let k=0;k<4;k++){const m=uniqMask(P,ids,k,ALL);for(let j=0;j<B.props.length;j++)if((m>>j)&1)seen.add(j*2+((P[ids[k]]>>j)&1));}
    for(const t of seen)tc.set(t,(tc.get(t)||0)+1);}
  return Math.max(0,...tc.values());}
/* Variant del full A: simetria del tauler i substitució de cada element per un altre amb les mateixes propietats. */
function variantA(B,rnd){const [R,C]=dims(B),A=B.fulls.A,P=B.items.map(x=>x.p),K=B.items.map(x=>x.k);
  const fr=rnd()<.5,fc=rnd()<.5;const Bd=A.map((_,i)=>{let r=Math.floor(i/C),c=i%C;if(fr)r=R-1-r;if(fc)c=C-1-c;return A[r*C+c];});
  const same={};B.items.forEach((x,i)=>{(same[x.p]=same[x.p]||[]).push(i);});
  const W=wins(B).map(([r,c])=>cellsOf(B,r,c)),inW=Bd.map((_,i)=>W.filter(w=>w.includes(i)));
  const order=Bd.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  for(const i of order){const cand=same[P[Bd[i]]];for(let t=0;t<6;t++){const x=cand[Math.floor(rnd()*cand.length)],old=Bd[i];Bd[i]=x;
      if(inW[i].every(w=>new Set(w.map(j=>K[Bd[j]])).size===4)&&Bd.filter(y=>y===x).length===1)break;Bd[i]=old;}}
  return Bd;}
function genera(B,num){const o=B.gen||{};
  for(let a=0;a<(o.tries||2);a++){const rnd=mulberry32(hashSeed(B.code+'-'+num+'-'+a));
    const Bd=anneal(B,rnd,o.iters||60000,o.t0||5,o.decay||0.9998);if(valid(B,Bd)===wins(B).length&&maxMotiu(B,Bd)<=Math.max(maxMotiu(B,B.fulls.A),Math.floor(5*wins(B).length/12)))return Bd;}
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
  case 'ang':{const [th,phi,l2]=d,a1=phi*Math.PI/180,a2=(phi+th)*Math.PI/180,RA=11,RQ=8;   // RA, RQ: mida fixa de l'arc i del quadradet
    const P1=[Math.cos(a1),Math.sin(a1)],P2=[l2*Math.cos(a2),l2*Math.sin(a2)],pts=[[0,0],P1,P2],xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);
    const s=76/Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys),.8),cx=(Math.max(...xs)+Math.min(...xs))/2,cy=(Math.max(...ys)+Math.min(...ys))/2;
    const T=p=>[f1(50+(p[0]-cx)*s),f1(50-(p[1]-cy)*s)],O=T([0,0]),A=T(P1),Bp=T(P2),U=(a,r)=>[f1(O[0]+r*Math.cos(a)),f1(O[1]-r*Math.sin(a))];let o='';
    if(th===90){const q=[U(a1,RQ),[f1(O[0]+RQ*(Math.cos(a1)+Math.cos(a2))),f1(O[1]-RQ*(Math.sin(a1)+Math.sin(a2)))],U(a2,RQ)];
      o+=`<polyline points="${O} ${q.map(p=>p.join(',')).join(' ')} ${O}" fill="#d0d0d0" stroke="#000" stroke-width="1.6"/>`;}
    else{const ap=[];for(let i=0;i<=40;i++)ap.push(U(a1+(a2-a1)*i/40,RA));
      o+=`<path d="M${O} ${ap.map(p=>'L'+p.join(',')).join(' ')} Z" fill="#d0d0d0" stroke="none"/><polyline points="${ap.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#000" stroke-width="1.6"/>`;}
    return o+`<path d="M${A} L${O} L${Bp}" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${O[0]}" cy="${O[1]}" r="2.6"/>`;}
  case 'dots':{const g=d[0],X=v=>f1(12+v*76/g);let o='';for(let i=0;i<=g;i++)for(let j=0;j<=g;j++)o+=`<circle cx="${X(i)}" cy="${X(j)}" r="1.9" fill="#777"/>`;
    const pts=[];for(let i=1;i<d.length;i+=2)pts.push(X(d[i])+','+X(g-d[i+1]));return o+`<polygon points="${pts.join(' ')}" fill="#d9d9d9" fill-opacity=".85" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/>`;}
  case 'cells':{const w=Math.max(...d.map(p=>p[0]))+1,h=Math.max(...d.map(p=>p[1]))+1,s=Math.min(84/w,84/h,20),ox=50-w*s/2,oy=50-h*s/2;
    return d.map(([x,y])=>`<rect x="${f1(ox+x*s)}" y="${f1(oy+(h-1-y)*s)}" width="${f1(s)}" height="${f1(s)}" fill="#d9d9d9" stroke="#000" stroke-width="2.2"/>`).join('');}
  case 'svg':return d;}
  return '';}
const etiqueta=(B,id)=>{const d=B.items[id].d;if(B.tipus==='txt')return String(d);if(B.tipus==='fra')return typeof d==='string'?d:d[0]+'/'+d[1];return null;};
G.WODB={dims,wins,cellsOf,maxMotiu,motius,motiuCurt,genera,valid,dibuixa,etiqueta,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
