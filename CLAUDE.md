# CLAUDE.md — Reixeta (cold-start brief for Claude)

Read this file first, then `TODO.md`, then `docs/DECISIONS.md` and `docs/GAMES.md`.

## 1. What this project is

**Reixeta** is a collection of **printable** maths/logic games for Catalan secondary school (ESO, Batxillerat) built on one physical device:

- **Full 1 (F1)**: an A4 sheet (always A4, never A5) with an m×n grid of square cells. Each cell holds content: a number, a fraction, a letter, a drawing. WODB uses 5 columns × 4 rows of 40 mm cells (until 2026-11-09 it was 10 × 5 of 26 mm; the owner found 36 puzzles per sheet far too many and prefers fewer cells and more sheets per topic).
- **Full 2 (F2)**: a mask (plantilla) with square holes. Placed on F1, each hole shows exactly one cell. F2 can be translated, rotated 90/180/270° and flipped.

The owner is a maths teacher (degree in Mathematics, expert in algorithm design, programs in C). He designed the device and reviews every proposal himself.

Four games are built: **WODB** (§4), the **counting game** (§7), **Sanefa trencada** (§8) and **Pinta per sumes** (§9). Every rectangular mask is made by folding and one scissor cut (§10). The first finished deliverable is **WODB** ("Which One Doesn't Belong?", *Quin no hi encaixa?*): a 2×2-hole mask; **every** mask position on F1 (12 per sheet) must be a valid WODB (each of the 4 visible items has at least one property in which it differs from the other three). Each of the 12 topics has 4 fixed sheets (A–D) plus a generator of new sheets. The repo also holds the backlog of the other approved games (see `docs/GAMES.md`) — Reixeta is **not** only WODB.

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
docs/DECISIONS.md             Every decision taken with the owner, chronological (rounds 1–13, physical tests, corrections)
docs/GAMES.md                 Specs of approved / parked / rejected games
docs/history/rondaN.html      The review artifacts (proposals + demos) as offline HTML (rounds 1–9 show the old 10×5 layout);
                              revisio-v4.html = review of WODB v4; ronda10 = counting game + Sanefa; ronda11 = Pinta per sumes;
                              ronda12 = laser cutter + 3D printer ideas; ronda13 = how to make the Sanefa mask (both answered on 2026-11-11, see DECISIONS);
                              ronda14 = Cardano grille proposals + review of another AI's 23 proposals (answers pending, see TODO)
pinta/                        Pinta per sumes: index.html (teacher editor), motor.js (rules, solver, URL codec, example drawings), app.js, pinta.css
comptar/                      Counting game: index.html, motor.js (engine), fulls.js (GENERATED fixed sheets), app.js, comptar.css
sanefa/                       Sanefa trencada: index.html, motor.js (engine, sheets are generated on the fly), app.js, sanefa.css
comu/plec.js                  Shared by every mask page: fold-and-one-cut instructions (drawings + the simulation that proves them), §10
wodb/index.html               Teacher print page: F1, mask, answer keys, "Full nou"
wodb/constructor.html (+ .js, .css)   Builder: own grid, own sheet, own mask (§4.6)
wodb/motor.js                 Engine: reasons, drawing (SVG), deterministic two-phase generator
wodb/bancs.js                 GENERATED: item banks, properties, fixed sheets A–D
wodb/app.js, wodb/wodb.css    Page logic and print CSS (mm units, @page A4)
pdf/wodb/, pdf/comptar/, pdf/sanefa/, pdf/pinta/   GENERATED PDFs + laser SVGs + index.html
tools/wodb/                   Pipeline: Python builds bancs.js and the PDFs; Node searches and checks the sheets
tools/comptar/, tools/sanefa/, tools/pinta/   fulls.js (comptar only), check.js, make_pdfs.py — see each README.md
tools/plec/                   check.js (maths of the fold-and-cut recipe) and prova.js (browser test of the mask pages)
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

1. `node tools/check.js` prints `EVERYTHING OK` (syntax of every `.js`, the four game checks, the fold-and-cut check, and the two browser tests: builder and mask pages; `--rapid` for small samples).
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

## 9. Pinta per sumes — `pinta/` (round 2 A1; format approved in round 11)

