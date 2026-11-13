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
- Simple variant for comparison: levels `CS1`/`CS2` on a 5×4 sheet with the WODB 2×2 mask (12 positions, answers 0–4). The owner has to choose which one stays (or both).
- Full spec: `CLAUDE.md` §7.

## DONE — Sanefa trencada (round 4 S1, round 7 Q13, format round 10, rebuilt after round 13) — `sanefa/`

- One portrait sheet = the seven frieze types (translation; vertical mirrors; glide reflection; half-turns; vertical mirrors + half-turns; horizontal mirror; vertical + horizontal mirrors) made with one motif without symmetry, 8 copies of 22 mm each, exactly one wrong copy per frieze. Same motif within a sheet, different motifs on different sheets. No "creative version".
- Motifs: straight-cut shapes with the drawing inside (sail, cheese, shed, boot), so that the card can be cut by hand. The first figurative motifs (boot, flag, sailboat, duck) were dropped: their holes could only be cut by laser.
- F2 = card with a clipped corner whose final position names the isometry; default model = the motif as a bite on the card edge (scissors), second model = hole inside (cutter or laser). Separate answer key.
- Rejected in round 10: splitting the seven friezes over two sheets (too "baroque"). Rejected in round 13: square window + printed motif, transparent overlay, laser-only masks.
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

## DONE — The Cardano grille (round 14 R1, R2, R3, R5) — `cardano/`

- One turning grille for every sheet (6 × 6, 9 holes, four positions show each cell once). Three uses: secret messages (teacher tool), "four turns, four families" (8 numbers of a family + 1 intruder at each position; two levels) and a worksheet to design one's own grille. Full spec: `CLAUDE.md` §11.
- Rejected in round 14: magic grille (find the holes with equal sums), order of the encryption permutation, crib cryptanalysis. The fixed grille of 1550 stays as an anecdote.

## DONE — Pinta per sumes: themes and mazes (round 14 A1, A2) — `pinta/`

- Themes: two-digit sums; integers (product positive); fractions (sum is a whole number); factors 2, 3, 5 (product is a perfect square). Mazes: the hidden picture is a maze walked one cell at a time. Full spec: `CLAUDE.md` §9.

## DONE — Dice and events (round 14 C3) — `daus/`

- The 36 outcomes of two dice and one mask per event; stacking masks = intersection; question sheet and key. Full spec: `CLAUDE.md` §12. Not built: the deck-of-cards variant.

## DONE — The sonar (round 14 F2) — `sonar/`

- Two players, 5 treasures hidden on a 5 × 4 sheet, the WODB mask as the query tool, three levels. Full spec: `CLAUDE.md` §13.

## PARKED — Mosaic trencat (round 14 B2)

- Wallpaper groups as the continuation of Sanefa trencada (11 of the 17 groups are possible with one asymmetric motif per square cell, per the other AI's classifier — not re-verified by Claude). Owner: later. Do not start before the new Sanefa has been tested on paper.

## REJECTED in round 14

- A3 window hunt, A4 make 24, A5 shape hunt, A6 WODB banks for 3r–Batx, B3 lock and key, C1 binary cards, C2 Hamming bit, C4 sieve, D1 hidden law, D2 area crosses, D3 window kakuro, D4 Creek, D5 mask sudoku, E1 matrices in the window, E2 window invariants, E3 sampling, F1 loot window.
