# tools/sonar — the sonar

Engine and spec: `sonar/motor.js`, `CLAUDE.md` §13. Requirements as in `tools/wodb/README.md`. Sheets are generated on the fly by `SONAR.genera(level, id)`; nothing is stored.

```bash
node tools/sonar/check.js [N]             # the whole game recounted with an independent model + fixed sheets A–D and N generated per level
cd tools/sonar && python3 make_pdfs.py    # -> pdf/sonar/: SO1.pdf, SO2.pdf, SO3.pdf, registre.pdf, solucionaris.pdf, index.html
```

`check.js` takes about 20 s: it enumerates the 15 504 hideouts as lists of cells, groups them by their 12 answers, finds the smallest separating set of positions of every hideout (4 095 subsets) and plays a greedy seeker against all of them. The figures it asserts (10 260 determined hideouts; level sizes 1 678 / 6 950 / 1 632; greedy seeker 3–12 questions, 9.32 on average) are the ones quoted in the page, the README and `CLAUDE.md`: if you change the board, the number of treasures or the level bounds, update them there too.

The mask is the WODB one (`pdf/wodb/plantilla-2x2.pdf`); there is no mask file here.