- F1: N×N two-digit numbers, A4 **portrait**; N = 10 with 18 mm cells (default, pictures 9×9, 81 positions) or N = 8 with 22 mm cells (pictures 7×7). F2: a small 2×2 mask (frame 14, ★ centred in the corner; default one single hole, optional four holes with 6 mm bars; 64 mm outer for N = 10). Paper check N = 10: 180 + 28 = 208 ≤ 210 (1 mm left at the sides).
- Play: at each position (named by the top-left cell, A1…I9) add the four visible numbers and paint the matching cell of an answer grid if the sum satisfies the rule. One sheet hides up to **three pictures, one per rule, with the same mask** (the owner approved dropping "one orientation per picture"): `REGLES` = sum even / multiple of 3 / multiple of 5. Existential rules ("there is a multiple of 7") were **rejected** by the owner after seeing that only thick drawings are possible.
- Maths: for modulus m the residues of the first row and first column are free and every other cell follows from the window whose bottom-right corner it is (target 0 for a black pixel, any non-zero residue for a white one), so **any bitmap is solvable**; the three moduli are coprime, so each cell needs a residue mod 30 = three candidates among 10–99. Numbers repeat on the sheet (accepted) but never inside one mask position (`resol` retries with new random free residues, up to 200 attempts; `comprova` re-derives the pictures).
- A drawing with no black pixel is unused (its rule is not printed). State = `N.hex1.hex2.hex3.seed` in the URL hash (`#p=…`); printed code = `PIN-` + 4 base-36 characters of a hash of the state; examples `PIN-A`, `PIN-B`, `PIN-C` (`EX` in `motor.js`). Views: editor (screen only), Full 1, mask, answer sheet (empty grids + rule above each), key.
- This page is a teacher tool (click-to-paint editor); nothing is meant for pupils on screen.

## 10. Fold and one cut — `comu/plec.js` (owner's idea, 2026-11-11)

Cutting a window out of the middle of a sheet by hand is hard (the scissors must be stabbed into the paper). The owner remembered an "origami + symmetry" course: fold, **one straight cut**, unfold. For our masks it takes **three folds**:

1. Cut out the outer rectangle. 2. Fold in half. 3. Fold in half again (the mask centre is where the two folded edges meet). 4. Fold the outer corner along its bisector, so that the two outer edges lie on each other. 5. One straight cut along the printed window line, from one edge of the packet to the other. Unfold.

- **Why it works:** folds 1–2 use the two mirror axes of the mask; the frame has the same width on the four sides, so the bisector of the outer corner passes through the window corner and fold 3 lays the vertical window side on the horizontal one. Condition (`PLEC.serveix`): one centred window, uniform frame, `W ≥ H`. It holds for the square masks and for the 168 × 128 mask of the counting game (there fold 3 stops before the centre and the packet is a quadrilateral).
- **Not applicable:** the `barres` models (several holes; the 2×2 one would need a fourth fold = 16 layers, the 3×2 one has no simple recipe) and the Sanefa cards (edge bite or small motif-shaped hole, §8).
- `PLEC.comprova(W,H,Wh,Hh,step)` simulates the folds point by point and returns the number of misclassified lattice points (must be 0). `PLEC.instruccions({x,y,w,h,mode,g})` returns SVG (mm, black and white) with a title, a short note and the five drawn steps, to scale, inside the box: `mode:'columna'` (upright, captions below; boxes ≥ ~35 mm wide) or `mode:'tira'` (narrow box, drawn rotated 90°, read bottom to top, captions beside). `g = {W,H,Wh,Hh,estrella:{x,y,r}|null,cols,files}`. Catalan texts are the constants `TITOL`, `INTRO`, `PASSOS`.
- **Mask pages:** with the single-hole model the masks are no longer centred: they sit at the left (WODB, CS and builder at x = 10; counting game 3×2 at x = 6; Pinta at x = 8 with a 7 mm gap) and the instructions fill the free strip at the right (column 56–86 mm wide; for the 3×2 mask a 27 mm rotated strip, the only room left). With `barres` the page is as before (centred, no instructions). The laser SVGs are unchanged.
- **Tests:** `tools/plec/check.js` (212 mask sizes — every one in the repo plus 200 random — checked with `comprova` and with an independent model; negative controls for non-uniform frames) and `tools/plec/prova.js` (browser: on 12 mask pages the instruction sizes equal the mask really drawn, nothing leaves its box or touches a mask, ≥ 4 mm to the paper edge, no text over a drawing, none with the bars model). Both run from `tools/check.js`.
- **Limits told to the owner:** 8 paper layers (fine with 80 g paper, card untested); fold and cut **before laminating**; the creases stay (two medians, four corner diagonals). **Not tested on paper yet.**
