/* Runs every verification of the repo. Usage: node tools/check.js [--rapid]
   1. node --check on every .js file;  2. the check.js of each game (WODB, counting game, Sanefa trencada, Pinta per sumes)
      and of the fold-and-cut recipe (tools/plec/check.js);
   3. the browser tests: WODB builder and fold-and-cut instructions on the mask pages (skipped with a notice if the `playwright`
      npm package cannot be loaded).
   4. tools/versio.js --check: every link to a .js, .css, .pdf or .svg carries the current content stamp (run `node tools/versio.js` to fix).
   --rapid uses small sample sizes. Prints one line per step and exits with code 1 if any step fails. */
'use strict';
const {spawnSync,execSync}=require('child_process'),fs=require('fs'),path=require('path'),ROOT=path.join(__dirname,'..'),rapid=process.argv.includes('--rapid');
let bad=0;const pas=(nom,ok,nota)=>{if(!ok)bad++;console.log((ok?'OK      ':'FAILED  ')+nom+(nota?'  — '+nota:''));};
const js=[];(function rec(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){if(f.name.startsWith('.')||f.name==='node_modules')continue;const p=path.join(d,f.name);if(f.isDirectory())rec(p);else if(f.name.endsWith('.js'))js.push(p);}})(ROOT);
const sx=js.filter(f=>spawnSync(process.execPath,['--check',f]).status!==0);pas(`syntax of ${js.length} .js files`,!sx.length,sx.map(f=>path.relative(ROOT,f)).join(', '));
for(const [nom,f,n] of [['WODB','tools/wodb/check.js',rapid?2:10],['counting game','tools/comptar/check.js',rapid?3:25],['Sanefa trencada','tools/sanefa/check.js',rapid?20:200],['Pinta per sumes','tools/pinta/check.js',rapid?50:300],['fold and one cut','tools/plec/check.js',0]]){
  const r=spawnSync(process.execPath,[path.join(ROOT,f),String(n)],{encoding:'utf8'}),last=(r.stdout||'').trim().split('\n').pop();pas(nom,r.status===0&&last==='ALL OK',r.status===0?'':last||(r.stderr||'').trim().split('\n').pop());}
{const r=spawnSync(process.execPath,[path.join(ROOT,'tools/versio.js'),'--check'],{encoding:'utf8'}),out=(r.stdout||'').trim().split('\n');pas('cache stamps on script, stylesheet, PDF and SVG links',r.status===0,r.status===0?'':out.slice(-2).join(' · '));}
let np='';try{np=execSync('npm root -g',{encoding:'utf8'}).trim();}catch(e){}
const env=Object.assign({},process.env,{NODE_PATH:[process.env.NODE_PATH,np].filter(Boolean).join(path.delimiter)});
const t=spawnSync(process.execPath,['-e',"require('playwright')"],{env});
for(const [nom,f] of [['WODB builder (browser test)','tools/wodb/prova_constructor.js'],['fold-and-cut instructions on the mask pages (browser test)','tools/plec/prova.js']]){
  if(t.status!==0){console.log('SKIPPED '+nom+'  — the playwright npm package is not available');continue;}
  const r=spawnSync(process.execPath,[path.join(ROOT,f)],{encoding:'utf8',env}),last=(r.stdout||'').trim().split('\n').pop();pas(nom,r.status===0&&last==='ALL OK',r.status===0?'':last);}
console.log(bad?`\n${bad} step(s) FAILED`:'\nEVERYTHING OK');process.exit(bad?1:0);
