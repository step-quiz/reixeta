# GAMES.md — game catalogue of Reixeta

All games use the same device: F1 = grid sheet (always A4; the grid size is chosen per game — the owner prefers few cells per sheet and several sheets per topic), F2 = mask with holes. The mask can be translated, rotated (90/180/270°) and flipped. The original proposals, with working demos, are in `docs/history/rondaN.html`; the owner's answers were stored in the artifacts' databases and are summarised in `docs/DECISIONS.md`.

Status legend: **DONE**, **APPROVED** (to build), **PARKED** ("més endavant"), **REJECTED**.

## DONE — WODB · Quin no hi encaixa? (rounds 5, 6, 8, 9 + redesign of 2026-11-09)

- Mask: 2×2 holes. F1: 5 × 4 cells of 40 mm, so 12 positions per sheet. Every position is a valid WODB: each visible item differs from the other three in at least one listed property. Any other correct argument from students is also accepted ("no hi ha solució única").
- 12 topics, each with 4 fixed sheets (A–D): NUM numbers 1–99; FIG polygons (geometric properties only); FRA fractions only; BLO logic blocks in colour; BLB logic blocks in B/W (colour → hatch pattern: ratllat / quadriculat / puntejat; filled/empty → thick/thin contour); LLE letters (geometric properties only, custom stroke font); ANG angles (types + <45°, >270°); TR5 triangles on a 5×5 dot grid; TR4 triangles on a 4×4 dot grid; QUA quadrilaterals on a 5×5 dot grid; POL tetrominoes + pentominoes; COS solids (no icosahedron or dodecahedron).
- Two quality rules on top of validity: balance (no reason type in more than 5 of the 12 positions) and neighbours (moving the mask one cell should change the reasons as much as possible). See `CLAUDE.md` §4.2.
- Teacher page `wodb/` prints F1, the mask (PDF + laser SVG) and answer keys (one page per topic), and generates new sheets ("Full nou", reproducible by number).
- Pending: the owner's physical test of the new sizes (see `TODO.md` P0).

## APPROVED — Sanefa trencada (round 4, S1) — *without the creative version*

- F1: friezes (border strips) made by repeating one motif with one of the 7 frieze rules (translation, glide reflection, vertical mirrors, half-turns, horizontal mirror and their combinations; Conway's names: hop, step, sidle, spinning hop, spinning sidle, jump, spinning jump). Each frieze contains exactly **one** wrong copy (rotated or reflected). Find it.
- F2: a mask with the motif's outline, used to check: a copy is correct if the mask fits it with the same orientation as the others.
- The motif must have **no symmetry at all**, so that any wrong copy is detectable (the demo checked this).
- Owner decisions: no "creative version"; same motif within one sheet, different motifs on different sheets; separate answer key; print only, B/W.

## APPROVED — Counting game (owner's idea, round 1 comment)

- F2: 2×2 (4 holes) or 3×2 (6 holes). F1: numbers. Questions: "how many primes / multiples of 3 / perfect squares do you see?" or "add them" = add **only** the visible numbers that satisfy the property.
- Levels: N1 numbers 2–50; N2 numbers 2–150.
- Team rules (owner): teams A vs B; the first team that thinks it knows the answer says it; +5 if right, −10 if wrong; both start at 40; first to 100 wins.
- Design the sheet so that all possible answers (0..4 or 0..6) appear with similar frequency over the positions (no guessing). Answer key separate.

## APPROVED — Pinta per sumes (round 2, A1)

- F1 numbers that look random. Place the mask at each position, add the 4 visible numbers; if the sum satisfies the rule, colour the corresponding cell on an answer grid. When the class has done all positions, a picture appears. The same F1 hides up to **three** pictures, one per mask orientation (demo: upright + "even sum" → heart; flipped + "multiple of 3" → smiley; rotated 180° + "multiple of 5" → π). The demo used an asymmetric 4-hole mask on a 9×10 sheet with numbers 10–99 (before the "few cells per sheet" preference; rediscuss the size).
- Owner decisions: the generator must let the teacher **design his own bitmap drawings**; up to 3 per sheet; more and simpler rules, e.g. "there is a multiple of 7", "there is a prime" (rules about the visible numbers, not only about the sum).
- Open: drawing size (9×9 on a 10×10 sheet was proposed). With arbitrary rules, three simultaneous pictures become a constraint-satisfaction problem; verify feasibility by computer before promising.

## APPROVED — WODB builder for teachers (round 5, J6)

- Static vanilla HTML, very intuitive. Part 1: choose 4 items from a bank and see each item's reasons. Part 2: generate a whole sheet from a bank (the "Full nou" logic already exists in `wodb/motor.js`). Part 3 (custom banks): **not** wanted.
- Facts already computed: a random set of 4 items is a valid WODB about 1/4 of the time with logic blocks, 1/10 with figures, 1/11 with numbers, 1/16 with letters, 1/21 with fractions. A property can never give a reason to two items of the same window.

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
