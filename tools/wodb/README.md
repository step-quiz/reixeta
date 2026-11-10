# tools/wodb — pipeline that builds the WODB banks, sheets and PDFs

Run every script from this directory. Requirements: Python 3 with numpy, scipy (solids), pypdf, playwright (`pip install scipy pypdf playwright`); Chrome or Chromium at `/usr/bin/google-chrome` or `/usr/bin/chromium` (`make_pdfs.py` picks the first that exists); Node ≥ 18.

## Main flow

```bash
python3 export_bancs.py    # item sources + props9.py + fulls_bal.json -> ../../wodb/bancs.js
node check.js [N]          # verifies every fixed sheet and N generated sheets per bank; must print ALL OK
python3 make_pdfs.py       # -> ../../pdf/wodb/: CODE.pdf (sheets A–D), tots-els-fulls.pdf, mask, laser SVG, solucionaris.pdf, index.html
```

Full rebuild including the board search (about 10 minutes):

```bash
python3 export_bancs.py && node fulls.js && python3 export_bancs.py && node check.js && python3 make_pdfs.py
```

`export_bancs.py` builds every bank (items, bitmask properties, generator options) for a 5 × 4 board (`ROWS`, `COLS`), appends the round-9 properties of `props9.py`, and takes the fixed sheets from `fulls_bal.json` (`{CODE: {A: [20 indices], B, C, D}}`; BLB uses the boards of BLO). If a bank is missing there it gets a placeholder sheet, which `check.js` reports as BAD until `fulls.js` has run.

## Scripts in use

| Script | Role |
|---|---|
| `export_bancs.py` | Builds `wodb/bancs.js`. FRA pool and its 7 base properties are inline. `maxrep` (max items with the same key per sheet) = ceil(20 / number of keys). |
| `props9.py` | Round-9 properties, each computed from the item's own data: TR5/TR4 (integer lattice arithmetic), QUA (exact fractions), FIG (from `domains.SHAPES`), LLE (junctions and stroke kinds parsed from the SVG paths of `letters.py`), COS (face lists), FRA. `python3 props9.py` prints the LLE sets and the FIG / COS tables for visual checking. |
| `fulls.js [CODE …]` | Searches sheets A–D: smallest balance cap starting at floor(5N/12); each sheet = best of `SEEDS` (env, default 24) two-phase searches (`WODB.cercaFull` in `wodb/motor.js`), cost = neighbour repeats + reuse of items of the previous sheets. Heavy mode for the banks in `HARD` (env, default `POL,COS`): when the normal pass finds nothing, up to `HSEEDS` (150) seeds × 3 long phase-1 configurations, stopping at 3 good sheets; `MINCAP` in the script skips caps proven out of reach (COS 5). Writes `fulls_bal.json` and `bal_final.json` (`{CODE: [max positions of one reason type, positions, [neighbour repeats of A–D]]}`). Deterministic. |
| `check.js [N]` | Validity, no repeated item, balance cap, neighbour figures, and `WODB.genera` (deterministic, valid, searched vs fallback). Exit code 1 on failure. |
| `make_pdfs.py` | Serves the repo on 127.0.0.1:8766, prints with headless Chrome, merges with pypdf, checks that no answer key overflows its quarter page (`solu overflow: []`) and that the page raised no JS error (`errors []`). Deletes old PDFs/SVG in `pdf/wodb/` first. |

## Item sources per bank

| Bank | Items / base properties come from |
|---|---|
| NUM, FIG, BLO/BLB | `data5.json` (built earlier by `domains.py` + `gen.py`) |
| FRA | inline in `export_bancs.py` (fractions only) |
| LLE | `out_let9.json` (+ paths in `letters.py`); property 6 "one stroke" dropped by `perm` |
| ANG | `out_ang2.json` (+ `angles.py` for ray lengths) |
| TR5, TR4 | `out_tri_g.json`, `out_tr4_5x9.json` (`dots.py` + `thin.py` filter) |
| QUA | `out_qua_g.json` (pool of 450, `dots.py` + `thin.py`) |
| POL | `out_pol_b.json` (`poly.py`) |
| COS | `out_sol2.json` (`solids.py`) |

The `board` arrays inside the `out_*.json` / `data5.json` files are the old 10×5 boards and are **ignored**.

`export_bancs.py` sets `gen.marge = 1` for POL and COS (`MARGE`): "Full nou" cannot afford the heavy search, so its cap is one above their fixed sheets.

## Adding or changing a property

1. Add `(si, no, test)` to the bank's list in `props9.py` (or edit the generator of the pool). At most 15 properties per bank (reason types are kept in a 32-bit mask).
2. Full rebuild (above). Adding properties never invalidates a sheet, but the balance and neighbour figures change, so rerun `fulls.js`.
3. Update the table in the root `README.md` from `bal_final.json`.

## Legacy scripts (history of the 10×5 version; not part of the flow)

`common.py`, `gen.py`, `gen_extra.py`, `polish.py`, `sizes.py`, `tr4size.py`, `mosaics.py` (pool builders / 10×5 annealers in Python) and `balance.py` (10×5 balance search; superseded by `fulls.js`). They are kept because the `out_*.json` pools were produced with them; some contain hard-coded sizes `R,C=5,10`.
