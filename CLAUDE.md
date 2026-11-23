# CLAUDE.md — Reixeta (cold-start brief for Claude)

Read this file first, then `TODO.md`, then `docs/DECISIONS.md` and `docs/GAMES.md`.

## 1. What this project is

**Reixeta** is a collection of **printable** maths/logic games for Catalan secondary school (ESO, Batxillerat) built on one physical device:

- **Full 1 (F1)**: an A4 sheet (always A4, never A5) with an m×n grid of square cells. Each cell holds content: a number, a fraction, a letter, a drawing. WODB uses 5 columns × 4 rows of 40 mm cells (until 2026-11-09 it was 10 × 5 of 26 mm; the owner found 36 puzzles per sheet far too many and prefers fewer cells and more sheets per topic).
- **Full 2 (F2)**: a mask (plantilla) with square holes. Placed on F1, each hole shows exactly one cell. F2 can be translated, rotated 90/180/270° and flipped.

The owner is a maths teacher (degree in Mathematics, expert in algorithm design, programs in C). He designed the device and reviews every proposal himself.

Built: **WODB** (§4), the **counting game** (§7), **Pinta per sumes** (§9) and the **Cardano grille** (§11). Sanefa trencada, dice and events and the sonar were **removed** by the owner on 2026-11-17 ("no m'agraden"); their sections §8, §12, §13 are gone and the numbers are kept free so that old references stay valid. Their code is in the git history (last commit that had them: `c852bc5`). Every rectangular mask is made by folding and one scissor cut (§10). The first finished deliverable is **WODB** ("Which One Doesn't Belong?", *Quin no hi encaixa?*): a 2×2-hole mask; **every** mask position on F1 (12 per sheet) must be a valid WODB (each of the 4 visible items has at least one property in which it differs from the other three). Each of the 8 topics has 4 fixed sheets (A–D) plus a generator of new sheets. The repo also holds the backlog of the other approved games (see `docs/GAMES.md`) — Reixeta is **not** only WODB.

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
- **Always open a pull request to `main` whenever changes are pushed** (owner, 2026-11-10: standing instruction, do not ask each time). He merges it himself; a merged PR is finished, so later changes go in a new PR.
- Verify before claiming: every property and every "all positions valid" claim in this repo was checked by computer. Keep it that way.

## 3. Repository map

