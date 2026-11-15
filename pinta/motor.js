/* Reixeta · Pinta per sumes — motor (temes, regles, resolució, laberints i codis). Funciona al navegador i a Node.
   Cada regla «suma» en un grup finit: a cada casella li correspon un element del grup (la seva classe) i la regla es compleix
   en una posició de la plantilla quan les quatre classes sumen l'element neutre. Per això qualsevol dibuix és possible. */
(function(G){
'use strict';
const Z=m=>({n:m,sum:(a,b)=>(a+b)%m,neg:a=>(m-a)%m});      // enters mòdul m
const B3={n:8,sum:(a,b)=>a^b,neg:a=>a};                    // tres paritats alhora (Z2 × Z2 × Z2)
const mod=(a,m)=>((a%m)+m)%m;
/* Un valor (el que s'imprimeix en una casella): {s: text} o {f:[numerador, denominador]}, amb c = classe per a cada regla del tema. */
/* Ronda 17 (el propietari, després de jugar): nombres de l'1 al 30, perquè les sumes es facin de cap. Distribució buscada:
   2/3 entre 1 i 15, 2/9 entre 16 i 25, 1/9 entre 26 i 30. Cada nombre és l'únic del seu residu mòdul 30 (= les tres classes):
   les classes lliures es trien amb aquests pesos (classesS) i, en aquest tema, un nombre es pot repetir dins d'una posició. */
const V_SUMES=[];for(let n=1;n<=30;n++)V_SUMES.push({s:String(n),c:[n%2,n%3,n%5],p:n<=15?2/3/15:n<=25?2/9/10:1/9/5});
const GRUPS=[15,25,30],OBJ=[2/3,2/9,1/9];
const PES_RES=new Array(30).fill(0);V_SUMES.forEach(v=>PES_RES[+v.s%30]+=v.p);
const res30=(a,b,c)=>{for(let m=0;m<30;m++)if(m%2===a&&m%3===b&&m%5===c)return m;};
const V_ENTERS=[];for(let n=-45;n<=45;n++)if(n)V_ENTERS.push({s:(n<0?'−':'')+Math.abs(n),c:[n<0?1:0,mod(n,3),mod(n,5)]});
const mcd=(a,b)=>b?mcd(b,a%b):a;
const V_FRACCIONS=[];for(let k=1;k<=18;k++){const d=mcd(k,6);V_FRACCIONS.push(6/d===1?{s:String(k/6),c:[0]}:{f:[k/d,6/d],c:[k%6]});}
const V_QUADRATS=[];for(let n=2;n<=150;n++){let m=n,bits=0;[2,3,5].forEach((p,i)=>{while(m%p===0){m/=p;bits^=1<<i;}});if(m===1)V_QUADRATS.push({s:String(n),c:[bits]});}
const TEMES={
  S:{nom:'Nombres de l\'1 al 30 · sumes',valors:V_SUMES,regles:[{g:Z(2),text:'la suma és parella'},{g:Z(3),text:'la suma és múltiple de 3'},{g:Z(5),text:'la suma és múltiple de 5 (acaba en 0 o en 5)'}]},
  E:{nom:'Enters · signe del producte',valors:V_ENTERS,regles:[{g:Z(2),text:'el producte dels quatre nombres és positiu'},{g:Z(3),text:'la suma és múltiple de 3'},{g:Z(5),text:'la suma és múltiple de 5'}]},
  F:{nom:'Fraccions · sumes enteres',valors:V_FRACCIONS,regles:[{g:Z(6),text:'la suma dels quatre nombres és un nombre enter'}]},
  Q:{nom:'Factors 2, 3 i 5 · quadrats perfectes',valors:V_QUADRATS,regles:[{g:B3,text:'el producte dels quatre nombres és un quadrat perfecte'}]}};
const ORDRE_TEMES=['S','E','F','Q'];
const REGLES=TEMES.S.regles;                   // compatibilitat: les tres regles de suma
/* Ronda 17: el full fa com a molt 8 × 8 caselles i no cal que sigui quadrat; té la mida dels dibuixos més 1 (h × w píxels -> (h+1) × (w+1)
   nombres). Casella de 19 mm (A4 vertical; guies fora del marc de 14 mm, als quatre costats). */
const MAX=8,MIN=3,CEL=19,MIDES={cel:CEL};
const midaOk=(h,w)=>Number.isInteger(h)&&Number.isInteger(w)&&h>=MIN-1&&w>=MIN-1&&h<=MAX-1&&w<=MAX-1;
const clau=v=>v.s||v.f.join('/');              // dos valors són «el mateix nombre» si s'imprimeixen igual
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}
/* Un dibuix és una llista de files de text: 'X' negre, '.' blanc. Mida h × w; el full és de (h+1) × (w+1). */
const buit=(h,w)=>Array.from({length:h},()=>'.'.repeat(w));
const teNegre=D=>!!D&&D.some(f=>f.includes('X'));
/* Ronda 17: cap fila ni cap columna del dibuix sense pintar (es fa estrany a l'alumnat). */
const senseBuides=D=>D.every(f=>f.includes('X'))&&[...D[0]].every((_,c)=>D.some(f=>f[c]==='X'));
/* Classes d'un dibuix en un grup: la primera fila i la primera columna són lliures; cada altra casella surt de la posició
   que la té a baix a la dreta. Píxel negre: les quatre classes sumen el neutre. Píxel blanc: sumen qualsevol altre element. */
function classes(D,g,R,C,rnd){const x=Array.from({length:R},()=>new Array(C).fill(0));
  for(let i=0;i<C;i++)x[0][i]=Math.floor(rnd()*g.n);for(let i=0;i<R;i++)x[i][0]=Math.floor(rnd()*g.n);
  for(let r=0;r<R-1;r++)for(let c=0;c<C-1;c++){const t=D[r][c]==='X'?0:1+Math.floor(rnd()*(g.n-1));x[r+1][c+1]=g.sum(t,g.neg(g.sum(g.sum(x[r][c],x[r][c+1]),x[r+1][c])));}
  return x;}
/* Tema S: les tres classes de cada casella es trien juntes, amb probabilitat proporcional al pes del residu mòdul 30 que en surt
   (PES_RES); a les caselles on un dibuix força la classe, només es trien les altres. Així els nombres petits surten més. */
function triaPes(op,rnd){const t=op.reduce((a,o)=>a+o.w,0);let x=rnd()*t;for(const o of op){x-=o.w;if(x<=0)return o;}return op[op.length-1];}
function classesS(D,R,C,rnd){const G=[2,3,5],x=G.map(()=>Array.from({length:R},()=>new Array(C).fill(0)));
  const posa=(r,c,f)=>{const op=[];for(let a=0;a<2;a++)for(let b=0;b<3;b++)for(let d=0;d<5;d++){const v=[a,b,d];if(f(v))op.push({v,w:PES_RES[res30(a,b,d)]});}
    const o=triaPes(op,rnd);G.forEach((_,k)=>x[k][r][c]=o.v[k]);};
  for(let i=0;i<C;i++)posa(0,i,()=>true);for(let i=1;i<R;i++)posa(i,0,()=>true);
  for(let r=0;r<R-1;r++)for(let c=0;c<C-1;c++)
    posa(r+1,c+1,v=>G.every((n,k)=>{const t=(v[k]+x[k][r][c]+x[k][r][c+1]+x[k][r+1][c])%n;return D[k][r][c]==='X'?t===0:t!==0;}));
  return x;}
/* Dibuix a l'atzar per a una regla sense dibuix (es pinta igualment): probabilitat 1/n de negre, sense files ni columnes buides. */
function atzar(h,w,n,rnd){for(let a=0;a<500;a++){const D=Array.from({length:h},()=>Array.from({length:w},()=>rnd()<1/n?'X':'.').join(''));if(senseBuides(D))return D;}
  return Array.from({length:h},(_,r)=>Array.from({length:w},(_,c)=>(r===c||(r>=w&&c===w-1)||(c>=h&&r===h-1))?'X':'.').join(''));}
/* Full que amaga els dibuixos (un per regla del tema; un dibuix en blanc es canvia per un a l'atzar). Dibuixos de h × w: full de
   (h+1) × (w+1). Fora del tema S, cap valor es repeteix dins d'una mateixa posició de la plantilla. Torna null si no ho aconsegueix. */
function resol(tema,h,w,dibuixos,llavor){const M=TEMES[tema];if(!M||!midaOk(h,w))return null;const R=h+1,C=w+1;let millor=null,bons=0;
  for(let a=0;a<300;a++){const rnd=mulberry32(hashSeed(llavor+'-'+a));
    const D=M.regles.map((g,k)=>teNegre(dibuixos[k])?dibuixos[k]:atzar(h,w,g.g.n,rnd));
    const X=tema==='S'?classesS(D,R,C,rnd):M.regles.map((g,k)=>classes(D[k],g.g,R,C,rnd));
    const T=Array.from({length:R},()=>new Array(C).fill(null));let ok=true;
    for(let r=0;r<R&&ok;r++)for(let c=0;c<C&&ok;c++){const prop=tema==='S'?[]:[(T[r-1]||[])[c],T[r][c-1],(T[r-1]||[])[c-1],(T[r-1]||[])[c+1]].filter(Boolean).map(clau);
      const cand=M.valors.filter(v=>v.c.every((x,k)=>x===X[k][r][c])&&!prop.includes(clau(v)));
      if(!cand.length)ok=false;else T[r][c]=cand[0].p?triaPes(cand.map(v=>({v,w:v.p})),rnd).v:cand[Math.floor(rnd()*cand.length)];}
    if(ok&&comprova(tema,T,dibuixos)){if(tema!=='S')return T;
      /* tema S: entre els primers 16 fulls bons, el que té la distribució més propera a 2/3, 2/9, 1/9 */
      const f=[0,0,0];T.flat().forEach(v=>{f[GRUPS.findIndex(g=>+v.s<=g)]++;});const d=f.reduce((z,x,i)=>z+Math.abs(x/(R*C)-OBJ[i]),0);
      if(!millor||d<millor.d)millor={T,d};if(++bons>=16)break;}}
  return millor?millor.T:null;}
/* Dibuix que surt de pintar, amb la regla k del tema, les posicions del full T. */
function pinta(tema,T,k){const g=TEMES[tema].regles[k].g,R=T.length,C=T[0].length,out=[];for(let r=0;r<R-1;r++){let s='';for(let c=0;c<C-1;c++)s+=g.sum(g.sum(T[r][c].c[k],T[r][c+1].c[k]),g.sum(T[r+1][c].c[k],T[r+1][c+1].c[k]))===0?'X':'.';out.push(s);}return out;}
function comprova(tema,T,dibuixos){const M=TEMES[tema],R=T.length,C=T[0].length;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++)if(!M.valors.includes(T[r][c]))return false;
  if(tema!=='S')for(let r=0;r<R-1;r++)for(let c=0;c<C-1;c++)if(new Set([T[r][c],T[r][c+1],T[r+1][c],T[r+1][c+1]].map(clau)).size<4)return false;
  return M.regles.every((g,k)=>{if(!teNegre(dibuixos[k]))return senseBuides(pinta(tema,T,k));return pinta(tema,T,k).join()===dibuixos[k].join();});}
