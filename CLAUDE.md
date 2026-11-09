# CLAUDE.md — Reixeta (cold-start brief for Claude)

Read this file first, then `TODO.md`, then `docs/DECISIONS.md` and `docs/GAMES.md`.

## 1. What this project is

**Reixeta** is a collection of **printable** maths/logic games for Catalan secondary school (ESO, Batxillerat) built on one physical device:

- **Full 1 (F1)**: an A4 sheet with an m×n grid of square cells (default 10 columns × 5 rows, 26 mm cells). Each cell holds content: a number, a fraction, a letter, a drawing.
- **Full 2 (F2)**: a mask (plantilla) with square holes. Placed on F1, each hole shows exactly one cell. F2 can be translated, rotated 90/180/270° and flipped.

The owner is a maths teacher (degree in Mathematics, expert in algorithm design, programs in C). He designed the device and reviews every proposal himself.

The first finished deliverable is **WODB** ("Which One Doesn't Belong?", *Quin no hi encaixa?*): a 2×2-hole mask; **every** mask position on F1 must be a valid WODB (each of the 4 visible items has at least one property in which it differs from the other three). The repo also holds the backlog of the other approved games (see `docs/GAMES.md`) — Reixeta is **not** only WODB.

## 2. Owner preferences (hard rules)

- Talk to the owner **in Catalan**. Markdown documents meant for an AI (like this one) are **in English**, highly technical.
- Explain git/ZIP/deploy operations in detail and give copy-paste command blocks.
- Delivery = a ZIP whose root **is the repo root** (no wrapping folder). The owner uploads it to `_uploads/` on GitHub; the workflow `.github/workflows/unzip-upload.yml` extracts and commits it. Never put files under `.github/` in a ZIP (ignored by the workflow).
- Deploy: Cloudflare Pages from GitHub (static, no build command, output dir `/`). **Never** put `[skip ci]`, `[ci skip]` or `[cf-pages-skip]` in any commit message (Cloudflare would not publish).
- **Print only.** No interactive online games for students, ever. The single allowed web tool is a static vanilla-HTML generator for teachers (`wodb/` page; future WODB builder, see TODO).
- **Black and white** whenever possible (sheets are printed and laminated). Exception: BLO (logic blocks in colour), which also exists in B/W as BLB.
- F1 must be **completely clean**: only the grid, row letters on the left (A–E), column numbers on top (1–10), and the sheet code (e.g. `NUM-A`) at the top-right corner. No title, no instructions, no control squares.
- **Originality**: the owner rejects "existing games adapted to the format". Proposals must exploit what only this F1/F2 device can do.
- Reviews: when a reply has many points (> 5–6) to decide, build a **review artifact** (cards grouped by category, short IDs, proposal + concrete question, buttons «Sí, fes-ho» / «No» / «Més endavant» / «En parlem», a comment box, answers auto-saved, an answered counter and an «Sense resposta» filter). In chat give only a 2–3 sentence summary and the link. When he writes «Revisa artifact», read his answers, reply to each point inside the same artifact and do what he approved.
- Verify before claiming: every property and every "all positions valid" claim in this repo was checked by computer. Keep it that way.

## 3. Repository map

```
index.html                    Home page (links to games)
README.md                     Human README (Catalan)
CLAUDE.md                     This file
TODO.md                       Prioritised next work, with exact specs
docs/DECISIONS.md             Every decision taken with the owner (rounds 1–9)
docs/GAMES.md                 Specs of approved / parked / rejected games
docs/history/rondaN.html      The review artifacts (proposals + demos) as offline HTML
wodb/index.html               Teacher print page: F1, mask, answer keys, "Full nou"
wodb/motor.js                 Engine: reasons, drawing (SVG), deterministic generator
wodb/bancs.js                 GENERATED: item banks, properties, fixed sheets "A"
wodb/app.js, wodb/wodb.css    Page logic and print CSS (mm units, @page A4)
pdf/wodb/                     GENERATED PDFs + laser SVG + index.html
tools/wodb/                   Python pipeline that builds bancs.js and the PDFs
```

## 4. WODB architecture

### 4.1 Data model (`wodb/bancs.js`)

`window.BANCS[code]`:

```js
{ code:'NUM', nom:'Nombres', tipus:'txt'|'fra'|'poly'|'blo'|'let'|'ang'|'dots'|'cells'|'svg',
  props:[{si:"És l'únic parell", no:"És l'únic senar"}, ...],   // property j: bit j of item.p
  items:[{k, p, d, t?, g?}],   // k: dedupe key (no two equal keys in one window)
                               // p: bitmask of properties; d: drawing data; t: tags; g: value group
  fulls:{A:[board indices, row-major]},
  rows?:5, cols?:10,           // board size (QUA is 4×10, TR4 is 5×9)
  bn?:true,                    // BLB: blocks drawn with hatch patterns + contour width
  gen:{maxrep, w1, iters, decay, tries, cons:[{tag,min|max}], gmax} }
```

