# CLAUDE.md — Reixeta (cold-start brief for Claude)

Read this file first, then `TODO.md`, then `docs/DECISIONS.md` and `docs/GAMES.md`.

## 1. What this project is

**Reixeta** is a collection of **printable** maths/logic games for Catalan secondary school (ESO, Batxillerat) built on one physical device:

- **Full 1 (F1)**: an A4 sheet (always A4, never A5) with an m×n grid of square cells. Each cell holds content: a number, a fraction, a letter, a drawing. WODB uses 5 columns × 4 rows of 40 mm cells (until 2026-11-09 it was 10 × 5 of 26 mm; the owner found 36 puzzles per sheet far too many and prefers fewer cells and more sheets per topic).
- **Full 2 (F2)**: a mask (plantilla) with square holes. Placed on F1, each hole shows exactly one cell. F2 can be translated, rotated 90/180/270° and flipped.

The owner is a maths teacher (degree in Mathematics, expert in algorithm design, programs in C). He designed the device and reviews every proposal himself.

The first finished deliverable is **WODB** ("Which One Doesn't Belong?", *Quin no hi encaixa?*): a 2×2-hole mask; **every** mask position on F1 (12 per sheet) must be a valid WODB (each of the 4 visible items has at least one property in which it differs from the other three). Each of the 12 topics has 4 fixed sheets (A–D) plus a generator of new sheets. The repo also holds the backlog of the other approved games (see `docs/GAMES.md`) — Reixeta is **not** only WODB.

## 2. Owner preferences (hard rules)

- Talk to the owner **in Catalan**. Markdown documents meant for an AI (like this one) are **in English**, highly technical.
- Explain git/ZIP/deploy operations in detail and give copy-paste command blocks.
- Delivery = a ZIP whose root **is the repo root** (no wrapping folder). The owner uploads it to `_uploads/` on GitHub; the workflow `.github/workflows/unzip-upload.yml` extracts and commits it. Never put files under `.github/` in a ZIP (ignored by the workflow).
- Deploy: Cloudflare Pages from GitHub (static, no build command, output dir `/`). **Never** put `[skip ci]`, `[ci skip]` or `[cf-pages-skip]` in any commit message (Cloudflare would not publish).
- **Print only.** No interactive online games for students, ever. The single allowed web tool is a static vanilla-HTML generator for teachers (`wodb/` page; future WODB builder, see TODO).
- **Black and white** whenever possible (sheets are printed and laminated). Exception: BLO (logic blocks in colour), which also exists in B/W as BLB.
- F1 must be **completely clean**: only the grid, row letters on the left (A–D), column numbers on top (1–5), and the sheet code (e.g. `NUM-A`) at the top-right corner. No title, no instructions, no control squares.
- **Originality**: the owner rejects "existing games adapted to the format". Proposals must exploit what only this F1/F2 device can do.
- Reviews: when a reply has many points (> 5–6) to decide, build a **review artifact** (cards grouped by category, short IDs, proposal + concrete question, buttons «Sí, fes-ho» / «No» / «Més endavant» / «En parlem», a comment box, answers auto-saved, an answered counter and an «Sense resposta» filter). In chat give only a 2–3 sentence summary and the link. When he writes «Revisa artifact», read his answers, reply to each point inside the same artifact and do what he approved.
- **«Sí, fes-ho» means: the owner agrees with the proposal / the first option of the question, with no further request.** Extra wishes come in the comment box.
- **Beta mode** (owner, 2026-11-10): until he says otherwise nothing old has to be preserved (generated sheet numbers, old PDFs, old masks may change freely).
- Every game has its own grid and mask (the owner expects some games with many more cells and some with a 3×2 mask); only WODB is fixed at 5×4 + 2×2.
- Verify before claiming: every property and every "all positions valid" claim in this repo was checked by computer. Keep it that way.

## 3. Repository map

