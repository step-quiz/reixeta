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

## P0 — Waiting for the owner

1. **Rounds 12 and 13 are closed** (answered 2026-11-11, see `docs/DECISIONS.md`). Postponed by the owner («Més endavant»), do not build until he asks: round 12 **A1** (which laser / printer / materials the school really has — he never told; laser files assume a CO₂ laser ≥ 300 × 200 mm and 3 mm MDF or acrylic) and **L3** (an "A" engraved on the front face of the Sanefa cards in the laser SVGs).
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
