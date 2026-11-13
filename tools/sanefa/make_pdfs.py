"""Prints Sanefa trencada (sanefa/) to ../../pdf/sanefa/ with headless Chrome. Run from tools/sanefa/.
Output: SAN-XXX.pdf per motif (fixed sheets 1 and 2), plantilles.pdf (edge-bite cards, scissors), plantilles-forat.pdf (hole cards),
plantilla-XXX-tall-laser.svg (hole) and plantilla-XXX-vora-tall-laser.svg (edge bite) per motif, solucionaris.pdf, index.html.
Also checks on the real page that the mask never leaves the paper."""
from playwright.sync_api import sync_playwright
from pypdf import PdfWriter
import http.server, threading, functools, os, glob
ROOT='../..'; OUT=ROOT+'/pdf/sanefa'; os.makedirs(OUT,exist_ok=True)
CHROME=next((p for p in ('/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser') if os.path.exists(p)),None)
for f in glob.glob(OUT+'/*.pdf')+glob.glob(OUT+'/*.svg'): os.remove(f)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8768),functools.partial(Q,directory=ROOT)); threading.Thread(target=srv.serve_forever,daemon=True).start()
errs=[]; TMP=OUT+'/_tmp.pdf'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=CHROME,args=['--no-sandbox'])
    pg=b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e))); pg.emulate_media(media='print')
    def go(h): pg.goto('http://127.0.0.1:8768/sanefa/#'+h); pg.reload(); pg.wait_for_timeout(300)
    def pdf(path): pg.pdf(path=path,prefer_css_page_size=True,print_background=True)
    go('SAN-VEL1'); MOT=pg.evaluate("window.SANEFA.ORDRE"); NOM=pg.evaluate("Object.fromEntries(window.SANEFA.ORDRE.map(m=>[m,window.SANEFA.MOTIUS[m].nom]))"); VORA=pg.evaluate("window.SANEFA.ORDRE.filter(m=>window.SANEFA.MOTIUS[m].vora)")
    # the card (motif box + frame; the edge-bite card reaches less far up/down than the frame) must stay inside the A4 portrait sheet at the outermost copies
    box=pg.evaluate("""(()=>{const r=[...document.querySelectorAll('svg.full rect')].map(e=>['x','y','width','height'].map(a=>+e.getAttribute(a)));
      const m=window.__reixeta.mides;return {left:Math.min(...r.map(v=>v[0]))-m.MARC,top:Math.min(...r.map(v=>v[1]))-m.MARC,right:210-Math.max(...r.map(v=>v[0]+v[2]))-m.MARC,bottom:297-Math.max(...r.map(v=>v[1]+v[3]))-m.MARC};})()""")
    print('paper left around the mask at the outermost copies (mm):',box); assert min(box.values())>=0
    for m in MOT:
        w=PdfWriter()
        for v in '12': go(f'SAN-{m}{v}'); pdf(TMP); w.append(TMP)
        w.write(f'{OUT}/SAN-{m}.pdf')
        open(f'{OUT}/plantilla-{m}-tall-laser.svg','w').write('<?xml version="1.0" encoding="UTF-8"?>\n'+pg.evaluate(f"window.__reixeta.plantillaLaser('{m}','forat')"))
        if m in VORA: open(f'{OUT}/plantilla-{m}-vora-tall-laser.svg','w').write('<?xml version="1.0" encoding="UTF-8"?>\n'+pg.evaluate(f"window.__reixeta.plantillaLaser('{m}','vora')"))
    os.remove(TMP)
    go('SAN-VEL1/plantilla'); pdf(f'{OUT}/plantilles.pdf')
    go('SAN-VEL1/plantilla-forat'); pdf(f'{OUT}/plantilles-forat.pdf')
    go('SAN-VEL1/solu'); pdf(f'{OUT}/solucionaris.pdf')
    over=pg.evaluate("""[...document.querySelectorAll('.ssolu')].map(s=>s.scrollHeight>s.clientHeight+1?s.querySelector('.codi')?.textContent:null).filter(Boolean)""")
    print('solu overflow:',over)
    b.close()
srv.shutdown()
li=''.join(f'<li><a href="SAN-{m}.pdf">SAN-{m}</a> · {NOM[m]} (fulls 1 i 2)</li>' for m in MOT)
ls=''.join(f'<li>Talladora làser, «{NOM[m]}»: <a href="plantilla-{m}-tall-laser.svg">forat a dins (SVG)</a>'+(f' · <a href="plantilla-{m}-vora-tall-laser.svg">mossegada a la vora (SVG)</a>' if m in VORA else '')+'</li>' for m in MOT)
open(f'{OUT}/index.html','w',encoding='utf-8').write(f'''<!DOCTYPE html><html lang="ca"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,"><title>Reixeta · PDF Sanefa trencada</title>
<style>body{{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px 18px;color:#111}}a{{color:#0f766e}}li{{margin:4px 0}}</style></head><body>
<p><a href="../../">Reixeta</a> · <a href="../../sanefa/">Sanefa trencada</a></p><h1>PDF · Sanefa trencada</h1>
<p>Imprimeix sempre a mida real (100 %, sense «ajusta a la pàgina»).</p>
<h2>Full 1</h2><ul>{li}</ul>
<h2>Targetes (full 2)</h2><ul><li><a href="plantilles.pdf">Targetes per tallar amb tisores</a>: el motiu és una mossegada a la vora (la bota, amb el forat a dins)</li><li><a href="plantilles-forat.pdf">Targetes amb el forat a dins</a>, per a cúter i regle</li>{ls}</ul>
<p>Per a la talladora làser, els fitxers estan pensats per a material rígid de 3 mm (DM o metacrilat opac): vermell = tall.</p>
<h2>Solucionaris</h2><ul><li><a href="solucionaris.pdf">Solucionaris dels fulls fixos</a> (dos per cara)</li></ul>
</body></html>''')
print('errors',errs)
import subprocess; subprocess.run(['node',ROOT+'/tools/versio.js'],check=True)   # stamp the links of the pages just written (cache busting)
