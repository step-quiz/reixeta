# TODO — Reixeta

Status (2026-11-23). Built and merged into `main`: WODB (8 topics × 4 sheets, generator, builder), counting game, Pinta per sumes, Cardano grille (Sanefa trencada, dice and events and the sonar were removed by the owner on 2026-11-17). **Every approved game is built.** Beta mode: nothing old has to be preserved. Standing rule: open a pull request whenever changes are pushed.

What is known about each piece, so that nobody takes "built" for "validated":

| Piece | Verified by computer | Tested on paper by the owner |
|---|---|---|
| WODB sheets + generator | yes (`tools/wodb/check.js`) | v3 yes; v4 (5×4) printed, mask cut by hand (bars tore → single-hole mask) |
| WODB new masks (single hole / 6 mm bars, frame 24) | geometry only | no |
| WODB builder | yes (browser test) | not reviewed at all |
| Fold-and-one-cut instructions on the mask pages (`comu/plec.js`) | yes (`tools/plec/check.js`, `prova.js`) | no — 8 layers; card stock untested |
| Counting game (CO 3×2 and CS 2×2) | yes | no |
| Pinta per sumes | yes | no (he reviewed the example drawings on screen) |
| Pinta themes (integers, fractions, perfect squares) and mazes | yes | no |
| Cardano grille (messages, families, design worksheets) | yes | no |

## P0 — Waiting for the owner

0. **2026-11-23 (maths document review, artifact https://claude.ai/artifact/8pmYqt7aUrf5B12z2b1nro, points R1–R3): built.** Fixed sheets that were a symmetry of another one replaced (CO1-C, CO1-D, CO2-C, CS2-C, ANG-D); Pinta: `escurca` (short window sums) and Wilson mazes; README/CLAUDE.md/TODO.md brought up to date. Not tested on paper.
1. **Rounds 12 and 13 are closed** (answered 2026-11-11, see `docs/DECISIONS.md`). Postponed by the owner («Més endavant»), do not build until he asks: round 12 **A1** (which laser / printer / materials the school really has — he never told; laser files assume a CO₂ laser ≥ 300 × 200 mm and 3 mm MDF or acrylic) and **L3** (an "A" engraved on the Sanefa cards — void: Sanefa was removed).
0. **Round 15 is closed** (2026-11-14; artifact https://claude.ai/artifact/62miWirBD9fBm3CvJcGkUU, offline copy `docs/history/ronda15.html`): WODB topics revised and rebuilt, see `docs/DECISIONS.md`. Pending: the owner's look at the new LIN sheets and at the block dimensions on paper.
0. **Round 14 is closed** (answered and built on 2026-11-13; artifact https://claude.ai/artifact/161sYgsFy1KTRcSnqdJjcZ, offline copy `docs/history/ronda14.html`, decisions in `docs/DECISIONS.md`). Built: T1 cache stamps (`tools/versio.js`), the Cardano grille (`CLAUDE.md` §11), Pinta themes + mazes (§9), dice and events (§12), the sonar (§13). Postponed by the owner: **B2 "Mosaic trencat"** (wallpaper groups, the continuation of Sanefa; wait until the new Sanefa has been tested on paper). **Nothing of round 14 has been seen on paper by the owner**: when he comes back, ask what he thinks of each piece. Points Claude flagged to him:
   - the grille is 196 mm (not the 208 mm of the proposal: unprintable on A4), cells 26 mm; no alignment mark on F1;
   - Pinta theme Q expects pupils to factor, not to multiply (products up to 150⁴).
3. **Counting game: CO or CS?** Both exist (`CLAUDE.md` §7). Ask which stays once he has tried them.
4. **Paper tests** of everything in the table above. Known tight spots to mention if he reports trouble:
   - Masks with the 24 mm frame leave only 1 mm of paper above/below at the extreme rows (WODB, counting game) and 1 mm at the sides on the 10×10 Pinta sheet. He was told; he may want to frame the sheets some day. Remedy: smaller cell (`CEL` 38) or thinner frame.
   - WODB letters: the Q is excluded from "punt d'on surten tres línies o més" by his decision although its tail crosses the oval; redraw the Q in `tools/wodb/letters.py` if pupils argue.
   - WODB balance: ANG 10/12 is above the 5/12 rule (accepted; 2026-11-23: proved optimal, no ANG sheet can do better, maths document §4.2). Since round 15 there are 8 topics (LLE, TR5, TR4, POL, COS removed; LIN added).
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
