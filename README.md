# Reixeta

Jocs de matemàtiques amb dos fulls: el **full 1**, amb una graella de 10×5 caselles, i el **full 2** (la plantilla), amb forats que s'hi col·loquen a sobre.

Web estàtica (HTML, CSS i JavaScript purs, sense dependències), publicada amb Cloudflare Pages.

## Contingut

```
index.html                 Portada
wodb/                      WODB · Quin no hi encaixa?
  index.html               Pàgina d'impressió (full 1, plantilla, solucionaris, full nou)
  motor.js                 Motius, dibuix dels elements i generador de fulls nous
  bancs.js                 Elements, propietats i fulls fixos (A) dels 12 bancs
  app.js, wodb.css         Interfície i estils d'impressió
pdf/wodb/                  PDF ja preparats
  NUM-A.pdf … COS-A.pdf    Un PDF per a cada full 1
  tots-els-fulls-A.pdf     Els 12 fulls en un sol PDF
  plantilla-2x2.pdf        Plantilla de 4 forats (3 per A4)
  plantilla-2x2-tall-laser.svg   Plantilla per a talladora làser
  solucionaris-A.pdf       Solucionaris dels 12 fulls (2 per cara)
```

## WODB

Posis on posis la plantilla de 4 forats, cadascun dels quatre elements té almenys un motiu de la llista per ser l'intrús. El solucionari dona un motiu garantit per element; n'hi pot haver d'altres, i qualsevol argument correcte val.

| Codi | Full | Posicions |
|---|---|---|
| NUM | Nombres | 36 |
| FIG | Figures geomètriques | 36 |
| FRA | Fraccions | 36 |
| BLO | Blocs lògics (color) | 36 |
| BLB | Blocs lògics (blanc i negre: trames i gruix del contorn) | 36 |
| LLE | Lletres | 36 |
| ANG | Angles | 36 |
| TR5 | Triangles (trama 5×5) | 36 |
| TR4 | Triangles (trama 4×4, graella de 9×5) | 32 |
| QUA | Quadrilàters (graella de 10×4) | 27 |
| POL | Poliòmins | 36 |
| COS | Cossos geomètrics | 36 |

**Regla d'equilibri.** Els fulls s'han buscat perquè cap motiu no domini: l'objectiu és que cap motiu no surti en més de 5/12 de les posicions (15 de 36). NUM, BLO i BLB ho compleixen; als altres fulls s'ha reduït tant com permeten les seves propietats. Els fulls nous mai no són menys equilibrats que el full A.

**Posicions.** Es diuen per la casella que queda sota el forat marcat amb ★: de A1 a D9.

**Full nou.** A la pàgina `wodb/`, «Full nou núm.» genera un altre full amb la mateixa garantia. El codi (per exemple, `NUM-4821`) torna a generar sempre el mateix full i el mateix solucionari. També es pot obrir directament: `wodb/#NUM-4821`.

## Imprimir

1. Imprimeix sempre a **mida real (100 %)**, mai amb «ajusta a la pàgina».
2. Abans d'imprimir-ne molts, fes una prova: imprimeix un full 1 i la plantilla i comprova que les caselles fan 26 mm i que els forats (23 mm) hi encaixen.
3. Els solucionaris s'imprimeixen a doble cara, girant per la vora curta: 4 solucionaris per full.

## Plantilla

- Exterior de 82 × 82 mm (marc de 15 mm) i 4 forats de 23 mm, amb 1,5 mm de marge respecte de cada casella. A les posicions de les vores, la plantilla no surt del full.
- Cada dibuix ocupa com a màxim 18 mm dins de la casella de 26 mm: queda lluny de la vora del forat.
- Les marques de la vora continuen les línies de la graella: serveixen per alinear-la.
- SVG per a talladora làser: **vermell** = tall, **blau** = marcat (marques guia), **negre** = gravat (★). Unitats en mm.

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
- `tools/wodb/`: scripts en Python que generen `wodb/bancs.js` i els PDF.
