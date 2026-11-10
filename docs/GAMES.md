# GAMES.md — game catalogue of Reixeta

All games use the same device: F1 = grid sheet (always A4; the grid size is chosen per game — the owner prefers few cells per sheet and several sheets per topic), F2 = mask with holes. The mask can be translated, rotated (90/180/270°) and flipped. The original proposals, with working demos, are in `docs/history/rondaN.html`; the owner's answers were stored in the artifacts' databases and are summarised in `docs/DECISIONS.md`.

Status legend: **DONE**, **APPROVED** (to build), **PARKED** ("més endavant"), **REJECTED**.

## DONE — WODB · Quin no hi encaixa? (rounds 5, 6, 8, 9 + redesign of 2026-11-09)

- Mask: 2×2 holes. F1: 5 × 4 cells of 40 mm, so 12 positions per sheet. Every position is a valid WODB: each visible item differs from the other three in at least one listed property. Any other correct argument from students is also accepted ("no hi ha solució única").
- 12 topics, each with 4 fixed sheets (A–D): NUM numbers 1–99; FIG polygons (geometric properties only); FRA fractions only; BLO logic blocks in colour; BLB logic blocks in B/W (colour → hatch pattern: ratllat / quadriculat / puntejat; filled/empty → thick/thin contour); LLE letters (geometric properties only, custom stroke font); ANG angles (types + <45°, >270°); TR5 triangles on a 5×5 dot grid; TR4 triangles on a 4×4 dot grid; QUA quadrilaterals on a 5×5 dot grid; POL tetrominoes + pentominoes; COS solids (no icosahedron or dodecahedron).
- Two quality rules on top of validity: balance (no reason type in more than 5 of the 12 positions) and neighbours (moving the mask one cell should change the reasons as much as possible). See `CLAUDE.md` §4.2.
- Teacher page `wodb/` prints F1, the mask (PDF + laser SVG) and answer keys (one page per topic), and generates new sheets ("Full nou", reproducible by number).
- Pending: the owner's physical test of the new sizes (see `TODO.md` P0).
- The format proposals of round 10 (`docs/history/ronda10.html`) were answered and built: see the next two entries.

## DONE — Counting game (owner's idea, round 1 comment; format round 10) — `comptar/`

- F1 6 × 4 numbers (40 mm cells), F2 3×2 holes used horizontally and vertically (22 positions). Questions: how many primes / multiples of 3 / perfect squares (0–6), or the sum of the visible numbers with the property. Levels `CO1` (2–50) and `CO2` (2–150); one sheet serves all the questions and its answers are balanced; four fixed sheets per level + "Full nou".
- Team rules (owner): A vs B, first to answer; +5 if right, −10 if wrong; start at 40; first to 100. Answer key = shuffled game script; printable score track.
- Full spec: `CLAUDE.md` §7. Open: the owner wants to compare later with a 2×2 mask on 5×4 ("keep it simple").

## DONE — Sanefa trencada (round 4 S1, round 7 Q13, format round 10) — `sanefa/`

- One sheet = the seven frieze types (translation; vertical mirrors; glide reflection; half-turns; vertical mirrors + half-turns; horizontal mirror; vertical + horizontal mirrors) made with one figurative motif without symmetry (boot, flag, sailboat, duck), 12 copies each, exactly one wrong copy per frieze. Same motif within a sheet, different motifs on different sheets. No "creative version".
- F2 = card with a motif-shaped hole and a corner notch; the corner where the notch ends up names the isometry. Separate answer key.
- Rejected in round 10: splitting the seven friezes over two sheets with larger motifs (the owner found it too "baroque": too much information puts pupils off).
- Full spec: `CLAUDE.md` §8.

## DONE — Pinta per sumes (round 2 A1; format round 11) — `pinta/`

- A 10×10 sheet of two-digit numbers (A4 portrait) and a small 2×2 mask; at each of the 81 positions the pupils add the four visible numbers and paint a cell of a 9×9 grid if the sum satisfies the rule; a picture appears. Up to three pictures per sheet, one per rule (sum even / multiple of 3 / multiple of 5), all with the same mask.
- The teacher draws his own bitmaps in the editor; any bitmap is possible. Three example sheets. Full spec: `CLAUDE.md` §9.
- Rejected in round 11: rules of the kind "there is a multiple of 7" (only thick drawings are drawable).

## DONE — WODB builder for teachers (round 5, J6; built 2026-11-10) — `wodb/constructor.html`

- Own grid (2–7 × 2–5), sheet filled by hand with live validation of every mask position (reasons shown per item) or automatically, own mask (one hole / 6 mm bars, frame, star), print views and laser SVG. Uses the 12 existing banks; custom banks are still **not** wanted. Spec: `CLAUDE.md` §4.6.

## PARKED — El robot llaminer (round 2, P3)

The mask is a robot: one hole for its body and three "eyes" (front, left, right). At each step it moves to the largest of the three visible numbers, turns that way and eats it. After 5 or 8 steps, compare with a student who chooses the path (same moves). Greedy vs optimal. Simulation: on random 6×10 boards with 8 steps, greedy is optimal only 1 time in 5; the best path wins by about 5 points on average.

## PARKED — El dau amagat (round 4, C1)

The mask's holes form a cube net; F1 is full of digits 1–6. Fold mentally what you see: only one position gives a real die (opposite faces add up to 7, right-handed: 1-2-3 anticlockwise around their common vertex). Three levels with different nets; the last one includes a mirror-image die as a trap. Verified by folding every placement.

## REJECTED (do not propose again)

- Round 1: all ideas, because they were existing games adapted to the format. Owner: "Pensa. Inventa. Crea."
- Round 2: A2, A3, D1, D2, P1, P2, P4, P5.
- Round 3 (synthetic geometry + probability): G1, G2, G3, P1, P2, P3.
- Round 4 (graphs, solids, friezes, kaleidoscopes): G1, G2, S2.
- Round 5: WODB game variants J1–J5 (they were online or game-show mechanics; the owner wants printed material).
- Round 6 WODB sheets: cube nets (hexominoes) and tessellations.
