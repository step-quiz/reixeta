"""«Baixa tots els PDF»: for every game folder pdf/<game>/ builds <game>-tots.zip (every .pdf and .svg of the folder) and puts a
download link at the top of pdf/<game>/index.html, right after the «Imprimeix sempre a mida real» line.
Usage: python3 tools/tots_pdf.py [game ...]   (no argument = every folder of pdf/). Run by every tools/<game>/make_pdfs.py.
The ZIP entries carry a fixed date, so the ZIP only changes when a file inside changes. The link is between <!--tots--> markers,
so running the script again replaces it instead of adding a second one. Then run `node tools/versio.js` (cache stamps)."""
import os, sys, zipfile, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
PDF = os.path.join(ROOT, 'pdf')
DATA = (2026, 1, 1, 0, 0, 0)

def fes(joc):
    d = os.path.join(PDF, joc)
    nom = f'{joc}-tots.zip'
    fitxers = sorted(f for f in os.listdir(d) if f.endswith(('.pdf', '.svg')))
    if not fitxers:
        return None
    tmp = os.path.join(d, nom + '.tmp')
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in fitxers:
            info = zipfile.ZipInfo(f'{joc}/{f}', DATA)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            with open(os.path.join(d, f), 'rb') as h:
                z.writestr(info, h.read())
    desti = os.path.join(d, nom)
    if os.path.exists(desti) and open(desti, 'rb').read() == open(tmp, 'rb').read():
        os.remove(tmp)
    else:
        os.replace(tmp, desti)
    mb = os.path.getsize(desti) / 1e6
    npdf = sum(f.endswith('.pdf') for f in fitxers)
    nsvg = len(fitxers) - npdf
    detall = f'{npdf} PDF' + (f' i {nsvg} fitxer' + ('s' if nsvg > 1 else '') + ' per a talladora làser' if nsvg else '') + f', {mb:.1f} MB'.replace('.', ',')
    enllac = f'<!--tots--><p class="tots"><a href="{nom}" download><b>Baixa tots els PDF</b></a> (un sol fitxer ZIP: {detall})</p><!--/tots-->'
    idx = os.path.join(d, 'index.html')
    s = open(idx, encoding='utf-8').read()
    s2 = re.sub(r'<!--tots-->.*?<!--/tots-->\n?', '', s, flags=re.S)
    m = re.search(r'<p>Imprimeix sempre a mida real[^<]*</p>\n?', s2)
    if not m:
        raise SystemExit(f'{idx}: no «Imprimeix sempre a mida real» line to put the link after')
    s2 = s2[:m.end()] + ('' if s2[m.end() - 1] == '\n' else '\n') + enllac + '\n' + s2[m.end():]
    if s2 != s:
        open(idx, 'w', encoding='utf-8').write(s2)
    return nom, detall

jocs = sys.argv[1:] or sorted(j for j in os.listdir(PDF) if os.path.isdir(os.path.join(PDF, j)))
for j in jocs:
    r = fes(j)
    print(f'{j}: ' + (f'{r[0]} ({r[1]})' if r else 'no PDF'))