```
index.html                    Home page (links to games)
README.md                     Human README (Catalan)
CLAUDE.md                     This file
TODO.md                       Prioritised next work, with exact specs
docs/DECISIONS.md             Every decision taken with the owner, chronological (rounds 1–14, physical tests, corrections)
docs/GAMES.md                 Specs of approved / parked / rejected games
docs/history/rondaN.html      The review artifacts (proposals + demos) as offline HTML (rounds 1–9 show the old 10×5 layout);
                              revisio-v4.html = review of WODB v4; ronda10 = counting game + Sanefa; ronda11 = Pinta per sumes;
                              ronda12 = laser cutter + 3D printer ideas; ronda13 = how to make the Sanefa mask (both answered on 2026-11-11, see DECISIONS);
                              ronda14 = Cardano grille proposals + review of another AI's 23 proposals (answered and built on 2026-11-13, see DECISIONS);
                              ronda15 = WODB topics revision (answered and built on 2026-11-14)
pinta/                        Pinta per sumes: index.html (teacher editor), motor.js (rules, solver, URL codec, example drawings), app.js, pinta.css
comptar/                      Counting game: index.html, motor.js (engine), fulls.js (GENERATED fixed sheets), app.js, comptar.css
cardano/                      The Cardano grille: index.html, motor.js (grille, messages, families generator), app.js, cardano.css (§11)
comu/plec.js                  Shared by every mask page: two-folds-two-cuts instructions (drawings + the simulation that proves them), §10
wodb/index.html               Teacher print page: F1, mask, answer keys, "Full nou"
wodb/constructor.html (+ .js, .css)   Builder: own grid, own sheet, own mask (§4.6)
wodb/motor.js                 Engine: reasons, drawing (SVG), deterministic two-phase generator
wodb/bancs.js                 GENERATED: item banks, properties, fixed sheets A–D
wodb/app.js, wodb/wodb.css    Page logic and print CSS (mm units, @page A4)
pdf/wodb/, pdf/comptar/, pdf/pinta/, pdf/cardano/   GENERATED PDFs + laser SVGs + index.html + the two «Baixa tots els PDF» ZIPs (`tools/tots_pdf.py`)
tools/wodb/                   Pipeline: Python builds bancs.js and the PDFs; Node searches and checks the sheets
tools/comptar/, tools/pinta/   fulls.js (comptar only), check.js, make_pdfs.py — see each README.md
tools/cardano/                check.js, make_pdfs.py, README.md
tools/tots_pdf.py             Builds pdf/<game>/<game>-tots.zip and <game>-tots-sense-solucions.zip (every page landscape: portrait pages get
                              /Rotate 90; answer keys = files solucionari*/guions* + pages whose text contains «solucionari») and the
                              «Baixa tots els PDF» block with the «Inclou les solucions» checkbox on each PDF index (run by every make_pdfs.py)
tools/plec/                   check.js (maths of the fold-and-cut recipe) and prova.js (browser test of the mask pages)
tools/versio.js               Cache-busting stamps (?v=hash) on every script, stylesheet, PDF and SVG link; --check is part of tools/check.js
tools/check.js                Runs every verification of the repo in one go
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

`BANCS_ORDRE = [NUM, FIG, FRA, BLO, BLB, LIN, ANG, QUA]` (round 15, 2026-11-14: LLE, TR5, TR4, POL and COS were removed, LIN added). BLB has the same items and boards as BLO.

### 4.2 Core definitions (`wodb/motor.js`)

- Window (position): 2×2 block with top-left cell (r,c); named `A1…C4` (row letter + column) = the cell under the ★ hole. 12 positions per sheet.
- Reason type = property + direction (e.g. "the only even one" and "the only odd one" are two types). Item k of a window has reason j iff bit j of `p[k]` differs from bit j of each of the other three. `uniqMask = AND_i (p_k XOR p_i)`. A property can give a reason to at most one item of a window, so every valid window shows at least 4 reason types.
- A window is **valid** iff the 4 keys are distinct and every item has ≥ 1 reason. A sheet is valid iff every window is valid.
- A sheet is **good** (`WODB.bo`) iff it is valid, no item appears twice in it, and no reason type appears in more positions than the bank's cap.
- **Balance rule** (owner decision): no reason type in more than **5/12** of the positions = 5 of 12. `maxMotiu(B, board)` measures it. Met by 7 of the 8 banks; ANG 10 (structural: 7 properties; the owner said to leave it). The cap used by "Full nou" = `objectiu(B)` = max(5, worst fixed sheet + `gen.marge`); no bank uses `marge` since round 15 (it was for POL and COS). Figures in `tools/wodb/bal_final.json`.
- **Neighbour rule** (owner idea, 2026-11-09): when the mask moves one cell (up, down, left, right), as few reason types as possible should repeat. `repVeins(B, board)` = Σ over the 17 pairs of neighbouring positions of the number of shared reason types. It is a soft objective (minimised, never guaranteed to be 0); reducing it also reduces the number of spare reasons per position.
- Answer key (solucionari): one reason per item, the **shortest** phrase, `"És "` stripped.

### 4.3 Generator ("Full nou")

`genera(B, num)`: deterministic (mulberry32 seeded by `code-num-attempt`), up to `tries` (6) attempts of `cercaFull`:

1. Phase 1 — simulated annealing from a random board (incremental score: per-window reason coverage weight `w1`, min-reason and distinct-property bonuses, penalties for repeated items, `maxrep` per key, tag quotas `cons`, value-group cap `gmax`, balance penalty `balw` above the cap). It must end in a good sheet, otherwise the attempt fails.
2. Phase 2 — polishing: annealing restarted from that sheet with the neighbour-rule weight `adjw` on (`POLIT`); only good sheets are kept, and the result replaces phase 1 only if it repeats fewer reasons between neighbours.

Fallback if all attempts fail (3 of the 64 sheets 1000–1007 of the 8 banks, all of FIG, measured 2026-11-23): `variantA` = random flip of a fixed sheet + replace each item by another one with the same property bitmask (always valid). Same number ⇒ same sheet. URL: `wodb/#NUM-4821`. **Any change to `motor.js` scoring or to a bank changes which sheet a number gives.**

The fixed sheets A–D are found by the same engine (`tools/wodb/fulls.js`: best of many seeds, penalising items already used in the previous sheets of the bank, and rejecting a sheet whose vector pattern equals that of an earlier sheet up to a flip or a half turn — before that check ANG-D was ANG-B upside down, 2026-11-23). ANG starts at cap 10 (`MINCAP`): every valid ANG window has exactly four of the five reasons «the only acute / right / obtuse / straight / reflex angle», so some reason appears in ≥ ⌈48/5⌉ = 10 positions (proof in the maths document, §4.2).

### 4.4 Print specification (all in mm)

