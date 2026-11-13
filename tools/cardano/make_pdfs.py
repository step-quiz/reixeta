"""Prints the Cardano grille game (cardano/) to ../../pdf/cardano/ with headless Chrome. Run from tools/cardano/.
Output: missatges.pdf (example sheets CAR-A…C), CF1.pdf and CF2.pdf (fixed sheets A–D of each level), reixeta.pdf,
reixeta-tall-laser.svg, solucionaris.pdf (every sheet above), dissenya.pdf (the two design worksheets), index.html.
Checks on the real pages: the grille laid on the sheet stays on the paper, the grille page is printable (>= 5 mm to the edge),
and no text leaves any page."""
from playwright.sync_api import sync_playwright
from pypdf import PdfWriter
import http.server, threading, functools, os, glob
ROOT='../..'; OUT=ROOT+'/pdf/cardano'; os.makedirs(OUT,exist_ok=True)
CHROME=next((p for p in ('/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser') if os.path.exists(p)),None)
for f in glob.glob(OUT+'/*.pdf')+glob.glob(OUT+'/*.svg'): os.remove(f)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8769),functools.partial(Q,directory=ROOT)); threading.Thread(target=srv.serve_forever,daemon=True).start()
errs=[]; fora=[]; TMP=OUT+'/_tmp.pdf'
FORA_JS="""(()=>{const out=[];document.querySelectorAll('.pagina').forEach(p=>{const R=p.getBoundingClientRect();
  p.querySelectorAll('text,.dtext').forEach(t=>{const q=t.getBoundingClientRect();if(q.left<R.left+1||q.right>R.right-1||q.top<R.top+1||q.bottom>R.bottom-1)out.push((t.textContent||'').trim().slice(0,40));});});return out;})()"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox'])
    pg=b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e))); pg.emulate_media(media='print')
    def go(h):
        pg.goto('http://127.0.0.1:8769/cardano/#'+h); pg.reload(); pg.wait_for_timeout(300)
        o=pg.evaluate(FORA_JS)
        if o: fora.append((h,o))
    def pdf(path): pg.pdf(path=path,prefer_css_page_size=True,print_background=True)
    go('CAR-A'); NIV=pg.evaluate("window.CARDANO.ORDRE"); NOM=pg.evaluate("Object.fromEntries(window.CARDANO.ORDRE.map(k=>[k,window.CARDANO.NIVELLS[k].nom]))"); EX=pg.evaluate("window.CARDANO.EX")
    m=pg.evaluate("window.__reixeta.mides")
    box={'left':m['X0']-m['MARC'],'top':m['Y0']-m['MARC'],'right':210-(m['X0']+6*m['CEL']+m['MARC']),'bottom':297-(m['Y0']+6*m['CEL']+m['MARC'])}
    print('paper left around the grille when it lies on the sheet (mm):',box); assert min(box.values())>=5
    solu=PdfWriter(); w=PdfWriter()
    for k in EX:
        go(f'CAR-{k}'); pdf(TMP); w.append(TMP); go(f'CAR-{k}/solu'); pdf(TMP); solu.append(TMP)
    w.write(f'{OUT}/missatges.pdf')
    for niv in NIV:
        w=PdfWriter()
        for v in 'ABCD':
            go(f'{niv}-{v}'); pdf(TMP); w.append(TMP); go(f'{niv}-{v}/solu'); pdf(TMP); solu.append(TMP)
        w.write(f'{OUT}/{niv}.pdf')
    solu.write(f'{OUT}/solucionaris.pdf')
    go('CAR-A/reixeta'); pdf(f'{OUT}/reixeta.pdf')
    vora=pg.evaluate("""(()=>{const e=document.querySelector('path.reixeta'),s=document.querySelector('svg.full').getBoundingClientRect(),q=e.getBoundingClientRect(),k=210/s.width;
      return Math.min(q.left-s.left,q.top-s.top,s.right-q.right,s.bottom-q.bottom)*k;})()""")
    print('grille page: outline at %.1f mm from the paper edge'%vora); assert vora>=5
    open(f'{OUT}/reixeta-tall-laser.svg','w').write(pg.evaluate("window.__reixeta.reixetaLaser()"))
    go('dissenya'); pdf(f'{OUT}/dissenya.pdf')
    os.remove(TMP); b.close()
srv.shutdown()
print('text out of the page:',fora); assert not fora
li=''.join(f'<li><a href="{k}.pdf">{k}</a> · {NOM[k]} (fulls A–D)</li>' for k in NIV)
open(f'{OUT}/index.html','w',encoding='utf-8').write(f'''<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,"><title>Reixeta · PDF La reixeta de Cardano</title>
<style>body{{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px 18px;color:#111}}a{{color:#0f766e}}li{{margin:4px 0}}</style></head><body>
<p><a href="../../">Reixeta</a> · <a href="../../cardano/">La reixeta de Cardano</a></p><h1>PDF · La reixeta de Cardano</h1>
<p>Imprimeix sempre a mida real (100 %, sense «ajusta a la pàgina»).</p>
<h2>La reixeta</h2><ul><li><a href="reixeta.pdf">Reixeta de 9 forats</a>: la mateixa per a tots els fulls (cúter i regle) · <a href="reixeta-tall-laser.svg">SVG per a talladora làser</a></li></ul>
<h2>Quatre girs, quatre famílies</h2><ul>{li}</ul>
<h2>Missatges</h2><ul><li><a href="missatges.pdf">Tres fulls d'exemple</a> (CAR-A, CAR-B i CAR-C). Per fer-ne de propis, obre la pàgina del joc.</li></ul>
<h2>Dissenya la teva reixeta</h2><ul><li><a href="dissenya.pdf">Fulls de treball de 4 × 4 i de 6 × 6</a></li></ul>
<h2>Solucionaris</h2><ul><li><a href="solucionaris.pdf">Solucionaris de tots els fulls d'aquesta pàgina</a></li></ul>
</body></html>''')
print('errors',errs)
import subprocess; subprocess.run(['node',ROOT+'/tools/versio.js'],check=True)   # stamp the links of the pages just written (cache busting)
