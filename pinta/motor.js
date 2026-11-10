/* Reixeta · Pinta per sumes — motor (regles, resolució i codis). Funciona al navegador i a Node. */
(function(G){
'use strict';
/* Una regla de suma per dibuix. Els tres divisors són primers entre si: els tres dibuixos no s'interfereixen. */
const REGLES=[{m:2,text:'la suma és parella'},{m:3,text:'la suma és múltiple de 3'},{m:5,text:'la suma és múltiple de 5 (acaba en 0 o en 5)'}];
const MIDES={10:{cel:18},8:{cel:22}};          // caselles per costat -> mida de la casella en mm (A4 vertical)
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
/* Un dibuix és una llista de files de text: 'X' negre, '.' blanc. Mida (N-1)×(N-1). */
const buit=N=>Array.from({length:N-1},()=>'.'.repeat(N-1));
const teNegre=D=>D.some(f=>f.includes('X'));
/* Residus mòdul m: la primera fila i la primera columna són lliures; cada altra casella surt de la posició
   que la té a baix a la dreta. Píxel negre: suma ≡ 0. Píxel blanc: qualsevol residu que no sigui 0. */
function residus(D,m,N,rnd){const x=Array.from({length:N},()=>new Array(N).fill(0));
  for(let i=0;i<N;i++){x[0][i]=Math.floor(rnd()*m);x[i][0]=Math.floor(rnd()*m);}
  for(let r=0;r<N-1;r++)for(let c=0;c<N-1;c++){const t=D[r][c]==='X'?0:1+Math.floor(rnd()*(m-1));x[r+1][c+1]=((t-x[r][c]-x[r][c+1]-x[r+1][c])%m+m)%m;}
  return x;}
/* Full de nombres de dues xifres que amaga els dibuixos (un per regla; un dibuix sense cap píxel negre no es fa servir).
   Cap nombre es repeteix dins d'una mateixa posició de la plantilla. Torna null si no ho aconsegueix. */
function resol(N,dibuixos,llavor){
  for(let a=0;a<200;a++){const rnd=mulberry32(hashSeed(llavor+'-'+a));
    const R=REGLES.map((g,k)=>residus(teNegre(dibuixos[k])?dibuixos[k]:Array.from({length:N-1},()=>Array.from({length:N-1},()=>rnd()<1/g.m?'X':'.').join('')),g.m,N,rnd));
    const T=Array.from({length:N},()=>new Array(N).fill(0));let ok=true;
    for(let r=0;r<N&&ok;r++)for(let c=0;c<N&&ok;c++){const cand=[];
      for(let n=10;n<=99;n++)if(REGLES.every((g,k)=>n%g.m===R[k][r][c])&&n!==(T[r-1]||[])[c]&&n!==T[r][c-1]&&n!==(T[r-1]||[])[c-1]&&n!==(T[r-1]||[])[c+1])cand.push(n);
      if(!cand.length)ok=false;else T[r][c]=cand[Math.floor(rnd()*cand.length)];}
    if(ok&&comprova(T,N,dibuixos))return T;}
  return null;}
/* Dibuix que surt de pintar, amb la regla k, les posicions del full T. */
function pinta(T,N,k){const m=REGLES[k].m,out=[];for(let r=0;r<N-1;r++){let s='';for(let c=0;c<N-1;c++)s+=(T[r][c]+T[r][c+1]+T[r+1][c]+T[r+1][c+1])%m===0?'X':'.';out.push(s);}return out;}
function comprova(T,N,dibuixos){
  for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!(T[r][c]>=10&&T[r][c]<=99))return false;
  for(let r=0;r<N-1;r++)for(let c=0;c<N-1;c++)if(new Set([T[r][c],T[r][c+1],T[r+1][c],T[r+1][c+1]]).size<4)return false;
  return dibuixos.every((D,k)=>!teNegre(D)||pinta(T,N,k).join()===D.join());}
/* ---------- estat <-> text (per a l'adreça de la pàgina) ---------- */
function codifica(N,dibuixos,llavor){const hex=D=>{const bits=D.join('').replace(/X/g,'1').replace(/\./g,'0');let h='';for(let i=0;i<bits.length;i+=4)h+=parseInt(bits.slice(i,i+4).padEnd(4,'0'),2).toString(16);return h;};
  return [N,...dibuixos.map(hex),llavor].join('.');}
function descodifica(s){const p=String(s).split('.');const N=+p[0];if(!MIDES[N]||p.length!==5)return null;const n=(N-1)*(N-1);
  const D=p.slice(1,4).map(h=>{if(!/^[0-9a-f]*$/.test(h))return null;let bits='';for(const ch of h)bits+=parseInt(ch,16).toString(2).padStart(4,'0');bits=bits.padEnd(n,'0').slice(0,n);
    return Array.from({length:N-1},(_,r)=>bits.slice(r*(N-1),(r+1)*(N-1)).replace(/1/g,'X').replace(/0/g,'.'));});
  if(D.some(d=>!d)||!/^\d{1,6}$/.test(p[4]))return null;return {N,dibuixos:D,llavor:p[4]};}
/* Codi curt que s'imprimeix al full (el mateix estat dona sempre el mateix codi). */
const codiCurt=estat=>'PIN-'+(hashSeed(estat)%1679616).toString(36).toUpperCase().padStart(4,'0');
/* ---------- fulls d'exemple ---------- */
const EX={
 A:[['.........','.XX...XX.','XXXX.XXXX','XXXXXXXXX','XXXXXXXXX','.XXXXXXX.','..XXXXX..','...XXX...','....X....'],
    ['..XXXXX..','.X.....X.','X.X...X.X','X.......X','X.......X','X.X...X.X','X..XXX..X','.X.....X.','..XXXXX..'],
    ['.........','XXXXXXXXX','XXXXXXXXX','..X...X..','..X...X..','..X...X..','..X...X..','..X...X..','.XX...XX.']],
 B:[['....X....','...XXX...','..XXXXX..','.XXXXXXX.','XXXXXXXXX','.XXXXXXX.','.XX.X.XX.','.XX.XXXX.','.XX.XXXX.'],
    ['....X....','...XXX...','..XXXXX..','...XXX...','..XXXXX..','.XXXXXXX.','XXXXXXXXX','....X....','....X....'],
    ['....X....','....XX...','....XXX..','....XXXX.','....X....','XXXXXXXXX','.XXXXXXX.','..XXXXX..','.........']],
 C:[['....X....','....X....','...XXX...','XXXXXXXXX','.XXXXXXX.','..XXXXX..','..XXXXX..','.XX...XX.','.X.....X.'],
    ['....X....','...XXX...','..XXXXX..','.XXXXXXX.','XXXXXXXXX','...XXX...','...XXX...','...XXX...','...XXX...'],
    ['.X.....X.','.XX...XX.','.XXXXXXX.','.X.X.X.X.','.XXXXXXX.','.XX.X.XX.','..XXXXX..','...X.X...','..XX.XX..']]};
const EXNOM={A:'cor, cara i lletra pi',B:'casa, arbre i veler',C:'estrella, fletxa i gat'};
G.PINTA={REGLES,MIDES,EX,EXNOM,buit,teNegre,resol,pinta,comprova,codifica,descodifica,codiCurt,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