| Element | Value |
|---|---|
**Round 16 (2026-11-15), after the owner printed, cut and played:** every game where a mask slides over a sheet (WODB, builder, counting game, Pinta) uses `comu/plantilla.js`: `MIDES` = cell 30, hole 27 (inset 1.5), drawing 21 (ANG 23, BLO/BLB 24 via `caixa`), frame 24, bars 6, star 4.9; `guies()` puts the guides at frame + 5 mm, **left and top only** since round 19, with the grid lines extended as thin dashed lines past the guides (a dashed line between two letters / two numbers); `cos()` draws the mask: dashed fold marks at the middle of each side across the frame, which are also the guides (single-hole model: no grid ticks; laser: short score marks at the middles); grid ticks only on the bars model, the star at the top-left corner and an arrow towards the nearest hole corner that stops 3 mm before it (owner: "no facis que arribi tant a prop"); printed masks (not laser) number the four frame zones I, II (top) / III, IV (bottom), I = the star's zone, and show a solid scissors icon outside the mask, 3 mm right of its top-right corner, pointing at the top edge (round 19, icon style chosen by the owner); Pinta's mask has no star; `pagina()` = **one mask per A4 portrait page** with the fold help below (26 mm under the mask, after a horizontal rule) in the large `graella` layout of `comu/plec.js`; title «Com retallar el quadrat (rectangle) interior amb tres plecs i un sol tall». The 3×2 mask is drawn landscape with the star top-left (landscape use: the arrow marks A1 at the start; portrait use: star top-right).
| F1 | A4 landscape, grid 5 × 4 centred, cell 30 (round 16), grid line 0.35, outer 0.8; row letters (left) / column numbers (top) at frame + 5 mm from the grid, grid lines extended in dashes (round 19) (`comu/plantilla.js`), code top-right of the page |
| Labels | letters at x0−8, numbers at y0−5, 7 mm Arial; code 5.5 mm Courier bold at (x0+w, y0−15) right-aligned |
| Item drawing box | 28 × 28 centred in the cell (4.5 mm clearance to the hole edge); ANG uses 31 × 31 (3 mm clearance, the minimum the owner accepts) |
| Text | Arial bold; size so width ≤ 84/100 of the box (`midaText`); fractions stacked, 30/100 |
| Mask | frame **24** (owner asked for margins 60 % larger than 15), outer 128 × 128; guide marks 6 long at 24/64/104 on every edge (they continue the grid lines); ★ of radius 4.9 **centred** in the top-left corner square (12, 12); 2 masks per A4 portrait, with the fold-and-cut instructions next to them (§10). Two models: **`un` (default) = one single hole of 77 × 77** (1.5 inset from the 2×2 block, no bars: the 3 mm bars of the old 4-hole mask tore when the owner cut it by hand); **`barres` = 4 holes of 34 separated by 6 mm bars**, kept as an option (page toggle, `#…/plantilla-barres`, and meant to be offered by the future builder) |
| Laser SVG | red `#FF0000` 0.01 = cut, blue `#0000FF` = score (guides), black fill = engrave (★) |
| Answer keys | A4 landscape, 4 keys per side (148.5 × 105 each) = sheets A–D of one topic, 12 rows each, 2.45 mm text; generated sheets are grouped 4 per page |

The mask must never exceed the paper: 5·40 + 2·24 = 248 ≤ 297 and 4·40 + 2·24 = 208 ≤ 210 — **only 1 mm of paper is left above/below the mask at rows A and C** (24.5 mm at the sides); the owner was told. If you change cell size, board size or frame, recheck this. All sizes are the constants `CEL, FORAT, ITEM, MARC, BARRA, ESTRELLA` at the top of `wodb/app.js`.

### 4.5 Drawing rules

- Dot-grid shapes (QUA; the triangle banks TR5/TR4 were removed in round 15): thin shapes are excluded (`tools/wodb/thin.py`): triangles min angle ≥ 25° and isoperimetric ratio 4πA/P² ≥ 0.40; quadrilaterals ≥ 22° and ≥ 0.35. The owner rejected slivers.
- Angles (ANG): **every cell is drawn at the same scale** (owner, twice): in a 31 mm drawing box (`caixa: 31` in the bank; 3 mm left to the hole edge) every angle has one long ray (56 units of the 100-unit box = 17.4 mm) and one short ray (40 = 12.4 mm), sector radius 24 (7.4 mm), right-angle square of side 16; the figure is only translated to centre it, never scaled (the flat angle, 96 units wide, sets the limit). No dot at the vertex (owner: it adds noise). Smaller sectors or per-cell scaling were rejected as hard to see / inconsistent.
- Line figures (LIN, round 15): `tools/wodb/linies.py`. Invisible 3×3 grid of nodes; a figure = 1 to 3 clean strokes (segments of 1 or 2 units, h/v/diagonal; semicircles of radius ½ or 1; quarter circles of radius 1; circles of radius ½ or 1; unit squares, the 2×2 square, 1×2 rectangles), decomposed into unit pieces that meet only at nodes (no interior crossings, no tangencies, no angle under 40° between pieces at a node). Properties computed exactly in doubled integer coordinates: vertical / horizontal axis, half turn, holes = E − V + 1, right angle between two segments, two parallel segments (maximal segments, collinear ones excluded), some curve, some segment. Pool: all 1- and 2-stroke figures + 3-stroke figures with a V/H axis or half-turn symmetry (1134 items); dedupe key = congruence class (234). The owner rejected graph-theory properties (degree-3 points, drawable in one stroke): keep it to synthetic geometry.
- Logic blocks (BLO, BLB, round 15): the big block is exactly twice the small one; each block has a technical-drawing dimension under it with one number, 1 or 2 (square and triangle: side; circle: diameter; rectangle: long side). Reasons «de mida 1 / de mida 2» replace «gran / petit».
- Angles (ANG, round 15): both rays 48 units (the flat angle is 96 wide); the old long/short variant is gone (196 items).

