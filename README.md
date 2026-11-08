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
  plantilla-2x2.pdf        Plantilla de 4 forats (2 per A4)
  plantilla-2x2-tall-laser.svg   Plantilla per a talladora làser
  solucionaris-A.pdf       Solucionaris dels 12 fulls (2 per cara)
```

## WODB

Posis on posis la plantilla de 4 forats, cadascun dels quatre elements té almenys un motiu de la llista per ser l'intrús. El solucionari dona un motiu garantit per element; n'hi pot haver d'altres, i qualsevol argument correcte val.

| Codi | Full | Posicions |
|---|---|---|
| NUM | Nombres | 36 |
| FIG | Figures geomètriques | 36 |
| FRA | Fraccions i decimals | 36 |
| BLO | Blocs lògics (color) | 36 |
| BLB | Blocs lògics (blanc i negre: trames i gruix del contorn) | 36 |
| LLE | Lletres | 36 |
| ANG | Angles | 36 |
| TR5 | Triangles (trama 5×5) | 36 |
| TR4 | Triangles (trama 4×4) | 36 |
| QUA | Quadrilàters (graella de 10×4) | 27 |
| POL | Poliòmins | 36 |
| COS | Cossos geomètrics | 36 |

**Posicions.** Es diuen per la casella que queda sota el forat marcat amb ★: de A1 a D9.

**Full nou.** A la pàgina `wodb/`, «Full nou núm.» genera un altre full amb la mateixa garantia. El codi (per exemple, `NUM-4821`) torna a generar sempre el mateix full i el mateix solucionari. També es pot obrir directament: `wodb/#NUM-4821`.

## Imprimir

1. Imprimeix sempre a **mida real (100 %)**, mai amb «ajusta a la pàgina».
2. Abans d'imprimir-ne molts, fes una prova: imprimeix un full 1 i la plantilla i comprova que les caselles fan 26 mm i que els forats (23 mm) hi encaixen.
3. Els solucionaris s'imprimeixen a doble cara, girant per la vora curta: 4 solucionaris per full.

## Plantilla

- Exterior de 104 × 104 mm (4 × 4 caselles) i 4 forats de 23 mm, amb 1,5 mm de marge respecte de cada casella.
- Les marques de la vora continuen les línies de la graella: serveixen per alinear-la.
- SVG per a talladora làser: **vermell** = tall, **blau** = marcat (marques guia), **negre** = gravat (★). Unitats en mm.

## Publicar amb Cloudflare Pages

Framework preset: *None*. Build command: (buit). Build output directory: `/`.
