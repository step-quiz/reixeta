/* Reixeta · La reixeta de Cardano — motor (reixeta giratòria, missatges, famílies de nombres). Funciona al navegador i a Node.
   La reixeta és una de sola per a tot el joc: 6 × 6 caselles i 9 forats. Gira un quart de volta cap a la dreta tres vegades,
   i en les quatre posicions ensenya les 36 caselles, cadascuna una sola vegada. */
(function(G){
'use strict';
const N=6;
/* Els nou forats (fila, columna), amb l'estrella a dalt a l'esquerra. N'hi ha un a cada grup de quatre caselles que el gir
   intercanvia, i cap forat en toca un altre pel costat (comprovat a tools/cardano/check.js). */
const FORATS=[[0,3],[1,0],[1,5],[2,2],[2,4],[3,0],[4,2],[4,4],[5,0]];
const gira=(p,n)=>[p[1],(n||N)-1-p[0]];                        // un quart de volta cap a la dreta
const ordena=h=>h.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);   // ordre de lectura: per files
/* Els grups de quatre caselles que el gir intercanvia, en un full de n × n (n parell). */
function grups(n){const vist=new Set(),out=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++){if(vist.has(r*n+c))continue;const g=[];let p=[r,c];for(let k=0;k<4;k++){g.push(p);vist.add(p[0]*n+p[1]);p=gira(p,n);}out.push(g);}return out;}
/* Les quatre posicions de la reixeta: a cada una, els nou forats en ordre de lectura. */
const POSICIONS=(()=>{const out=[];let h=FORATS;for(let k=0;k<4;k++){out.push(ordena(h));h=h.map(p=>gira(p));}return out;})();
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashSeed(s){let h=2166136261>>>0;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h;}

/* ---------- missatges ---------- */
/* Només lletres (sense accents; la Ç es conserva) i xifres. */
function normalitza(t){return String(t).toUpperCase().replace(/Ç/g,'\u0001').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\u0001/g,'Ç').replace(/[^A-ZÇ0-9]/g,'');}
const FARCIMENT='EEEEEEAAAAAASSSSRRRRLLLLTTTTIIIINNNNOOOOCCCDDDUUUMMMPPBVGFQHXJ';
/* Full de 36 lletres: el missatge s'escriu pels forats, posició rere posició. El que sobra s'omple amb lletres a l'atzar
   (sempre les mateixes per al mateix missatge). Torna null si el missatge és buit o té més de 36 caràcters. */
function xifra(text){const m=normalitza(text);if(!m.length||m.length>N*N)return null;const rnd=mulberry32(hashSeed('CAR-'+m));
  const T=Array.from({length:N},()=>new Array(N).fill(''));let k=0;
  for(const pos of POSICIONS)for(const [r,c] of pos){T[r][c]=k<m.length?m[k]:FARCIMENT[Math.floor(rnd()*FARCIMENT.length)];k++;}
  return T;}
/* El que es llegeix a cada una de les quatre posicions. */
const llegeix=T=>POSICIONS.map(pos=>pos.map(([r,c])=>T[r][c]).join(''));
const codiMissatge=text=>'CAR-'+(hashSeed('m'+normalitza(text))%1679616).toString(36).toUpperCase().padStart(4,'0');
const EX={A:'La reixeta de Cardano gira quatre vegades',B:'El producte de dos negatius és positiu',C:'Un nombre primer només té dos divisors'};

