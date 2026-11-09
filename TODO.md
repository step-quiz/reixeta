# TODO — Reixeta

Status at closing (2026-11-09): WODB deliverable v3 delivered (`wodb/`, `pdf/wodb/`). The owner printed v1–v2 and tested them physically; v3 includes all his fixes. Work order agreed with the owner: **(1) WODB → (4) Sanefa trencada + (5) counting game → (3) Pinta per sumes → (2) WODB builder**. Do not start a new game until the owner says so.

## P0 — WODB: add the properties the owner chose (review round 9, 2026-11-09)

Goal: make each sheet meet (or get close to) the balance rule, i.e. no reason type in more than 5/12 of the windows. Owner rule: "if it gets close, it's good". Procedure for each sheet: add the properties to the generator script → regenerate the pool bitmasks → `balance.py` (W1=200, CAPN=5, CAPD=12) → keep all windows valid → update `fulls_bal.json` → `export_bancs.py` → `make_pdfs.py` → check.

| Sheet | New properties (exact) | Notes |
|---|---|---|
| ANG | none | Leave as is (max 30/36 is structural: only angle types + <45°, >270°). |
| POL | none | Leave as is. |
| QUA | (a) has an axis of symmetry (re-add the old `simetria` test from `dots.py`); (c) diagonals have equal length; (d) has at least one pair of equal sides; (e) has an obtuse angle | Owner did **not** choose (b) "side horizontal/vertical". With more properties, try a 10×5 board again (currently 10×4, 27 windows). |
| FRA | (a) equals a decimal with exactly one decimal digit (denominator of the reduced fraction divides 10 and the value ×10 is an integer but the value is not an integer); (b) numerator and denominator both even; plus owner's own: (f) numerator and denominator are both prime; (g) the fraction is a perfect square (reduced a/b with a and b perfect squares, e.g. 1/4, 9/4, 4/9) | Owner also asked for "és irreductible": it is the **same** property as the existing "es pot simplificar" (opposite direction, already used as the "no" reason). Tell him; do not add a duplicate. Fractions are feminine: "És l'única …". |
| TR5, TR4 | (a) area is a whole number of squares (`area2` even); (b) has a 45° angle | Both triangle sheets. |
| LLE | (b) has a point where three or more lines meet (T, Y, E, F, H, K, …) ; (c) mixes straight and curved lines (B, D, G, J, P, R, U, Q) | Define the sets explicitly from the stroke font in `letters.py` and check them visually. |
| COS | (a) has faces of two different shapes; (b) has exactly 5 faces | |
| FIG | (a) has an obtuse angle; (b) all angles are equal; (c) more than one axis of symmetry | Compute from coordinates (`domains.py` `props_shape`). |

After this, rebuild the PDFs, update `tools/wodb/bal_final.json`, the README table and deliver a v4 ZIP.

## P1 — WODB print refinements still open

- The owner wants it "extremely easy" to place F2 on F1. Current solution: frame 15 mm with guide marks. Ask for feedback after he cuts the new 82 mm mask.
- Solution keys show one reason per item in words; he accepted the format.

## P2 — Next games (in this order; full specs in `docs/GAMES.md`)

1. **Sanefa trencada** (round 4, S1): approved **without** the "creative" version. Printable sheets with friezes, each containing exactly one wrong motif; mask = the motif outline; answer key separate. Same motif within one sheet, different motif on different sheets (owner clarified).
2. **Counting game** (the owner's idea, round 1 comment): mask 2×2 or 3×2 over a numbers sheet; the question is "how many primes / multiples of 3 / perfect squares can you see?" or "add them" (= add **only** the numbers that satisfy the property). Two levels: N1 numbers 2–50, N2 numbers 2–150. Team rules: A vs B, first team to answer; +5 if right, −10 if wrong; start at 40; first to 100 wins. Balance the sheet so that every possible answer (0..4 or 0..6) appears with similar frequency.
3. **Pinta per sumes** (round 2, A1): approved; the generator must let the teacher design his own bitmap drawings. Up to 3 drawings per sheet (one per mask orientation). Rules must be simple and more varied than parity/mod 3/mod 5, e.g. "there is a multiple of 7", "there is a prime". Drawing size not decided (ask: 9×9 with a 10×10 sheet was proposed). Feasibility of 3 simultaneous arbitrary rules = constraint satisfaction; check by computer.
4. **WODB builder** (round 5, J6): static vanilla HTML for teachers, very intuitive, parts (1) choose 4 items from a bank → show reasons; (2) generate a full sheet from a bank (already done by the "Full nou" button; reuse `motor.js`). Part (3) custom banks: **not** wanted.

## Parked (do not work on them unless asked)

- **El robot llaminer** (round 2, P3) — "més endavant".
- **El dau amagat** (round 4, C1) — "més endavant".
- Other content for new WODB sheets: "later; mainly geometry".
