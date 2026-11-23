/* Searches the fixed sheets A–D of each level of the counting game and writes ../../comptar/fulls.js.
   Usage (from anywhere): node tools/comptar/fulls.js
   Each sheet = the lowest-cost good sheet among SEEDS deterministic runs of the generator's annealer (COMPTAR.genera). */
'use strict';
const fs=require('fs'),path=require('path');globalThis.window=globalThis;
require(path.join(__dirname,'../../comptar/motor.js'));
const K=globalThis.COMPTAR,SEEDS=+(process.env.SEEDS||16),out={};
const OLD=fs.existsSync(path.join(__dirname,'../../comptar/fulls.js'))?(require(path.join(__dirname,'../../comptar/fulls.js')),globalThis.COMPTAR_FULLS||{}):{};
/* Class pattern of a sheet (the vector of counted properties of every cell) under the four symmetries of the
   Klein group (identity, row flip, column flip, half turn). Two sheets with a common key give the same answers,
   up to a symmetry, in every position (maths document, §3.7): the search found such pairs (CO1 A/D and B/C,
   CO2 B/C, CS2 B/C) before this check was added. */
function patronsKlein(T,niv){const N=K.NIVELLS[niv],P=K.comptades(niv),v=x=>P.map(p=>p.f(x)?1:0).join(''),out=[];
  for(const fr of [0,1])for(const fc of [0,1]){const k=[];for(let r=0;r<N.R;r++)for(let c=0;c<N.C;c++)k.push(v(T[(fr?N.R-1-r:r)*N.C+(fc?N.C-1-c:c)]));out.push(k.join('|'));}
  return out;}
for(const niv of K.ORDRE){if(OLD[niv]&&!process.env.TOT){out[niv]=OLD[niv];console.log(niv,'kept (set TOT=1 to search again)');continue;}out[niv]={};
  for(const nm of 'ABCD'){let best=null;
    const usats=new Set(Object.values(out[niv]).map(T=>T.slice().sort((a,b)=>a-b).join()));   // round 18: the four sheets of a level must have different sets of numbers
    const patrons=new Set([].concat(...Object.values(out[niv]).map(T=>patronsKlein(T,niv))));   // 2026-11-23: and different class patterns, up to the Klein group
    for(let s=0;s<SEEDS;s++){const T=K.genera(niv,'fix-'+nm+'-'+s);if(!T||usats.has(T.slice().sort((a,b)=>a-b).join())||patronsKlein(T,niv).some(k=>patrons.has(k)))continue;const c=K.cost(T,niv);if(!best||c<best.c)best={T,c};}
    out[niv][nm]=best.T;console.log(niv+'-'+nm,'cost',best.c.toFixed(1),JSON.stringify(K.histograma(best.T,niv)));}}
fs.writeFileSync(path.join(__dirname,'../../comptar/fulls.js'),'/* Reixeta · Joc de comptar — fulls fixos. Generat automàticament (tools/comptar/fulls.js). */\nwindow.COMPTAR_FULLS='+JSON.stringify(out)+';\n');
