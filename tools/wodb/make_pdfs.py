"""Prints every fixed sheet, the mask and the answer keys of wodb/ to ../../pdf/wodb/ (headless Chrome).
Output: CODE.pdf (one per bank: sheets A–D, one per page), tots-els-fulls.pdf, plantilla-2x2.pdf,
plantilla-2x2-tall-laser.svg, solucionaris.pdf (one page per bank) and index.html."""
from playwright.sync_api import sync_playwright
from pypdf import PdfWriter
import http.server, threading, functools, os, glob, json, re
ROOT='../..'; OUT=ROOT+'/pdf/wodb'; os.makedirs(OUT,exist_ok=True)
CHROME=next((p for p in ('/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser') if os.path.exists(p)),None)
src=open(ROOT+'/wodb/bancs.js',encoding='utf-8').read()
BANCS=json.loads(src[src.index('window.BANCS=')+13:src.index(';\nwindow.BANCS_ORDRE')])
ORDRE=json.loads(re.search(r'window\.BANCS_ORDRE=(\[.*?\]);',src).group(1))
for f in glob.glob(OUT+'/*.pdf')+glob.glob(OUT+'/*.svg'): os.remove(f)      # no stale files from older layouts
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(Q,directory=ROOT)); threading.Thread(target=srv.serve_forever,daemon=True).start()
errs=[]; tots=PdfWriter(); TMP=OUT+'/_tmp.pdf'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox'])
    pg=b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.emulate_media(media='print')
    def go(h):
        pg.goto('http://127.0.0.1:8766/wodb/#'+h); pg.reload(); pg.wait_for_timeout(300)
    def pdf(path): pg.pdf(path=path,prefer_css_page_size=True,print_background=True)
    for c in ORDRE:
        w=PdfWriter()
        for v in BANCS[c]['fulls']:
            go(f'{c}-{v}'); pdf(TMP); w.append(TMP); tots.append(TMP)
        w.write(f'{OUT}/{c}.pdf')
    os.remove(TMP); tots.write(f'{OUT}/tots-els-fulls.pdf')
    go('NUM-A/plantilla'); pdf(f'{OUT}/plantilla-2x2.pdf')
    svg=pg.evaluate("window.__reixeta.plantillaLaser()"); open(f'{OUT}/plantilla-2x2-tall-laser.svg','w').write('<?xml version="1.0" encoding="UTF-8"?>\n'+svg)
    go('NUM-A/solu'); pdf(f'{OUT}/solucionaris.pdf')
    # an answer key must fit in its quarter of the page
    over=pg.evaluate("""[...document.querySelectorAll('.solu')].map(s=>s.scrollHeight>s.clientHeight+1?s.querySelector('.codi')?.textContent:null).filter(Boolean)""")
    print('solu overflow:',over)
    b.close()
srv.shutdown()
fulls=''.join(BANCS[ORDRE[0]]['fulls'])
li=''.join(f'<li><a href="{c}.pdf">{c}</a> · {BANCS[c]["nom"]} (fulls {fulls[0]}–{fulls[-1]})</li>' for c in ORDRE)
open(f'{OUT}/index.html','w',encoding='utf-8').write(f'''<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,"><title>Reixeta · PDF WODB</title>
<style>body{{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px 18px;color:#111}}a{{color:#0f766e}}li{{margin:4px 0}}</style></head><body>
<p><a href="../../">Reixeta</a> · <a href="../../wodb/">WODB</a></p><h1>PDF · WODB</h1>
<p>Imprimeix sempre a mida real (100 %, sense «ajusta a la pàgina»).</p>
<h2>Full 1</h2><p>Cada PDF porta els {len(fulls)} fulls del tema, un per pàgina (A4 apaïsat, 12 enigmes per full).</p><ul>{li}<li><a href="tots-els-fulls.pdf">Tots els fulls en un sol PDF</a></li></ul>
<h2>Plantilla</h2><ul><li><a href="plantilla-2x2.pdf">Plantilla de 4 forats (2 per full A4)</a></li><li><a href="plantilla-2x2-tall-laser.svg">Plantilla per a talladora làser (SVG)</a></li></ul>
<h2>Solucionaris</h2><ul><li><a href="solucionaris.pdf">Solucionaris de tots els fulls</a> (una cara per tema)</li></ul>
</body></html>''')
print('errors',errs)
