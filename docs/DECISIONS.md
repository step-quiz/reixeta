# DECISIONS.md — decisions taken with the owner

Chronological. "Round" = one review artifact (`docs/history/rondaN.html`).

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
See `TODO.md` P0 for the exact list (not yet implemented at closing).
