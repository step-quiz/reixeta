"""Prints the example sheets of Pinta per sumes (pinta/) to ../../pdf/pinta/ with headless Chrome. Run from tools/pinta/.
Output: PIN-A/B/C.pdf (sheet, answer sheet, key), plantilla-2x2-petita.pdf (+ -barres), laser SVGs, index.html."""
from playwright.sync_api import sync_playwright
from pypdf import PdfWriter
import http.server, threading, functools, os, glob
ROOT='../..'; OUT=ROOT+'/pdf/pinta'; os.makedirs(OUT,exist_ok=True)
CHROME=next((p for p in ('/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser') if os.path.exists(p)),None)
for f in glob.glob(OUT+'/*.pdf')+glob.glob(OUT+'/*.svg'): os.remove(f)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8769),functools.partial(Q,directory=ROOT)); threading.Thread(target=srv.serve_forever,daemon=True).start()
errs=[]; TMP=OUT+'/_tmp.pdf'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox'])
    pg=b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e))); pg.emulate_media(media='print')
    def go(h): pg.goto('http://127.0.0.1:8769/pinta/#'+h); pg.reload(); pg.wait_for_timeout(300)
    def pdf(path): pg.pdf(path=path,prefer_css_page_size=True,print_background=True)
    go('PIN-A'); EX=pg.evaluate("Object.keys(window.PINTA.EX)"); NOM=pg.evaluate("window.PINTA.EXNOM")
    for k in EX:
        w=PdfWriter()
        for v in ('full','respostes','solu'): go(f'PIN-{k}/{v}'); pdf(TMP); w.append(TMP)
        w.write(f'{OUT}/PIN-{k}.pdf')
    os.remove(TMP)
    for suf in ('','-barres'):
        go('PIN-A/plantilla'+suf); pdf(f'{OUT}/plantilla-2x2-petita{suf}.pdf')
        open(f'{OUT}/plantilla-2x2-petita{suf}-tall-laser.svg','w').write('<?xml version="1.0" encoding="UTF-8"?>\n'+pg.evaluate("window.__reixeta.plantillaLaser()"))
    b.close()
srv.shutdown()
li=''.join(f'<li><a href="PIN-{k}.pdf">PIN-{k}</a> · {NOM[k]} (full de nombres, full de respostes i solucionari)</li>' for k in EX)
open(f'{OUT}/index.html','w',encoding='utf-8').write(f'''<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,"><title>Reixeta · PDF Pinta per sumes</title>
<style>body{{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px 18px;color:#111}}a{{color:#0f766e}}li{{margin:4px 0}}</style></head><body>
<p><a href="../../">Reixeta</a> · <a href="../../pinta/">Pinta per sumes</a></p><h1>PDF · Pinta per sumes</h1>
<p>Imprimeix sempre a mida real (100 %, sense «ajusta a la pàgina»).</p>
<h2>Fulls d'exemple</h2><ul>{li}</ul>
<h2>Plantilla (caselles de 18 mm)</h2><ul><li><a href="plantilla-2x2-petita.pdf">Plantilla d'un sol forat (6 per full A4, amb els passos per fer la finestra amb 3 plecs i 1 tall)</a> · <a href="plantilla-2x2-petita-tall-laser.svg">SVG per a talladora làser</a></li><li><a href="plantilla-2x2-petita-barres.pdf">Plantilla de 4 forats separats per barres de 6 mm</a> · <a href="plantilla-2x2-petita-barres-tall-laser.svg">SVG per a talladora làser</a></li></ul>
</body></html>''')
print('errors',errs)
import subprocess; subprocess.run(['node',ROOT+'/tools/versio.js'],check=True)   # stamp the links of the pages just written (cache busting)