/* ---------- laberints ---------- */
/* Laberint a l'atzar (sempre el mateix per a la mateixa llavor): les posicions de fila i columna senars (A1, A3, C1…) són
   cambres, i un arbre de passadissos les uneix totes. Negre = es pot passar. Entre dues posicions només hi ha un camí. */
function laberint(h,w,llavor){if(h%2===0||w%2===0)return null;   // cal un nombre senar de files i de columnes
  const mh=(h+1)/2,mw=(w+1)/2,rnd=mulberry32(hashSeed('lab-'+h+'x'+w+'-'+llavor)),D=Array.from({length:h},()=>new Array(w).fill('.'));
  const vist=Array.from({length:mh},()=>new Array(mw).fill(false)),pila=[[0,0]];vist[0][0]=true;D[0][0]='X';
  while(pila.length){const [r,c]=pila[pila.length-1],ve=[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([a,b])=>a>=0&&b>=0&&a<mh&&b<mw&&!vist[a][b]);
    if(!ve.length){pila.pop();continue;}const [a,b]=ve[Math.floor(rnd()*ve.length)];vist[a][b]=true;D[2*a][2*b]='X';D[r+a][c+b]='X';pila.push([a,b]);}
  return D.map(f=>f.join(''));}
/* Si el dibuix és un laberint (les caselles negres fan un arbre que conté l'entrada, a dalt a l'esquerra, i la sortida,
   a baix a la dreta), torna l'únic camí de l'entrada a la sortida com a llista de [fila, columna]. Si no ho és, torna null. */
