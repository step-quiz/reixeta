# TODO — Reixeta

Status (2026-11-11). Built and merged into `main`: WODB (12 topics × 4 sheets, generator, builder), counting game, Sanefa trencada, Pinta per sumes. **Every approved game is built.** Beta mode: nothing old has to be preserved. Standing rule: open a pull request whenever changes are pushed.

What is known about each piece, so that nobody takes "built" for "validated":

| Piece | Verified by computer | Tested on paper by the owner |
|---|---|---|
| WODB sheets + generator | yes (`tools/wodb/check.js`) | v3 yes; v4 (5×4) printed, mask cut by hand (bars tore → single-hole mask) |
| WODB new masks (single hole / 6 mm bars, frame 24) | geometry only | no |
| WODB builder | yes (browser test) | not reviewed at all |
| Fold-and-one-cut instructions on the mask pages (`comu/plec.js`) | yes (`tools/plec/check.js`, `prova.js`) | no — 8 layers; card stock untested |
| Counting game (CO 3×2 and CS 2×2) | yes | no |
| Sanefa trencada (rebuilt after round 13: straight-cut motifs, edge-bite cards, portrait sheet, 22 mm motif) | yes | no (the first version's masks could not be cut by hand) |
| Pinta per sumes | yes | no (he reviewed the example drawings on screen) |
| Pinta themes (integers, fractions, perfect squares) and mazes | yes | no |
| Cardano grille (messages, families, design worksheets) | yes | no |
| Dice and events | yes | no |
| The sonar | yes (whole game recounted) | no |

## P0 — Waiting for the owner

1. **Rounds 12 and 13 are closed** (answered 2026-11-11, see `docs/DECISIONS.md`). Postponed by the owner («Més endavant»), do not build until he asks: round 12 **A1** (which laser / printer / materials the school really has — he never told; laser files assume a CO₂ laser ≥ 300 × 200 mm and 3 mm MDF or acrylic) and **L3** (an "A" engraved on the front face of the Sanefa cards in the laser SVGs).
0. **Round 14 is closed** (answered and built on 2026-11-13; artifact https://claude.ai/artifact/161sYgsFy1KTRcSnqdJjcZ, offline copy `docs/history/ronda14.html`, decisions in `docs/DECISIONS.md`). Built: T1 cache stamps (`tools/versio.js`), the Cardano grille (`CLAUDE.md` §11), Pinta themes + mazes (§9), dice and events (§12), the sonar (§13). Postponed by the owner: **B2 "Mosaic trencat"** (wallpaper groups, the continuation of Sanefa; wait until the new Sanefa has been tested on paper). **Nothing of round 14 has been seen on paper by the owner**: when he comes back, ask what he thinks of each piece. Points Claude flagged to him:
   - the grille is 196 mm (not the 208 mm of the proposal: unprintable on A4), cells 26 mm; no alignment mark on F1;
   - the sonar usually needs 9–11 of the 12 possible questions;
   - dice mask H (sum even) has 72 cuts: laser only; mask F is floppy in paper;
   - Pinta theme Q expects pupils to factor, not to multiply (products up to 150⁴).
1. **Rounds 12 and 13 are closed** (answered 2026-11-11, see `docs/DECISIONS.md`). Postponed by the owner («Més endavant»), do not build until he asks: round 12 **A1** (which laser / printer / materials the school really has — he never told; laser files assume a CO₂ laser ≥ 300 × 200 mm and 3 mm MDF or acrylic) and **L3** (an "A" engraved on the front face of the Sanefa cards in the laser SVGs).
0. **Round 14 was answered on 2026-11-13 — BUILD IN PROGRESS.** Approved: T1, R1, R2, R3, R5 (+ R8 as an anecdote), A1, A2, B1 (= the grille), C3, F2. Later: B2. Everything else: no. **Built and pushed (PR 13): T1 (`tools/versio.js`) and the Cardano grille (`cardano/`, `CLAUDE.md` §11).** Still to build, in this order: **A1** Pinta with new rules (sign of a product of integers first; then fraction sums that are whole numbers and products that are perfect squares), **A2** the invisible maze as a new view of Pinta per sumes, **C3** dice and events (36 outcomes of two dice, one mask per event, stacking = intersection), **F2** the sonar (two players, 5 treasures on a 5×4 sheet, the WODB mask as the query tool). Replies already written in the artifact for every point except A1, A2, C3, F2 (collection `claude`). The original text of the round follows.
   **Round 14 — the Cardano grille + another AI's 23 proposals** (2026-11-12, artifact https://claude.ai/artifact/161sYgsFy1KTRcSnqdJjcZ, offline copy `docs/history/ronda14.html`; generators of figures and numbers were scratch files, not in the repo). On «Revisa artifact»: read collection `respostes` (doc ids T1, R1–R8, A1–A6, B1–B3, C1–C4, D1–D5, E1–E3, F1–F2), reply in collection `claude` (doc id = point id, field `text`), build what he approved. Nothing is built.
   - **T1**: the owner saw the old Sanefa on the site although `main` (and the ZIP he downloaded) had the new one → browser/CDN cache of `.js`/`.css`/`.pdf`. Proposed: version query strings on every script, stylesheet and PDF link.
   - **R1–R8 (Claude's proposals for the turning grille)**; Claude recommended R1, R3, R6. R1 one standard 6×6 grille with 9 holes for every sheet (cells 28, holes 22, bars 6, frame 20 → 208 mm; it rotates in place so it fits A4; holes `[[0,3],[1,0],[1,5],[2,2],[2,4],[3,0],[4,2],[4,4],[5,0]]`, one per rotation orbit, no two holes sharing a side); R2 message tool (36 letters); R3 "four turns, four families": each turn shows 8 numbers of one family + 1 intruder (example verified: squares / primes / multiples of 10 / multiples of 7, numbers 2–150, each number in exactly one family); R4 "magic grille": find the 4 holes on a 4×4 square so that the four turns have equal sums (Dürer: 8 of 256, 2 up to rotation — verified; no new squares searched); R5 design-your-own worksheet (orbit template, 4⁹ count, 65 536 up to rotation); R6 "the message that returns": order of the encryption permutation (4×4: orders 4…120 over the 256 grilles, 30 of order 12 — verified); R7 crib cryptanalysis (nothing verified); R8 the 1550 fixed grille "the errors are the holes" (Claude sees no practical way).
   - **A1–F2**: the other AI's proposals with Claude's opinion on each. Verified by Claude: its B1 demo decodes correctly; Dürer 8/256; "make 24" 404 of 495 (and 447 make 10); sonar bound 5⁵ < C(20,5).
   - Facts for the build: rotation `(r,c) → (c, n−1−r)`; 6×6 has 9 orbits (5×5: 6 + centre; 4×4: 4); 4⁹ = 262 144 grilles, 6 164 without side-adjacent holes, only 4 without any adjacency (the regular one). Nine interior holes cannot be made by fold-and-cut nor with scissors: cutter + ruler (36 cuts of 22 mm) or laser.
2. **Sanefa trencada was rebuilt** from the round-13 answers (P1 + P2 + P3, `CLAUDE.md` §8). He has not seen the result on paper: ask for his opinion of the new motifs and of the edge-bite card.
3. **Counting game: CO or CS?** Both exist (`CLAUDE.md` §7). Ask which stays once he has tried them.
4. **Paper tests** of everything in the table above. Known tight spots to mention if he reports trouble:
   - Masks with the 24 mm frame leave only 1 mm of paper above/below at the extreme rows (WODB, counting game) and 1 mm at the sides on the 10×10 Pinta sheet; the Sanefa card leaves 2 mm at the sides of the portrait sheet. He was told; he may want to frame the sheets some day. Remedy: smaller cell (`CEL` 38) or thinner frame.
   - Sanefa: the shed is the least asymmetric motif (0.23 vs threshold 0.20) and has the shortest cut (6.0 mm); the boot has no scissors model.
   - WODB letters: the Q is excluded from "punt d'on surten tres línies o més" by his decision although its tail crosses the oval; redraw the Q in `tools/wodb/letters.py` if pupils argue.
   - WODB balance: COS 6/12 and ANG 10/12 are above the 5/12 rule (accepted).
5. **Builder review.** It was built without a proposals round. Not implemented: a builder for the other games (they have their own generators); custom item banks (not wanted since round 7).

## P1 — Ideas not requested (do not start without asking)

- Pinta per sumes: a fourth rule (multiple of 7) would need three-digit numbers.
- A common page shell: the four game pages repeat the same controls/print code.

## Parked by the owner (do not work on them unless asked)

- **El robot llaminer** (round 2, P3), **El dau amagat** (round 4, C1) — "més endavant". Specs in `docs/GAMES.md`.
- Other content for new WODB sheets: "later; mainly geometry".

## How the owner works (see also `CLAUDE.md` §2)

- Proposals with 5 or more points go in a review artifact; he answers and writes «Revisa artifact»; «Sí, fes-ho» = the first option, nothing else. Short questions go in an option dialog, never as plain text.
- He looks at every figure closely (pixel by pixel) and judges sheets by how approachable they look to a pupil. Send him rendered images of the real PDFs, not sketches: a wrong sketch already misled him once.
- The cloud session cannot reach the published site; to check what is live, compare with `origin/main`.
