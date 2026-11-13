"""Prints "El sonar" (sonar/) to ../../pdf/sonar/ with headless Chrome. Run from tools/sonar/.
Output: SO1.pdf, SO2.pdf, SO3.pdf (hideout sheets A–D of each level), registre.pdf (record sheet for the seeker),
solucionaris.pdf (the twelve fixed sheets), plantilla.pdf (the WODB mask with the fold-and-cut steps), index.html.
Checks on the real pages that no text leaves a page."""
from playwright.sync_api import sync_playwright
from pypdf import PdfWriter
import http.server, threading, functools, os, glob
ROOT='../..'; OUT=ROOT+'/pdf/sonar'; os.makedirs(OUT,exist_ok=True)
CHROME=next((p for p in ('/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser') if os.path.exists(p)),None)
for f in glob.glob(OUT+'/*.pdf')+glob.glob(OUT+'/*.svg'): os.remove(f)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8771),functools.partial(Q,directory=ROOT)); threading.Thread(target=srv.serve_forever,daemon=True).start()
errs=[]; fora=[]; TMP=OUT+'/_tmp.pdf'
FORA_JS="""(()=>{const out=[];document.querySelectorAll('.pagina').forEach(p=>{const R=p.getBoundingClientRect();
  p.querySelectorAll('text').forEach(t=>{const q=t.getBoundingClientRect();if(q.left<R.left+1||q.right>R.right-1||q.top<R.top+1||q.bottom>R.bottom-1)out.push((t.textContent||'').trim().slice(0,40));});});return out;})()"""
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox'])
    pg=b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e))); pg.emulate_media(media='print')
    def go(h):
        pg.goto('http://127.0.0.1:8771/sonar/#'+h); pg.reload(); pg.wait_for_timeout(300)
        o=pg.evaluate(FORA_JS)
        if o: fora.append((h,o))
    def pdf(path): pg.pdf(path=path,prefer_css_page_size=True,print_background=True)
    go('SO1-A'); NIV=pg.evaluate("window.SONAR.ORDRE"); NOM=pg.evaluate("Object.fromEntries(window.SONAR.ORDRE.map(k=>[k,window.SONAR.NIVELLS[k].nom]))")
    solu=PdfWriter()
    for niv in NIV:
        w=PdfWriter()
        for v in 'ABCD':
            go(f'{niv}-{v}'); pdf(TMP); w.append(TMP); go(f'{niv}-{v}/solu'); pdf(TMP); solu.append(TMP)
        w.write(f'{OUT}/{niv}.pdf')
    solu.write(f'{OUT}/solucionaris.pdf')
    go('SO1-A/registre'); pdf(f'{OUT}/registre.pdf')
    go('SO1-A/plantilla'); pdf(f'{OUT}/plantilla.pdf')
    os.remove(TMP); b.close()
srv.shutdown()
print('text out of the page:',fora); assert not fora
li=''.join(f'<li><a href="{k}.pdf">{k}</a> · {NOM[k]} (fulls A–D)</li>' for k in NIV)
open(f'{OUT}/index.html','w',encoding='utf-8').write(f'''<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,"><title>Reixeta · PDF El sonar</title>
<style>body{{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px 18px;color:#111}}a{{color:#0f766e}}li{{margin:4px 0}}</style></head><body>
<p><a href="../../">Reixeta</a> · <a href="../../sonar/">El sonar</a></p><h1>PDF · El sonar</h1>
<p>Imprimeix sempre a mida real (100 %, sense «ajusta a la pàgina»).</p>
<h2>Fulls d'amagatall</h2><p>Un full per a qui amaga; no l'ha de veure qui busca.</p><ul>{li}</ul>
<h2>Per a qui busca</h2><ul><li><a href="registre.pdf">Full de registre</a> (sis partides, amb les regles)</li></ul>
<h2>Plantilla</h2><ul><li><a href="plantilla.pdf">Plantilla d'un sol forat</a> (2 per full A4, amb els passos per fer la finestra amb 3 plecs i 1 tall). És la mateixa del WODB.</li></ul>
<h2>Solucionaris</h2><ul><li><a href="solucionaris.pdf">Solucionaris dels dotze fulls</a>: les respostes de cada posició i amb quantes preguntes n'hi ha prou</li></ul>
</body></html>''')
print('errors',errs)
import subprocess; subprocess.run(['node',ROOT+'/tools/versio.js'],check=True)   # stamp the links of the pages just written (cache busting)
