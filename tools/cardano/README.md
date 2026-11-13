# tools/cardano — the Cardano grille

Engine and spec: `cardano/motor.js`, `CLAUDE.md` §11. Requirements as in `tools/wodb/README.md`. There is no stored sheet: messages are encoded on the fly and the "families" sheets come from `CARDANO.genera(level, id)`.

```bash
node tools/cardano/check.js [N]             # grille, messages, families sheets (A–D + N generated per level), design templates
cd tools/cardano && python3 make_pdfs.py    # -> pdf/cardano/: missatges.pdf, CF1.pdf, CF2.pdf, reixeta.pdf, reixeta-tall-laser.svg, solucionaris.pdf, dissenya.pdf, index.html
```

`check.js` re-derives everything without the engine's own predicates: the grille (one hole per rotation orbit, 36 cells shown once, no holes sharing a side, cut lengths and card size read from `cardano/app.js`), the message round trip (an independent reader that turns the sheet instead of the grille), and every families sheet (8 + 1 per position, intruder in no catalogue family, unambiguous family). `make_pdfs.py` asserts that the grille stays on the paper when laid on the sheet, that the grille page is printable (outline ≥ 5 mm from the edge) and that no text leaves a page; it must print `errors []`.

To add a family: append `{nom, f}` to `FAMILIES` and its key to the `cat` list of a level in `cardano/motor.js`. Families of one catalogue must not be nested (e.g. multiples of 3 and of 9): a turn showing eight members of the inner family would also show eight of the outer one and every such sheet is rejected as ambiguous.
