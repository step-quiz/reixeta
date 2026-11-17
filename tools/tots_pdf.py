"""«Baixa tots els PDF»: for every game folder pdf/<game>/ builds two ZIPs and puts the download block at the top of
pdf/<game>/index.html, right after the «Imprimeix sempre a mida real» line.
  <game>-tots.zip                 every .pdf and .svg of the folder (answer keys included)
  <game>-tots-sense-solucions.zip the same without the answer keys
The block has a checkbox «Inclou les solucions» (on by default) that chooses which ZIP the link downloads.
Inside both ZIPs **every page is landscape** (owner, 2026-11-17): portrait pages are turned a quarter turn (/Rotate 90), so a
sequence of pages is never portrait-landscape-landscape-portrait. The PDFs listed one by one on the page are not changed.
Answer keys = whole files whose name starts with «solucionari» or «guions», plus single pages whose text contains «solucionari»
(the last page of each Pinta sheet). Laser SVGs go in both ZIPs.
Usage: python3 tools/tots_pdf.py [game ...]   (no argument = every folder of pdf/). Run by every tools/<game>/make_pdfs.py.
ZIP entries carry a fixed date, so a ZIP only changes when a file inside changes. The block is between <!--tots--> markers, so
running the script again replaces it. Then run `node tools/versio.js` (cache stamps)."""
import os, sys, zipfile, re, io
from pypdf import PdfReader, PdfWriter
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PDF = os.path.join(ROOT, 'pdf')
DATA = (2026, 1, 1, 0, 0, 0)

def fitxer_solucio(nom):
    return nom.startswith(('solucionari', 'guions'))

def pagina_solucio(p):
    try:
        return re.search(r'solucionari', p.extract_text() or '', re.I) is not None
    except Exception:
        return False

def apaisada(p):
    """Turns a portrait page a quarter turn, so that it is seen landscape."""
    w, h = float(p.mediabox.width), float(p.mediabox.height)
    if (int(p.get('/Rotate', 0)) // 90) % 2:
        w, h = h, w
    if h > w:
        p.rotate(90)

def pdf_bytes(pagines):
    w = PdfWriter()
    for p in pagines:
        w.add_page(p)
    for p in w.pages:
        apaisada(p)
    w.add_metadata({'/Producer': 'Reixeta'})
    w._ID = None
    b = io.BytesIO(); w.write(b); return b.getvalue()

def zip_de(d, nom, entrades):
    tmp = os.path.join(d, nom + '.tmp')
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as z:
        for arxiu, dades in entrades:
            info = zipfile.ZipInfo(arxiu, DATA); info.compress_type = zipfile.ZIP_DEFLATED; info.external_attr = 0o644 << 16
            z.writestr(info, dades)
    desti = os.path.join(d, nom)
    if os.path.exists(desti) and open(desti, 'rb').read() == open(tmp, 'rb').read():
        os.remove(tmp)
    else:
        os.replace(tmp, desti)
    return os.path.getsize(desti)

def detall(npdf, npag, nsvg, mida):
    t = f'{npdf} PDF, {npag} pàgines'
    if nsvg:
        t += f' i {nsvg} fitxer' + ('s' if nsvg > 1 else '') + ' per a talladora làser'
    return t + f', {mida / 1e6:.1f} MB'.replace('.', ',')

def fes(joc):
    d = os.path.join(PDF, joc)
    fitxers = sorted(f for f in os.listdir(d) if f.endswith(('.pdf', '.svg')))
    if not fitxers:
        return None
    amb, sense = [], []
    comptes = {'amb': [0, 0, 0], 'sense': [0, 0, 0]}     # PDF, pàgines, SVG
    for f in fitxers:
        ruta = os.path.join(d, f)
        if f.endswith('.svg'):
            dades = open(ruta, 'rb').read()
            amb.append((f'{joc}/{f}', dades)); sense.append((f'{joc}/{f}', dades))
            comptes['amb'][2] += 1; comptes['sense'][2] += 1
            continue
        pagines = list(PdfReader(ruta).pages)
        amb.append((f'{joc}/{f}', pdf_bytes(pagines))); comptes['amb'][0] += 1; comptes['amb'][1] += len(pagines)
        if fitxer_solucio(f):
            continue
        sp = [p for p in PdfReader(ruta).pages if not pagina_solucio(p)]
        if sp:
            sense.append((f'{joc}/{f}', pdf_bytes(sp))); comptes['sense'][0] += 1; comptes['sense'][1] += len(sp)
    na, ns = f'{joc}-tots.zip', f'{joc}-tots-sense-solucions.zip'
    ma, ms = zip_de(d, na, amb), zip_de(d, ns, sense)
    da, ds = detall(*comptes['amb'][:2], comptes['amb'][2], ma), detall(*comptes['sense'][:2], comptes['sense'][2], ms)
    bloc = ('<!--tots--><div class="tots" style="border:1px solid #9ca3af;border-radius:8px;padding:10px 14px;margin:12px 0">'
            f'<p style="margin:0 0 6px"><a id="tots-amb" href="{na}" download><b>Baixa tots els PDF</b></a>'
            f'<a id="tots-sense" href="{ns}" download hidden><b>Baixa tots els PDF</b></a> '
            f'<span id="tots-info" data-amb="(un sol fitxer ZIP: {da})" data-sense="(un sol fitxer ZIP, sense solucions: {ds})">(un sol fitxer ZIP: {da})</span></p>'
            '<label style="display:inline-flex;gap:6px;align-items:center"><input type="checkbox" id="tots-sol" checked> Inclou les solucions</label>'
            '<p style="margin:6px 0 0;font-size:.9em;color:#4b5563">Dins del ZIP totes les pàgines són apaïsades: les verticals hi van girades un quart de volta.</p>'
            '<script>(function(){var c=document.getElementById("tots-sol"),a=document.getElementById("tots-amb"),s=document.getElementById("tots-sense"),i=document.getElementById("tots-info");'
            'function f(){a.hidden=!c.checked;s.hidden=c.checked;i.textContent=c.checked?i.dataset.amb:i.dataset.sense;}c.addEventListener("change",f);f();})();</script>'
            '</div><!--/tots-->')
    idx = os.path.join(d, 'index.html')
    s = open(idx, encoding='utf-8').read()
    s2 = re.sub(r'<!--tots-->.*?<!--/tots-->\n?', '', s, flags=re.S)
    m = re.search(r'<p>Imprimeix sempre a mida real[^<]*</p>\n?', s2)
    if not m:
        raise SystemExit(f'{idx}: no «Imprimeix sempre a mida real» line to put the block after')
    s2 = s2[:m.end()] + ('' if s2[m.end() - 1] == '\n' else '\n') + bloc + '\n' + s2[m.end():]
    if s2 != s:
        open(idx, 'w', encoding='utf-8').write(s2)
    return da, ds

jocs = sys.argv[1:] or sorted(j for j in os.listdir(PDF) if os.path.isdir(os.path.join(PDF, j)))
for j in jocs:
    r = fes(j)
    print(f'{j}: ' + (f'amb solucions {r[0]} · sense {r[1]}' if r else 'no PDF'))
