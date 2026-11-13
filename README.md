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
pinta/                     Pinta per sumes (editor de dibuixos i pàgina d'impressió)
comptar/                   Joc de comptar (pàgina d'impressió, motor i fulls fixos)
sanefa/                    Sanefa trencada (pàgina d'impressió i motor)
comu/plec.js               Els passos dibuixats de «plegar i un sol tall», per a totes les pàgines de plantilla
pdf/comptar/, pdf/sanefa/, pdf/pinta/  PDF ja preparats d'aquests jocs
pdf/wodb/                  PDF ja preparats
  NUM.pdf … COS.pdf        Un PDF per tema, amb els fulls A, B, C i D (un per pàgina)
  tots-els-fulls.pdf       Els 48 fulls en un sol PDF
  plantilla-2x2.pdf        Plantilla d'un sol forat (2 per A4), amb els passos per fer la finestra plegant el paper
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

## Constructor de WODB

A `wodb/constructor.html` es pot fer un full propi a partir de qualsevol dels 12 temes.

- **Graella pròpia:** de 2 a 7 columnes i de 2 a 5 files. La casella es fa tan gran com permet el paper amb la plantilla a les posicions de les vores.
- **Full a mà o automàtic:** es clica una casella i després un element de la llista. Cada posició de la plantilla té un cercle verd si és un WODB vàlid i vermell si no; clicant-lo es veuen els motius de cada element. «Omple sol» busca un full amb totes les posicions vàlides; si ja hi has posat elements, els respecta i només omple les caselles buides, i si no és possible et diu quina posició ho impedeix.
- **Plantilla pròpia:** un sol forat o quatre forats amb barres de 6 mm, marc de 15, 20 o 24 mm, amb estrella o sense. Es pot baixar l'SVG per a la talladora làser.
- **Per imprimir:** full 1, plantilla i solucionari. L'adreça de la pàgina desa el full sencer.

## Imprimir

1. Imprimeix sempre a **mida real (100 %)**, mai amb «ajusta a la pàgina».
2. Abans d'imprimir-ne molts, fes una prova: imprimeix un full 1 i la plantilla i comprova que les caselles fan 40 mm i que el forat de la plantilla hi encaixa.
3. Solucionaris: una cara per tema, amb els fulls A–D. Es poden imprimir a doble cara.

## Plantilla

- Exterior de 128 × 128 mm (marc de 24 mm). Hi ha dos models: el d'**un sol forat** de 77 mm (per defecte; no té cap part fràgil i es talla bé a mà) i el de **4 forats** de 34 mm separats per barres de 6 mm. A les posicions de les vores, la plantilla no surt del full, però a dalt i a baix només hi queda 1 mm de paper.
- **La finestra es fa amb 3 plecs i 1 sol tall recte**, sense clavar les tisores al mig del paper. Primer es retalla el contorn; després es plega per la meitat, es torna a plegar per la meitat, es plega la cantonada de fora en diagonal (una vora exterior sobre l'altra) i es talla seguint la línia de la finestra. Cal plegar sempre cap enrere (el dibuix a fora) i fer-ho abans de plastificar. Els cinc passos surten dibuixats al costat de les plantilles d'un sol forat del WODB, del joc de comptar, de Pinta per sumes i del constructor. Són 8 capes de paper: amb paper normal va bé; amb cartolina no s'ha provat. Comprovat per ordinador (`tools/plec/`), encara no en paper. No serveix per al model de barres ni per a la plantilla de la sanefa.
- Cada dibuix ocupa com a màxim 28 mm dins de la casella de 40 mm: queda lluny de la vora del forat.
- Les marques de la vora continuen les línies de la graella: serveixen per alinear-la.
- SVG per a talladora làser: **vermell** = tall, **blau** = marcat (marques guia), **negre** = gravat (★). Unitats en mm.
- La plantilla antiga de 82 mm (caselles de 26 mm) ja no serveix.

## Joc de comptar

Un full de 6 × 4 nombres i una plantilla de 6 forats (3 × 2) que es pot posar horitzontal o vertical: 22 posicions per full. Dos equips; qui fa d'àrbitre col·loca la plantilla i pregunta quants primers, múltiples de 3 o quadrats perfectes es veuen, o quant sumen (només els que compleixen la propietat). El primer equip que respon guanya 5 punts si l'encerta i en perd 10 si falla; es comença amb 40 i guanya qui arriba a 100.

- **Nivells:** `CO1`, nombres de 2 a 50; `CO2`, de 2 a 150. Quatre fulls fixos per nivell (A–D) i «Full nou».
- **Versió senzilla:** `CS1` i `CS2` fan servir un full de 5 × 4 i la mateixa plantilla de 2 × 2 del WODB: 12 posicions, respostes de 0 a 4 i 72 jugades per full.
- **Un sol full per a totes les preguntes:** a cada full, les respostes de cada pregunta surten repartides entre les 22 posicions, de manera que no es poden endevinar. Al nivell 1 només hi ha sis quadrats perfectes, i veure'n cinc o sis alhora és poc freqüent o impossible.
- **Guió de partida:** fa de solucionari. Són 40 jugades barrejades per cara (posició, pregunta i resposta), dos guions per full.
- **Marcador:** un full a part amb una pista de 0 a 100 per a cada equip.
- **Plantilla:** 168 × 128 mm, marc de 24 mm, amb un sol forat (per defecte) o amb sis forats separats per barres de 6 mm. La posició es diu per la casella que es veu a dalt a l'esquerra.

## Sanefa trencada

Cada full (A4 vertical) té les set classes de sanefa fetes amb un mateix motiu, amb 8 còpies de 22 mm cadascuna. A cada sanefa hi ha una sola còpia que trenca el ritme: cal trobar-la.

- **Motius:** vela, formatge, caseta i bota. Són figures de pocs talls rectes i llargs, amb el dibuix a dins, perquè la targeta es pugui retallar a mà. Cap no té simetria (s'ha mesurat per ordinador), i per això qualsevol error es pot detectar.
- **Targeta (full 2):** té la cantonada de dalt a l'esquerra tallada. Per fer-la encaixar en una còpia cal deixar-la tal com és, girar-la de cara o fer-li mitja volta, i el lloc on queda la cantonada tallada ho diu: ↖ tal com és, ↗ mirall vertical, ↙ mirall horitzontal, ↘ mitja volta. Anotant-ho a cada còpia es veu el ritme i la còpia que el trenca.
- **Dos models de targeta:** amb **mossegada a la vora** (per defecte), de 52 × 30 mm, que es talla amb tisores entrant per la vora (dos talls per a la vela i el formatge, tres per a la caseta) i es posa per sobre de la còpia; i amb el **forat a dins**, de 52 × 52 mm, per a cúter i regle o talladora làser. La bota només té el model de forat. El tall més curt fa 6 mm.
- **Fulls:** dos de fixos per motiu (`SAN-VEL1`, `SAN-VEL2`…) i «Full nou» amb un número. L'error no és mai a les dues primeres còpies i és l'única manera d'arreglar la sanefa canviant una sola còpia.
- **Solucionari:** la casella errònia de cada sanefa i el ritme correcte.
- Als costats del full només queden 2 mm de paper quan la targeta és a la primera o a l'última còpia.

## La reixeta de Cardano

Una reixeta de nou forats sobre un full de 6 × 6 caselles. Es posa amb l'estrella a dalt a l'esquerra, es llegeix el que es veu pels forats i es gira un quart de volta cap a la dreta, tres vegades: en les quatre posicions es veuen les 36 caselles, cadascuna una sola vegada. La reixeta és la mateixa per a tots els fulls.

- **Missatges:** escrius un text de fins a 36 lletres o xifres i la pàgina et dona el full. El que sobra s'omple amb lletres de farciment.
- **Quatre girs, quatre famílies:** un full de 36 nombres diferents. A cada posició de la reixeta es veuen vuit nombres d'una mateixa família (primers, quadrats perfectes, múltiples de 4, 6, 7, 9, 10 o 11) i un intrús que no és de cap. Cal dir la família i l'intrús; el solucionari dona també la suma dels quatre intrusos. Dos nivells (`CF1`, nombres de 2 a 150; `CF2`, de 2 a 200), quatre fulls fixos per nivell i «Full nou» amb un número.
- **Dissenya la teva reixeta:** dos fulls de treball (4 × 4 i 6 × 6) amb les caselles numerades per grups: retallant-ne una de cada número, la reixeta sempre funciona.
- **La reixeta:** 196 mm de costat, caselles de 26 mm, forats de 20 mm separats per barres de 6 mm. Es talla amb cúter i regle (36 talls rectes de 20 mm) o amb talladora làser; amb tisores no es pot.
- **Una mica d'història:** la reixeta que va descriure Cardano el 1550 era fixa i es posava sobre una carta d'aspecte innocent. La que gira la va publicar Fleissner el 1881, i Jules Verne la fa servir a *Mathias Sandorf*.

## Pinta per sumes

Un full de 10 × 10 nombres de dues xifres (caselles de 18 mm, A4 vertical) i una plantilla de 2 × 2. A cada una de les 81 posicions se sumen els quatre nombres que es veuen i es pinta la casella corresponent d'una graella de 9 × 9 si la suma compleix la regla. El mateix full amaga fins a tres dibuixos, un per regla: la suma és parella, és múltiple de 3 o és múltiple de 5.

- **Editor:** a `pinta/` es pinten els tres dibuixos clicant i el full de nombres es genera sol. Qualsevol dibuix és possible. L'adreça de la pàgina desa els dibuixos, i cada full té un codi (per exemple `PIN-E746`).
- **Fulls d'exemple:** `PIN-A`, `PIN-B` i `PIN-C`, amb tres dibuixos cadascun.
- **Garanties:** els dibuixos es recuperen exactament dels nombres i cap nombre es repeteix dins d'una mateixa posició de la plantilla (al full sí que se'n repeteixen).
- **Per imprimir:** full de nombres, plantilla (un sol forat o quatre forats amb barres de 6 mm), full de respostes amb les graelles buides i solucionari. També hi ha la mida de 8 × 8 nombres, amb dibuixos de 7 × 7.

## Publicar amb Cloudflare Pages

Framework preset: *None*. Build command: (buit). Build output directory: `/`.

## Altres jocs del projecte

Tots els jocs aprovats estan fets (detalls a `docs/GAMES.md`).

Aparcats: *El robot llaminer* i *El dau amagat*.

## Documentació

- `CLAUDE.md`: guia tècnica per a una IA (en anglès).
- `TODO.md`: feina pendent, amb les especificacions exactes.
- `docs/DECISIONS.md`: totes les decisions preses.
- `docs/GAMES.md`: tots els jocs (fets, aprovats, aparcats i descartats).
- `docs/history/`: les propostes revisades (rondes 1 a 9), amb les demos.
- `tools/`: scripts que busquen i verifiquen els fulls i fan els PDF. `node tools/check.js` passa totes les verificacions de cop.
