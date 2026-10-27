# Prompt-Library — granskning inför gemensam nav/CSS-jämförelse

Granskningsdatum: 2026-10-27  
Scope: endast `/Users/cipher/Projects/Prompt-Library`. Ingen applikationskod, konfiguration eller git-historik ändrades. Enda nya filen är denna rapport.

## 1. Snapshot och scope

- Produktnamn enligt uppdragskontext: **AI Guidance**. Repository/appens dokumenterade och renderade namn är **Prompt Library** (`index.html:7`, `src/PromptsPage.tsx:91`).
- Git före granskning: branch `main`, upstream `origin/main`, HEAD `530b00d2abeddac75f9895cd40cd59a89db6b579`; `git status --short --branch` var `## main...origin/main` utan befintliga ändringar.
- Projektet är en Vite/React-app med en renderad sida. Inga router- eller route-filer hittades; `vite.config.ts:5-7` anger base `/prompt-library/`.
- Ingen `AGENTS.md` hittades under projektmappen. CSS-review-instruktionen `good-css` lästes; den användes som granskningslins, inte som ändringsspecifikation.
- Endast statisk läsning gjordes. Ingen renderkontroll, skärmbild eller test/build utfördes.

## 2. Filkarta och importkedja

| Område | Fil:rad | Observation |
|---|---|---|
| HTML-ingång | `index.html:2-5,17-19` | `lang="en"`, viewport-metatag och `#root`; laddar `/src/main.tsx`. |
| CSS-importordning | `src/main.tsx:3-5` | `personal.css` importeras först, därefter `site.css`, sedan `PromptsPage`. Bundlerordningen är därmed Personal UI före sidans styles. |
| Gemensam token-/komponentbas | `src/personal.css:1-4` | Lokalt inbäddade Archivo- och Space Mono-fonts och kommenterad Personal UI-version `0.2.0`; lager deklareras som `personal.tokens`, `personal.base`, `personal.components`. |
| Tokens | `src/personal.css:6-35` | Tokens sätts under `[data-personal-theme="black"]`, accent är amber på `<html>` (`index.html:2`). |
| Gemensam sidfot | `src/personal.css:79-86` | `.p-foot` är uttryckligen avsedd som gemensam sidfot; reglerna är avsiktligt o-lagerlagda. |
| Sidskal och kataloglayout | `src/site.css:1-18,28-52,114-135` | O-lagerlagd sid-CSS: maxbredd, innehållsz-index, rubriklinje, grid och filterkontroller. |
| Katalog- och dialogdetaljer | `src/site.css:138-228` | Dialog, responsiv dialog, sökfält och mobil kategori-rad. |
| Sidstruktur | `src/PromptsPage.tsx:88-156` | Ett `<main className="pl">`, dekorativ canvas, H1, filter, grid/tomt-/laddningstillstånd, en `<footer className="p-foot">` och dialog. Ingen `<header>` eller primär `<nav>` för produktsektioner. |
| Funktionell detaljvy | `src/PromptDialog.tsx:21-78` | Native `<dialog>`, stängningsknapp, kopieringsknapp och källänk. Dialogens header är lokal till detaljvyn, inte global topnav. |
| Promptkort | `src/PromptGrid.tsx:24-59` | Klickbara knappar öppnar promptdialog. Ingen navigationsmeny. |

CSS-kedjan innehåller inga `@import`-direktiv eller externa CSS-ramverk i de granskade filerna. `personal.css` definierar `@layer`, men huvuddelen av `.p-foot` och hela `site.css` ligger o-lagerlagda. Den o-lagerlagda sid-CSS:en har därför normal cascade-prioritet över lagerlagda Personal UI-regler (oavsett att Personal UI laddas först); selectors och ordning avgör mellan o-lagerlagda regler.

## 3. Topnav-tabell

**Topnav saknas.** Ingen global `<nav>`, headerlogotyp/länk eller menyknapp renderas. H1:n “PROMPT LIBRARY” är sidatitel, inte topnav; dess flex-radslut är en dekorativ linje (`src/PromptsPage.tsx:91`, `src/site.css:28-36`). Filtergruppernas kategori- och sökknappar är sidkontroller, inte navigation (`src/PromptsPage.tsx:93-130`). Därför finns inga topnav-egenskaper, active-route-markeringar, menyfunktioner eller nav-specifika brytpunkter att fylla i.