### 4.6 Builder — `wodb/constructor.html` + `constructor.js` + `constructor.css` (round 5 J6, asked for on 2026-11-10)

Teacher tool to make **own sheets, own grids and own masks** from the 8 existing banks (custom banks stay out: not wanted since round 7).
- Grid 2–7 columns × 2–5 rows. Cell = min(40, (297 − 2·frame)/cols, (210 − 2·max(frame, 19))/rows) rounded down to 0.5 mm, so the mask always fits the paper (19 mm are needed above the grid for labels and code). Labels and drawing box scale with the cell.
- Editing: click a cell, then an item of the palette; double-click empties a cell. A circle at every mask position is green (valid), red (not valid) or grey (incomplete); clicking it lists the reasons of each of the four items (this is "part 1" of J6). Summary: valid positions, most frequent reason type vs the 5/12 limit, repeated items, empty cells.
- "Omple sol" = `WODB.cercaFull` on a copy of the bank with the chosen `rows/cols`, trying caps from max(1, ⌊5N/12⌋) upwards (3 seeds each) — the fixed sheets' cap (`objectiu`) is not used here. On a partly filled sheet it keeps the placed cells (`anneal` option `fix` = indices that may not change, `init` with −1 for free cells) and fills only the empty ones; if that fails, `impossibles()` brute-forces every position with ≤ 2 empty cells and names those that cannot be completed (e.g. regular hexagon + regular octagon share every property).
- Mask: model `un` / `barres`, frame 15 / 20 / 24 mm, ★ optional (radius = 0.2 · frame, centred in the corner); "Baixa l'SVG per al làser" downloads the cut file (red cut, blue guides, black ★).
- State in the URL hash: `#c=BANK.CxR.model.frame.star.id-id-…` (ids in base 36, `_` = empty) + optional `/full|plantilla|solu`. Printed code = `BANK-` + 4 base-36 characters of a hash of the state. Invalid sheets can still be printed (the status line warns).
- Test: `node tools/wodb/prova_constructor.js` (Playwright; set `NODE_PATH` to the global npm root if `playwright` is not found): seven bank/grid/mask combinations, validity re-checked with `WODB.valid`, paper fit, URL round trip, no JS errors.

## 5. Pipeline (rebuild everything)

Python 3 with numpy, scipy, pypdf, playwright (`pip install scipy pypdf playwright`) + Chrome/Chromium at `/usr/bin/google-chrome` or `/usr/bin/chromium`; Node ≥ 18. Run from `tools/wodb/`:

```bash
python3 export_bancs.py    # sources + props9.py + fulls_bal.json -> ../../wodb/bancs.js
node check.js              # validity, balance, neighbour rule, "Full nou" (must print ALL OK)
python3 make_pdfs.py       # serves the repo locally, prints every sheet/mask/key to ../../pdf/wodb/
```

Board search (only when properties, pools or `motor.js` scoring change; about 10 minutes, about 4 minutes in all since round 15):

```bash
python3 export_bancs.py && node fulls.js && python3 export_bancs.py   # fulls.js [CODE ...] writes fulls_bal.json + bal_final.json
```

