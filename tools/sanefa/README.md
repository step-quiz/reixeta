# tools/sanefa — Sanefa trencada

Engine and spec: `sanefa/motor.js`, `CLAUDE.md` §8. Requirements as in `tools/wodb/README.md`. There is no board search: sheets are generated on the fly by `SANEFA.genera(motif, number)`.

```bash
node tools/sanefa/check.js [N]             # motif asymmetry (>= 0.20 for the three frieze transforms) + sheets 1, 2 and N generated per motif
cd tools/sanefa && python3 make_pdfs.py    # -> pdf/sanefa/: SAN-XXX.pdf (sheets 1 and 2), plantilles.pdf, one laser SVG per motif, solucionaris.pdf, index.html
```

`check.js` re-verifies with an independent definition of "correct frieze" that each frieze has exactly one wrong copy and that it is the only single-copy fix. `make_pdfs.py` also measures on the real page the paper left around the mask at the outermost copies (asserts >= 0), and must print `solu overflow: []` and `errors []`.

To add a motif: append a polygon (0–100 box, y down) to `MOTIUS` and its code to `ORDRE` in `sanefa/motor.js`, then run `check.js`; reject it if any of the three mismatch values is below 0.20.
