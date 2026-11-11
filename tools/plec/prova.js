/* Browser test of the fold-and-cut instructions on the mask pages. Usage: node tools/plec/prova.js
   (needs the `playwright` npm package and Chromium; set NODE_PATH to the global npm root if it is not found)
   For every mask page with the single-hole model: the instructions are there; their sizes (data-g) are those of the mask really drawn
   on the page (outer rectangle and hole read from the mask path); PLEC.comprova gives 0 misclassified points for them; everything drawn
   stays inside its box, at least 4 mm from the paper edge, does not touch any mask, and no text lies over a drawing or over another text. With the bars model there must be no
   instructions (the recipe does not make several holes). No page may raise a JavaScript error. Exit code 1 on failure. */
'use strict';
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path'),ROOT=path.join(__dirname,'../..');
const cons=(C,R,model,marc,star)=>`wodb/constructor.html#c=NUM.${C}x${R}.${model}.${marc}.${star}.${new Array(C*R).fill('_').join('-')}/plantilla`;
const PAGINES=[['WODB','wodb/#NUM-A/plantilla',true],['WODB bars','wodb/#NUM-A/plantilla-barres',false],
  ['counting game 3×2','comptar/#CO1-A/plantilla',true],['counting game 3×2 bars','comptar/#CO1-A/plantilla-barres',false],['counting game 2×2','comptar/#CS1-A/plantilla',true],
  ['Pinta N=10','pinta/#PIN-A/plantilla',true],['Pinta N=10 bars','pinta/#PIN-A/plantilla-barres',false],['Pinta N=8','pinta/#p=8.0010387c7c3810.0.0.1/plantilla',true],
  ['builder 5×4 frame 24','/'+cons(5,4,'un',24,1),true],['builder 7×5 frame 15 no star','/'+cons(7,5,'un',15,0),true],['builder 2×2 frame 20','/'+cons(2,2,'un',20,1),true],['builder 6×5 bars','/'+cons(6,5,'barres',24,1),false]];
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);
  fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html'});r.end(d);});}).listen(8782,async()=>{
  const b=await chromium.launch(),errs=[];let bad=0;
  for(const [nom,url,vol] of PAGINES){const pg=await b.newPage({viewport:{width:900,height:1200}});pg.on('pageerror',e=>errs.push(nom+': '+e));
    await pg.emulateMedia({media:'print'});await pg.goto('http://127.0.0.1:8782/'+url.replace(/^\//,''));await pg.waitForTimeout(300);
    const r=await pg.evaluate(()=>{const svg=document.querySelector('.pagina svg.full');if(!svg)return null;const R=svg.getBoundingClientRect(),k=210/R.width;
      const mm=e=>{const q=e.getBoundingClientRect();return [(q.left-R.left)*k,(q.top-R.top)*k,(q.right-R.left)*k,(q.bottom-R.top)*k];};
      /* masks: the grey paths. Outer rectangle = bounding box; holes = the other sub-paths (M x,y h w v h …) */
      const masks=[...svg.querySelectorAll(':scope > path[fill="#d4d4d4"]')].map(p=>{const sub=p.getAttribute('d').split('M').filter(Boolean).map(t=>{const m=/^([-\d.]+),([-\d.]+) h([-\d.]+) v([-\d.]+)/.exec(t.trim());return m?m.slice(1).map(Number):null;});
        return {caixa:mm(p),W:sub[0][2],H:sub[0][3],forats:sub.slice(1).map(h=>[h[2],h[3],h[0]-sub[0][0],h[1]-sub[0][1]])};});
      const g=svg.querySelector('g.plec');if(!g)return {masks,plec:null};
      const tot=[...g.querySelectorAll('text,polygon,line,path,circle')].filter(e=>!e.closest('clipPath')).map(mm),bb=[Math.min(...tot.map(t=>t[0])),Math.min(...tot.map(t=>t[1])),Math.max(...tot.map(t=>t[2])),Math.max(...tot.map(t=>t[3]))];
      const tx=[...g.querySelectorAll('text')].map(mm),dib=[...g.querySelectorAll('polygon,line,path,circle')].filter(e=>!e.closest('clipPath')).map(mm);
      let xoc=0;for(const a of tx){for(const d of dib)if(a[0]<d[2]-.1&&a[2]>d[0]+.1&&a[1]<d[3]-.1&&a[3]>d[1]+.1)xoc++;}
      for(let i=0;i<tx.length;i++)for(let j=i+1;j<tx.length;j++){const a=tx[i],d=tx[j];if(a[0]<d[2]-.1&&a[2]>d[0]+.1&&a[1]<d[3]-.3&&a[3]>d[1]+.3)xoc++;}   // text over text (line boxes of one paragraph may touch)
      const G=g.dataset.g.split(' ').map(Number);
      return {masks,plec:{bb,caixa:g.dataset.caixa.split(' ').map(Number),g:G,mal:window.PLEC.comprova(G[0],G[1],G[2],G[3],.25).mal,textos:g.querySelectorAll('text').length,xoc}};});
    let ok=!!r&&r.masks.length>0,nota='';
    if(ok&&!vol){ok=r.plec===null;nota=ok?'no instructions, as expected':'instructions should not be here';}
    else if(ok){const P=r.plec;if(!P){ok=false;nota='instructions missing';}else{const [x,y,w,h]=P.caixa,[x0,y0,x1,y1]=P.bb,t=.6,M=r.masks[0];
      const dins=x0>=x-t&&y0>=y-t&&x1<=x+w+t&&y1<=y+h+t,vora=Math.min(x0,y0,210-x1,297-y1);
      const lliure=r.masks.every(m=>x1<=m.caixa[0]||x0>=m.caixa[2]||y1<=m.caixa[1]||y0>=m.caixa[3]);
      const mateixa=M.forats.length===1&&Math.abs(M.W-P.g[0])<1e-6&&Math.abs(M.H-P.g[1])<1e-6&&Math.abs(M.forats[0][0]-P.g[2])<1e-6&&Math.abs(M.forats[0][1]-P.g[3])<1e-6
        &&Math.abs(M.forats[0][2]-(M.W-P.g[2])/2)<1e-6&&Math.abs(M.forats[0][3]-(M.H-P.g[3])/2)<1e-6;                       // same sizes, window centred
      const fora=r.masks.every(m=>Math.min(m.caixa[0],m.caixa[1],210-m.caixa[2],297-m.caixa[3])>=4);
      ok=dins&&lliure&&mateixa&&fora&&vora>=4&&P.mal===0&&P.textos>=7&&P.xoc===0;
      nota=`mask ${P.g[0]}×${P.g[1]}, window ${P.g[2]}×${P.g[3]}: ${mateixa?'same as drawn':'NOT THE MASK DRAWN'}, misclassified ${P.mal}, ${dins?'inside its box':'OUT OF ITS BOX '+P.bb.map(v=>v.toFixed(1))+' vs '+P.caixa}, ${lliure?'clear of the masks':'OVER A MASK'}, ${P.xoc?P.xoc+' TEXT/DRAWING OVERLAPS, ':''}${Math.min(vora,...r.masks.map(m=>Math.min(m.caixa[0],m.caixa[1],210-m.caixa[2],297-m.caixa[3]))).toFixed(1)} mm to the paper edge`;}}
    if(!ok)bad++;console.log((ok?'OK      ':'FAILED  ')+nom+'  — '+(nota||'page not drawn'));await pg.close();}
  if(errs.length){bad++;console.log('JS errors:',errs);}
  await b.close();srv.close();console.log(bad?bad+' ERROR(S)':'ALL OK');process.exit(bad?1:0);});
