# tools/sanefa — Sanefa trencada

Engine and spec: `sanefa/motor.js`, `CLAUDE.md` §8. Requirements as in `tools/wodb/README.md`. There is no board search: sheets are generated on the fly by `SANEFA.genera(motif, number)`.

```bash
node tools/sanefa/check.js [N]             # motif asymmetry (>= 0.20), hand-cutting of the cards (shortest cut >= 5 mm, no inward corner in the bite model) + sheets 1, 2 and N generated per motif
cd tools/sanefa && python3 make_pdfs.py    # -> pdf/sanefa/: SAN-XXX.pdf (sheets 1 and 2), plantilles.pdf (edge-bite cards), plantilles-forat.pdf (hole cards), laser SVGs (hole: 4 motifs; edge bite: 3), solucionaris.pdf, index.html
```

`check.js` re-verifies with an independent definition of "correct frieze" that each frieze has exactly one wrong copy and that it is the only single-copy fix. `make_pdfs.py` also measures on the real page the paper left around the mask at the outermost copies (asserts >= 0), and must print `solu overflow: []` and `errors []`.

To add a motif: append `{nom, vora, pts, det}` (outline in a 0–100 box, y down; `vora:true` only for a convex outline with a horizontal bottom side) to `MOTIUS` and its code to `ORDRE` in `sanefa/motor.js`, then run `check.js`; reject it if any mismatch value is below 0.20 or any cut is shorter than 5 mm at the real size.
