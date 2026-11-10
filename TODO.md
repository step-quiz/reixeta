# TODO — Reixeta

Status (2026-11-10): WODB v4 is on branch `claude/friendly-planck-6sha1i` with a pull request to `main` open. The owner reviewed it (13 points, all answered and applied, see `docs/DECISIONS.md`). Round 10 (format proposals for the counting game and Sanefa trencada) is published as a review artifact and **awaits the owner's answers**. Work order agreed: **(1) WODB → (4) Sanefa trencada + (5) counting game → (3) Pinta per sumes → (2) WODB builder**.

## P0 — WODB: only the owner's physical test is pending

The owner still has to print a 5×4 sheet and cut the 110 mm mask. Possible follow-ups:

- Framing: only 10 mm of paper remain above/below the mask at rows A and C. If he frames the sheets, change `CEL` to 38 and/or `MARC` to 12 in `wodb/app.js`, recheck the paper bound, rerun `make_pdfs.py`.
- LLE: the Q is excluded from "punt d'on surten tres línies o més" by owner decision although its tail crosses the oval; if pupils argue, redraw the Q in `letters.py` or revisit.
- COS is at 6/12 and ANG at 10/12 (accepted).

## P1 — Round 10: next two games (artifact https://claude.ai/artifact/8iqngG5w4ed2P2Y68CVBgt, offline copy `docs/history/ronda10.html`)

When the owner writes «Revisa artifact», read collection `respostes` of that artifact (doc ids K1–K6, F1–F5), reply in collection `claude` (doc id = point id, field `text`), then build what he approved. Proposals made (not decisions yet):

- **Counting game**: K1 board 6×4 of 40 mm cells + new 3×2 mask of 150 × 110 mm, used horizontally (12 positions) and vertically (10) = 22 positions, answers 0–6 (alternative: 5×4 + the WODB mask); K2 one sheet serves the three questions at once (primes, multiples of 3, squares; histograms computed by annealing, see the artifact); K3 accept that N1 (2–50) has only six squares; K4 answer key = shuffled game script (position, orientation, question, answer), 40 plays per side; K5 printable score track 0–100; K6 four fixed sheets per level, codes `CO1-A…D`, `CO2-A…D`, generated `CO1-4821`.
- **Sanefa trencada**: F1 the 7 frieze types on two sheets per motif (sheet 1: translation, vertical mirrors, glide, half-turns — one row each; sheet 2: mirrors + half-turns, horizontal mirror, all mirrors), motif box 30 mm, 8 copies per frieze (alternative: one sheet with 7 friezes and 17 mm motifs); F2 mask = 54 mm card with a motif-shaped hole and a notch in one corner, the notch corner tells which isometry was needed (↖ identity, ↗ vertical mirror, ↙ horizontal mirror, ↘ half-turn); F3 four polyomino-like motifs without symmetry (all 8 images under D4 distinct, verified); F4 the wrong copy is one of the other three frieze orientations, never a quarter turn, never among the first two copies; F5 half-page answer key per motif, codes `SAN-F1`, `SAN-F2`.
- Scratch code used for the figures (not in the repo): exhaustive search of balanced 0/1 patterns and an annealer for the three-question sheet; a frieze SVG generator. Rewrite them inside the repo (`tools/comptar/`, `tools/sanefa/`) when the games are built.

General preference stated by the owner on 2026-11-09: few cells per F1 and several F1 sheets per topic; F1 is always A4. Each game chooses its own grid and mask.

## P2 — Later games (full specs in `docs/GAMES.md`)

1. **Pinta per sumes** (round 2, A1): approved; teacher designs his own bitmap drawings; up to 3 drawings per sheet; simple varied rules. A picture needs many cells: discuss the size with the owner. Check feasibility by computer.
2. **WODB builder** (round 5, J6): static vanilla HTML; parts (1) choose 4 items → reasons, (2) generate a sheet (exists as "Full nou"). Part (3) custom banks: not wanted.

## Parked (do not work on them unless asked)

- **El robot llaminer** (round 2, P3), **El dau amagat** (round 4, C1) — "més endavant".
- Other content for new WODB sheets: "later; mainly geometry".
