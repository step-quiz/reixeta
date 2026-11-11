# DECISIONS.md — decisions taken with the owner

Chronological; later entries override earlier ones (e.g. the 10×5 board, the 26 mm cell and the 82 mm mask of the first sections are obsolete — current values are in `CLAUDE.md`). "Round" = one review artifact (`docs/history/rondaN.html`).

## Device and general rules
- F1: m×n grid, m > n, A4 (A5 rejected: cells too small). F2: mask with square holes, never larger than F1; may be translated, rotated, flipped.
- Everything is printed (and laminated). Never an online interactive game for students. Only exception: a static teacher tool (WODB builder / sheet generator).
- Black and white whenever possible.
- Proposals must be new games that exploit the device, not adaptations of existing games.
- Repo `reixeta` on GitHub, Cloudflare Pages, ZIP → `_uploads/` → GitHub Action extracts (workflow file is maintained by the owner from the GitHub web UI; no `verifica-errades.yml` step in this repo).

## Round 1 (2026-11-07) — first ideas
- All rejected as copies of existing games. Owner's own idea kept for later: counting game (see GAMES.md).

## Rounds 2–4 — invented games
- Approved: Pinta per sumes (round 2 A1, with the teacher's own bitmap drawings), Sanefa trencada (round 4 S1, no creative version).
- Parked: Robot llaminer (round 2 P3), Dau amagat (round 4 C1). Everything else rejected.

## Round 5 — WODB
- Every mask position must be a WODB. Mask = 2×2 holes.
- Sheets approved: numbers (8 properties, as is), figures (geometric properties only), fractions/decimals (no percentages), logic blocks (colour + B/W version with patterns), letters (geometric properties only).
- Game variants J1–J5 rejected (no online versions). J6 builder approved as the only web tool.
- Answer keys always separate; there is no unique solution.

## Round 6 — WODB geometry sheets
- Angles: only angle types (+ size properties <45°, >270° added in round 7).
- Triangles on dot grid: both 5×5 and 4×4.
- Quadrilaterals: exactly 7 properties: four right angles, four equal sides, parallel sides in pairs, some pair of parallel sides, concave, perpendicular diagonals, some right angle.
- Polyominoes: approved as is. Solids: remove icosahedron and dodecahedron. Cube nets and tessellations: rejected. Letters: remove "drawable in one stroke".

## Round 7 — alignment
- Work order: (1) WODB, then stop until the owner reviews; then (4) Sanefa trencada and (5) counting game; then (3) Pinta per sumes; then (2) WODB builder.
- "Full nou" button wanted. Builder: parts 1 and 2 only.
- Counting game: "add them" = only the numbers with the property; levels 2–50 and 2–150.
- Sanefa: same motif within a sheet, different between sheets.
- Pinta per sumes: more simple rules ("there is a multiple of 7", "there is a prime"…), up to 3 drawings per sheet.
- If a sheet cannot reach 36 valid positions: use a smaller board where all positions are valid.
- Logic blocks B/W: colours → patterns; filled/empty → thick/thin contour.
- Answer keys: 4 per duplex sheet.

## Round 8 — print design
- F1 absolutely clean: only coordinates on the left (letters) and top (numbers), plus the sheet code (NUM-A…).
- Mask with a frame and guide marks; holes 1.5 mm smaller than the cell on each side; laser cutting with the standard convention (red cut, blue score, black engrave).
- Answer key: one reason per item, written in words.
- Sheet codes approved; one PDF per sheet, one for the mask, one for the keys.

## Physical test by the owner (2026-11-09) and fixes (v2, v3)
- Thin triangles/quadrilaterals rejected → thinness filter.
- Mask stuck out of the paper at left/right positions → frame reduced from 26 to 15 mm (mask 82 mm).
- Drawings too close to the hole edge (1 mm) → drawing box 18 mm inside the 26 mm cell; text width fitted.
- Angle arc size must be constant → fixed radius.
- Decimal digits must be the same size as fraction digits → (then made moot) FRA became **fractions only** because the single decimal was always the obvious odd one out.
- Balance rule: first 1/3, then relaxed to **5/12** of the positions per reason type; if a sheet gets close, it is accepted.

## Round 9 — new properties to improve balance
Owner's choice per sheet: ANG none; POL none; QUA symmetry axis, equal diagonals, some pair of equal sides, obtuse angle (not "horizontal/vertical side"); FRA one-decimal value, both terms even, plus his own: both terms prime, perfect square (he also asked for "irreducible", which is the existing "es pot simplificar" in the opposite direction, so it was not duplicated); TR5/TR4 whole-number area, 45° angle; LLE junction of three or more lines, mixes straight and curved lines; COS faces of two shapes, exactly 5 faces; FIG obtuse angle, all angles equal, more than one symmetry axis.

## Redesign session (2026-11-09, cloud session, answered through option dialogs)
- **Fewer cells per F1.** The owner found that a 10×5 sheet holds far too many puzzles (36 per sheet). Decision: WODB board = **5 columns × 4 rows = 12 positions**; the 10×5 sheets are **replaced** (not kept as an alternative). General preference for the project: few cells per F1, several F1 sheets per topic.
- **F1 is always A4, never A5** (explicit). The cells grow instead: 40 mm cell, 37 mm hole (the 1.5 mm inset of round 8 is kept), 28 mm drawing box, frame 15 mm, mask 110 × 110 mm (the 82 mm mask is obsolete).
- **Four fixed sheets per topic: A, B, C, D** (plus "Full nou"). One PDF per topic with 4 pages; answer keys: one page per topic with the 4 keys.
- **Delivery in cloud sessions: commit + push to the working branch** (the ZIP → `_uploads/` route remains valid for chat sessions).
- **"Full nou" was broken in v3** (found by the study): the annealer always failed and the fallback only flipped sheet A (BLO/BLB had just 4 possible sheets). Rewritten: incremental scoring, cap consistent with the acceptance test, two phases. Now every tested number gives a genuinely new good sheet.
- **Neighbour rule** (owner idea): if reason C1 works at mask position (x,y), as few as possible of the positions (x±1,y), (x,y±1) should also offer C1. Implemented as a soft objective: `repVeins` counts reason types shared by neighbouring positions; phase 2 of the search minimises it. It cannot reach 0 (neighbouring positions share two cells) and pushing it lowers the number of spare reasons per position.
- **Round 9 implemented** (`tools/wodb/props9.py`), with these adaptations that the owner still has to confirm:
  - COS "faces of two different shapes" is worded "cares **planes** de dues formes diferents" so that cylinder, cone and hemisphere are unambiguous (no).
  - LLE "three or more lines meet" is worded "algun punt d'on **surten** tres línies o més" (branch count, computed from the stroke font): A B E F H K P Q R T X Y. X and Q count (4 branches).
  - FRA wording shortened to fit the answer key: "amb un sol decimal", "amb els dos termes parells", "amb els dos termes primers", "que és un quadrat perfecte". Every k/k (= 1) is a perfect square. Pool extended with denominator 9 and 9/4, 16/9, 1/16, 9/16, 4/25, 9/25, 16/25, otherwise the only squares were 1 and 1/4.
- Result: 9 of 12 topics meet the 5/12 rule exactly (5 of 12 positions): NUM, FIG, FRA, BLO, BLB, LLE, TR5, TR4, QUA. POL 6, COS 7, ANG 10 (accepted as "leave as is" for ANG and POL; COS is close).

## Review of WODB v4 (2026-11-10, artifact `docs/history/revisio-v4.html`, 13 points, all answered)
- Hole inset stays **1.5 mm** (round-8 decision; a 2 mm deviation was corrected): hole 37 mm in the 40 mm cell.
- M1 sizes approved (cell 40, hole 37, drawing 28, frame 15, mask 110). The owner may frame the A4 sheets in the future: at the extreme positions the mask leaves 33.5 mm of paper at the sides and only **10 mm at top and bottom**; if that becomes a problem, cell 38 mm and/or frame 12 mm were offered.
- M2 one PDF per topic (4 pages) and M3 one answer-key page per topic: approved.
- P1 COS "cares planes de dues formes diferents": approved.
- P2 LLE junction property: **X counts, Q does not** (owner). Set: A B E F H K P R T X Y. Known risk: the drawn Q does show a crossing, so a pupil may argue it.
- P3 short FRA wording, P4 extended fraction pool and k/k = perfect square: approved.
- P5 the "no" reason of "es pot simplificar" is now worded **"És l'única irreductible"**.
- E1 neighbour rule: the level reached is enough.
- E2 trial of new properties: POL got "eix de simetria en diagonal" and "exactament dos quadrats que només en toquen un"; with them (and a heavy search) POL meets the 5/12 rule. COS "més de 10 arestes" was rejected: cap 5 was never reached with or without it; COS improved from 7 to 6 by the heavy search alone. Side effect: POL fixed sheets repeat more reasons between neighbours (43–50) than before (37–42).
- E3 no old generated sheet has to be preserved: **beta mode** until the owner says otherwise.
- S1 pull request opened for the branch. S2 the owner agrees that other games need their own grid (some with many more cells, some with a 3×2 mask) and asked for the proposals round (round 10).
- Meaning of the buttons, stated by the owner: «Sí, fes-ho» = agreement with the proposal / the first option, nothing else requested.

## Round 10 (2026-11-10, artifact `docs/history/ronda10.html`, 11 points, all answered)
- K1 counting game on **6×4 with a 3×2 mask** (horizontal + vertical, 22 positions). The owner added: note in the TODO that we must see whether the 2×2 mask is more "easy-going and keep-it-simple".
- K2 one sheet for all the questions; K3 accept the scarcity of squares at level 1; K4 answer key as a shuffled game script; K5 printable score track; K6 four fixed sheets per level, codes `CO1-…`, `CO2-…`: all approved.
- F1 **single sheet with the seven friezes** (not the two-sheet layout: "massa barroc, té massa informació, un alumne no tindrà ganes de jugar-hi perquè li semblarà inassumible"). Lesson for future proposals: the owner judges a sheet by how approachable it looks to a pupil.
- F2 mask with a notch that reveals the isometry: approved. F3 motifs: approved, **but figurative ones are preferred if they keep all the mathematical properties** → boot, flag, sailboat, duck, with measured asymmetry. F4 error kinds and F5 answer key: approved. Codes became `SAN-BOT1`, `SAN-BOT2`, … (one sheet per code) instead of `SAN-F1/F2`.

## Physical test of the v4 mask (2026-11-10) and angle fix
- The owner cut the printed 110 mm mask by hand: the **3 mm bars between holes tore**. Decision: keep two models — default **one single big hole** (no bars); optional **6 mm bars** (to be offered by the teacher builder site). Applied to WODB and to the counting game.
- **Outer margins of the mask 60 % larger** (frame 15 → 24 mm), same window. Consequence the owner was warned about: only 1 mm of paper remains above/below the mask at the extreme rows.
- **★ 40 % larger and centred in its corner.**
- Angles (ANG): same scale in every cell, larger sector, no vertex dot (see `CLAUDE.md` §4.5). Third time the owner had to ask for consistent angle drawings: do not reintroduce per-cell scaling.
- Sanefa mask: the owner chose the 60 % larger frame too (12 → 19 mm, card 54 mm), knowing that only 3 mm of paper remain below the last frieze.
- Standing instruction: always open a pull request when changes are pushed.

## Round 11 — Pinta per sumes (2026-11-10, artifact `docs/history/ronda11.html`, 8 points, all answered)
- P1 sheet 10×10 (pictures 9×9) by default, 8×8 as an option; P2 plain 2×2 mask and one rule per picture (no orientations); P3 base rules sum even / multiple of 3 / multiple of 5; P5 repeated numbers accepted (never inside one position); P6 answer sheet with empty grids; E1 teacher editor; E2 three example sheets: all approved.
- P4 **No** to existential rules: "ens quedem només amb les regles de suma".

## 2026-11-10 (evening) — example drawings and builder
- Pinta per sumes examples corrected by the owner: π with equal legs; PIN-C = little man (instead of a star that "did not look like a star"), arrow with a 1-pixel shaft, cat with two eyes and one nose. Lesson: he checks every drawing pixel by pixel; keep bitmaps symmetric and unambiguous.
- The owner ordered the WODB builder ("lloc per construir fulls i plantilles pròpies") directly, without a proposals round; built with the options of `CLAUDE.md` §4.6. Not yet reviewed by him.
- Round 12 (laser cutter + 3D printer brainstorming) published as a review artifact; see `TODO.md`.

## 2026-11-11 — work done while the owner reviews round 12 (chosen by him in an option dialog)
- Counting game with the 2×2 mask built as levels `CS1`/`CS2` next to `CO1`/`CO2`, so that he can compare; no decision yet on which stays.
- Builder: "Omple sol" keeps the cells already placed and names the positions that cannot be completed.
- One verification command: `node tools/check.js`.
- Documentation tidied (`TODO.md` rewritten).
- Note: the published site showed an old `PIN-C.pdf` after PR 6 was merged; `main` had the new file, so it was a cache/deploy delay on the owner's side (the cloud session cannot reach the published site).

## 2026-11-11 — the Sanefa mask cannot be cut by hand
- The owner printed the boot mask: "com podrà un ésser humà retallar el forat que marca aquesta bota?" Claude had flagged the problem (TODO) but shipped the design anyway. Lesson: **every mask must be checked for hand-cutting before it is proposed** — count the cuts, the shortest cut and the inward corners at real size; a hole with cuts under about 5 mm or with inward corners is a laser-only part.
- Round 13 published with the measurements and six alternatives (see `TODO.md`). No decision yet.
