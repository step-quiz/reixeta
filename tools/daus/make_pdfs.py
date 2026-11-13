"""Prints "Daus i successos" (daus/) to ../../pdf/daus/ with headless Chrome. Run from tools/daus/.
Output: full.pdf (the 36 outcomes), fitxes.pdf (one mask per event, the nine of the catalogue), fitxa-X-tall-laser.svg per event,
preguntes.pdf and solucionari.pdf (default set of six events), solucionari-tots.pdf (the nine events), index.html.
Checks on the real pages: every mask outline is at least 5 mm from the paper edge, no text leaves a page and no table overflows."""
from playwright.sync_api import sync_playwright
import http.server, threading, functools, os, glob
ROOT='../..'; OUT=ROOT+'/pdf/daus'; os.makedirs(OUT,exist_ok=True)
CHROME=next((p for p in ('/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser') if os.path.exists(p)),None)
for f in glob.glob(OUT+'/*.pdf')+glob.glob(OUT+'/*.svg'): os.remove(f)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8770),functools.partial(Q,directory=ROOT)); threading.Thread(target=srv.serve_forever,daemon=True).start()
errs=[]; fora=[]
FORA_JS="""(()=>{const out=[];document.querySelectorAll('.pagina').forEach(p=>{const R=p.getBoundingClientRect();
  p.querySelectorAll('text').forEach(t=>{const q=t.getBoundingClientRect();if(q.left<R.left+1||q.right>R.right-1||q.top<R.top+1||q.bottom>R.bottom-1)out.push((t.textContent||'').trim().slice(0,40));});
  p.querySelectorAll('.dtaules').forEach(d=>{if(d.scrollHeight>d.clientHeight+1||d.scrollWidth>d.clientWidth+1)out.push('table overflow');});});return out;})()"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox'])
    pg=b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e))); pg.emulate_media(media='print')
    def go(h):
        pg.goto('http://127.0.0.1:8770/daus/#'+h); pg.reload(); pg.wait_for_timeout(300)
        o=pg.evaluate(FORA_JS)
        if o: fora.append((h,o))
    def pdf(path): pg.pdf(path=path,prefer_css_page_size=True,print_background=True)
    go('s=ABCDEF'); pdf(f'{OUT}/full.pdf')
    TOTS=''.join(pg.evaluate("window.DAUS.ORDRE")); DEF=''.join(pg.evaluate("window.DAUS.PER_DEFECTE")); TXT=pg.evaluate("Object.fromEntries(window.DAUS.ORDRE.map(k=>[k,window.DAUS.SUCCESSOS[k].text]))")
    TALLS=pg.evaluate("Object.fromEntries(window.DAUS.ORDRE.map(k=>[k,window.__reixeta.forma(k).talls]))")
    go(f's={TOTS}/fitxes'); pdf(f'{OUT}/fitxes.pdf')
    vora=pg.evaluate("""(()=>Math.min(...[...document.querySelectorAll('.pagina')].map(p=>{const s=p.getBoundingClientRect(),q=p.querySelector('path.fitxa').getBoundingClientRect(),k=210/s.width;
      return Math.min(q.left-s.left,q.top-s.top,s.right-q.right,s.bottom-q.bottom)*k;})))()""")
    print('mask pages: outline at %.1f mm from the paper edge'%vora); assert vora>=5
    for k in TOTS: open(f'{OUT}/fitxa-{k}-tall-laser.svg','w').write(pg.evaluate(f"window.__reixeta.fitxaLaser('{k}')"))
    go(f's={DEF}/preguntes'); pdf(f'{OUT}/preguntes.pdf')
    go(f's={DEF}/solu'); pdf(f'{OUT}/solucionari.pdf')
    go(f's={TOTS}/solu'); pdf(f'{OUT}/solucionari-tots.pdf')
    b.close()
srv.shutdown()
print('text or tables out of the page:',fora); assert not fora
ls=''.join(f'<li>{k} · {TXT[k]} ({TALLS[k]} talls rectes) · <a href="fitxa-{k}-tall-laser.svg">SVG per a talladora làser</a></li>' for k in TOTS)
open(f'{OUT}/index.html','w',encoding='utf-8').write(f'''<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,"><title>Reixeta · PDF Daus i successos</title>
<style>body{{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px 18px;color:#111}}a{{color:#0f766e}}li{{margin:4px 0}}</style></head><body>
<p><a href="../../">Reixeta</a> · <a href="../../daus/">Daus i successos</a></p><h1>PDF · Daus i successos</h1>
<p>Imprimeix sempre a mida real (100 %, sense «ajusta a la pàgina»).</p>
<h2>Full 1</h2><ul><li><a href="full.pdf">Les 36 tirades de dos daus</a></li></ul>
<h2>Fitxes</h2><ul><li><a href="fitxes.pdf">Les nou fitxes, una per pàgina</a> (cúter i regle)</li>{ls}</ul>
<h2>Preguntes i solucionari</h2><ul><li><a href="preguntes.pdf">Full de preguntes</a> i <a href="solucionari.pdf">solucionari</a> amb les fitxes {', '.join(DEF)}</li><li><a href="solucionari-tots.pdf">Solucionari amb les nou fitxes</a> (36 parelles)</li></ul>
</body></html>''')
print('errors',errs)
import subprocess; subprocess.run(['node',ROOT+'/tools/versio.js'],check=True)   # stamp the links of the pages just written (cache busting)
