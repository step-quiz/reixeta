# TODO — Reixeta

Status (2026-11-10): four games are built (WODB, counting game, Sanefa trencada, Pinta per sumes; the last three not yet tested on paper). Older status line follows. Three games are built and on branch `claude/friendly-planck-6sha1i` — WODB v4 (already merged into `main` through PRs 1 and 2), the counting game (`comptar/`) and Sanefa trencada (`sanefa/`), the last two built right after round 10 and **not yet seen on paper by the owner**. Beta mode: nothing old has to be preserved. Remaining approved games: Pinta per sumes, then the WODB builder.

## P0 — Owner feedback pending on the two new games

Nothing was printed yet. Expect corrections of the kind recorded in `docs/DECISIONS.md` (sizes, clearances, wording). Known points to raise or watch:

- **Counting game — 2×2 alternative (owner's note, round 10 K1):** evaluate whether a 2×2 mask on a 5×4 sheet (the WODB mask, 12 positions, answers 0–4) is more "easy-going and keep-it-simple" than the 3×2 on 6×4. Exhaustive search already showed that a balanced 5×4 sheet exists for each single question (answer histogram 3 2 3 2 2) and annealing found joint sheets for the three questions (e.g. primes 3 3 2 2 2, multiples of 3 3 3 3 2 1, squares 3 3 3 2 1 at level 1). To build it: generalise `R, C` and the mask shapes in `comptar/motor.js` (`POS`), thresholds in `NIVELLS`, and the mask drawing in `comptar/app.js`.
- **Counting game:** numbers with the same property cluster on the sheet (needed to reach answers 5–6); the owner has not judged how that looks. Level 1 squares: answer 6 never occurs, 5 rarely.
- **Sanefa trencada:** motif box is only 16 mm so that seven friezes fit in A4 landscape with the mask inside the paper; hole details are small (the flag pole is about 2.2 mm wide) — fine for a laser, hard with a cutter. If too small: fewer copies per frieze do not help (height is the limit); options are A4 portrait (motif about 24 mm, 7 copies) or a thinner mask frame.
- **Sanefa trencada:** the sailboat is the least asymmetric motif under a vertical mirror (0.21, threshold 0.20); if pupils confuse it, enlarge the sail offset in `MOTIUS.VEL` and rerun `tools/sanefa/check.js`.
- **Masks (WODB, counting game):** new frame of 24 mm leaves only 1 mm of paper above/below at the extreme rows (conflicts with a possible framing of the sheets; owner informed, awaiting his view). Sanefa mask frame is 19 mm by his choice (3 mm of paper left below the last frieze). The `barres` model must be offered by the future builder site.
- **WODB:** the Q is excluded from the LLE junction property by owner decision.

## P0b — Pinta per sumes: built after round 11, not yet seen on paper by the owner

Points to watch: 1 mm of paper left at the sides of the mask on the 10×10 sheet; the example drawings (`EX` in `pinta/motor.js`) were drawn by Claude and not reviewed; a possible fourth rule (multiple of 7) would need three-digit numbers.

## P0c — WODB builder: built 2026-11-10 without a proposals round, not yet reviewed by the owner

`wodb/constructor.html` (spec `CLAUDE.md` §4.6). Expect corrections. Not done: keeping some cells fixed while "Omple sol" fills the rest; the builder exists only for WODB (the counting game and Pinta per sumes have their own generators).

## P1 — Round 12: laser cutter + 3D printer (artifact https://claude.ai/artifact/32rS7wTCXxAGtP5ZvedKMK, offline copy `docs/history/ronda12.html`) — awaiting the owner's answers

On «Revisa artifact»: read collection `respostes` (doc ids A1, L1–L7, D1–D3, N1), reply in collection `claude`, build what he approved. Nothing of this round is built. Ideas proposed: A1 which machines/materials they have (assumed CO₂ laser ≥ 300 × 200 mm bed cutting 3 mm MDF/acrylic, FDM printer ~200 mm, PLA); L1 rigid masks in 3 mm (single-hole model; 3 mm bars still fragile); L2 transparent acrylic mask with hatched-engraved frame (grid lines visible through it; neighbours only blurred) as a trial; L3 Sanefa masks cut by laser + an "A" engraved on one face; L4 real logic blocks (48 pieces; MDF with engraved hatches, "empty" = piece with a hole); L5 polyomino pieces (17 pieces, 15 mm squares, 3 dominoes, 3×3 frame); L6 loose engraved tiles + tray: pupils arrange 20 tiles so that every position is valid, checked with the builder page; L7 45°/90° acrylic set square; D1 the 14 solids of the COS sheet printed at ~40 mm (STL to be generated from the coordinates in `tools/wodb/solids.py`; sphere and octahedron in two halves; ~9 h and ~150 g PLA per set); D2 printed knob for the rigid mask (pending the L1 test); D3 tactile tiles only if a pupil needs them; N1 six rejected ideas (3D-printed masks, notched positioning tray, pixel board, engraved score track, frieze stamps = the rejected creative version, engraved wooden sheets).
- All times in that artifact are estimates, not measurements.

## Parked (do not work on them unless asked)

- **El robot llaminer** (round 2, P3), **El dau amagat** (round 4, C1) — "més endavant".
- Other content for new WODB sheets: "later; mainly geometry".