Round-9 properties of FIG and QUA live in `tools/wodb/props9.py` (computed from each item's data and appended as new bits). One explicit owner exception there: the letter Q does not count as a "junction" letter (`NO_JUNCTION`). See `tools/wodb/README.md` for every script.

## 6. Checklist before delivering

1. `node tools/check.js` prints `EVERYTHING OK` (syntax of every `.js`, the game checks, the fold-and-cut check, the cache stamps and the two browser tests: builder and mask pages; `--rapid` for small samples). After editing any `.js`, `.css` or generated file run `node tools/versio.js` (the `make_pdfs.py` scripts do it themselves), otherwise the stamp check fails.
2. If you changed a single game you may run only its own `tools/<game>/check.js` (must print `ALL OK`).
3. The game's `make_pdfs.py` (run from its own `tools/<game>/` directory) prints empty overflow lists and `errors []`.
4. Rasterise a few PDFs (`pdftoppm -r 50`) and look at them.
5. Delivery: either commit + push to the working branch (cloud sessions), or a ZIP from the repo root: `cd reixeta && zip -qr ../reixeta-vN.zip . -x "*.DS_Store" "*/__pycache__/*" ".git/*"` uploaded by the owner to `_uploads/`.
6. Give the owner the steps in Catalan (merge / upload, check Actions is green and Cloudflare published).

## 7. Counting game — `comptar/` (owner's idea; format approved in round 10)

- F1: 6 columns × 4 rows of 30 mm cells (round 16), 24 **distinct** numbers; F2: 3×2 window (168 × 128 mm, frame 24, no ★), same two models as WODB: default one single hole of 117 × 77, optional six holes of 34 with 6 mm bars. The mask is used horizontally (12 positions) and vertically (10) = **22 positions**, named by the top-left visible cell + orientation (`B2 horitzontal`, `A5 vertical`). Paper check: 240 + 48 = 288 ≤ 297 (4.5 mm left), 160 + 48 = 208 ≤ 210 (1 mm left).
- Questions (`PROPS` in `comptar/motor.js`, round 18, 2026-11-15): how many primes / multiples of 3 / multiples of 4 / perfect squares / triangular numbers / divisors of D (D = 36 at level 1, 60 at level 2; `propsDe(niv)`) are visible, or "add them" = sum of the visible numbers **with the property**. Multiples of 5 are asked **only as a sum**. Weights: m5 10 %, each other property 15 % with "sum" chosen with probability 1/18 → about 85 % counts and 15 % sums in a script (the owner's figures; `tools/comptar/check.js` measures 15.6 %). Rejected ideas offered in the same round: "how many even numbers", "largest minus smallest".
- Levels: `CO1` numbers 2–36, `CO2` numbers 2–120 (round 18). One sheet serves every question. A sheet is good (`COMPTAR.bo`) iff, for every counted property (all but m5), each answer 0..kmax appears in at least min positions and no answer in more than maxrep; the four fixed sheets of a level have different sets of numbers.
- **Simple variant** (the owner's "keep it simple" note, built 2026-11-11 for comparison): levels `CS1` (2–36) and `CS2` (2–120) on a 5×4 sheet with the **WODB 2×2 mask** (12 positions, answers 0–4, 72 plays, position names without orientation; thresholds min 1 / 2 for answers 0–4, `maxrep` 4). Every level carries its own geometry in `NIVELLS` (`R`, `C`, `formes`); use `posicions(niv)`, `histograma(T, niv)`, `jugades(T, niv)`. The owner has not yet chosen between CO and CS.
- `genera(niv, num)`: deterministic annealing on the three histograms (up to 8 attempts of 60 000 iterations, ~0.3–0.5 s). Fixed sheets A–D per level are stored in `comptar/fulls.js`, written by `tools/comptar/fulls.js` (best of 16 seeds; a sheet is rejected if it has the same set of numbers as an earlier sheet of the level, or the same class pattern up to a flip or a half turn — before that check CO1-D was CO1-A mirrored, and CO1-C/B, CO2-C/B, CS2-C/B likewise, 2026-11-23).
- Answer key = **game script** (`guio(T, code, k)`, round 18): 40 plays per script drawn deterministically by sheet code with the weights above; every position is used before any repeats and no play repeats inside a script; two scripts printed per sheet (k = 0, 1; k = 2, 3 exist). Plus a printable score track (`marcadorSVG`). Codes `CO1-A…D`, `CO2-A…D`, generated `CO1-4821`.
- `tools/comptar/fulls.js` keeps the fixed sheets of levels already present in `comptar/fulls.js` and only searches new levels (set `TOT=1` to search everything again).

## 9. Pinta per sumes — `pinta/` (round 2 A1; format round 11; themes and mazes added after round 14, 2026-11-13)

- F1 (round 17): (h+1)×(w+1) values, A4 **portrait**, at most 8 × 8 and not necessarily square: the sheet takes the size of its drawings (h × w, 2 ≤ h, w ≤ 7; the three drawings of a sheet share it). Cells 19 mm (`PINTA.CEL`), guides outside the 14 mm frame. F2: a small 2×2 mask (frame 14, ★ centred in the corner; default one single hole, optional four holes with 6 mm bars; 64 mm outer for N = 10). Paper check N = 10: 180 + 28 = 208 ≤ 210 (1 mm left at the sides).
- Play: at each position (named by the top-left cell, A1…I9) look at the four visible values and paint the matching cell of an answer grid if the rule holds. One sheet hides up to three pictures, one per rule, with the same mask. Existential rules ("there is a multiple of 7") were **rejected** by the owner (only thick drawings are possible).
- **Maths:** every rule "adds" in a finite abelian group: each printed value has a class per rule (`valor.c[k]`) and the rule holds at a position iff the four classes add up to the identity. The classes of the first row and first column are free and every other cell follows from the window whose bottom-right corner it is (identity for a black pixel, any other element for a white one), so **any bitmap is solvable**. Rules of one theme use independent components, so the pictures do not interfere.
- **Themes** (`TEMES`, round 14 A1; state letter in brackets):
  - `S` numbers 1–30 (round 17): sum even / multiple of 3 / multiple of 5 (Z2 × Z3 × Z5 = residue mod 30; exactly one value per class). Target distribution 2/3 on 1–15, 2/9 on 16–25, 1/9 on 26–30: `classesS` picks the free classes weighted by residue and `resol` keeps the closest of the first 16 valid sheets. Then `escurca` (2026-11-23) shortens long window sums without changing any drawing: it repeatedly adds k, −k, k… mod 30 along the column or row that best lowers (1) the number of windows summing over 60, (2) the largest window sum, (3) the distance to the target distribution (never above max(0.10, the sheet's own)). These moves are the kernel of the reading map (maths document, Corollary 4 in §2.4). Fixed sheets: at most 1 window over 60 (before: 3–20); 300 random drawing sets: windows over 60 from 28.7 % to 2.6 %. **In theme S a number may repeat inside a mask position** (about 1 position in 5): the owner accepted it (Q3), because with one value per class the no-repeat rule failed on most sheets.
  - `E` integers −45…45 without 0: **the product of the four is positive** (parity of the number of negatives) / sum multiple of 3 / sum multiple of 5.
  - `F` fractions k/6 in lowest terms, k = 1…18 (1/6 … 3, integers included): **the sum is a whole number** (Z6). One picture.
  - `Q` numbers 2…150 of the form 2^a·3^b·5^c: **the product is a perfect square** (three parities at once, Z2³). One picture. Pupils are expected to factor, not to multiply.
- Values repeat on the sheet (accepted) and, except in theme S, never inside one mask position (`resol` retries with new random free classes, up to 300 attempts; `comprova` re-derives the pictures). `T` is a matrix of value objects `{s}` or `{f:[num,den]}`.
- **Mazes** (round 14 A2): `laberint(h, w, seed)` = random perfect maze on the h × w positions (h and w odd; rooms on the odd rows/columns); black = allowed. Wilson's algorithm (loop-erased random walks, 2026-11-23): every spanning tree of the room grid is equally likely (100 352 for 7 × 7). The old depth-first search could only give 322 of them (Trémaux trees). `cami(D)` returns the unique path from A1 to the last position if the black cells of a drawing form a tree containing both, else null — **a drawing is a maze iff `cami` says so; there is no flag in the state**. The editor has a "Laberint" button per drawing; when some drawing is a maze the view "Full de laberints" (`/laberint`) appears: empty grids with E and S, the pupil moves the mask one cell at a time through positions that satisfy the rule. The key draws the path in white.
- No drawing has an empty row or column (owner, round 17): fixed drawings are checked, the editor warns, and a blank drawing is replaced by a random one (`atzar`) that also has none. State = `[theme.]hxw.hex1.hex2.hex3.seed` in the URL hash (`#p=…`; the theme letter is omitted for `S`); printed code = `PIN-` + 4 base-36 characters of a hash of the state. Examples (`EX`, `ORDRE_EX`, theme S unless said): the six 7 × 7 sheets were mixed by the owner on 2026-11-17 (artifacts https://claude.ai/artifact/Mb664Czhi7wqBdwRSrv2fN and https://claude.ai/artifact/8D5Ce6qJ4M92zQSP5ocTay): `PIN-A` umbrella / tree / ghost, `PIN-B` fish / cat / flame, `PIN-C` musical note / moon / star, `PIN-D` alien / heart / microphone, `PIN-E` smiling face / stick figure / the word «Hi», `PIN-L` pac-man / mushroom / spiral maze (only the third is a maze); umbrella, fish and note were proposed by Claude and chosen (the note retouched) by the owner; the sad face, the serious face and the thumbs up were dropped. `PIN-F` party, `PIN-G` gift / mask / crown, `PIN-H` small 5 × 5, `PIN-N` integers, `PIN-R` fractions (the digit 1), `PIN-Q` perfect squares. The owner redraws examples in the pixel-editor artifact https://claude.ai/artifact/1fx3jBpGiHRQBhj3DDj2jN (collection `dibuixos`, doc id = sheet letter + drawing number; Claude's replies in `claude`). Views: editor (screen only), Full 1, mask, answer sheet, maze sheet, key.
- `tools/pinta/check.js` repaints every sheet with independent arithmetic on the printed values (real products, exact fraction sums, BigInt square test) and counts the paths of every maze by exhaustive search.
- This page is a teacher tool (click-to-paint editor); nothing is meant for pupils on screen. The new themes and the mazes are **not tested on paper**.
- **Printing from the editor view** (bug reported by the owner on 2026-11-17: one blank page): `preparaImpressio()` (on the print button and on `beforeprint`) fills `#impressio` with the whole set of the sheet — Full 1, maze sheet if any, answer sheet, key — and hides `#pagines`; mixed orientations come from CSS named pages (`@page vertical` / `@page apaisat` in `pinta.css`). The other views print only themselves, as before. The WODB builder does the same from its editor view (sheet, mask, key; `constructor.css`).

## 10. Folding the window — `comu/plec.js` (owner's idea, 2026-11-11; since round 16: two folds and two cuts)

**Round 16 (2026-11-15), third paper test:** the recipe is now fold in half, fold in half again, and two straight cuts along the two window lines of the folded quarter (4 layers). The owner: three folds on 80 g/m² paper are too thick and give more folding errors. `comprova` / `comprovaLliure` simulate it; `serveix` accepts any centred window (portrait too, any frame); the printed fold lines of an off-centre window are the two axes only (no diagonals); 4 steps (`graella` = 2 + 2, drawings 30 % smaller than the space allows). The paragraphs below describe the original three-fold recipe.

Cutting a window out of the middle of a sheet by hand is hard (the scissors must be stabbed into the paper). The owner remembered an "origami + symmetry" course: fold, **one straight cut**, unfold. For our masks it takes **three folds**:

1. Cut out the outer rectangle. 2. Fold in half. 3. Fold in half again (the mask centre is where the two folded edges meet). 4. Fold the outer corner along its bisector, so that the two outer edges lie on each other. 5. One straight cut along the printed window line, from one edge of the packet to the other. Unfold.

- **Why it works:** folds 1–2 use the two mirror axes of the mask; the frame has the same width on the four sides, so the bisector of the outer corner passes through the window corner and fold 3 lays the vertical window side on the horizontal one. Condition (`PLEC.serveix`): one centred window, uniform frame, `W ≥ H`. It holds for the square masks and for the 168 × 128 mask of the counting game (there fold 3 stops before the centre and the packet is a quadrilateral).
- **Not applicable:** the `barres` models (several holes; the 2×2 one would need a fourth fold = 16 layers, the 3×2 one has no simple recipe).
- `PLEC.comprova(W,H,Wh,Hh,step)` simulates the folds point by point and returns the number of misclassified lattice points (must be 0). `PLEC.instruccions({x,y,w,h,mode,g})` returns SVG (mm, black and white) with a title, a short note and the five drawn steps, to scale, inside the box: `mode:'columna'` (upright, captions below; boxes ≥ ~35 mm wide) or `mode:'tira'` (narrow box, drawn rotated 90°, read bottom to top, captions beside). `g = {W,H,Wh,Hh,estrella:{x,y,r}|null,cols,files}`. Catalan texts are the constants `TITOL`, `INTRO`, `PASSOS`.
- **Mask pages:** with the single-hole model the masks are no longer centred: they sit at the left (WODB, CS and builder at x = 10; counting game 3×2 at x = 6; Pinta at x = 8 with a 7 mm gap) and the instructions fill the free strip at the right (column 56–86 mm wide; for the 3×2 mask a 27 mm rotated strip, the only room left). With `barres` the page is as before (centred, no instructions). The laser SVGs are unchanged.
- **Tests (centred and off-centre, 17 pages):** `tools/plec/check.js` (212 mask sizes — every one in the repo plus 200 random — checked with `comprova` and with an independent model; negative controls for non-uniform frames) and `tools/plec/prova.js` (browser: on 12 mask pages the instruction sizes equal the mask really drawn, nothing leaves its box or touches a mask, ≥ 4 mm to the paper edge, no text over a drawing, none with the bars model). Both run from `tools/check.js`.
- **Window that is not centred** (2026-11-14, the owner asked for the help "wherever it is useful"): the same recipe with the folds on the **axes of the window** instead of those of the mask — folds 1 and 2 along the two lines that halve the window, fold 3 on the 45° line through a window corner (it lays one window side on the other), one cut along the window line. The outline of the mask plays no role, so any rectangular window anywhere works (`comprovaLliure`, `serveixLliure`). Because there are no edges to match, **the fold lines must be printed on the mask**: `PLEC.marques(g, ox, oy)` draws the two axes over the frame and a 45° mark at each window corner (`g.salt` = mm at the top left without line, for the mask's text). Pass `fx, fy` (top-left corner of the window) in `g` to get the general drawings and captions (`PASSOS_L`, `INTRO_L`, `pasLliure`, `geoLliure`: the bigger part stays in front at each fold). Third layout `mode:'fila'` = steps side by side with the captions below (wide, low boxes).
- **Where the help is printed:** WODB, counting game (both masks), Pinta and the builder. Not on: bars models and the Cardano grille (several holes). The off-centre recipe (`comprovaLliure`, `marques`, `pasLliure`) was written for two dice masks; since the dice game was removed (2026-11-17) **no page uses it**, but it stays verified by `tools/plec/check.js` for a future builder option. The design worksheet of the grille has a two-step drawing of the classroom trick for one small hole (fold through the middle of the cell, cut half a square from the fold) — not `comu/plec.js`.
- **Limits told to the owner:** 8 paper layers (fine with 80 g paper, card untested); fold and cut **before laminating**; the creases stay (two medians, four corner diagonals). **Not tested on paper yet.**

## 11. The Cardano grille — `cardano/` (round 14 R1, R2, R3, R5, R8; built 2026-11-13)

Historical note (kept on the page as an anecdote, owner's wish for R8): Cardano's grille of 1550 is fixed (windows over an innocent-looking letter); the **turning** grille is Fleissner's (1881; Verne uses it in *Mathias Sandorf*). The game uses the turning one.

- **One grille for the whole game** (like the WODB mask): 6 × 6 cells, 9 holes `FORATS = [[0,3],[1,0],[1,5],[2,2],[2,4],[3,0],[4,2],[4,4],[5,0]]` (row, column; ★ at the top-left corner). The quarter turn `(r,c) → (c, 5−r)` splits the 36 cells into 9 orbits of 4; the grille has exactly one hole per orbit, so the four positions (start + three quarter turns **to the right**) show every cell exactly once. No two holes share a side. `POSICIONS[k]` = the nine holes of position k in reading order (row-major **on the sheet**).
- **Sizes** (`cardano/app.js`): cell 26, hole 20 (inset 3 → 6 mm bars), frame 20, card **196 mm**. The round-14 proposal said 28 / 22 / 208 mm, but a 208 mm outline cannot be printed on A4 (unprintable margins), so it was reduced; the owner was told. The grille never translates, so paper fit is trivial (7 mm left at the sides when it lies on the sheet). F1: A4 portrait, grid at x0 = 27, y0 = 52, **only the grid and the code** (no row/column labels: positions are not named in this game). There is no alignment mark on F1 (clean-sheet rule); the pupil centres the letters in the holes.
- **Making the grille:** 9 interior holes = 36 straight cuts of 20 mm with cutter and ruler, or laser (`reixeta-tall-laser.svg`: red cut, black ★ and arrow head, blue arrow arc). Fold-and-cut (§10) and scissors do not apply.
- **Three modes** on the page (`#CAR-A`, `#m=<text>`, `#CF1-A`, `#CF2-4821`, `#dissenya`; views `/reixeta`, `/solu`):
  1. **Messages** (R2, teacher tool): `xifra(text)` normalises (upper case, accents removed, Ç kept, letters and digits only, 1–36 characters), writes the text through the holes position after position and fills the rest with seeded random letters. Printed code `CAR-` + 4 base-36 characters of a hash; examples `CAR-A/B/C` (`EX`).
  2. **Four turns, four families** (R3): 36 different numbers; at every position 8 numbers belong to one family and 1 is an intruder. `genera(level, id)` is deterministic (fixed sheets A–D, "Full nou" 1000–9999). A sheet is good (`bo`) iff the intruder belongs to **no** family of the level's catalogue, every other number belongs to exactly one of the sheet's four families, and at every position only one family of the whole catalogue holds ≥ 8 of the 9 numbers. Levels: `CF1` numbers 2–150, catalogue primes / multiples of 4, 6, 7, 9, 10 (6 feasible sets of four); `CF2` numbers 2–200, plus perfect squares and multiples of 11 (45 sets). Catalogue families must not be nested. The answer key gives the family and the intruder of each position and the **sum of the four intruders** (a one-number check for the teacher).
  3. **Design your own grille** (R5): two landscape worksheets (4 × 4 with 26 mm cells, 6 × 6 with 18 mm cells): a template whose cells are numbered by orbit ("cut one cell of each number"), a blank message grid, the steps and three questions (4⁴ = 256 and 4⁹ = 262 144 grilles; why 5 × 5 fails).
- Not built (owner said no): R4 magic grille, R6 order of the permutation, R7 crib cryptanalysis. R8 (errors = holes) only as the historical note.
- Tests: `tools/cardano/check.js` (see its header) and the page checks of `make_pdfs.py`. **Not tested on paper yet.**
