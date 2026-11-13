/* Cache-busting stamps. Usage: node tools/versio.js [--check]
   Browsers and the CDN keep .js, .css, .pdf and .svg files for hours, so after a deploy a page could load new HTML with old scripts
   (the owner saw the old Sanefa on 2026-11-12). Every local <script src>, <link rel="stylesheet" href> and <a href> to a .pdf or .svg
   in the HTML pages of the repo gets `?v=` + the first 8 hex digits of the SHA-1 of the target file, so the address changes exactly
   when the file changes. Without arguments the pages are rewritten; with --check nothing is written and the exit code is 1 if any
   stamp is missing or stale (run by tools/check.js). docs/history, _uploads and node_modules are skipped. */
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),ROOT=path.join(__dirname,'..'),check=process.argv.includes('--check');
const pagines=[];(function rec(d){for(const f of fs.readdirSync(d,{withFileTypes:true})){if(f.name.startsWith('.')||['node_modules','_uploads','history'].includes(f.name))continue;
  const p=path.join(d,f.name);if(f.isDirectory())rec(p);else if(f.name.endsWith('.html'))pagines.push(p);}})(ROOT);
const cache={},hash=f=>cache[f]||(cache[f]=crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex').slice(0,8));
/* <script … src="X">, <link … href="X"> (stylesheets) and <a … href="X.pdf|X.svg">: X local, with or without an old stamp */
const RE=/(<script\b[^>]*?\bsrc="|<link\b[^>]*?\brel="stylesheet"[^>]*?\bhref="|<a\b[^>]*?\bhref=")([^"#?:]+\.(?:js|css|pdf|svg))(\?v=[0-9a-f]*)?(")/g;
let vells=0,total=0,falten=[];
for(const p of pagines){const s=fs.readFileSync(p,'utf8');
  const t=s.replace(RE,(m,a,url,v,z)=>{const f=path.join(path.dirname(p),url);if(!fs.existsSync(f)){falten.push(path.relative(ROOT,p)+' -> '+url);return m;}
    total++;const nou='?v='+hash(f);if(v!==nou)vells++;return a+url+nou+z;});
  if(t!==s&&!check)fs.writeFileSync(p,t);}
if(falten.length)console.log('links to files that do not exist:\n  '+falten.join('\n  '));
console.log(`${pagines.length} pages, ${total} stamped links, ${vells} ${check?'missing or stale':'updated'}`);
if(falten.length||(check&&vells)){console.log(check?'STALE — run: node tools/versio.js':'ERROR');process.exit(1);}
console.log('ALL OK');
