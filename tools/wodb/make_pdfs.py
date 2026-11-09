from playwright.sync_api import sync_playwright
import http.server, threading, functools, os, json
ROOT='../..'; OUT=ROOT+'/pdf/wodb'; os.makedirs(OUT,exist_ok=True)
H=functools.partial(http.server.SimpleHTTPRequestHandler,directory=ROOT)
class Q(H.func):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(Q,directory=ROOT)); threading.Thread(target=srv.serve_forever,daemon=True).start()
ORDRE=["NUM","FIG","FRA","BLO","BLB","LLE","ANG","TR5","TR4","QUA","POL","COS"]
errs=[]; files=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
    pg=b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.emulate_media(media='print')
    def go(h):
        pg.goto('http://127.0.0.1:8766/wodb/#'+h); pg.reload(); pg.wait_for_timeout(500)
    for c in ORDRE:
        go(f'{c}-A'); fn=f'{c}-A.pdf'; pg.pdf(path=f'{OUT}/{fn}',prefer_css_page_size=True,print_background=True); files.append(fn)
    go('NUM-A/plantilla'); pg.pdf(path=f'{OUT}/plantilla-2x2.pdf',prefer_css_page_size=True,print_background=True)
    svg=pg.evaluate("window.__reixeta.plantillaLaser()"); open(f'{OUT}/plantilla-2x2-tall-laser.svg','w').write('<?xml version="1.0" encoding="UTF-8"?>\n'+svg)
    go('NUM-A/solu'); pg.pdf(path=f'{OUT}/solucionaris-A.pdf',prefer_css_page_size=True,print_background=True)
    # check overflow of solution tables
    over=pg.evaluate("""[...document.querySelectorAll('.solu')].map(s=>s.scrollHeight>s.clientHeight+1?s.querySelector('.codi')?.textContent:null).filter(Boolean)""")
    print('solu overflow:',over)
    b.close()
srv.shutdown()
# combined sheets pdf
from pypdf import PdfWriter
w=PdfWriter()
for f in files: w.append(f'{OUT}/{f}')
w.write(f'{OUT}/tots-els-fulls-A.pdf')
names={'NUM':'Nombres','FIG':'Figures geomètriques','FRA':'Fraccions i decimals','BLO':'Blocs lògics (color)','BLB':'Blocs lògics (blanc i negre)','LLE':'Lletres','ANG':'Angles','TR5':'Triangles (trama 5×5)','TR4':'Triangles (trama 4×4)','QUA':'Quadrilàters','POL':'Poliòmins','COS':'Cossos geomètrics'}
li=''.join(f'<li><a href="{c}-A.pdf">{c}-A</a> · {names[c]}</li>' for c in ORDRE)
open(f'{OUT}/index.html','w').write(f'''<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,"><title>Reixeta · PDF WODB</title>
<style>body{{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px 18px;color:#111}}a{{color:#0f766e}}li{{margin:4px 0}}</style></head><body>
<p><a href="../../">Reixeta</a> · <a href="../../wodb/">WODB</a></p><h1>PDF · WODB</h1>
<p>Imprimeix sempre a mida real (100 %, sense «ajusta a la pàgina»).</p>
<h2>Full 1</h2><ul>{li}<li><a href="tots-els-fulls-A.pdf">Tots els fulls en un sol PDF</a></li></ul>
<h2>Plantilla</h2><ul><li><a href="plantilla-2x2.pdf">Plantilla de 4 forats (3 per full A4)</a></li><li><a href="plantilla-2x2-tall-laser.svg">Plantilla per a talladora làser (SVG)</a></li></ul>
<h2>Solucionaris</h2><ul><li><a href="solucionaris-A.pdf">Solucionaris dels fulls A</a> (2 per cara, a doble cara)</li></ul>
</body></html>''')
print('errors',errs)
