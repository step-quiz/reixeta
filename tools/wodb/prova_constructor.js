/* Browser test of wodb/constructor.html. Usage: node tools/wodb/prova_constructor.js   (needs the `playwright` npm package and Chromium)
   For several banks and grid sizes: "Omple sol" must give a sheet whose every position is valid (re-checked here with
   WODB.valid, not with the page's own code), the mask must fit the paper at the extreme positions, the state must
   survive a reload from the URL, and no view may raise a JavaScript error. Exit code 1 on failure. */
'use strict';
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),ROOT=path.join(__dirname,'../..');
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html'});r.end(d);});}).listen(8781,async()=>{
  const b=await chromium.launch(),errs=[];let bad=0,n=0;const pg=await b.newPage({viewport:{width:1100,height:800}});pg.on('pageerror',e=>errs.push(String(e)));
  await pg.goto('http://127.0.0.1:8781/wodb/constructor.html');
  for(const [banc,C,R,marc,model] of [['NUM',5,4,24,'un'],['FRA',7,5,15,'barres'],['LLE',6,4,20,'un'],['COS',3,3,24,'barres'],['ANG',2,2,24,'un'],['QUA',7,3,24,'un'],['BLB',4,5,15,'un']]){n++;
    const r=await pg.evaluate(([banc,C,R,marc,model])=>{const K=window.__constructor,s=K.st;Object.assign(s,{banc,C,R,marc,model,T:new Array(R*C).fill(-1),sel:0,pos:-1,vista:'editor'});
      const ok=K.omple();K.canvi();const B=Object.assign({},window.BANCS[banc],{rows:R,cols:C}),M=K.mides();
      const valides=ok?window.WODB.valid(B,s.T):-1,res=K.resum();
      for(const v of ['full','plantilla','solu','editor']){s.vista=v;K.canvi();}
      return {ok,valides,n:window.WODB.wins(B).length,pagOk:res.ok,cel:M.cel,S:M.S,ample:C*M.cel+2*marc,alt:R*M.cel+2*marc,hash:location.hash,laser:K.plantillaLaser().length};},[banc,C,R,marc,model]);
    const fits=r.ample<=297&&r.alt<=210;if(!r.ok||r.valides!==r.n||r.pagOk!==r.n||!fits)bad++;
    const p2=await b.newPage();p2.on('pageerror',e=>errs.push(String(e)));await p2.goto('http://127.0.0.1:8781/wodb/constructor.html'+r.hash);
    const same=await p2.evaluate(()=>'#c='+window.__constructor.estatText());if(same!==r.hash.split('/')[0])bad++;await p2.close();
    console.log(`${banc} ${C}x${R} marc ${marc} ${model}: valid ${r.valides}/${r.n}, cell ${r.cel} mm, mask ${r.S} mm, paper used ${r.ample}x${r.alt} of 297x210 ${fits?'OK':'TOO BIG'}, reload ${same===r.hash.split('/')[0]?'OK':'DIFFERENT'}`);}
  // manual editing: put two equal items in one position -> it must be reported as not valid
  const man=await pg.evaluate(()=>{const K=window.__constructor,s=K.st;Object.assign(s,{banc:'NUM',C:2,R:2,T:[0,0,1,2],pos:-1,vista:'editor'});K.canvi();return K.resum();});
  if(man.ok!==0||man.no!==1)bad++;
  console.log('manual sheet with a repeated item reported as invalid:',man.no===1);
  // partly filled sheet: "Omple sol" must keep the cells already placed and still make every position valid
  const par=await pg.evaluate(()=>{const K=window.__constructor,s=K.st;Object.assign(s,{banc:'FIG',C:5,R:4,T:new Array(20).fill(-1),pos:-1,vista:'editor'});
    const posats={0:3,6:17,13:40,19:22};for(const i in posats)s.T[i]=posats[i];const ok=K.omple();K.canvi();
    const B=Object.assign({},window.BANCS.FIG,{rows:4,cols:5});return {ok,valides:ok?window.WODB.valid(B,s.T):-1,kept:Object.keys(posats).every(i=>s.T[i]===posats[i]),distinct:new Set(s.T).size};});
  if(!par.ok||par.valides!==12||!par.kept||par.distinct!==20)bad++;
  console.log(`partly filled sheet: valid ${par.valides}/12, the 4 placed cells kept: ${par.kept}, distinct items ${par.distinct}/20`);
  // two placed items with identical properties (regular hexagon and octagon) in one position: no sheet exists and the page must name the position
  const imp=await pg.evaluate(()=>{const K=window.__constructor,s=K.st;Object.assign(s,{banc:'FIG',C:5,R:4,T:new Array(20).fill(-1),pos:-1,vista:'editor'});s.T[13]=40;s.T[19]=55;const ok=K.omple();return {ok,imp:K.impossibles(),kept:s.T[13]===40&&s.T[19]===55};});
  if(imp.ok||imp.imp.join()!=='C4'||!imp.kept)bad++;
  console.log('impossible pair detected at position:',imp.imp.join(),'(expected C4), sheet left untouched:',imp.kept&&!imp.ok);
  if(errs.length)bad++;console.log('errors',errs);console.log(bad?`FAILURES: ${bad}`:'ALL OK');await b.close();srv.close();process.exit(bad?1:0);});
