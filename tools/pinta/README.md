# tools/pinta — Pinta per sumes

Engine and spec: `pinta/motor.js`, `CLAUDE.md` §9. Requirements as in `tools/wodb/README.md`. No board search: `PINTA.resol(N, drawings, seed)` solves any set of drawings in milliseconds.

```bash
node tools/pinta/check.js [N]             # examples A–C + N random drawing sets per size, repainted with independent code
cd tools/pinta && python3 make_pdfs.py    # -> pdf/pinta/: PIN-A/B/C.pdf (sheet, answer sheet, key), masks (two models) + laser SVGs, index.html
```
