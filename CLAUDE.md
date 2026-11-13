# CLAUDE.md — Reixeta (cold-start brief for Claude)

Read this file first, then `TODO.md`, then `docs/DECISIONS.md` and `docs/GAMES.md`.

## 1. What this project is

**Reixeta** is a collection of **printable** maths/logic games for Catalan secondary school (ESO, Batxillerat) built on one physical device:

- **Full 1 (F1)**: an A4 sheet (always A4, never A5) with an m×n grid of square cells. Each cell holds content: a number, a fraction, a letter, a drawing. WODB uses 5 columns × 4 rows of 40 mm cells (until 2026-11-09 it was 10 × 5 of 26 mm; the owner found 36 puzzles per sheet far too many and prefers fewer cells and more sheets per topic).
- **Full 2 (F2)**: a mask (plantilla) with square holes. Placed on F1, each hole shows exactly one cell. F2 can be translated, rotated 90/180/270° and flipped.

The owner is a maths teacher (degree in Mathematics, expert in algorithm design, programs in C). He designed the device and reviews every proposal himself.

Built: **WODB** (§4), the **counting game** (§7), **Sanefa trencada** (§8), **Pinta per sumes** (§9), the **Cardano grille** (§11), **dice and events** (§12) and **the sonar** (§13). Every rectangular mask is made by folding and one scissor cut (§10). The first finished deliverable is **WODB** ("Which One Doesn't Belong?", *Quin no hi encaixa?*): a 2×2-hole mask; **every** mask position on F1 (12 per sheet) must be a valid WODB (each of the 4 visible items has at least one property in which it differs from the other three). Each of the 12 topics has 4 fixed sheets (A–D) plus a generator of new sheets. The repo also holds the backlog of the other approved games (see `docs/GAMES.md`) — Reixeta is **not** only WODB.

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
                              ronda14 = Cardano grille proposals + review of another AI's 23 proposals (answered and built on 2026-11-13, see DECISIONS)
pinta/                        Pinta per sumes: index.html (teacher editor), motor.js (rules, solver, URL codec, example drawings), app.js, pinta.css
comptar/                      Counting game: index.html, motor.js (engine), fulls.js (GENERATED fixed sheets), app.js, comptar.css
sanefa/                       Sanefa trencada: index.html, motor.js (engine, sheets are generated on the fly), app.js, sanefa.css
cardano/                      The Cardano grille: index.html, motor.js (grille, messages, families generator), app.js, cardano.css (§11)
daus/                         Dice and events: index.html, motor.js (events, hole outlines, probabilities), app.js, daus.css (§12)
sonar/                        The sonar: index.html, motor.js, app.js, sonar.css (§13)
comu/plec.js                  Shared by every mask page: fold-and-one-cut instructions (drawings + the simulation that proves them), §10
wodb/index.html               Teacher print page: F1, mask, answer keys, "Full nou"
wodb/constructor.html (+ .js, .css)   Builder: own grid, own sheet, own mask (§4.6)
wodb/motor.js                 Engine: reasons, drawing (SVG), deterministic two-phase generator
wodb/bancs.js                 GENERATED: item banks, properties, fixed sheets A–D
wodb/app.js, wodb/wodb.css    Page logic and print CSS (mm units, @page A4)
pdf/wodb/, pdf/comptar/, pdf/sanefa/, pdf/pinta/, pdf/cardano/, pdf/daus/, pdf/sonar/   GENERATED PDFs + laser SVGs + index.html
tools/wodb/                   Pipeline: Python builds bancs.js and the PDFs; Node searches and checks the sheets
tools/comptar/, tools/sanefa/, tools/pinta/   fulls.js (comptar only), check.js, make_pdfs.py — see each README.md
tools/cardano/, tools/daus/, tools/sonar/   check.js, make_pdfs.py, README.md
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
| Item drawing box | 28 × 28 centred in the cell (4.5 mm clearance to the hole edge); ANG uses 31 × 31 (3 mm clearance, the minimum the owner accepts) |
| Text | Arial bold; size so width ≤ 84/100 of the box (`midaText`); fractions stacked, 30/100 |
| Mask | frame **24** (owner asked for margins 60 % larger than 15), outer 128 × 128; guide marks 6 long at 24/64/104 on every edge (they continue the grid lines); ★ of radius 4.9 **centred** in the top-left corner square (12, 12); 2 masks per A4 portrait, with the fold-and-cut instructions next to them (§10). Two models: **`un` (default) = one single hole of 77 × 77** (1.5 inset from the 2×2 block, no bars: the 3 mm bars of the old 4-hole mask tore when the owner cut it by hand); **`barres` = 4 holes of 34 separated by 6 mm bars**, kept as an option (page toggle, `#…/plantilla-barres`, and meant to be offered by the future builder) |
| Laser SVG | red `#FF0000` 0.01 = cut, blue `#0000FF` = score (guides), black fill = engrave (★) |
| Answer keys | A4 landscape, 4 keys per side (148.5 × 105 each) = sheets A–D of one topic, 12 rows each, 2.45 mm text; generated sheets are grouped 4 per page |