| Egenskap | Exakt värde | Villkor | Källa |
|---|---|---|---|
| Global topnav | Saknas | Alla viewportar | `src/PromptsPage.tsx:88-156` |
| H1-identitet | Text `PROMPT LIBRARY`; `font: 400 11px/1 var(--p-mono)`; `letter-spacing: .3em`; färg `var(--p-muted)`; bottenmarginal `28px` | Alla viewportar | `src/PromptsPage.tsx:91`; `src/site.css:28-36` |
| H1-linje | `::after`: flex-grow, 1px hög, `var(--p-border)`; animerad `scaleX(0→1)` | Alla viewportar, utom animation stängs vid reduce-motion | `src/site.css:32-36,105-112` |
| Meny/active/hover/focus/pressed | Ej tillämpligt för nav eftersom nav saknas | Alla viewportar | `src/PromptsPage.tsx:88-156` |
| Sticky/fixed/z-index/content-offset | Ingen nav; `.pl` har vanlig dokumentposition. Innehållspadding börjar med 48px block-start | Alla viewportar | `src/site.css:16-17` |
| Safe-area | Ingen `env(safe-area-inset-*)` i relevant CSS | Alla viewportar; statiskt sökresultat | `src/site.css:1-228` |

## 4. Botnav/sidfot-tabell

**Mobil botnav saknas.** Det finns i stället en vanlig dokumentflödes-sidfot. Den bär tre utgående länkar och en “TOP” ankarlänk och är inte `position: fixed`/`sticky`.

| Egenskap | Exakt värde | Villkor | Källa |
|---|---|---|---|
| Botnav / mobil botnav | Saknas | Alla viewportar | `src/PromptsPage.tsx:146-153`; `src/personal.css:79-86` |
| Sidfotens innehåll | Nav med `AI HUB`, `GITHUB`, `LINKEDIN`; separat `TOP ↑` till `#top` | Alla viewportar; wrappar vid behov | `src/PromptsPage.tsx:146-153` |
| Layout/alignment | `display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:14px 22px` | Alla viewportar; innehåll kan radbrytas | `src/personal.css:82-84` |
| Sidfotplacering | `margin-block-start:48px; padding-block:22px 32px; border-block-start:1px solid var(--p-border)` | Alla viewportar; statiskt flöde | `src/personal.css:82` |
| Typografi/färg | `400 11px/1 var(--p-mono)`, `letter-spacing:.2em`, `color:var(--p-muted)` | Alla viewportar | `src/personal.css:82` |
| Länkytor | Inline-block; block-padding `7px`; block-margins `-7px`; text-decoration none | Alla viewportar; faktisk boxhöjd beror på line-height/font | `src/personal.css:84` |
| Hover/focus | `:hover, :focus-visible` ändrar färgen `var(--p-text)`; transition `color var(--p-duration) ease-out` enbart `prefers-reduced-motion:no-preference` | Alla viewportar; hoverregel ej begränsad till finpekare | `src/personal.css:85-86` |
| Active/pressed | Ingen definierad active-stil i `.p-foot` | Alla viewportar | `src/personal.css:79-86` |
| Position, z-index, offset | Ingen position eller z-index; vanlig footer efter sidinnehållet; ingen fast bottenoffset | Alla viewportar | `src/PromptsPage.tsx:146-155`; `src/personal.css:82-86` |
| Safe-area | Ingen safe-area-padding | Alla viewportar; statiskt sökresultat | `src/personal.css:79-86` |

## 5. Intern alignment nav/main (bevis och avvikelser)

