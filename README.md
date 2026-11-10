# Reixeta

Jocs de matemàtiques amb dos fulls: el **full 1**, un DIN A4 amb una graella de caselles, i el **full 2** (la plantilla), amb forats que s'hi col·loquen a sobre.

Web estàtica (HTML, CSS i JavaScript purs, sense dependències), publicada amb Cloudflare Pages.

## Contingut

```
index.html                 Portada
wodb/                      WODB · Quin no hi encaixa?
  index.html               Pàgina d'impressió (full 1, plantilla, solucionaris, full nou)
  motor.js                 Motius, dibuix dels elements i generador de fulls nous
  bancs.js                 Elements, propietats i fulls fixos (A–D) dels 12 temes
  app.js, wodb.css         Interfície i estils d'impressió
pdf/wodb/                  PDF ja preparats
  NUM.pdf … COS.pdf        Un PDF per tema, amb els fulls A, B, C i D (un per pàgina)
  tots-els-fulls.pdf       Els 48 fulls en un sol PDF
  plantilla-2x2.pdf        Plantilla de 4 forats (2 per A4)
  plantilla-2x2-tall-laser.svg   Plantilla per a talladora làser
  solucionaris.pdf         Solucionaris (una cara per tema)
```

## WODB

El full 1 té 5 × 4 caselles de 40 mm: la plantilla de 4 forats hi cap en **12 posicions**, i cada posició és un enigma. Posis on posis la plantilla, cadascun dels quatre elements té almenys un motiu de la llista per ser l'intrús. El solucionari dona un motiu garantit per element; n'hi pot haver d'altres, i qualsevol argument correcte val.

Cada tema té **4 fulls fixos (A, B, C i D)**, i se'n poden generar més.

| Codi | Tema | Motiu que més surt |
|---|---|---|
| NUM | Nombres | 5 de 12 ✓ |
| FIG | Figures geomètriques | 5 de 12 ✓ |
| FRA | Fraccions | 5 de 12 ✓ |
| BLO | Blocs lògics (color) | 5 de 12 ✓ |
| BLB | Blocs lògics (blanc i negre: trames i gruix del contorn) | 5 de 12 ✓ |
| LLE | Lletres | 5 de 12 ✓ |
| ANG | Angles | 10 de 12 |
| TR5 | Triangles (trama 5×5) | 5 de 12 ✓ |
| TR4 | Triangles (trama 4×4) | 5 de 12 ✓ |
| QUA | Quadrilàters | 5 de 12 ✓ |
| POL | Poliòmins | 5 de 12 ✓ |
| COS | Cossos geomètrics | 6 de 12 |

**Regla d'equilibri.** Cap motiu no hauria de sortir en més de 5/12 de les posicions (5 de 12). Ho compleixen 10 dels 12 temes (✓); als altres s'ha reduït tant com permeten les seves propietats.

**Regla dels veïns.** Quan la plantilla es mou una casella (amunt, avall, a l'esquerra o a la dreta), s'ha buscat que es repeteixin tan pocs motius com es pugui: l'enigma del costat demana arguments diferents.

**Posicions.** Es diuen per la casella que queda sota el forat marcat amb ★: de A1 a C4.

**Full nou.** A la pàgina `wodb/`, «Full nou núm.» genera un altre full amb les mateixes garanties (totes les posicions vàlides, cap element repetit i mai menys equilibrat que els fulls fixos; només a POL i COS, que han necessitat una cerca molt llarga, un full nou pot tenir un motiu en una posició més). El codi (per exemple, `NUM-4821`) torna a generar sempre el mateix full i el mateix solucionari. També es pot obrir directament: `wodb/#NUM-4821`.

## Imprimir

1. Imprimeix sempre a **mida real (100 %)**, mai amb «ajusta a la pàgina».
2. Abans d'imprimir-ne molts, fes una prova: imprimeix un full 1 i la plantilla i comprova que les caselles fan 40 mm i que els forats (37 mm) hi encaixen.
3. Solucionaris: una cara per tema, amb els fulls A–D. Es poden imprimir a doble cara.

## Plantilla

- Exterior de 110 × 110 mm (marc de 15 mm) i 4 forats de 37 mm, amb 1,5 mm de marge respecte de cada casella. A les posicions de les vores, la plantilla no surt del full.
- Cada dibuix ocupa com a màxim 28 mm dins de la casella de 40 mm: queda lluny de la vora del forat.
- Les marques de la vora continuen les línies de la graella: serveixen per alinear-la.
- SVG per a talladora làser: **vermell** = tall, **blau** = marcat (marques guia), **negre** = gravat (★). Unitats en mm.
- La plantilla antiga de 82 mm (caselles de 26 mm) ja no serveix.

## Publicar amb Cloudflare Pages

Framework preset: *None*. Build command: (buit). Build output directory: `/`.

## Altres jocs del projecte

Reixeta no és només WODB. Jocs aprovats per fer, en aquest ordre (detalls a `docs/GAMES.md`):

1. **Sanefa trencada**: en cada sanefa hi ha una figura que no segueix la regla.
2. **Joc de comptar**: quants primers, múltiples de 3 o quadrats es veuen per la plantilla, o quant sumen (equips A contra B).
3. **Pinta per sumes**: amb un generador on el professor dibuixa els seus propis dibuixos.
4. **Generador de WODB** per al professorat.

Aparcats: *El robot llaminer* i *El dau amagat*.

## Documentació

- `CLAUDE.md`: guia tècnica per a una IA (en anglès).
- `TODO.md`: feina pendent, amb les especificacions exactes.
- `docs/DECISIONS.md`: totes les decisions preses.
- `docs/GAMES.md`: tots els jocs (fets, aprovats, aparcats i descartats).
- `docs/history/`: les propostes revisades (rondes 1 a 9), amb les demos.
- `tools/wodb/`: scripts que generen `wodb/bancs.js`, busquen els fulls i fan els PDF.