```
index.html                    Home page (links to games)
README.md                     Human README (Catalan)
CLAUDE.md                     This file
TODO.md                       Prioritised next work, with exact specs
docs/DECISIONS.md             Every decision taken with the owner (rounds 1–9 + 2026-11-09 redesign)
docs/GAMES.md                 Specs of approved / parked / rejected games
docs/history/rondaN.html      The review artifacts (proposals + demos) as offline HTML (rounds 1–9 show the old 10×5 layout);
                              revisio-v4.html = review of WODB v4, ronda10.html = format proposals for the next two games
wodb/index.html               Teacher print page: F1, mask, answer keys, "Full nou"
wodb/motor.js                 Engine: reasons, drawing (SVG), deterministic two-phase generator
wodb/bancs.js                 GENERATED: item banks, properties, fixed sheets A–D
wodb/app.js, wodb/wodb.css    Page logic and print CSS (mm units, @page A4)
pdf/wodb/                     GENERATED PDFs + laser SVG + index.html
tools/wodb/                   Pipeline: Python builds bancs.js and the PDFs; Node searches and checks the sheets
```

## 4. WODB architecture

### 4.1 Data model (`wodb/bancs.js`)

`window.BANCS[code]`:

```js
{ code:'NUM', nom:'Nombres', tipus:'txt'|'fra'|'poly'|'blo'|'let'|'ang'|'dots'|'cells'|'svg',
  props:[{si:"És l'únic parell", no:"És l'únic senar"}, ...],   // property j: bit j of item.p (at most 15 properties)
  items:[{k, p, d, t?, g?}],   // k: dedupe key (no two equal keys in one window)
                               // p: bitmask of properties; d: drawing data; t: tags; g: value group
  rows:4, cols:5,              // board size (every bank)
  fulls:{A:[20 item indices, row-major], B:[…], C:[…], D:[…]},
  bn?:true,                    // BLB: blocks drawn with hatch patterns + contour width
  gen:{maxrep, cons:[{tag,min|max}], gmax, w1?, balw?, iters?, t0?, decay?, tries?} }
```

`BANCS_ORDRE = [NUM, FIG, FRA, BLO, BLB, LLE, ANG, TR5, TR4, QUA, POL, COS]`. BLB has the same items and boards as BLO.

### 4.2 Core definitions (`wodb/motor.js`)

- Window (position): 2×2 block with top-left cell (r,c); named `A1…C4` (row letter + column) = the cell under the ★ hole. 12 positions per sheet.
- Reason type = property + direction (e.g. "the only even one" and "the only odd one" are two types). Item k of a window has reason j iff bit j of `p[k]` differs from bit j of each of the other three. `uniqMask = AND_i (p_k XOR p_i)`. A property can give a reason to at most one item of a window, so every valid window shows at least 4 reason types.
- A window is **valid** iff the 4 keys are distinct and every item has ≥ 1 reason. A sheet is valid iff every window is valid.
- A sheet is **good** (`WODB.bo`) iff it is valid, no item appears twice in it, and no reason type appears in more positions than the bank's cap.
- **Balance rule** (owner decision): no reason type in more than **5/12** of the positions = 5 of 12. `maxMotiu(B, board)` measures it. Met by 10 banks; COS 6 (cap 5 was never reached in 600 heavy searches), ANG 10 (structural: 7 properties; the owner said to leave it). The cap used by "Full nou" = `objectiu(B)` = max(5, worst fixed sheet + `gen.marge`); `marge` is 1 for POL and COS, whose fixed sheets needed the heavy search of `fulls.js`, so a generated POL/COS sheet may have one reason type in one more position than the fixed ones. Figures in `tools/wodb/bal_final.json`.
- **Neighbour rule** (owner idea, 2026-11-09): when the mask moves one cell (up, down, left, right), as few reason types as possible should repeat. `repVeins(B, board)` = Σ over the 17 pairs of neighbouring positions of the number of shared reason types. It is a soft objective (minimised, never guaranteed to be 0); reducing it also reduces the number of spare reasons per position.
- Answer key (solucionari): one reason per item, the **shortest** phrase, `"És "` stripped.

### 4.3 Generator ("Full nou")

`genera(B, num)`: deterministic (mulberry32 seeded by `code-num-attempt`), up to `tries` (6) attempts of `cercaFull`:

1. Phase 1 — simulated annealing from a random board (incremental score: per-window reason coverage weight `w1`, min-reason and distinct-property bonuses, penalties for repeated items, `maxrep` per key, tag quotas `cons`, value-group cap `gmax`, balance penalty `balw` above the cap). It must end in a good sheet, otherwise the attempt fails.
2. Phase 2 — polishing: annealing restarted from that sheet with the neighbour-rule weight `adjw` on (`POLIT`); only good sheets are kept, and the result replaces phase 1 only if it repeats fewer reasons between neighbours.

