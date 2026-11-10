# TODO — Reixeta

Status (2026-11-11). Built and merged into `main`: WODB (12 topics × 4 sheets, generator, builder), counting game, Sanefa trencada, Pinta per sumes. **Every approved game is built.** Beta mode: nothing old has to be preserved. Standing rule: open a pull request whenever changes are pushed.

What is known about each piece, so that nobody takes "built" for "validated":

| Piece | Verified by computer | Tested on paper by the owner |
|---|---|---|
| WODB sheets + generator | yes (`tools/wodb/check.js`) | v3 yes; v4 (5×4) printed, mask cut by hand (bars tore → single-hole mask) |
| WODB new masks (single hole / 6 mm bars, frame 24) | geometry only | no |
| WODB builder | yes (browser test) | not reviewed at all |
| Counting game (CO 3×2 and CS 2×2) | yes | no |
| Sanefa trencada | yes | no |
| Pinta per sumes | yes | no (he reviewed the example drawings on screen) |

## P0 — Waiting for the owner

1. **Round 12 — laser cutter + 3D printer** (artifact https://claude.ai/artifact/32rS7wTCXxAGtP5ZvedKMK, offline copy `docs/history/ronda12.html`). He said he needs a few days. On «Revisa artifact»: read collection `respostes` (doc ids A1, L1–L7, D1–D3, N1), reply in collection `claude` (doc id = point id, field `text`), build what he approved. Nothing of that round is built. Proposals: A1 which machines/materials (assumed CO₂ laser ≥ 300 × 200 mm, 3 mm MDF/acrylic; FDM printer ~200 mm, PLA); L1 rigid 3 mm masks; L2 transparent acrylic mask with hatched frame (trial); L3 Sanefa masks by laser + "A" engraved on one face; L4 real logic blocks (48); L5 polyomino pieces (17 + 3 dominoes + 3×3 frame); L6 loose engraved tiles + tray ("build a WODB", checked with the builder); L7 45°/90° acrylic set square; D1 the 14 solids of COS at ~40 mm (generate STL from `tools/wodb/solids.py`; sphere and octahedron in two halves); D2 printed knob (pending L1); D3 tactile tiles only if needed; N1 six rejected ideas. All times there are estimates.
2. **Counting game: CO or CS?** Both exist (`CLAUDE.md` §7). Ask which stays once he has tried them.
3. **Paper tests** of everything in the table above. Known tight spots to mention if he reports trouble:
   - Masks with the 24 mm frame leave only 1 mm of paper above/below at the extreme rows (WODB, counting game) and 1 mm at the sides on the 10×10 Pinta sheet; Sanefa leaves 3 mm below the last frieze. He was told; he may want to frame the sheets some day. Remedy: smaller cell (`CEL` 38) or thinner frame.
   - Sanefa motif box is 16 mm; the flag pole is about 2.2 mm wide (fine for a laser, hard by hand). Alternative: A4 portrait, motif about 24 mm, 7 copies per frieze.
   - Sanefa: the sailboat is the least asymmetric motif under a vertical mirror (0.21 vs threshold 0.20).
   - WODB letters: the Q is excluded from "punt d'on surten tres línies o més" by his decision although its tail crosses the oval; redraw the Q in `tools/wodb/letters.py` if pupils argue.
   - WODB balance: COS 6/12 and ANG 10/12 are above the 5/12 rule (accepted).
4. **Builder review.** It was built without a proposals round. Not implemented: a builder for the other games (they have their own generators); custom item banks (not wanted since round 7).

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