/* ---------- quatre girs, quatre famílies ---------- */
const esPrimer=n=>{if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
const esQuadrat=n=>Math.round(Math.sqrt(n))**2===n;
const FAMILIES={
  P:{nom:'nombres primers',f:esPrimer},Q:{nom:'quadrats perfectes',f:esQuadrat},
  M4:{nom:'múltiples de 4',f:n=>n%4===0},M6:{nom:'múltiples de 6',f:n=>n%6===0},M7:{nom:'múltiples de 7',f:n=>n%7===0},
  M9:{nom:'múltiples de 9',f:n=>n%9===0},M10:{nom:'múltiples de 10',f:n=>n%10===0},M11:{nom:"múltiples d'11",f:n=>n%11===0}};
/* Nivells: rang dels nombres i famílies que hi poden sortir (el catàleg del nivell). */
const NIVELLS={
  CF1:{nom:'Nivell 1 · nombres de 2 a 150',lo:2,hi:150,cat:['P','M4','M6','M7','M9','M10']},
  CF2:{nom:'Nivell 2 · nombres de 2 a 200',lo:2,hi:200,cat:['P','Q','M4','M6','M7','M9','M10','M11']}};
const ORDRE=['CF1','CF2'],FIXOS=['A','B','C','D'];
/* Un full és bo si: té 36 nombres diferents del rang; a cada posició de la reixeta hi ha exactament 8 nombres de la família
   que toca i un intrús; l'intrús no és de cap família del catàleg; cada un dels altres és d'una sola de les quatre famílies
   del full; i a cada posició només una família de tot el catàleg té 8 o més dels 9 nombres (la resposta no és ambigua). */
function bo(F,niv){const L=NIVELLS[niv];if(!L||!F||F.fam.length!==4||new Set(F.fam).size!==4||F.fam.some(k=>!L.cat.includes(k)))return false;
  const tots=F.T.flat();if(tots.length!==N*N||new Set(tots).size!==N*N||tots.some(v=>v!==Math.floor(v)||v<L.lo||v>L.hi))return false;
  return POSICIONS.every((pos,i)=>{const vs=pos.map(([r,c])=>F.T[r][c]),fi=FAMILIES[F.fam[i]].f,fora=vs.filter(v=>!fi(v));
    if(fora.length!==1||fora[0]!==F.intrusos[i]||L.cat.some(k=>FAMILIES[k].f(fora[0])))return false;
    if(vs.some(v=>v!==fora[0]&&F.fam.filter(k=>FAMILIES[k].f(v)).length!==1))return false;
    return L.cat.filter(k=>vs.filter(FAMILIES[k].f).length>=8).length===1;});}
/* Full «id» d'un nivell (A–D són els fixos; qualsevol número és un «full nou»). Mateix id, mateix full. */
function genera(niv,id){const L=NIVELLS[niv];if(!L)return null;const lliures=[];for(let n=L.lo;n<=L.hi;n++)if(!L.cat.some(k=>FAMILIES[k].f(n)))lliures.push(n);
  for(let a=0;a<400;a++){const rnd=mulberry32(hashSeed(niv+'-'+id+'-'+a)),ri=n=>Math.floor(rnd()*n),tria=(arr,k)=>{const b=arr.slice();for(let i=b.length-1;i>0;i--){const j=ri(i+1);[b[i],b[j]]=[b[j],b[i]];}return b.slice(0,k);};
    const fam=tria(L.cat,4),pools=fam.map(k=>{const p=[];for(let n=L.lo;n<=L.hi;n++)if(FAMILIES[k].f(n)&&fam.filter(j=>FAMILIES[j].f(n)).length===1)p.push(n);return p;});
    if(pools.some(p=>p.length<8))continue;
    const T=Array.from({length:N},()=>new Array(N).fill(0)),intrusos=tria(lliures,4);
    POSICIONS.forEach((pos,i)=>{const vs=tria(pools[i],8),on=ri(9);let k=0;pos.forEach(([r,c],j)=>{T[r][c]=j===on?intrusos[i]:vs[k++];});});
    const F={T,fam,intrusos};if(bo(F,niv))return F;}
  return null;}
G.CARDANO={N,FORATS,POSICIONS,gira,ordena,grups,normalitza,xifra,llegeix,codiMissatge,EX,FAMILIES,NIVELLS,ORDRE,FIXOS,bo,genera,mulberry32,hashSeed};
})(typeof window!=='undefined'?window:globalThis);