- **Horisontell justering:** nav saknas, så nav-till-main alignment är inte tillämplig. H1, filter, resultatgrid och sidfot är barn till samma `.pl`-skal; sidfoten får ingen egen maxbredd (`src/PromptsPage.tsx:89-153`).
- **Skal:** `.pl` har `max-width:1120px; margin:0 auto; padding:48px clamp(16px, 3vw, 32px) 72px` (`src/site.css:16`). Med global `border-box` gäller 1120px inklusive sidpadding. Det innebär 16–32px inre gutters efter viewportbredd och ledigt utrymme efter centrering på stora skärmar.
- **Sidfot:** full bredd inom `.pl`-innehållsboxen och border-top på samma gutterlinje som övrigt innehåll (`src/personal.css:82-84`). Ingen egen mobil bredd eller dockad position.
- **Main alignment:** `.pl > :not(.pl-tide, .pl-dialog)` får `position:relative; z-index:1`; `.pl` har inte positionerat stacking context. Dekorativ canvas täcker viewporten fixed med `z-index:0`, och dialog använder native dialogens top layer (`src/site.css:17-24,139-146`; native top-layer-beteende behöver renderkontroll i målwebbläsare).
- **Vertikalt offset:** toppinnehåll börjar med skalets 48px top-padding. Inget nav kräver extra offset; footer avstånd från föregående block bestäms av sidstrukturens grid/filtermarginaler plus `.p-foot` 48px top-margin. Ingen scroll-padding eller safe-area-kompensation hittades.
- **Responsiv layout:** grid 3 kolumner över 900px, två kolumner vid `max-width:900px`, en vid `max-width:600px`; filtergrupper wrappar; kategorichips blir en horisontellt scrollbar enkelrad vid 600px och under (`src/site.css:38-52,124-135,206-228`). Sidfoten wrappar flexelement naturligt (`src/personal.css:82-84`).
- **Kategorichips** har 36px minhöjd och 14px sidpadding; **footerlänkar** har endast 7px block-padding på 11px line-height; native totala kontroll-/länkytor måste verifieras visuellt/med DOM-rect och touchmålskrav. Uppskattad footerbox är cirka 25px hög utifrån CSS line-height + padding, inte ett verifierat renderresultat.

## 6. CSS-standard-tabell

