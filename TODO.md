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
| Sanefa trencada | yes | mask printed: the motif-shaped hole cannot be cut by hand → round 13 |
| Pinta per sumes | yes | no (he reviewed the example drawings on screen) |

## P0 — Waiting for the owner

1. **Round 12 — laser cutter + 3D printer** (artifact https://claude.ai/artifact/32rS7wTCXxAGtP5ZvedKMK, offline copy `docs/history/ronda12.html`). He said he needs a few days. On «Revisa artifact»: read collection `respostes` (doc ids A1, L1–L7, D1–D3, N1), reply in collection `claude` (doc id = point id, field `text`), build what he approved. Nothing of that round is built. Proposals: A1 which machines/materials (assumed CO₂ laser ≥ 300 × 200 mm, 3 mm MDF/acrylic; FDM printer ~200 mm, PLA); L1 rigid 3 mm masks; L2 transparent acrylic mask with hatched frame (trial); L3 Sanefa masks by laser + "A" engraved on one face; L4 real logic blocks (48); L5 polyomino pieces (17 + 3 dominoes + 3×3 frame); L6 loose engraved tiles + tray ("build a WODB", checked with the builder); L7 45°/90° acrylic set square; D1 the 14 solids of COS at ~40 mm (generate STL from `tools/wodb/solids.py`; sphere and octahedron in two halves); D2 printed knob (pending L1); D3 tactile tiles only if needed; N1 six rejected ideas. All times there are estimates.
2. **Round 13 — the Sanefa mask cannot be cut by hand** (artifact https://claude.ai/artifact/HWVxgFANGUesMSBPTNPG7z, offline copy `docs/history/ronda13.html`). The owner printed the boot mask and asked how a human could cut that hole; measured on the real mask the holes have 7–14 cuts, the shortest 0.6–2.1 mm, with 2–4 inward corners. On «Revisa artifact»: read collection `respostes` (doc ids P1–P6, N1), reply in collection `claude`, build what he approved. Nothing is built. Proposals — P1, P4, P5, P6 are alternative paths; P2, P3 add to the chosen one; Claude recommended P1 + P2 + P3:
   - P1 replace the motifs by straight-cut shapes with the figurative drawing inside: sail `[[22,6],[22,94],[88,94]]`, cheese `[[8,80],[92,80],[80,22]]`, shed `[[14,92],[86,92],[86,10],[14,62]]`, simple boot `[[24,6],[56,6],[56,58],[92,58],[92,94],[24,94]]` (0–100 box; 3, 3, 4, 6 cuts; shortest cut 9.9 / 8.9 / 4.5 / 4.8 mm with the 16 mm motif; asymmetry 0.33 / 0.25 / 0.23 / 0.26, all ≥ 0.20). Inner details (seams, holes, door, sole) are in the scratch generator only: redraw them in `sanefa/motor.js`.
   - P2 second mask model: the shape as a **bite on the card edge**, cut with scissors (2 cuts for sail and cheese, 3 for the shed; not for the simple boot); card 54 × 30 mm placed above the copy (below when the shape is upside down); the clipped corner still codes the orientation. Proposed as the default model.
   - P3 sheet in **portrait**: same seven friezes, 8 copies, motif box 22 mm (now 16); card frame 15 instead of 19 → 2 mm of paper at the sides, 20 mm above/below.
   - P4 keep the current motifs with a **square window** and the motif printed next to it on a folded, glued card (comparison by eye, no fit). P5 keep them with a **transparent overlay** (acetate, or an empty laminating pouch run through the laminator; outline traced). P6 keep everything, masks **only by laser**.
   - N1 rejected: hole punch, loose cut-out motif, clipped-corner tiles printed on the sheet (trivialises the game), merely enlarging the boot (heel still 1.6 mm at 22 mm).
3. **Counting game: CO or CS?** Both exist (`CLAUDE.md` §7). Ask which stays once he has tried them.
4. **Paper tests** of everything in the table above. Known tight spots to mention if he reports trouble:
   - Masks with the 24 mm frame leave only 1 mm of paper above/below at the extreme rows (WODB, counting game) and 1 mm at the sides on the 10×10 Pinta sheet; Sanefa leaves 3 mm below the last frieze. He was told; he may want to frame the sheets some day. Remedy: smaller cell (`CEL` 38) or thinner frame.
   - Sanefa motif box is 16 mm; the flag pole is about 2.2 mm wide (fine for a laser, hard by hand). Alternative: A4 portrait, motif about 24 mm, 7 copies per frieze.
   - Sanefa: the sailboat is the least asymmetric motif under a vertical mirror (0.21 vs threshold 0.20).
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
