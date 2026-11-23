/* Searches the fixed sheets A–D of every bank and writes fulls_bal.json + bal_final.json.
   Usage (from tools/wodb, after export_bancs.py):   node fulls.js [CODE ...]      (then run export_bancs.py again)
   For each bank it looks for the smallest balance cap (max number of positions in which one reason type appears,
   starting at the owner's rule floor(5N/12)) for which 4 sheets exist that are valid in every position and have no
   repeated item. Each sheet is the best of SEEDS two-phase searches (WODB.cercaFull: feasibility, then polishing of
   the neighbour rule); "best" = fewest reason types repeated between neighbouring positions + items already used
   in the previous sheets of the bank. Deterministic. Same engine as the "Full nou" button (wodb/motor.js).
   BLB shares the boards of BLO (same items).
   Heavy mode (banks in HARD, default POL,COS): if the normal pass finds no sheet, each seed also tries three long
   phase-1 configurations (300 000 iterations) up to HSEEDS seeds, stopping at 3 good sheets. MINCAP skips caps that
   were proven out of reach (COS: no sheet at cap 5 in 600 heavy searches). */
'use strict';
const fs=require('fs'),path=require('path');
globalThis.window=globalThis;
require(path.join(__dirname,'../../wodb/motor.js'));require(path.join(__dirname,'../../wodb/bancs.js'));
const W=globalThis.WODB,BANCS=globalThis.BANCS,NAMES='ABCD',SEEDS=+(process.env.SEEDS||24),USEW=8,HSEEDS=+(process.env.HSEEDS||150);
// ANG: every valid window has exactly four of the five reasons «the only acute / right / obtuse / straight / reflex
// angle», so some reason appears in at least ceil(48/5) = 10 of the 12 positions (maths document, §4.2): caps below 10 are skipped.
const HARD=(process.env.HARD||'').split(',').filter(Boolean),MINCAP={ANG:10};
const HEAVY=[{w1:25,balw:20},{w1:40,balw:40},{w1:80,balw:60}].map(q=>Object.assign({iters:300000,decay:0.99997},q));
const FB=fs.existsSync(path.join(__dirname,'fulls_bal.json'))?JSON.parse(fs.readFileSync(path.join(__dirname,'fulls_bal.json'))):{};
const FIN=fs.existsSync(path.join(__dirname,'bal_final.json'))?JSON.parse(fs.readFileSync(path.join(__dirname,'bal_final.json'))):{};
const codes=(process.argv.length>2?process.argv.slice(2):globalThis.BANCS_ORDRE).filter(c=>c!=='BLB');
/* Vector pattern of a sheet under the four symmetries of the Klein group (identity, row flip, column flip, half
   turn). Sheets with a common key have the same reasons in every position, up to a symmetry (maths document, §4.5):
   before this check, ANG-D was ANG-B flipped upside down with other items of the same vectors (2026-11-23). */
function patronsKlein(B,Bd){const R=B.rows,C=B.cols,out=[];
  for(const fr of [0,1])for(const fc of [0,1]){const k=[];for(let r=0;r<R;r++)for(let c=0;c<C;c++)k.push(B.items[Bd[(fr?R-1-r:r)*C+(fc?C-1-c:c)]].p);out.push(k.join('|'));}
  return out;}
function cerca(B,cap){const used=new Float64Array(B.items.length),out={},patrons=new Set();
  for(const nm of NAMES){let best=null,n=0;const pen=used.map(u=>u*USEW);
    const take=Bd=>{if(!Bd||patronsKlein(B,Bd).some(k=>patrons.has(k)))return;n++;const cost=W.repVeins(B,Bd)+Bd.reduce((a,x)=>a+used[x],0);if(!best||cost<best.cost)best={Bd,cost};};
    for(let sd=0;sd<SEEDS;sd++)take(W.cercaFull(B,W.mulberry32(W.hashSeed(B.code+'|'+nm+'|'+cap+'|'+sd)),cap,pen));
    if(!best&&HARD.includes(B.code))for(let sd=0;sd<HSEEDS&&n<3;sd++)for(let h=0;h<HEAVY.length&&n<3;h++)
      take(W.cercaFull(B,W.mulberry32(W.hashSeed(B.code+'|'+nm+'|'+cap+'|H'+h+'|'+sd)),cap,pen,HEAVY[h]));
    if(!best)return null;
    out[nm]=best.Bd;for(const x of best.Bd)used[x]++;patronsKlein(B,best.Bd).forEach(k=>patrons.add(k));}
  return out;}
for(const c of codes){const B=BANCS[c],N=W.wins(B).length;let res=null,cap=Math.max(Math.floor(5*N/12),MINCAP[c]||0);
  for(;cap<=N&&!res;cap++)res=cerca(B,cap);
  cap--;const mx=Math.max(...Object.values(res).map(Bd=>W.maxMotiu(B,Bd)));
  const all=[].concat(...Object.values(res)),distinct=new Set(all).size;
  FB[c]=res;FIN[c]=[mx,N];
  FIN[c]=[mx,N,Object.values(res).map(Bd=>W.repVeins(B,Bd))];
  console.log(c,'cap',cap,'max',mx,'of',N,'| neighbour repeats per sheet',FIN[c][2].join(','),'| distinct items',distinct,'of',all.length,'(pool',B.items.length+')');}
delete FB.BLB;delete FIN.BLB;
fs.writeFileSync(path.join(__dirname,'fulls_bal.json'),JSON.stringify(FB));
fs.writeFileSync(path.join(__dirname,'bal_final.json'),JSON.stringify(FIN));
