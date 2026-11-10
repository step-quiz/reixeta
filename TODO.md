# TODO — Reixeta

Status (2026-11-09, after the redesign session): WODB v4 is on branch `claude/friendly-planck-6sha1i` — 5×4 board (12 positions), 40 mm cells, 110 mm mask, 4 fixed sheets (A–D) per topic, round-9 properties implemented, neighbour rule, working "Full nou". Work order agreed with the owner: **(1) WODB → (4) Sanefa trencada + (5) counting game → (3) Pinta per sumes → (2) WODB builder**. Do not start a new game until the owner says so.

## P0 — WODB: waiting for the owner's physical test of v4

The owner has to print a 5×4 sheet and cut the new 110 mm mask (the old 82 mm mask is obsolete). Ask for feedback on:

- Cell size 40 mm / hole 37 mm (1.5 mm inset, fixed by the owner) / drawing box 28 mm / frame 15 mm (all constants at the top of `wodb/app.js`; if any changes, recheck that the mask never exceeds the paper and rerun `make_pdfs.py`).
- "Extremely easy to place F2 on F1": current solution = frame with guide marks that continue the grid lines.
- Wording of the round-9 properties that were adapted (see `docs/DECISIONS.md`, "Round 9 implemented"): COS "cares planes de dues formes diferents", LLE "punt d'on surten tres línies o més" (includes X and Q), FRA "amb un sol decimal", "amb els dos termes parells/primers", "quadrat perfecte" (includes every k/k = 1).
- The fraction pool was extended (denominator 9 and 9/4, 16/9, 1/16, 9/16, 4/25, 9/25, 16/25) so that "perfect square" has examples; the owner has not seen this yet.
- Neighbour rule: it is a soft objective. If the owner wants it stronger, raise `adjw` in `POLIT` (`wodb/motor.js`) and `SEEDS` in `tools/wodb/fulls.js`, rerun the board search; the price is fewer spare reasons per position.

Possible improvements (not requested): POL (6/12) and COS (7/12) are above the 5/12 rule; POL has no new properties because the owner said to leave it; ANG (10/12) is structural.

## P1 — Next games (in this order; full specs in `docs/GAMES.md`)

General preference stated by the owner on 2026-11-09: **few cells per F1 and several F1 sheets per topic** rather than one big sheet; F1 is always A4.

1. **Sanefa trencada** (round 4, S1): approved **without** the "creative" version. Printable sheets with friezes, each containing exactly one wrong motif; mask = the motif outline; answer key separate. Same motif within one sheet, different motif on different sheets (owner clarified).
2. **Counting game** (the owner's idea, round 1 comment): mask 2×2 or 3×2 over a numbers sheet; the question is "how many primes / multiples of 3 / perfect squares can you see?" or "add them" (= add **only** the numbers that satisfy the property). Two levels: N1 numbers 2–50, N2 numbers 2–150. Team rules: A vs B, first team to answer; +5 if right, −10 if wrong; start at 40; first to 100 wins. Balance the sheet so that every possible answer (0..4 or 0..6) appears with similar frequency.
3. **Pinta per sumes** (round 2, A1): approved; the generator must let the teacher design his own bitmap drawings. Up to 3 drawings per sheet (one per mask orientation). Rules must be simple and more varied than parity/mod 3/mod 5, e.g. "there is a multiple of 7", "there is a prime". Drawing size not decided (ask; note that a picture needs many cells, which conflicts with the "few cells" preference — discuss). Feasibility of 3 simultaneous arbitrary rules = constraint satisfaction; check by computer.
4. **WODB builder** (round 5, J6): static vanilla HTML for teachers, very intuitive, parts (1) choose 4 items from a bank → show reasons; (2) generate a full sheet from a bank (already done by the "Full nou" button; reuse `motor.js`). Part (3) custom banks: **not** wanted.

## Parked (do not work on them unless asked)

- **El robot llaminer** (round 2, P3) — "més endavant".
- **El dau amagat** (round 4, C1) — "més endavant".
- Other content for new WODB sheets: "later; mainly geometry".
