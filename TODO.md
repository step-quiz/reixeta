# TODO — Reixeta

Status (2026-11-10): three games are built and on branch `claude/friendly-planck-6sha1i` — WODB v4 (already merged into `main` through PRs 1 and 2), the counting game (`comptar/`) and Sanefa trencada (`sanefa/`), the last two built right after round 10 and **not yet seen on paper by the owner**. Beta mode: nothing old has to be preserved. Remaining approved games: Pinta per sumes, then the WODB builder.

## P0 — Owner feedback pending on the two new games

Nothing was printed yet. Expect corrections of the kind recorded in `docs/DECISIONS.md` (sizes, clearances, wording). Known points to raise or watch:

- **Counting game — 2×2 alternative (owner's note, round 10 K1):** evaluate whether a 2×2 mask on a 5×4 sheet (the WODB mask, 12 positions, answers 0–4) is more "easy-going and keep-it-simple" than the 3×2 on 6×4. Exhaustive search already showed that a balanced 5×4 sheet exists for each single question (answer histogram 3 2 3 2 2) and annealing found joint sheets for the three questions (e.g. primes 3 3 2 2 2, multiples of 3 3 3 3 2 1, squares 3 3 3 2 1 at level 1). To build it: generalise `R, C` and the mask shapes in `comptar/motor.js` (`POS`), thresholds in `NIVELLS`, and the mask drawing in `comptar/app.js`.
- **Counting game:** numbers with the same property cluster on the sheet (needed to reach answers 5–6); the owner has not judged how that looks. Level 1 squares: answer 6 never occurs, 5 rarely.
- **Sanefa trencada:** motif box is only 16 mm so that seven friezes fit in A4 landscape with the mask inside the paper; hole details are small (the flag pole is about 2.2 mm wide) — fine for a laser, hard with a cutter. If too small: fewer copies per frieze do not help (height is the limit); options are A4 portrait (motif about 24 mm, 7 copies) or a thinner mask frame.
- **Sanefa trencada:** the sailboat is the least asymmetric motif under a vertical mirror (0.21, threshold 0.20); if pupils confuse it, enlarge the sail offset in `MOTIUS.VEL` and rerun `tools/sanefa/check.js`.
- **WODB:** physical test of the 110 mm mask still pending; framing leaves 10 mm above/below the mask; the Q is excluded from the LLE junction property by owner decision.

## P1 — Next games (full specs in `docs/GAMES.md`)

1. **Pinta per sumes** (round 2, A1): approved; the teacher designs his own bitmap drawings; up to 3 drawings per sheet; simple varied rules. A picture needs many cells (the owner accepts that some games need many more cells): propose sizes in a review round first, and check the feasibility of three simultaneous rules by computer before promising.
2. **WODB builder** (round 5, J6): static vanilla HTML; parts (1) choose 4 items → reasons, (2) generate a sheet (exists as "Full nou"). Part (3) custom banks: not wanted.

How the owner works: proposals go in a review artifact (see `CLAUDE.md` §2); «Sí, fes-ho» = first option; he then writes «Revisa artifact». He judges sheets by how approachable they look to a pupil ("too baroque" = rejected).

## Parked (do not work on them unless asked)

- **El robot llaminer** (round 2, P3), **El dau amagat** (round 4, C1) — "més endavant".
- Other content for new WODB sheets: "later; mainly geometry".
