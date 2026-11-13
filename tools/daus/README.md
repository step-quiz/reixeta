# tools/daus — dice and events

Engine and spec: `daus/motor.js`, `CLAUDE.md` §12. Requirements as in `tools/wodb/README.md`. Nothing is searched or stored: the sheet is the 36 outcomes of two dice and every mask follows from its event.

```bash
node tools/daus/check.js                 # events recounted, the 36 pairs with exact arithmetic, mask geometry at real size
cd tools/daus && python3 make_pdfs.py    # -> pdf/daus/: full.pdf, fitxes.pdf, fitxa-X-tall-laser.svg, preguntes.pdf, solucionari.pdf, solucionari-tots.pdf, index.html
```

To add an event: append `{text, f(i, j)}` to `SUCCESSOS` and its letter to `ORDRE` in `daus/motor.js`, then add the same predicate and its size to `MEU` / `MIDA` in `check.js` (the check refuses a catalogue it does not know). The check rejects an event whose mask would fall apart (`illes > 0`: a piece of card surrounded by holes) — for instance "the sum is not 7" is fine, but a ring of cells is not.