| Område | Nuvarande standard/värden | Källa och jämförelseunderlag |
|---|---|---|
| Tokenkällor/version | Personal UI `0.2.0` kommenterad; tokenvärden ligger i `[data-personal-theme="black"]`; sid-CSS definierar dessutom `--ease:cubic-bezier(.16,1,.3,1)` och separat `--pl-surface:oklch(13% 0 none)` | `src/personal.css:3-35`; `src/site.css:2-5`; HTML theme/accent `index.html:2` |
| Tema/färger | bg `oklch(0% 0 none)`; surface `oklch(13% 0 none)`; raised `oklch(18% 0 none)`; text `oklch(98% 0 none)`; muted `oklch(73% 0 none)`; border `oklch(30% 0 none)`; control-border `oklch(48% 0 none)`; accent/cyan `oklch(83% .13 200)`; violet `.78 .14 300`; amber `.85 .14 85`; coral `.78 .14 25`; success `.82 .14 155`; error alias coral | `src/personal.css:9-23`; html anger `data-personal-accent="amber"` i `index.html:2` |
| Font | Archivo (lokal woff2, variable weight 100–900); Space Mono (lokal woff2, weight 400); tokens `--p-font`, `--p-mono`; html/body använder `var(--p-font)` | `src/personal.css:1-2,24-25`; `src/site.css:9` |
| Typografisk skala | body `1rem`; display `clamp(2rem, 1.5rem + 2vw, 3.5rem)`; lokal sidtext: brand 11px, chip 11px, korttitel 19px, kortblurb 14px, dialogtitel `clamp(36px,6vw,60px)`, prompt 12.5px/1.6 | `src/personal.css:28-29`; `src/site.css:28-31,102-103,126-130,151,217` |
| Spacing | `--p-gap:clamp(1rem,.75rem + 1vw,1.5rem)`; skal 48px / clamp(16px,3vw,32px) / 72px; grid gap 14px; filter gap 8px; dialog inner gap 22px/padding clamp(20px,4vw,40px) | `src/personal.css:27`; `src/site.css:16,40,124-130,147` |
| Radier/border | tokens `--p-radius:.375rem`; p-button/p-panel 6px via token; sidkort/dialog 6px explicit; chips, input, dialog-close, copy control 4px; borders en pixel | `src/personal.css:26,53-62`; `src/site.css:63,128,141,156,163,200` |
| Shadows/elevation | Inga `box-shadow`-regler hittades; dialogbackdrop är svart `rgb(0 0 0 / .72)` med `blur(6px)`; dekorkanvas lager 0, innehåll lager 1 | `src/site.css:17-24,144` |
| Kontroller/kort | Gemensam Personal UI `.p-button` har 44px minimum och `.p-field` 44px (`src/personal.css:54,62`), men sidans `.pl-chip`/sökfält är egna 36px minimum och sidans kortknapp minst 210px (`src/site.css:61-67,126-130,198-203`) | De gemensamma klasserna används inte av filterkontrollerna i `src/PromptsPage.tsx:94-129`. |
| Active/hover/focus | Kort: active `scale:.99`, focus-visible outline; hover i finpekarmedia. Filterchip: hover på alla pekartyper plus `aria-pressed=true`; focus-visible outline. Sökfält `:focus {outline:none}` och border-färg; ingen ersättande focus-visible-outline. Dialogkontroller hoverregler saknar fine-pointer-guard, focus visible för close selector men ingen särskild outline. | `src/site.css:74-94,134-135,158,164-166,205`; `src/personal.css:41` är under `.personal-ui`, men appen saknar den wrappern. |
| Motion/reduced motion | Sidans easing `cubic-bezier(.16,1,.3,1)`; kortintro .5s med 30ms steg; intro-linje 1.1s; filter .7s; dialog .55s; transients .08–.3s. Reducerad motion inaktiverar kort-, filter-, dialog-, brand- och canvas-animationer samt vissa transforms, men override-regeln lämnar ändå `.2s` transitions för kortets delar (`src/site.css:105-112,188-190`). Personal UI-komponenternas transitions är villkorade av no-preference (`src/personal.css:74-76,86`). | Vissa av sidans transitions är inte uttryckligen villkorade av `prefers-reduced-motion:no-preference`; CSS-beteendet vid `reduce` behöver kontrolleras genom beräknade stilar. |
| Tillgänglighet | `<main>`, sidfotsnav med label, aria-pressed filter, visuellt dold söketikett, knappnamn/`aria-haspopup=dialog`, live loadingstatus och dialog label/kopieringsstatus finns | `src/PromptsPage.tsx:88-129,133-144,146-153`; `src/PromptGrid.tsx:34-39`; `src/PromptDialog.tsx:34-62` |
| Lager/overrides | `personal.css` declares `personal.*` layers and generic tokens/classes; `.p-foot` deliberately unlayered. `site.css` is entirely unlayered, imports second, globally resets box sizing and defines app-specific rules. Existing `site.css` comments say styles are shared/renamed from other products, but those products are out of scope and not independently verified. | `src/main.tsx:3-4`; `src/personal.css:4,79-82`; `src/site.css:1,7-9` |

## 7. Fynd med prioritet och fil:rad