function cami(D){const h=D.length,n=D[0].length,neg=(r,c)=>r>=0&&c>=0&&r<h&&c<n&&D[r][c]==='X';if(!neg(0,0)||!neg(h-1,n-1))return null;
  let nodes=0,arestes=0;for(let r=0;r<h;r++)for(let c=0;c<n;c++)if(neg(r,c)){nodes++;if(neg(r,c+1))arestes++;if(neg(r+1,c))arestes++;}
  if(arestes!==nodes-1)return null;                                   // un arbre té un passadís menys que caselles…
  const pare=new Map([[0,-1]]),cua=[[0,0]];
  while(cua.length){const [r,c]=cua.shift();for(const [a,b] of [[r-1,c],[r+1,c],[r,c-1],[r,c+1]])if(neg(a,b)&&!pare.has(a*n+b)){pare.set(a*n+b,r*n+c);cua.push([a,b]);}}
  if(pare.size!==nodes)return null;                                   // …i és d'una sola peça
  const out=[];for(let p=h*n-1;p!==-1;p=pare.get(p))out.push([Math.floor(p/n),p%n]);return out.reverse();}
/* ---------- estat <-> text (per a l'adreça de la pàgina) ---------- */
function codifica(tema,h,w,dibuixos,llavor){const hex=D=>{const bits=(D||buit(h,w)).join('').replace(/X/g,'1').replace(/\./g,'0');let x='';for(let i=0;i<bits.length;i+=4)x+=parseInt(bits.slice(i,i+4).padEnd(4,'0'),2).toString(16);return x;};
  return (tema==='S'?[]:[tema]).concat([h+'x'+w,hex(dibuixos[0]),hex(dibuixos[1]),hex(dibuixos[2]),llavor]).join('.');}
