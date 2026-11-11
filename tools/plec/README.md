# tools/plec — fold and one cut

Checks of `comu/plec.js`, the shared module that draws, on every mask page, how to make the window of a mask with three folds and one straight scissor cut (see `CLAUDE.md` §10).

| Script | What it does |
|---|---|
| `check.js` | Pure Node. For every mask size of the repo (WODB, counting game 3×2 and 2×2, Pinta N = 10 and 8, every grid/frame of the WODB builder) and 200 random uniform-frame masks: after the three folds a complete straight cut along the window line removes exactly the window (0 misclassified points on a 0.25 mm lattice), with `PLEC.comprova` and with an independent model. Negative controls: non-uniform frame, off-centre window, portrait mask. Prints `ALL OK`. |
| `prova.js` | Browser test (Playwright; `NODE_PATH=$(npm root -g)` if the package is not found). Opens 12 mask pages in print mode. Single-hole model: instructions present, their sizes equal the mask path really drawn, everything inside its box, clear of the masks, ≥ 4 mm from the paper edge, no text over a drawing or over another text. Bars model: no instructions. Prints `ALL OK`. |

Both are run by `node tools/check.js`. There are no PDFs of their own: the instructions are part of the mask PDFs of each game (`tools/<game>/make_pdfs.py`).