1. **P1 — Sökfältets keyboard-focusindikator raderas.** `outline:none` gäller vid `:focus` utan att lägga en motsvarande `:focus-visible`-outline; border ändras till textfärg. Det avviker från Personal UI:s focus-visible-standard men `.personal-ui`-reglerna matchar inte eftersom rotklassen saknas. `src/site.css:205`; jämför `src/personal.css:41`.
2. **P1 — Mobil/pekarkontrollernas minhöjd är 36px.** Kategorichips och sökfält är 36px, mindre än de 44px som Personal UI-komponenter själva anger; på mobil kan detta ge små touchmål. `src/site.css:126-130,198-203`; jämför `src/personal.css:54,62`.
3. **P2 — Footerlänkarna har små klick-/touchytor.** CSS ger endast 7px blockpadding runt 11px/1 text och ingen minsta blockstorlek; uppskattad höjd cirka 25px före font-/rendervariation. `src/personal.css:82-85`. Verkliga DOM-boxar och mobil användbarhet behöver renderkontroll.
4. **P2 — Hoverregler för filter/dialog följer inte finpekarmönstret.** `.pl-chip:hover`, `.pl-d-close:hover` och `.pl-d-copy:hover` ligger utanför `@media (hover:hover) and (pointer:fine)`; endast kortens hover är villkorad. På touch-webbläsare kan hover-state därför bete sig olika. `src/site.css:87-94,134,158,166`.
5. **P2 — Gemensamma Personal UI-komponentregler används inte konsekvent.** Tokenbasen erbjuder 44px `.p-button`/`.p-field`, accent focus, radii och duration, men appens filter/search/dialogkontroller duplicerar egna deklarationer, 36px höjd, 4px radius och lokala transitioner. Det ökar risken för drift mellan projekt och central jämförelse. `src/personal.css:24-30,49-76`; `src/site.css:124-135,154-169,198-205`.
6. **P2 — Reducerad rörelse hanteras ojämnt.** Animationsregler stängs av under `prefers-reduced-motion:reduce`, men ersättningsregeln sätter kvar `.2s` transitions för kortdelar; flera transitions i normalläge är inte uttryckligen inneslutna i `no-preference`. `src/site.css:66,72,79-81,105-112,130,164,202`; reducerad motion kan behöva granskning med computed styles.
7. **P3 — Dubblerade/överskrivna regler i samma fil.** `.pl-blurb` deklareras vid 103 och åter vid 194, `.pl-d-source pre` vid 173 och 217, mobile dialog pre vid 185, 218 samt 183-186; senare deklarationer ändrar max-height/font/overflow. Detta gör kaskadens avsedda slutvärde mindre uppenbart. `src/site.css:103,173-186,194,217-218`.
8. **Designmöjlighet, inte verifierat fel — ingen destinationsnav i toppen:** använd AI-Hubs kompakta brandrad som chrome-referens och överväg en liten sökikon som öppnar katalogens sökdialog. Filter fortsätter vara sidkontroller; sidfoten är vanlig footer, inte mobil botnav. `src/PromptsPage.tsx:88-156`.
9. **P3 — Safe-area och viewportdialog saknar explicit safe-area-inset.** Fullskärmsdialog vid `max-width:600px` är `height:100dvh`, men padding tar inte hänsyn till `env(safe-area-inset-*)`. Dialogen ligger inte i nav-scope men är ett mobilskal-observandum. `src/site.css:182-186`; safe-area saknas även i `.pl` och `.p-foot` (`src/site.css:16`, `src/personal.css:82-86`). Kräver verklig enhet/renderkontroll.
10. **P3 — Stylevärden blandar moderna och äldre färgfunktioner.** Tokenvärdena är `oklch()`, men accentmixar använder `color-mix(in srgb, …)` (`src/site.css:83,89,98,118`), medan gemensam Personal UI använder `color-mix(in oklch, …)` (`src/personal.css:60,69`). Detta är en standarddriftskillnad; visuellt utfall beror på browser interpolation.

## 8. Fakta för central jämförelse och öppna frågor

### Jämförbara fakta

- Produktkännetecken i den faktiskt renderade appen: 11px monospace H1 med 0.3em tracking, accenttemat amber men katalogkategorier färgade separat, central container max 1120px och 16–32px gutters.
- Navstatus: **ingen topnav, ingen bottomnav/mobil botnav**; en vanlig footer med externa länkar och topplänk finns.
- Footer ligger i samma main/container och delar inline-kanter; den är inte fixerad och har inte mobilnavens reserverade content-offset.
- Responsiva brytpunkter: 900px för grid 3→2 och 600px för 2→1, dialog fullskärm, sökfält fullbredd och kategorirad sidscroll.
- Tokenfamilj: Personal UI `0.2.0`-kommentar med Archivo/Space Mono, mörka neutrala tokens, amber accent på dokumentroten, `.375rem` standardradius, clamp-baserat gap/display och 160ms duration. Sidans egna komponentregler duplicerar vissa av dessa värden.
- Kända layoutlager: `.pl` max 1120px; fixed canvas z0; huvudinnehåll z1; native dialog top layer. Ingen nav z-index.

### Vad går att slå fast statiskt

DOM-strukturen från React-komponenterna, importordningen, klassnamn, deklarerade CSS-värden, media queries, uttryckliga hover/focus/active selectors, förekomst/frånvaro av nav/position/safe-area-deklarationer och textinnehåll är verifierade genom källkod.

