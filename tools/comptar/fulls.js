/* Searches the fixed sheets A–D of each level of the counting game and writes ../../comptar/fulls.js.
   Usage (from anywhere): node tools/comptar/fulls.js
   Each sheet = the lowest-cost good sheet among SEEDS deterministic runs of the generator's annealer (COMPTAR.genera). */
'use strict';
const fs=require('fs'),path=require('path');globalThis.window=globalThis;
require(path.join(__dirname,'../../comptar/motor.js'));
const K=globalThis.COMPTAR,SEEDS=+(process.env.SEEDS||16),out={};
for(const niv of K.ORDRE){out[niv]={};
  for(const nm of 'ABCD'){let best=null;
    for(let s=0;s<SEEDS;s++){const T=K.genera(niv,'fix-'+nm+'-'+s);if(!T)continue;const c=K.cost(T,niv);if(!best||c<best.c)best={T,c};}
    out[niv][nm]=best.T;console.log(niv+'-'+nm,'cost',best.c.toFixed(1),JSON.stringify(K.histograma(best.T)));}}
fs.writeFileSync(path.join(__dirname,'../../comptar/fulls.js'),'/* Reixeta · Joc de comptar — fulls fixos. Generat automàticament (tools/comptar/fulls.js). */\nwindow.COMPTAR_FULLS='+JSON.stringify(out)+';\n');