The mask must never exceed the paper: 5·40 + 2·24 = 248 ≤ 297 and 4·40 + 2·24 = 208 ≤ 210 — **only 1 mm of paper is left above/below the mask at rows A and C** (24.5 mm at the sides); the owner was told. If you change cell size, board size or frame, recheck this. All sizes are the constants `CEL, FORAT, ITEM, MARC, BARRA, ESTRELLA` at the top of `wodb/app.js`.

### 4.5 Drawing rules

- Dot-grid shapes (TR5, TR4, QUA): thin shapes are excluded (`tools/wodb/thin.py`): triangles min angle ≥ 25° and isoperimetric ratio 4πA/P² ≥ 0.40; quadrilaterals ≥ 22° and ≥ 0.35. The owner rejected slivers.
- Angles (ANG): **every cell is drawn at the same scale** (owner, twice): in a 31 mm drawing box (`caixa: 31` in the bank; 3 mm left to the hole edge) every angle has one long ray (56 units of the 100-unit box = 17.4 mm) and one short ray (40 = 12.4 mm), sector radius 24 (7.4 mm), right-angle square of side 16; the figure is only translated to centre it, never scaled (the flat angle, 96 units wide, sets the limit). No dot at the vertex (owner: it adds noise). Smaller sectors or per-cell scaling were rejected as hard to see / inconsistent.
- Letters (LLE): custom stroke font (`letters.py`, SVG paths) so that symmetries are exact; properties are geometric only.
- Solids (COS): 3D convex hull projected orthographically; hidden edges dashed.

### 4.6 Builder — `wodb/constructor.html` + `constructor.js` + `constructor.css` (round 5 J6, asked for on 2026-11-10)

Teacher tool to make **own sheets, own grids and own masks** from the 12 existing banks (custom banks stay out: not wanted since round 7).
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

Board search (only when properties, pools or `motor.js` scoring change; about 10 minutes, plus about 25 for the heavy mode of POL and COS):

```bash
python3 export_bancs.py && node fulls.js && python3 export_bancs.py   # fulls.js [CODE ...] writes fulls_bal.json + bal_final.json
```

