# tools/wodb — pipeline that builds the WODB banks and PDFs

Run every script from this directory. Requirements: Python 3, numpy, scipy (solids), pypdf, playwright with Google Chrome at `/usr/bin/google-chrome` (edit `make_pdfs.py` if elsewhere), Node for checks.

## Main flow

```bash
python3 export_bancs.py out_qua_g   # → ../../wodb/bancs.js
python3 make_pdfs.py                # → ../../pdf/wodb/*.pdf, laser SVG, index.html
```

`export_bancs.py` reads the item sources below, builds every bank (items, bitmask properties, generator options), then overrides the fixed sheet "A" of each bank with the balanced boards in `fulls_bal.json`.

## Sources per bank

| Bank | Items / properties come from | Original board search |
|---|---|---|
| NUM, FIG, BLO/BLB | `data5.json` (built earlier by `domains.py` + `gen.py`; NUM board by `gen_extra.py num`) | `gen.py`, `gen_extra.py` |
| FRA | inline in `export_bancs.py` (fractions only, 7 properties) | `balance.py FRA` |
| LLE | `out_let9.json` (+ paths in `letters.py`); property 6 "one stroke" dropped by `perm` | `run_let_simple.py` (not copied; superseded by `balance.py`) |
| ANG | `out_ang2.json` (+ `angles.py` for ray lengths) | `common.run` |
| TR5, TR4 | `out_tri_g.json`, `out_tr4_5x9.json` (`dots.py` + `thin.py` filter) | `common.run`, `polish.py`, `tr4size.py` |
| QUA | `out_qua_g.json` (10×4 board, 7 properties) | `sizes.py`, `polish.py` |
| POL | `out_pol_b.json` (`poly.py`) | `polish.py` |
| COS | `out_sol2.json` (`solids.py`) | `common.run` |

## Board search scripts

- `common.py`: generic simulated annealing over a 5×10 board (score = validity + variety); `W1` env = coverage weight.
- `balance.py CODE ITERS SEEDS`: reads banks from `../../wodb/bancs.js`, searches a board that keeps every window valid and minimises reason types above the cap. Env: `CAPN/CAPD` (cap = N·CAPN/CAPD, owner rule 5/12), `W1` (use 200 to force validity), `BALW` (balance weight), `CONW` (weight of tag quotas / value-group caps), `INIT` (start from `bal{INIT}_CODE.json`), `TAG` (output `bal{TAG}_CODE.json`). Saves the board only if all windows are valid.
- `polish.py NAME MAXREP ITERS SEEDS BASE [TAG]`: restarts annealing from an existing `out_NAME.json` board.
- `sizes.py R C ...` / `tr4size.py R C`: search smaller boards when 36 positions are impossible.
- `bal_final.json`: chosen board per bank → (max reason count, number of windows, source file).

## Adding properties (TODO P0)

1. Add the property to the domain generator (e.g. `dots.py` for QUA/TR5/TR4, inline FRA block in `export_bancs.py`, `letters.py` sets, `solids.py` table, `domains.py` for FIG).
2. Rebuild the pool and its bitmasks (re-run the relevant `out_*.json` generation or patch the `p` arrays), keeping the item order.
3. `export_bancs.py` (with the old board, which stays valid: adding properties never removes reasons), then `balance.py CODE 250000 4` with `W1=200 CAPN=5 CAPD=12 BALW=40`.
4. Copy the best board into `fulls_bal.json`, re-export, `make_pdfs.py`, check visually.

Absolute paths of the original environment were rewritten to relative ones; if a script still fails, look for a hard-coded path.