### Vad kräver senare renderkontroll

Ingen visuell kontroll har gjorts. Kontrollera vid jämförelse senare: faktisk line wrap och sidfotens radbrytning på telefon/tablet, gridbredd vid 900/600px, upplevda klick-/touchytor, computed cascade efter CSS-bundling, fokusmarkering i riktiga browserkontroller, hover på hybrida pekare, dialogens native top-layer/scroll och safe-area på iOS, samt reducerad rörelse med OS-inställningen påslagen.

### Öppna frågor

- Är den framtida enhetliga navigationen avsedd att introduceras i alla sju projekt även där nuvarande produkt saknar nav, eller ska frånvaro mappas som produktvariant?
- Ska “bottom nav” i den jämförande modellen skiljas från detta projekts dokumentflödes-footer (här: ja, de är separata koncept)?
- Är Personal UI `0.2.0` den avsedda gemensamma tokenkällan för alla projekt, eller är versionstexten en lokal kopia/kommentar som behöver jämföras med varje projekts faktiska revision? Det går inte att avgöra inom detta scope.
- Ska navigerings- och kontrollernas minsta touchhöjd vara gemensam? Projektets bas `.p-button`/`.p-field` är 44px men dess faktiska katalogkontroller är 36px.


## Efterföljande designriktning

Efter den statiska inventeringen har AI-Hub identifierats som visuell referens för kompakt brandrad och Personal UI-sidfot. Inga ändringar i appkod ingår i detta tillägg. De ursprungliga tabellerna och fynden ovan dokumenterar granskat nuläge; rekommendationen nedan skiljer nuläget från föreslagen riktning. AI-Hub-projektet har en brandrad och vanlig footer, inte en global destinationsnav eller fast mobil botnav.

Topnav saknas i nulägesinventeringen. Föreslagen riktning är att använda AI-Hubs kompakta brandrad och footer som chrome-referens. En liten sökikon kan öppna promptkatalogens befintliga sökfunktion i dialog; filterchips förblir sidkontroller. Frånvaron av destinationsnav ska inte ensamt klassas som fel. Sökfältets befintliga fokus och touchmått är separata frågor.

## Implementation efter inventeringen — 2026-10-27

Alignment-ändringar är implementerade i Prompt Library efter snapshoten ovan. Nulägestabellerna beskriver fortfarande källan vid ursprunglig granskning; följande fynd har ny status:

- **Åtgärdat:** designmöjligheten för kompakt brandrad/sökikon. `PROMPT LIBRARY` är kvar som produktsignatur; en sökikon med accessible name öppnar katalogens native sökdialog. `/` öppnar samma dialog och fokuserar fältet. Enter i sökfältet lämnar dialogen öppen.
- **Åtgärdat:** inline-sökfältet är borttaget ur filterraden. Dialogen återanvänder samma `query`-state och befintliga `matches()`-index/data; kategori- och deliverable-filter ligger kvar i sidans toolbar och kombineras fortfarande med sökningen.
- **Åtgärdat:** tidigare sökfältets fokusindikator och 36px kontrollhöjd gäller inte längre; dialogfältet använder Personal UI 0.3 `.p-field` (minst 44px) och synlig `:focus-visible`-outline. Ikonknappen använder `.p-icon-button`-kontraktet med 36px ikonbox och 44px hit area.
- **Åtgärdat:** footer-länkar har minst 44px blockträffyta och hover är begränsad till finpekare. Befintliga AI HUB, GITHUB, LINKEDIN och TOP-länkar är bevarade; `#top` pekar nu på sidans `<main>`.
- **Designval, inte avvikelse:** appen får ingen destinationsnav eller fast mobil botnav. Header/main/footer fortsätter dela `.pl`-container (1120px border-box, gutter clamp 16–32px), och sidfoten ligger i dokumentflödet.

Ändrade filer: `src/PromptsPage.tsx`, `src/site.css`, `src/personal.css`, denna rapport. Den lokala Personal UI-kopian matchar nu kanoniska 0.3.0; ingen ändring gjordes i AI-Hub eller Personal-UI-källmappen. Build/test/renderkontroll kördes inte.