`BANCS_ORDRE = [NUM, FIG, FRA, BLO, BLB, LLE, ANG, TR5, TR4, QUA, POL, COS]`.

### 4.2 Core definitions (`wodb/motor.js`)

- Window (position): 2×2 block with top-left cell (r,c); named `A1…D9` (row letter + column) = the cell under the ★ hole.
- Item k of a window has reason j iff bit j of `p[k]` differs from bit j of each of the other three. `uniqMask = AND_i (p_k XOR p_i)`.
- A window is **valid** iff the 4 keys are distinct and every item has ≥ 1 reason.
- A sheet is valid iff every window is valid.
- **Balance rule** (owner decision): no reason type (property + direction) should appear in more than **5/12** of the windows (15 of 36). Met by NUM, BLO, BLB; other sheets are "as close as their properties allow" (accepted by owner; see `tools/wodb/bal_final.json`). `maxMotiu(B, board)` measures it.
- Answer key (solucionari): one reason per item, the **shortest** phrase, `"És "` stripped.

### 4.3 Generator ("Full nou")

`genera(B, num)`: deterministic (mulberry32 seeded by `code-num-attempt`). Simulated annealing (same score as Python: coverage weight `w1`, min-reason bonus, distinct-property bonus, penalties for repeated items, `maxrep` per key, tag quotas `cons`, value-group cap `gmax`, balance cap 5/12). A result is accepted only if valid and not less balanced than sheet A; otherwise fallback `variantA`: random board flip + replace each item by another item with the **same property bitmask** keeping window keys distinct (always valid, same balance as A). Same number ⇒ same sheet. URL: `wodb/#NUM-4821`.

### 4.4 Print specification (all in mm)

| Element | Value |
|---|---|
| F1 | A4 landscape, grid centred, cell 26, grid line 0.3, outer 0.7 |
| Labels | letters at x0−6, numbers at y0−4, 5.5 mm Arial; code 4.6 mm Courier bold at (x0+w, y0−12) right-aligned |
| Item drawing box | 18 × 18 centred in the cell (≥ 3 mm clearance to the hole edge) |
| Text | Arial bold; size so width ≤ 84/100 of the box (`midaText`); fractions stacked, 30/100 |
| Mask | frame 15, 4 holes of 23 (1.5 inset from each cell), outer 82 × 82; guide marks 6 long at 15/41/67 on every edge (they continue the grid lines); ★ near the top-left hole; 3 masks per A4 portrait |
| Laser SVG | red `#FF0000` 0.01 = cut, blue `#0000FF` = score (guides), black fill = engrave (★) |
| Answer keys | A4 landscape, 2 keys per side (148.5 × 210 each), 36 rows, 2.05 mm text; print duplex, flip on short edge ⇒ 4 keys per sheet |

The mask must never exceed the paper: 260 + 2·15 = 290 ≤ 297. If you change cell size or frame, recheck this.

### 4.5 Drawing rules

- Dot-grid shapes (TR5, TR4, QUA): thin shapes are excluded (`tools/wodb/thin.py`): triangles min angle ≥ 25° and isoperimetric ratio 4πA/P² ≥ 0.40; quadrilaterals ≥ 22° and ≥ 0.35. The owner rejected slivers.
- Angles (ANG): arc radius and right-angle square have a **fixed** size (11 and 8 units), whatever the ray lengths.
- Letters (LLE): custom stroke font (`letters.py`, SVG paths) so that symmetries are exact; properties are geometric only.
- Solids (COS): 3D convex hull projected orthographically; hidden edges dashed.

## 5. Pipeline (rebuild everything)

Python 3 with numpy, scipy, pypdf, playwright + Chrome. Run from `tools/wodb/`:

```bash
python3 export_bancs.py out_qua_g   # builds ../../wodb/bancs.js from sources + fulls_bal.json
python3 make_pdfs.py                # serves the repo locally, prints every sheet/mask/key to ../../pdf/wodb/
```

Board search (only when properties or pools change):

```bash
python3 balance.py CODE ITERS SEEDS          # env: W1=200 BALW=40..80 CAPN=5 CAPD=12 CONW=15 INIT= TAG=
# writes bal{TAG}_CODE.json (only if all windows valid) and balres{TAG}_CODE.json
```

Then put the chosen board into `fulls_bal.json` (keyed by code; BLB = BLO) and rerun `export_bancs.py`. See `tools/wodb/README.md` for every script.

## 6. Checklist before delivering

1. `node --check wodb/*.js`.
2. In Node: every `BANCS[c].fulls.A` is valid (`WODB.valid === WODB.wins(B).length`) and `WODB.genera(B, n)` returns a valid board for a few `n`.
3. `make_pdfs.py` prints `solu overflow: []` and `errors []`.
4. Rasterise a few PDFs (`pdftoppm -r 50`) and look at them.
5. ZIP from the repo root: `cd reixeta && zip -qr ../reixeta-vN.zip . -x "*.DS_Store" "*/__pycache__/*"`.
6. Give the owner the upload steps in Catalan (upload the ZIP to `_uploads/`, check Actions is green).