Fallback if all attempts fail (not observed in the tests): `variantA` = random flip of a fixed sheet + replace each item by another one with the same property bitmask (always valid). Same number ⇒ same sheet. URL: `wodb/#NUM-4821`. **Any change to `motor.js` scoring or to a bank changes which sheet a number gives.**

The fixed sheets A–D are found by the same engine (`tools/wodb/fulls.js`: best of many seeds, penalising items already used in the previous sheets of the bank).

### 4.4 Print specification (all in mm)

| Element | Value |
|---|---|
| F1 | A4 landscape, grid 5 × 4 centred, cell 40, grid line 0.35, outer 0.8 |
| Labels | letters at x0−8, numbers at y0−5, 7 mm Arial; code 5.5 mm Courier bold at (x0+w, y0−15) right-aligned |
| Item drawing box | 28 × 28 centred in the cell (4.5 mm clearance to the hole edge) |
| Text | Arial bold; size so width ≤ 84/100 of the box (`midaText`); fractions stacked, 30/100 |
| Mask | frame 15, 4 holes of 37 (1.5 inset from each cell — owner's explicit choice — so 3 mm bars between holes), outer 110 × 110; guide marks 6 long at 15/55/95 on every edge (they continue the grid lines); ★ near the top-left hole; 2 masks per A4 portrait |
| Laser SVG | red `#FF0000` 0.01 = cut, blue `#0000FF` = score (guides), black fill = engrave (★) |
| Answer keys | A4 landscape, 4 keys per side (148.5 × 105 each) = sheets A–D of one topic, 12 rows each, 2.45 mm text; generated sheets are grouped 4 per page |

The mask must never exceed the paper: 5·40 + 2·15 = 230 ≤ 297 and 4·40 + 2·15 = 190 ≤ 210. If you change cell size, board size or frame, recheck this. All sizes are the constants `CEL, FORAT, ITEM, MARC` at the top of `wodb/app.js`.

### 4.5 Drawing rules

- Dot-grid shapes (TR5, TR4, QUA): thin shapes are excluded (`tools/wodb/thin.py`): triangles min angle ≥ 25° and isoperimetric ratio 4πA/P² ≥ 0.40; quadrilaterals ≥ 22° and ≥ 0.35. The owner rejected slivers.
- Angles (ANG): arc radius and right-angle square have a **fixed** size (11 and 8 units), whatever the ray lengths.
- Letters (LLE): custom stroke font (`letters.py`, SVG paths) so that symmetries are exact; properties are geometric only.
- Solids (COS): 3D convex hull projected orthographically; hidden edges dashed.

## 5. Pipeline (rebuild everything)

Python 3 with numpy, scipy, pypdf, playwright (`pip install scipy pypdf playwright`) + Chrome/Chromium at `/usr/bin/google-chrome` or `/usr/bin/chromium`; Node ≥ 18. Run from `tools/wodb/`:

```bash
python3 export_bancs.py    # sources + props9.py + fulls_bal.json -> ../../wodb/bancs.js
node check.js              # validity, balance, neighbour rule, "Full nou" (must print ALL OK)
python3 make_pdfs.py       # serves the repo locally, prints every sheet/mask/key to ../../pdf/wodb/
```

Board search (only when properties, pools or `motor.js` scoring change; about 10 minutes, plus about 25 for the heavy mode of POL and COS):

```bash
python3 export_bancs.py && node fulls.js && python3 export_bancs.py   # fulls.js [CODE ...] writes fulls_bal.json + bal_final.json
```

Round-9 properties (and the two POL properties added on 2026-11-10) live in `tools/wodb/props9.py` (computed from each item's data and appended as new bits). One explicit owner exception there: the letter Q does not count as a "junction" letter (`NO_JUNCTION`). See `tools/wodb/README.md` for every script.

## 6. Checklist before delivering

1. `node --check wodb/*.js`.
2. `node tools/wodb/check.js` prints `ALL OK`.
3. `make_pdfs.py` prints `solu overflow: []` and `errors []`.
4. Rasterise a few PDFs (`pdftoppm -r 50`) and look at them.
5. Delivery: either commit + push to the working branch (cloud sessions), or a ZIP from the repo root: `cd reixeta && zip -qr ../reixeta-vN.zip . -x "*.DS_Store" "*/__pycache__/*" ".git/*"` uploaded by the owner to `_uploads/`.
6. Give the owner the steps in Catalan (merge / upload, check Actions is green and Cloudflare published).
