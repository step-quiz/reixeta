/* Reixeta · Pinta per sumes — motor (temes, regles, resolució, laberints i codis). Funciona al navegador i a Node.
   Cada regla «suma» en un grup finit: a cada casella li correspon un element del grup (la seva classe) i la regla es compleix
   en una posició de la plantilla quan les quatre classes sumen l'element neutre. Per això qualsevol dibuix és possible. */
(function(G){
'use strict';
const Z=m=>({n:m,sum:(a,b)=>(a+b)%m,neg:a=>(m-a)%m});      // enters mòdul m
const B3={n:8,sum:(a,b)=>a^b,neg:a=>a};                    // tres paritats alhora (Z2 × Z2 × Z2)
const mod=(a,m)=>((a%m)+m)%m;
/* Un valor (el que s'imprimeix en una casella): {s: text} o {f:[numerador, denominador]}, amb c = classe per a cada regla del tema. */
const V_SUMES=[];for(let n=10;n<=99;n++)V_SUMES.push({s:String(n),c:[n%2,n%3,n%5]});
const V_ENTERS=[];for(let n=-45;n<=45;n++)if(n)V_ENTERS.push({s:(n<0?'−':'')+Math.abs(n),c:[n<0?1:0,mod(n,3),mod(n,5)]});
const mcd=(a,b)=>b?mcd(b,a%b):a;
const V_FRACCIONS=[];for(let k=1;k<=18;k++){const d=mcd(k,6);V_FRACCIONS.push(6/d===1?{s:String(k/6),c:[0]}:{f:[k/d,6/d],c:[k%6]});}
const V_QUADRATS=[];for(let n=2;n<=150;n++){let m=n,bits=0;[2,3,5].forEach((p,i)=>{while(m%p===0){m/=p;bits^=1<<i;}});if(m===1)V_QUADRATS.push({s:String(n),c:[bits]});}
const TEMES={
  S:{nom:'Nombres de dues xifres · sumes',valors:V_SUMES,regles:[{g:Z(2),text:'la suma és parella'},{g:Z(3),text:'la suma és múltiple de 3'},{g:Z(5),text:'la suma és múltiple de 5 (acaba en 0 o en 5)'}]},
  E:{nom:'Enters · signe del producte',valors:V_ENTERS,regles:[{g:Z(2),text:'el producte dels quatre nombres és positiu'},{g:Z(3),text:'la suma és múltiple de 3'},{g:Z(5),text:'la suma és múltiple de 5'}]},
  F:{nom:'Fraccions · sumes enteres',valors:V_FRACCIONS,regles:[{g:Z(6),text:'la suma dels quatre nombres és un nombre enter'}]},
  Q:{nom:'Factors 2, 3 i 5 · quadrats perfectes',valors:V_QUADRATS,regles:[{g:B3,text:'el producte dels quatre nombres és un quadrat perfecte'}]}};
const ORDRE_TEMES=['S','E','F','Q'];
const REGLES=TEMES.S.regles;                   // compatibilitat: les tres regles de suma
const MIDES={10:{cel:18},8:{cel:22}};          // caselles per costat -> mida de la casella en mm (A4 vertical)
const clau=v=>v.s||v.f.join('/');              // dos valors són «el mateix nombre» si s'imprimeixen igual
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
/* Un dibuix és una llista de files de text: 'X' negre, '.' blanc. Mida (N-1)×(N-1). */
const buit=N=>Array.from({length:N-1},()=>'.'.repeat(N-1));
const teNegre=D=>!!D&&D.some(f=>f.includes('X'));
/* Classes d'un dibuix en un grup: la primera fila i la primera columna són lliures; cada altra casella surt de la posició
   que la té a baix a la dreta. Píxel negre: les quatre classes sumen el neutre. Píxel blanc: sumen qualsevol altre element. */
function classes(D,g,N,rnd){const x=Array.from({length:N},()=>new Array(N).fill(0));
  for(let i=0;i<N;i++){x[0][i]=Math.floor(rnd()*g.n);x[i][0]=Math.floor(rnd()*g.n);}
  for(let r=0;r<N-1;r++)for(let c=0;c<N-1;c++){const t=D[r][c]==='X'?0:1+Math.floor(rnd()*(g.n-1));x[r+1][c+1]=g.sum(t,g.neg(g.sum(g.sum(x[r][c],x[r][c+1]),x[r+1][c])));}
  return x;}
/* Full que amaga els dibuixos (un per regla del tema; un dibuix sense cap píxel negre no es fa servir).
   Cap valor es repeteix dins d'una mateixa posició de la plantilla. Torna null si no ho aconsegueix. */
function resol(tema,N,dibuixos,llavor){const M=TEMES[tema];if(!M||!MIDES[N])return null;
  for(let a=0;a<300;a++){const rnd=mulberry32(hashSeed(llavor+'-'+a));
    const R=M.regles.map((g,k)=>classes(teNegre(dibuixos[k])?dibuixos[k]:Array.from({length:N-1},()=>Array.from({length:N-1},()=>rnd()<1/g.g.n?'X':'.').join('')),g.g,N,rnd));
    const T=Array.from({length:N},()=>new Array(N).fill(null));let ok=true;
    for(let r=0;r<N&&ok;r++)for(let c=0;c<N&&ok;c++){const prop=[(T[r-1]||[])[c],T[r][c-1],(T[r-1]||[])[c-1],(T[r-1]||[])[c+1]].filter(Boolean).map(clau);
      const cand=M.valors.filter(v=>v.c.every((x,k)=>x===R[k][r][c])&&!prop.includes(clau(v)));
      if(!cand.length)ok=false;else T[r][c]=cand[Math.floor(rnd()*cand.length)];}
    if(ok&&comprova(tema,T,N,dibuixos))return T;}
  return null;}
/* Dibuix que surt de pintar, amb la regla k del tema, les posicions del full T. */
function pinta(tema,T,N,k){const g=TEMES[tema].regles[k].g,out=[];for(let r=0;r<N-1;r++){let s='';for(let c=0;c<N-1;c++)s+=g.sum(g.sum(T[r][c].c[k],T[r][c+1].c[k]),g.sum(T[r+1][c].c[k],T[r+1][c+1].c[k]))===0?'X':'.';out.push(s);}return out;}
function comprova(tema,T,N,dibuixos){const M=TEMES[tema];
  for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!M.valors.includes(T[r][c]))return false;
  for(let r=0;r<N-1;r++)for(let c=0;c<N-1;c++)if(new Set([T[r][c],T[r][c+1],T[r+1][c],T[r+1][c+1]].map(clau)).size<4)return false;
  return M.regles.every((g,k)=>!teNegre(dibuixos[k])||pinta(tema,T,N,k).join()===dibuixos[k].join());}
/* ---------- laberints ---------- */
/* Laberint a l'atzar (sempre el mateix per a la mateixa llavor): les posicions de fila i columna senars (A1, A3, C1…) són
   cambres, i un arbre de passadissos les uneix totes. Negre = es pot passar. Entre dues posicions només hi ha un camí. */
function laberint(N,llavor){const n=N-1,m=(n+1)/2,rnd=mulberry32(hashSeed('lab-'+N+'-'+llavor)),D=Array.from({length:n},()=>new Array(n).fill('.'));
  const vist=Array.from({length:m},()=>new Array(m).fill(false)),pila=[[0,0]];vist[0][0]=true;D[0][0]='X';
  while(pila.length){const [r,c]=pila[pila.length-1],ve=[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([a,b])=>a>=0&&b>=0&&a<m&&b<m&&!vist[a][b]);
    if(!ve.length){pila.pop();continue;}const [a,b]=ve[Math.floor(rnd()*ve.length)];vist[a][b]=true;D[2*a][2*b]='X';D[r+a][c+b]='X';pila.push([a,b]);}
  return D.map(f=>f.join(''));}
/* Si el dibuix és un laberint (les caselles negres fan un arbre que conté l'entrada, a dalt a l'esquerra, i la sortida,
   a baix a la dreta), torna l'únic camí de l'entrada a la sortida com a llista de [fila, columna]. Si no ho és, torna null. */
function cami(D){const n=D.length,neg=(r,c)=>r>=0&&c>=0&&r<n&&c<n&&D[r][c]==='X';if(!neg(0,0)||!neg(n-1,n-1))return null;
  let nodes=0,arestes=0;for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(neg(r,c)){nodes++;if(neg(r,c+1))arestes++;if(neg(r+1,c))arestes++;}
  if(arestes!==nodes-1)return null;                                   // un arbre té un passadís menys que caselles…
  const pare=new Map([[0,-1]]),cua=[[0,0]];
  while(cua.length){const [r,c]=cua.shift();for(const [a,b] of [[r-1,c],[r+1,c],[r,c-1],[r,c+1]])if(neg(a,b)&&!pare.has(a*n+b)){pare.set(a*n+b,r*n+c);cua.push([a,b]);}}
  if(pare.size!==nodes)return null;                                   // …i és d'una sola peça
  const out=[];for(let p=n*n-1;p!==-1;p=pare.get(p))out.push([Math.floor(p/n),p%n]);return out.reverse();}
/* ---------- estat <-> text (per a l'adreça de la pàgina) ---------- */
function codifica(tema,N,dibuixos,llavor){const hex=D=>{const bits=(D||buit(N)).join('').replace(/X/g,'1').replace(/\./g,'0');let h='';for(let i=0;i<bits.length;i+=4)h+=parseInt(bits.slice(i,i+4).padEnd(4,'0'),2).toString(16);return h;};
  return (tema==='S'?[]:[tema]).concat([N,hex(dibuixos[0]),hex(dibuixos[1]),hex(dibuixos[2]),llavor]).join('.');}
function descodifica(s){const p=String(s).split('.');let tema='S';if(/^[A-Z]$/.test(p[0])){tema=p.shift();}const N=+p[0];if(!TEMES[tema]||!MIDES[N]||p.length!==5)return null;const n=(N-1)*(N-1);
  const D=p.slice(1,4).map(h=>{if(!/^[0-9a-f]*$/.test(h))return null;let bits='';for(const ch of h)bits+=parseInt(ch,16).toString(2).padStart(4,'0');bits=bits.padEnd(n,'0').slice(0,n);
    return Array.from({length:N-1},(_,r)=>bits.slice(r*(N-1),(r+1)*(N-1)).replace(/1/g,'X').replace(/0/g,'.'));});
  if(D.some(d=>!d)||!/^\d{1,6}$/.test(p[4]))return null;return {tema,N,dibuixos:D,llavor:p[4]};}
/* Codi curt que s'imprimeix al full (el mateix estat dona sempre el mateix codi). */
const codiCurt=estat=>'PIN-'+(hashSeed(estat)%1679616).toString(36).toUpperCase().padStart(4,'0');
/* ---------- fulls d'exemple (tots de 10 × 10) ---------- */
const B=buit(10);
const EX={
 A:{tema:'S',nom:'cor, cara i lletra pi',dib:[['.........','.XX...XX.','XXXX.XXXX','XXXXXXXXX','XXXXXXXXX','.XXXXXXX.','..XXXXX..','...XXX...','....X....'],
    ['..XXXXX..','.X.....X.','X.X...X.X','X.......X','X.......X','X.X...X.X','X..XXX..X','.X.....X.','..XXXXX..'],
    ['.........','XXXXXXXXX','XXXXXXXXX','..X...X..','..X...X..','..X...X..','..X...X..','..X...X..','.XX...XX.']]},
 B:{tema:'S',nom:'casa, arbre i veler',dib:[['....X....','...XXX...','..XXXXX..','.XXXXXXX.','XXXXXXXXX','.XXXXXXX.','.XX.X.XX.','.XX.XXXX.','.XX.XXXX.'],
    ['....X....','...XXX...','..XXXXX..','...XXX...','..XXXXX..','.XXXXXXX.','XXXXXXXXX','....X....','....X....'],
    ['....X....','....XX...','....XXX..','....XXXX.','....X....','XXXXXXXXX','.XXXXXXX.','..XXXXX..','.........']]},
 C:{tema:'S',nom:'ninot, fletxa i gat',dib:[['...XXX...','...XXX...','....X....','.XXXXXXX.','.X.XXX.X.','...XXX...','...X.X...','...X.X...','..XX.XX..'],
    ['....X....','...XXX...','..XXXXX..','.XXXXXXX.','XXXXXXXXX','....X....','....X....','....X....','....X....'],
    ['.X.....X.','.XX...XX.','.XXXXXXX.','.XXXXXXX.','.X.XXX.X.','.XXXXXXX.','.XXX.XXX.','..XXXXX..','...XXX...']]},
 L:{tema:'S',nom:'tres laberints',dib:[laberint(10,1),laberint(10,2),laberint(10,3)]},
 E:{tema:'E',nom:'enters: signes de sumar, multiplicar i dividir',dib:[['...XXX...','...XXX...','...XXX...','XXXXXXXXX','XXXXXXXXX','XXXXXXXXX','...XXX...','...XXX...','...XXX...'],
    ['X.......X','.X.....X.','..X...X..','...X.X...','....X....','...X.X...','..X...X..','.X.....X.','X.......X'],
    ['....X....','...XXX...','....X....','.........','XXXXXXXXX','.........','....X....','...XXX...','....X....']]},
 F:{tema:'F',nom:'fraccions: el número 1',dib:[['....X....','...XX....','..X.X....','....X....','....X....','....X....','....X....','....X....','..XXXXX..'],B,B]},
 Q:{tema:'Q',nom:'quadrats perfectes: quadrats dins de quadrats',dib:[['XXXXXXXXX','X.......X','X.XXXXX.X','X.X...X.X','X.X.X.X.X','X.X...X.X','X.XXXXX.X','X.......X','XXXXXXXXX'],B,B]}};
const ORDRE_EX=['A','B','C','L','E','F','Q'];
G.PINTA={TEMES,ORDRE_TEMES,REGLES,MIDES,EX,ORDRE_EX,clau,buit,teNegre,resol,pinta,comprova,laberint,cami,codifica,descodifica,codiCurt,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
