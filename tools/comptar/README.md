# tools/comptar — counting game

Engine and spec: `comptar/motor.js`, `CLAUDE.md` §7. Requirements as in `tools/wodb/README.md`.

```bash
node tools/comptar/fulls.js        # searches fixed sheets A–D of CO1 and CO2 -> comptar/fulls.js (SEEDS env, default 16; ~1 min)
node tools/comptar/check.js [N]    # fixed sheets good and distinct; every script answer recomputed independently; N generated sheets per level
cd tools/comptar && python3 make_pdfs.py   # -> pdf/comptar/: CO1.pdf, CO2.pdf, plantilla-3x2.pdf, laser SVG, guions.pdf, marcador.pdf, index.html
```

`make_pdfs.py` must print `guio overflow: []` and `errors []`. Rerun `fulls.js` only if `NIVELLS`, `PROPS`, `POS` or the cost function change (the fixed sheets are data, not regenerated in the browser).