Round-9 properties (and the two POL properties added on 2026-11-10) live in `tools/wodb/props9.py` (computed from each item's data and appended as new bits). One explicit owner exception there: the letter Q does not count as a "junction" letter (`NO_JUNCTION`). See `tools/wodb/README.md` for every script.

## 6. Checklist before delivering

1. `node tools/check.js` prints `EVERYTHING OK` (syntax of every `.js`, the game checks, the fold-and-cut check, the cache stamps and the two browser tests: builder and mask pages; `--rapid` for small samples). After editing any `.js`, `.css` or generated file run `node tools/versio.js` (the `make_pdfs.py` scripts do it themselves), otherwise the stamp check fails.
2. If you changed a single game you may run only its own `tools/<game>/check.js` (must print `ALL OK`).
3. The game's `make_pdfs.py` (run from its own `tools/<game>/` directory) prints empty overflow lists and `errors []`.
4. Rasterise a few PDFs (`pdftoppm -r 50`) and look at them.
5. Delivery: either commit + push to the working branch (cloud sessions), or a ZIP from the repo root: `cd reixeta && zip -qr ../reixeta-vN.zip . -x "*.DS_Store" "*/__pycache__/*" ".git/*"` uploaded by the owner to `_uploads/`.
6. Give the owner the steps in Catalan (merge / upload, check Actions is green and Cloudflare published).

## 7. Counting game — `comptar/` (owner's idea; format approved in round 10)

- F1: 6 columns × 4 rows of 40 mm cells, 24 **distinct** numbers; F2: 3×2 window (168 × 128 mm, frame 24, no ★), same two models as WODB: default one single hole of 117 × 77, optional six holes of 34 with 6 mm bars. The mask is used horizontally (12 positions) and vertically (10) = **22 positions**, named by the top-left visible cell + orientation (`B2 horitzontal`, `A5 vertical`). Paper check: 240 + 48 = 288 ≤ 297 (4.5 mm left), 160 + 48 = 208 ≤ 210 (1 mm left).
- Questions (`PROPS` in `comptar/motor.js`): how many primes / multiples of 3 / perfect squares are visible (answer 0–6), or "add them" = sum of the visible numbers **with the property**. 22 × 3 × 2 = 132 plays per sheet. Team rules (owner): A vs B, first to answer, +5 / −10, start at 40, first to 100.
- Levels: `CO1` numbers 2–50, `CO2` numbers 2–150. One sheet serves the three questions. A sheet is good (`COMPTAR.bo`) iff, for every question, each answer 0..kmax appears in at least `min` of the 22 positions (CO1: min 1, kmax 6/6/5 because 2–50 holds only six squares; CO2: min 2, kmax 6) and no answer appears in more than `maxrep` = 6 positions.
- **Simple variant** (the owner's "keep it simple" note, built 2026-11-11 for comparison): levels `CS1` (2–50) and `CS2` (2–150) on a 5×4 sheet with the **WODB 2×2 mask** (12 positions, answers 0–4, 72 plays, position names without orientation; thresholds min 1 / 2 for answers 0–4, `maxrep` 4). Every level carries its own geometry in `NIVELLS` (`R`, `C`, `formes`); use `posicions(niv)`, `histograma(T, niv)`, `jugades(T, niv)`. The owner has not yet chosen between CO and CS.
- `genera(niv, num)`: deterministic annealing on the three histograms (up to 8 attempts of 60 000 iterations, ~0.3–0.5 s). Fixed sheets A–D per level are stored in `comptar/fulls.js`, written by `tools/comptar/fulls.js` (best of 16 seeds).
- Answer key = **game script** (`guio(T, code, k)`): the 132 plays shuffled deterministically by sheet code, 40 per page side, two scripts printed per sheet (a third exists, k = 2). Plus a printable score track (`marcadorSVG`). Codes `CO1-A…D`, `CO2-A…D`, generated `CO1-4821`.
- `tools/comptar/fulls.js` keeps the fixed sheets of levels already present in `comptar/fulls.js` and only searches new levels (set `TOT=1` to search everything again).

## 8. Sanefa trencada — `sanefa/` (round 4 S1; format round 10; rebuilt after round 13, 2026-11-11)

- F1: **one A4 portrait sheet with the seven frieze types** (owner's explicit choice over a two-sheet layout), **8 copies** per frieze (two full periods of the longest rhythm), motif box **22 mm**, gap 4, friezes lettered A–G (order shuffled per sheet), copies numbered 1–8. Five types take one row, the two with a horizontal mirror take two rows. Each frieze has exactly **one wrong copy**.
- Orientations are 2-bit codes combined by XOR: 0 as is, 1 vertical mirror, 2 horizontal mirror, 3 half-turn. `TIPUS` (period per row): T `[0]`, V `[0,1]`, L `[0,2]`, R `[0,3]`, VR `[0,1,2,3]`, H `[0]/[2]`, VH `[0,1]/[2,3]`, each with a random global orientation and phase.
- The wrong copy shows one of the other three orientations (never a quarter turn), never in the first two columns, and must be the **only** single-copy change that yields a correct frieze of any type (`arreglos` in `motor.js`; re-verified by `tools/sanefa/check.js` with an independent definition).
- **Motifs = straight-cut shapes with the drawing inside** (round 13 P1; the first figurative motifs — boot, flag, sailboat, duck — had holes nobody can cut by hand: 7–14 cuts, shortest 0.6–2.1 mm): sail `VEL` (3 sides), cheese `FOR` (3), shed `CAS` (4), boot `BOT` (6, an L). `MOTIUS[code] = {nom, vora, pts, det}`: `pts` outline in a 0–100 box, `det` inner details (`'l'` polyline, `'c'` circle) drawn only on F1. Asymmetry is measured, not assumed: for the three frieze transforms the non-overlapping area fraction after the best translation is ≥ 0.20 (0.33 / 0.25 / 0.23 / 0.26; the weakest is the shed).
- F2 = a card with the **top-left corner clipped** (`OSCA` 8 mm). Fitting the card on a copy leaves the clipped corner at a corner that tells the orientation: ↖ as is, ↗ vertical mirror, ↙ horizontal mirror, ↘ half-turn. Pupils write that sequence for each frieze; the wrong copy breaks the rhythm. Two models (`SANEFA.targeta(motif, model, x, y, {m, marc, joc, osca, alt})`, round 13 P2):
  - **`vora` (default) = edge bite, cut with scissors**: card 52 × 30 mm (motif box + 2 · frame 15, height `ALT`) laid above the copy (below it when the motif is upside down); the bottom side of the motif lies on the card edge, so the shape is a notch of 2 cuts (sail, cheese) or 3 (shed) entered from the edge. Only for motifs with `vora:true` (convex, horizontal bottom side).
  - **`forat` = hole inside** a 52 × 52 card (0.6 mm clearance), for cutter + ruler or laser. The boot exists only in this model (a bite would need a turn inside a 5 mm step); on the `vora` page it is printed as a hole card with a note.
  - `tools/sanefa/check.js` measures every cut at real size: shortest cut ≥ 5 mm (actual minimum 6.0 mm, the shed's short wall), no inward corner in the bite models, ≥ 8 mm of card above the apex.
- Sheets are generated on the fly: `genera(motiu, num)` is deterministic; fixed sheets are numbers 1 and 2 of each motif (`SAN-VEL1`, `SAN-VEL2`, …), any number 1000–9999 is a "Full nou" (`SAN-CAS4821`). URL views: `/plantilla` (bite cards), `/plantilla-forat`, `/solu`. Answer key (A4 landscape, two per side): wrong cell (e.g. `B6`, with "fila de dalt/baix" for two-row friezes), found vs expected corner, and the correct sequence.
- Paper check (done on the real page by `make_pdfs.py`): around the card at the outermost copies there remain **2 mm at the sides**, 24.5 mm at the top and 20.5 mm at the bottom.
- Laser SVGs: `plantilla-XXX-tall-laser.svg` (hole) for the four motifs and `plantilla-XXX-vora-tall-laser.svg` for the three bite motifs. Round 12 L1: laser files are meant for 3 mm rigid material (MDF / opaque acrylic). Round 12 L3 (an "A" engraved on the front face) is postponed by the owner.
- The fold-and-cut recipe (§10) does not apply here. **Not tested on paper yet.**

## 9. Pinta per sumes — `pinta/` (round 2 A1; format round 11; themes and mazes added after round 14, 2026-11-13)

- F1: N×N values, A4 **portrait**; N = 10 with 18 mm cells (default, pictures 9×9, 81 positions) or N = 8 with 22 mm cells (pictures 7×7). F2: a small 2×2 mask (frame 14, ★ centred in the corner; default one single hole, optional four holes with 6 mm bars; 64 mm outer for N = 10). Paper check N = 10: 180 + 28 = 208 ≤ 210 (1 mm left at the sides).
- Play: at each position (named by the top-left cell, A1…I9) look at the four visible values and paint the matching cell of an answer grid if the rule holds. One sheet hides up to three pictures, one per rule, with the same mask. Existential rules ("there is a multiple of 7") were **rejected** by the owner (only thick drawings are possible).
- **Maths:** every rule "adds" in a finite abelian group: each printed value has a class per rule (`valor.c[k]`) and the rule holds at a position iff the four classes add up to the identity. The classes of the first row and first column are free and every other cell follows from the window whose bottom-right corner it is (identity for a black pixel, any other element for a white one), so **any bitmap is solvable**. Rules of one theme use independent components, so the pictures do not interfere.
- **Themes** (`TEMES`, round 14 A1; state letter in brackets):
  - `S` two-digit numbers 10–99: sum even / multiple of 3 / multiple of 5 (Z2 × Z3 × Z5; 3 candidates per class).
  - `E` integers −45…45 without 0: **the product of the four is positive** (parity of the number of negatives) / sum multiple of 3 / sum multiple of 5.
  - `F` fractions k/6 in lowest terms, k = 1…18 (1/6 … 3, integers included): **the sum is a whole number** (Z6). One picture.
  - `Q` numbers 2…150 of the form 2^a·3^b·5^c: **the product is a perfect square** (three parities at once, Z2³). One picture. Pupils are expected to factor, not to multiply.
- Values repeat on the sheet (accepted) but never inside one mask position (`resol` retries with new random free classes, up to 300 attempts; `comprova` re-derives the pictures). `T` is a matrix of value objects `{s}` or `{f:[num,den]}`.
- **Mazes** (round 14 A2): `laberint(N, seed)` = random perfect maze on the (N−1)×(N−1) positions (rooms on the odd rows/columns, 49 black cells for N = 10); black = allowed. `cami(D)` returns the unique path from A1 to the last position if the black cells of a drawing form a tree containing both, else null — **a drawing is a maze iff `cami` says so; there is no flag in the state**. The editor has a "Laberint" button per drawing; when some drawing is a maze the view "Full de laberints" (`/laberint`) appears: empty grids with E and S, the pupil moves the mask one cell at a time through positions that satisfy the rule. The key draws the path in white.
- A drawing with no black pixel is unused (its rule is not printed). State = `[theme.]N.hex1.hex2.hex3.seed` in the URL hash (`#p=…`; the theme letter is omitted for `S`); printed code = `PIN-` + 4 base-36 characters of a hash of the state. Examples (`EX`, `ORDRE_EX`): `PIN-A`, `PIN-B`, `PIN-C` (sums), `PIN-L` (three mazes), `PIN-E` (integers: +, × and ÷ signs), `PIN-F` (fractions: the digit 1), `PIN-Q` (squares inside squares). Views: editor (screen only), Full 1, mask, answer sheet, maze sheet, key.
- `tools/pinta/check.js` repaints every sheet with independent arithmetic on the printed values (real products, exact fraction sums, BigInt square test) and counts the paths of every maze by exhaustive search.
- This page is a teacher tool (click-to-paint editor); nothing is meant for pupils on screen. The new themes and the mazes are **not tested on paper**.

## 10. Fold and one cut — `comu/plec.js` (owner's idea, 2026-11-11)

Cutting a window out of the middle of a sheet by hand is hard (the scissors must be stabbed into the paper). The owner remembered an "origami + symmetry" course: fold, **one straight cut**, unfold. For our masks it takes **three folds**:

1. Cut out the outer rectangle. 2. Fold in half. 3. Fold in half again (the mask centre is where the two folded edges meet). 4. Fold the outer corner along its bisector, so that the two outer edges lie on each other. 5. One straight cut along the printed window line, from one edge of the packet to the other. Unfold.

- **Why it works:** folds 1–2 use the two mirror axes of the mask; the frame has the same width on the four sides, so the bisector of the outer corner passes through the window corner and fold 3 lays the vertical window side on the horizontal one. Condition (`PLEC.serveix`): one centred window, uniform frame, `W ≥ H`. It holds for the square masks and for the 168 × 128 mask of the counting game (there fold 3 stops before the centre and the packet is a quadrilateral).
- **Not applicable:** the `barres` models (several holes; the 2×2 one would need a fourth fold = 16 layers, the 3×2 one has no simple recipe) and the Sanefa cards (edge bite or small motif-shaped hole, §8).
- `PLEC.comprova(W,H,Wh,Hh,step)` simulates the folds point by point and returns the number of misclassified lattice points (must be 0). `PLEC.instruccions({x,y,w,h,mode,g})` returns SVG (mm, black and white) with a title, a short note and the five drawn steps, to scale, inside the box: `mode:'columna'` (upright, captions below; boxes ≥ ~35 mm wide) or `mode:'tira'` (narrow box, drawn rotated 90°, read bottom to top, captions beside). `g = {W,H,Wh,Hh,estrella:{x,y,r}|null,cols,files}`. Catalan texts are the constants `TITOL`, `INTRO`, `PASSOS`.
- **Mask pages:** with the single-hole model the masks are no longer centred: they sit at the left (WODB, CS and builder at x = 10; counting game 3×2 at x = 6; Pinta at x = 8 with a 7 mm gap) and the instructions fill the free strip at the right (column 56–86 mm wide; for the 3×2 mask a 27 mm rotated strip, the only room left). With `barres` the page is as before (centred, no instructions). The laser SVGs are unchanged.
- **Tests (centred and off-centre, 17 pages):** `tools/plec/check.js` (212 mask sizes — every one in the repo plus 200 random — checked with `comprova` and with an independent model; negative controls for non-uniform frames) and `tools/plec/prova.js` (browser: on 12 mask pages the instruction sizes equal the mask really drawn, nothing leaves its box or touches a mask, ≥ 4 mm to the paper edge, no text over a drawing, none with the bars model). Both run from `tools/check.js`.
- **Window that is not centred** (2026-11-14, the owner asked for the help "wherever it is useful"): the same recipe with the folds on the **axes of the window** instead of those of the mask — folds 1 and 2 along the two lines that halve the window, fold 3 on the 45° line through a window corner (it lays one window side on the other), one cut along the window line. The outline of the mask plays no role, so any rectangular window anywhere works (`comprovaLliure`, `serveixLliure`). Because there are no edges to match, **the fold lines must be printed on the mask**: `PLEC.marques(g, ox, oy)` draws the two axes over the frame and a 45° mark at each window corner (`g.salt` = mm at the top left without line, for the mask's text). Pass `fx, fy` (top-left corner of the window) in `g` to get the general drawings and captions (`PASSOS_L`, `INTRO_L`, `pasLliure`, `geoLliure`: the bigger part stays in front at each fold). Third layout `mode:'fila'` = steps side by side with the captions below (wide, low boxes).
- **Where the help is printed:** WODB, counting game (both masks), Pinta, the builder, **the sonar** (its own `/plantilla` view with the WODB mask) and **dice masks B and G** (the two events whose mask is one rectangle; `plegable(id)` in `daus/app.js`; on those pages the mask sits at y = 10 and the steps go below it). Not on: bars models, the Cardano grille and the other dice masks (several holes, or an L / staircase hole), the Sanefa cards. The design worksheet of the grille has a two-step drawing of the classroom trick for one small hole (fold through the middle of the cell, cut half a square from the fold) — a different, unverified-on-paper trick, not `comu/plec.js`.
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

## 12. Dice and events — `daus/` (round 14 C3, another AI's proposal approved by the owner; built 2026-11-13)

Probability material rather than a puzzle: the sheet is the sample space and **each mask is an event**.

- F1 (code `DAUS`, a single sheet): A4 portrait, 6 × 6 cells of 26 mm at x0 = 27, y0 = 52, the 36 outcomes of two dice; row = first die (white die, left), column = second die (grey die, right); dice 8.5 mm, so both fit in the 20 mm hole. Only the grid and the code.
- F2: one **196 mm mask per event** (same size as the Cardano grille: cell 26, inset 3, frame 20, ★ top-left, the event letter and text on the top frame). Holes at the outcomes where the event happens; **neighbouring cells merge into one hole** (no bar), so "the first die is even" is three slots. `forats(M, cel, inset)` builds the outline on an 11 × 11 grid of pieces (even index = cell, odd index = the bar between two cells) and returns `{vores, talls, curt, illes}`; `illes` must be 0 (the card stays in one piece).
- Catalogue (`SUCCESSOS`, `ORDRE` A–I; default set `PER_DEFECTE` = A–F): A first die even (18 outcomes, 12 straight cuts) · B second die 5 or 6 (12; 4) · C sum 7 (6; 24) · D doubles (6; 24) · E sum ≥ 10 (6; 8) · F some 6 (11; 6) · G first die 1 or 2 (12; 4) · H sum even (18; **72 cuts, laser only in practice**) · I first > second (15; 12). Independent pairs: AB AC AD AG AH BC BD BG BH CG DG GH; incompatible: CD CE CH DI EG.
- Use: counting holes = favourable cases; **stacking two masks = intersection**; P(Y | X) = what is seen through both ÷ holes of X. `parella(x, y)` gives the counts and the exact fractions; the page prints a question sheet (table of single events + table of every pair of the chosen events, 15 pairs for six events) and its key, plus the challenge "design a 12-hole mask independent of A" (answer: 6 holes on the even rows).
- Page: checkboxes choose the events (`#s=ABCDEF`), views `/fitxes`, `/preguntes`, `/solu`; one laser SVG per event.
- Making the masks: interior holes → cutter and ruler or laser. Masks B and G (one rectangle) also carry the fold-and-cut steps and printed fold lines (§10); the others cannot be made that way. Mask F (an L-shaped hole along the last row and column) leaves two frame strips held only at their ends: floppy in paper, fine in 3 mm material.
- Not built: the deck-of-cards variant mentioned in the proposal.
- Tests: `tools/daus/check.js`, page checks in `make_pdfs.py`. **Not tested on paper.**

## 13. The sonar — `sonar/` (round 14 F2, another AI's proposal approved by the owner; built 2026-11-13)

A game for two, the only one so far where the mask is a **query tool** between players.

- The hider has a hidden F1: A4 landscape, 5 × 4 cells of 40 mm laid out exactly like a WODB sheet (row letters A–D, column numbers 1–5, code `SO1-A` top-right) with **5 treasures** (a cut gem, 24 mm) and 15 empty cells. The seeker names a position of the **WODB 2×2 mask** (A1…C4 = the top-left visible cell, 12 positions); the hider lays the mask there and answers how many treasures are visible (0–4). The seeker deduces the five cells with as few questions as possible; then they swap roles. The mask is the WODB one — no new mask; the page has its own `/plantilla` view (same drawing, with the fold-and-cut steps) and `pdf/sonar/plantilla.pdf`.
- A hideout is a 20-bit number (bit row·5 + column). `TOTS` = the C(20,5) = **15 504** hideouts, `RESP` their 12 answers. Only **10 260** are determined by the 12 answers (4 760 come in pairs and 484 in groups of four with identical answers): sheets use determined hideouts only (`determinat`), so the seeker can always finish.
- `minim(m)` = the smallest set of positions whose answers separate m from **every** other hideout (a minimum hitting set over the "difference masks", found by trying the 4 095 subsets by size) → `{k, pos}`. **Levels by k:** `SO1` k ≤ 5 (1 678 hideouts), `SO2` k = 6–8 (6 950), `SO3` k ≥ 9 (1 632). `genera(level, id)` is deterministic: fixed sheets A–D, "Full nou" 1000–9999.
- Printed material: the hideout sheet; a **record sheet** for the seeker (A4 landscape, the rules in four lines and six small boards with a circle at each of the 12 positions — the circle of B3 is the one with cell B3 at its top-left); the key (treasures, the 12 answers, the smallest set of questions, and a note for the teacher).
- Maths for the teacher: every answer is a linear equation in 0/1 unknowns; 5⁵ = 3 125 < 15 504, so five questions cannot always be enough; a seeker that always asks the position leaving the smallest largest group needs 3–12 questions, **9.32 on average** — in practice most games use 9–11 of the 12 positions, so the game is about deducing rather than about asking very few questions (told to the owner).
- Related, and rejected by the owner in the same round: D4 "Pinta al revés" (the same counts given all at once as a solitaire puzzle). Do not turn the sonar into that.
- Paper: same as WODB (the mask leaves 1 mm above/below at rows A and C).
- Tests: `tools/sonar/check.js` recounts the whole game with an independent model (about 20 s). **Not tested on paper or with pupils.**