function descodifica(s){const p=String(s).split('.');let tema='S';if(/^[A-Z]$/.test(p[0])){tema=p.shift();}
  const m=/^(\d)x(\d)$/.exec(p[0]||'');if(!TEMES[tema]||!m||p.length!==5)return null;const h=+m[1],w=+m[2];if(!midaOk(h,w))return null;const n=h*w;
  const D=p.slice(1,4).map(x=>{if(!/^[0-9a-f]*$/.test(x))return null;let bits='';for(const ch of x)bits+=parseInt(ch,16).toString(2).padStart(4,'0');bits=bits.padEnd(n,'0').slice(0,n);
    return Array.from({length:h},(_,r)=>bits.slice(r*w,(r+1)*w).replace(/1/g,'X').replace(/0/g,'.'));});
  if(D.some(d=>!d)||!/^\d{1,6}$/.test(p[4]))return null;return {tema,h,w,dibuixos:D,llavor:p[4]};}
/* Codi curt que s'imprimeix al full (el mateix estat dona sempre el mateix codi). */
const codiCurt=estat=>'PIN-'+(hashSeed(estat)%1679616).toString(36).toUpperCase().padStart(4,'0');
/* ---------- fulls fixos (ronda 17: dibuixos aprovats pel propietari, de com a molt 7 × 7, sense files ni columnes buides) ---------- */
const EX={
 A:{tema:'S',nom:'emoticones',dib:[['.XXXXX.','XXXXXXX','XX.X.XX','XXXXXXX','X.XXX.X','XX...XX','.XXXXX.'],['.XXXXX.','XXXXXXX','XX.X.XX','XXXXXXX','XX...XX','X.XXX.X','.XXXXX.'],['.XXXXX.','XXXXXXX','XX.X.XX','XXXXXXX','XXXXXXX','XX...XX','.XXXXX.']]},
 B:{tema:'S',nom:'lluna, arbre i bolet',dib:[['..XXXXX','.XXX...','XXX....','XXX....','XXX....','.XXX...','..XXXXX'],['...X...','..XXX..','.XXXXX.','..XXX..','.XXXXX.','XXXXXXX','...X...'],['..XXX..','.XXXXX.','X.XXX.X','XXXXXXX','..XXX..','..XXX..','.XXXXX.']]},
 C:{tema:'S',nom:'videojoc',dib:[['.X...X.','..X.X..','.XXXXX.','XX.X.XX','XXXXXXX','X.X.X.X','.X...X.'],['..XXX..','.XXXXX.','XX.X.XX','XXXXXXX','XXXXXXX','XXXXXXX','X.X.X.X'],['..XXXX.','.XXXXXX','XXXXX..','XXX....','XXXXX..','.XXXXXX','..XXXX.']]},
 D:{tema:'S',nom:'gat, ninot i cor',dib:[['X.....X','XX...XX','XXXXXXX','X.XXX.X','XXXXXXX','XXX.XXX','.XXXXX.'],['..XXX..','..XXX..','...X...','XXXXXXX','...X...','..X.X..','.X...X.'],['.XX.XX.','XXXXXXX','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...']]},
 E:{tema:'S',nom:'menjar: plàtan, pastanaga i piruleta',dib:[['...X.','...XX','...XX','..XXX','.XXX.','XXX..','XX...'],['X.X.X','.XXX.','XXXXX','.XXX.','.XXX.','..X..','..X..'],['.XXX.','X...X','X.X.X','X...X','.XXX.','..X..','..X..']]},
 F:{tema:'S',nom:'festa: copa, globus i pastís',dib:[['XXXXX','XXXXX','.XXX.','..X..','..X..','.XXX.','XXXXX'],['.XXX.','XXXXX','XXXXX','.XXX.','..X..','..X..','..X..'],['X.X.X','X.X.X','XXXXX','XXXXX','X.X.X','XXXXX','XXXXX']]},
 G:{tema:'S',nom:'regal, careta i corona',dib:[['.XX.XX.','XXXXXXX','X..X..X','X..X..X','XXXXXXX'],['XXXXXXX','X.XXX.X','XXXXXXX','.XX.XX.','..XXX..'],['X..X..X','XX.X.XX','XXXXXXX','X.X.X.X','XXXXXXX']]},
 H:{tema:'S',nom:'petits: cor, estrella i casa',dib:[['XX.XX','XXXXX','XXXXX','.XXX.','..X..'],['..X..','XXXXX','.XXX.','.X.X.','X...X'],['..X..','.XXX.','XXXXX','X.X.X','XXXXX']]},
 L:{tema:'S',nom:'tres laberints',dib:[laberint(7,7,1),laberint(7,7,2),laberint(7,7,3)]},
 N:{tema:'E',nom:'enters: signes de sumar i de multiplicar, i un cor',dib:[['...X...','...X...','...X...','XXXXXXX','...X...','...X...','...X...'],['X.....X','.X...X.','..X.X..','...X...','..X.X..','.X...X.','X.....X'],['.XX.XX.','XXXXXXX','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...']]},
 R:{tema:'F',nom:'fraccions: el número 1',dib:[['..X..','.XX..','X.X..','..X..','..X..','..X..','XXXXX'],buit(7,5),buit(7,5)]},
 Q:{tema:'Q',nom:'quadrats perfectes: quadrats dins de quadrats',dib:[['XXXXXXX','X.....X','X.XXX.X','X.X.X.X','X.XXX.X','X.....X','XXXXXXX'],buit(7,7),buit(7,7)]}};
const ORDRE_EX=['A','B','C','D','E','F','G','H','L','N','R','Q'];
const midaDe=D=>[D.length,D[0].length];   // h, w d'un dibuix
G.PINTA={TEMES,ORDRE_TEMES,REGLES,MIDES,MAX,MIN,CEL,midaOk,midaDe,senseBuides,EX,ORDRE_EX,clau,buit,teNegre,resol,pinta,comprova,laberint,cami,codifica,descodifica,codiCurt,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
