"""Prints the counting game (comptar/) to ../../pdf/comptar/ with headless Chrome. Run from tools/comptar/.
Output: CO1.pdf, CO2.pdf (sheets A–D), plantilla-3x2.pdf, plantilla-3x2-tall-laser.svg, guions.pdf, marcador.pdf, index.html."""
from playwright.sync_api import sync_playwright
from pypdf import PdfWriter
import http.server, threading, functools, os, glob
ROOT='../..'; OUT=ROOT+'/pdf/comptar'; os.makedirs(OUT,exist_ok=True)
CHROME=next((p for p in ('/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser') if os.path.exists(p)),None)
for f in glob.glob(OUT+'/*.pdf')+glob.glob(OUT+'/*.svg'): os.remove(f)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8767),functools.partial(Q,directory=ROOT)); threading.Thread(target=srv.serve_forever,daemon=True).start()
errs=[]; TMP=OUT+'/_tmp.pdf'; NIV=['CO1','CO2','CS1','CS2']
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox'])
    pg=b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e))); pg.emulate_media(media='print')
    def go(h): pg.goto('http://127.0.0.1:8767/comptar/#'+h); pg.reload(); pg.wait_for_timeout(300)
    def pdf(path): pg.pdf(path=path,prefer_css_page_size=True,print_background=True)
    for n in NIV:
        w=PdfWriter()
        for v in 'ABCD': go(f'{n}-{v}'); pdf(TMP); w.append(TMP)
        w.write(f'{OUT}/{n}.pdf')
    os.remove(TMP)
    for model,suf in (('un',''),('barres','-barres')):      # default: one big hole; alternative: six holes with 6 mm bars
        go('CO1-A/plantilla'+suf); pdf(f'{OUT}/plantilla-3x2{suf}.pdf')
        open(f'{OUT}/plantilla-3x2{suf}-tall-laser.svg','w').write('<?xml version="1.0" encoding="UTF-8"?>\n'+pg.evaluate(f"window.__reixeta.plantillaLaser('{model}')"))
    go('CO1-A/guio'); pdf(f'{OUT}/guions.pdf')
    over=pg.evaluate("""[...document.querySelectorAll('.guio')].map(s=>s.scrollHeight>s.clientHeight+1?s.querySelector('.codi')?.textContent:null).filter(Boolean)""")
    print('guio overflow:',over)
    go('CO1-A/marcador'); pdf(f'{OUT}/marcador.pdf')
    b.close()
srv.shutdown()
open(f'{OUT}/index.html','w',encoding='utf-8').write('''<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,"><title>Reixeta · PDF Joc de comptar</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px 18px;color:#111}a{color:#0f766e}li{margin:4px 0}</style></head><body>
<p><a href="../../">Reixeta</a> · <a href="../../comptar/">Joc de comptar</a></p><h1>PDF · Joc de comptar</h1>
<p>Imprimeix sempre a mida real (100 %, sense «ajusta a la pàgina»).</p>
<h2>Full 1 · plantilla de 3×2</h2><ul><li><a href="CO1.pdf">CO1</a> · Nivell 1, nombres de 2 a 50 (fulls A–D)</li><li><a href="CO2.pdf">CO2</a> · Nivell 2, nombres de 2 a 150 (fulls A–D)</li></ul>
<h2>Full 1 · versió senzilla, amb la plantilla de 2×2 del WODB</h2><ul><li><a href="CS1.pdf">CS1</a> · Nivell 1, nombres de 2 a 50 (fulls A–D)</li><li><a href="CS2.pdf">CS2</a> · Nivell 2, nombres de 2 a 150 (fulls A–D)</li></ul>
<h2>Plantilla de 3×2</h2><p>Per als fulls CS serveix la <a href="../wodb/plantilla-2x2.pdf">plantilla de 2×2 del WODB</a>.</p><ul><li><a href="plantilla-3x2.pdf">Plantilla d'un sol forat (2 per full A4)</a> · <a href="plantilla-3x2-tall-laser.svg">SVG per a talladora làser</a></li><li><a href="plantilla-3x2-barres.pdf">Plantilla de 6 forats separats per barres de 6 mm</a> · <a href="plantilla-3x2-barres-tall-laser.svg">SVG per a talladora làser</a></li></ul>
<h2>Per jugar</h2><ul><li><a href="guions.pdf">Guions de partida</a> (dos per full, un per cara)</li><li><a href="marcador.pdf">Marcador</a></li></ul>
</body></html>''')
print('errors',errs)
