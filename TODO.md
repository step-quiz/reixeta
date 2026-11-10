# TODO — Reixeta

Status (2026-11-10): three games are built and on branch `claude/friendly-planck-6sha1i` — WODB v4 (already merged into `main` through PRs 1 and 2), the counting game (`comptar/`) and Sanefa trencada (`sanefa/`), the last two built right after round 10 and **not yet seen on paper by the owner**. Beta mode: nothing old has to be preserved. Remaining approved games: Pinta per sumes, then the WODB builder.

## P0 — Owner feedback pending on the two new games

Nothing was printed yet. Expect corrections of the kind recorded in `docs/DECISIONS.md` (sizes, clearances, wording). Known points to raise or watch:

- **Counting game — 2×2 alternative (owner's note, round 10 K1):** evaluate whether a 2×2 mask on a 5×4 sheet (the WODB mask, 12 positions, answers 0–4) is more "easy-going and keep-it-simple" than the 3×2 on 6×4. Exhaustive search already showed that a balanced 5×4 sheet exists for each single question (answer histogram 3 2 3 2 2) and annealing found joint sheets for the three questions (e.g. primes 3 3 2 2 2, multiples of 3 3 3 3 2 1, squares 3 3 3 2 1 at level 1). To build it: generalise `R, C` and the mask shapes in `comptar/motor.js` (`POS`), thresholds in `NIVELLS`, and the mask drawing in `comptar/app.js`.
- **Counting game:** numbers with the same property cluster on the sheet (needed to reach answers 5–6); the owner has not judged how that looks. Level 1 squares: answer 6 never occurs, 5 rarely.
- **Sanefa trencada:** motif box is only 16 mm so that seven friezes fit in A4 landscape with the mask inside the paper; hole details are small (the flag pole is about 2.2 mm wide) — fine for a laser, hard with a cutter. If too small: fewer copies per frieze do not help (height is the limit); options are A4 portrait (motif about 24 mm, 7 copies) or a thinner mask frame.
- **Sanefa trencada:** the sailboat is the least asymmetric motif under a vertical mirror (0.21, threshold 0.20); if pupils confuse it, enlarge the sail offset in `MOTIUS.VEL` and rerun `tools/sanefa/check.js`.
- **Masks (WODB, counting game):** new frame of 24 mm leaves only 1 mm of paper above/below at the extreme rows (conflicts with a possible framing of the sheets; owner informed, awaiting his view). Sanefa mask frame is 19 mm by his choice (3 mm of paper left below the last frieze). The `barres` model must be offered by the future builder site.
- **WODB:** the Q is excluded from the LLE junction property by owner decision.

## P0b — Round 11: Pinta per sumes (artifact https://claude.ai/artifact/3SdT9jqeWY3PCcgnmXSSNJ, offline copy `docs/history/ronda11.html`) — awaiting the owner's answers

On «Revisa artifact»: read collection `respostes` (doc ids P1–P6, E1, E2), reply in collection `claude` (doc id = point id, field `text`), then build what he approved. Proposals (not decisions): P1 sheet 10×10 of 18 mm cells in A4 portrait, picture 9×9 (option 8×8 of 22 mm); P2 a plain 2×2 mask and one **rule** per picture instead of one orientation per picture (alternative: L-shaped mask); P3 base rules "sum even / multiple of 3 / multiple of 5"; P4 existential rules ("there is a multiple of 7" = "the product is a multiple of 7") offered with a warning, the editor marks impossible pixels; P5 repeated numbers accepted, never inside one mask position; P6 answer sheet with three empty 9×9 grids; E1 teacher editor page (click pixels, one rule per grid, sheet code stored in the URL); E2 three example sheets `PIN-A…C`.

Facts computed for that round (scratch code, not in the repo):
- Sum rule mod m with a 2×2 mask: the linear system has full rank (81 of 81 positions on 10×10; also checked for an L mask and other sheet sizes, mod 2, 3, 5), so **any** bitmap is drawable. Constructive solution: choose the first row and first column of residues freely, then each cell (r+1, c+1) follows from window (r, c); target 0 for a black pixel, any non-zero residue for a white one.
- Rules with different moduli are independent (CRT): three pictures mod 2, 3, 5 need a residue mod 30 per cell, i.e. three candidates among 10–99, hence repeated numbers (60 distinct in the 100-cell example). Two pictures with the same modulus on one sheet are not possible in general (rank 96 of 144 for the L mask).
- Existential rule ("some visible number has property Q"): a black pixel is drawable iff one of its four cells is seen only by black pixels; thin strokes fail (smiley 11 of 31 black pixels impossible, π 11 of 33, heart 1 of 46).

## P1 — Next games (full specs in `docs/GAMES.md`)

1. **Pinta per sumes** (round 2, A1): approved; the teacher designs his own bitmap drawings; up to 3 drawings per sheet; simple varied rules. A picture needs many cells (the owner accepts that some games need many more cells): propose sizes in a review round first, and check the feasibility of three simultaneous rules by computer before promising.
2. **WODB builder** (round 5, J6): static vanilla HTML; parts (1) choose 4 items → reasons, (2) generate a sheet (exists as "Full nou"). Part (3) custom banks: not wanted.

How the owner works: proposals go in a review artifact (see `CLAUDE.md` §2); «Sí, fes-ho» = first option; he then writes «Revisa artifact». He judges sheets by how approachable they look to a pupil ("too baroque" = rejected).

## Parked (do not work on them unless asked)

- **El robot llaminer** (round 2, P3), **El dau amagat** (round 4, C1) — "més endavant".
- Other content for new WODB sheets: "later; mainly geometry".
