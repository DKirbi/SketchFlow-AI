import type { ComponentSet } from 'lofi-kit';
import type { DocLocale } from '../docLocale';

type Kind = ComponentSet['kind'];

const DE: Record<Kind, string> = {
  'action-cluster':
    'Eine hostbewusste Aktionszeile. Das JSON speichert **Rollen** (`commit`, `dismiss`, `secondary`, `destructive`, `tertiary`), keine Farben. `resolveActionPresentation(role, host)` mappt jede Rolle auf eine LOFI-`variant` / `size` im Prototyp und auf UI-Pattern `color` / `rank` für den Hi-Fi-Schritt. Ein `commit` pro Cluster. Nutzen, wo sich Footer, Bulk-Leiste oder Toolbar-rechts wiederholt.',
  'upper-bar':
    'P1.1-Chrome: der Produktidentitätsstreifen. `variant: "upl"` ist die volle Unified-Production-Landscape-Leiste. Showcase-Prototypen nutzen `variant: "tool"` — eine einzeilige Identitätsleiste (Handle, Rolle, Titel) ohne Logo, Applications oder Configuration. Rechte Slots sind `ActionDescriptor`s am Host `toolbar-right`.',
  'filter-query-row':
    'P1.2.1 / P9 Suchzeile. Felder sind `FieldDescriptor`s (dasselbe Schema wie in Modal-Bodies). `applyMode: "commit"` wartet auf Search; `applyMode: "immediate"` gilt bei Änderung und behält meist nur Clear. Werte liegen nicht als Live-App-State im JSON — `onFieldChange(name, value)` und `onAction` (`search` / `clear`) zur Renderzeit binden.',
  'filter-chip-group':
    'Exklusive Statusfilter aus `LOFIChip` — nicht `LOFIButton`, nicht `LOFIFilterBar`. Der aktive Chip hat `selected` und **kein** `onClear` (kein ✕). Der gewählte Chip invertiert (Ink-Fill) und bleibt gedrückt, bis ein anderer gewählt wird; erneutes Drücken ist ein No-op. Zähler gehören ins Label (`Unmapped (14)`). Abstand `$space-8` (16px). `onAction` an die Chip-`id` binden.',
  sidebar:
    'P1.2.2-Klassifikationsleiste. UPL-Sidebars sind ein einklappbarer `LOFINavTree`. Tool- / Notifications-Sidebars ergänzen Überschrift, optionale `LOFIToggle`-Gruppierung und Aktionen über dem Baum. Auswahl ist `selectedId` plus `onSelect`. Collapse ist eine Action-Id (`collapseActionId`), kein Boolean, den das Set selbst mutiert.',
  'main-workspace':
    'P1.2.3 Feature-Interface: Breadcrumb, Titel + Badges, optionale Tabs, Body, klebriger Footer. Der Body ist ein `BodyConfig` (`form`, `table`, `copy`, `placeholder` oder `sections` mit `LOFIToggle`). Dieses Set ist die Mittelspalte eines `upl-shell`, keine ganze App.',
  'summary-card':
    'Schreibgeschützte Entitätszusammenfassung in Overview-Tabs. Titel, Crumb, Badges, Label/Wert-Paare und ein kompaktes Action-Cluster (Edit / Clone / Disable / Move / Remove). Zeilenverben bleiben `secondary` / `tertiary` / `destructive` — nie ein gefülltes Primary in einer Karten-Spalte (U5.2).',
  'list-header':
    'Tabellen-Managementleiste: Suche, Klassen-Checkboxen und ein kleines Add-Commit. Sitzt über der Datentabelle im Main Workspace, nicht in der P9-Suchzeile. Add ist Host `list-header`, damit es neben Filtern kompakt bleibt.',
  'table-chrome':
    'P2-Tabelle plus Zeilenaktionen und Leerzustand. Spalten / Zeilen sind serialisierbare Deskriptoren. Zeilenaktionen nutzen Host `row-actions` (kompakt, nie die Spalte füllend). Optionales `empty` ist ein `EmptyDescriptor` für `LOFIEmptyState`. Sortierung ist das Flag `sortable` — das Set besitzt den Sortierzustand nicht.',
  'suggestion-row':
    'Ein KI-Vorschlag unter einer aufgeklappten Mapping-Entität (P2.5 Nested Body). Externes Label, Match-%, Map (`LOFIStatefulButton` P3) und Unmap (disabled, bis dieser Vorschlag die akzeptierte Map ist). Nur ein Vorschlag pro Parent; Geschwister-Map deaktiviert nach Success. In den Expanded Body einer Demo-`LOFITable`, nicht als zweites Modal.',
  'modal-editor':
    'P5 Create-/Edit-Overlay. Titel, optionale Beschreibung, Body (`form`, `table`, `sections`, …) und ein Modal-Footer-Cluster (Dismiss links vom Commit). Ein P7 darf auf diesem Modal stapeln, wenn Save / Merge destruktiv ist — das ist ein separates `p7-confirm`, kein zweiter Editor. Footer-`id`s mit `onAction` und Felder mit `onFieldChange` binden.',
  'p7-confirm':
    'P7 reines Bestätigungs-Overlay: Titel, Nachricht, zwei Aktionen. Keine Formulare, Tabellen oder Extrafelder. `confirm.destructive` mappt auf Warning + Fill im Hi-Fi (Discard). Das einzige Overlay, das auf einem `modal-editor` stapeln darf. Dismiss und Confirm sind Pflicht-`ActionDescriptor`s am Host `p7-footer`.',
  'tool-shell':
    'Standalone-Tool-Layout (Mapping, Merge): Identitäts-Upper-Bar, optionale Commit-Suchzeile, optionale Tabs, optionale Filter-Chips, optionale Bulk-Leiste und eine Tabelle **oder** `children` für eine demoeigene aufklappbare Tabelle. Vollseiten-Demos setzen `framed: false`. Kein volles UPL.',
  'upl-shell':
    'Volles P1-Workspace: Upper Bar, optionale Modultabs, Filter-Suchzeile, Sidebar, Main Workspace. Default-Shell für `upl-management`. Verschachtelte Configs nutzen dieselben Kinds (`upper-bar`, `filter-query-row`, `sidebar`, `main-workspace`), damit die Shell zuerst steht und Body-Slots später ersetzt werden.',
};

const SL: Record<Kind, string> = {
  'action-cluster':
    'Vrstica dejanj, ki pozna gostitelja. JSON hrani **vloge** (`commit`, `dismiss`, `secondary`, `destructive`, `tertiary`), ne barv. `resolveActionPresentation(role, host)` vsako vlogo preslika v LOFI `variant` / `size` in v UI Pattern `color` / `rank` za hi-fi. En `commit` na grozd. Uporabi kjer se ponavlja noga, bulk vrstica ali desni del orodne vrstice.',
  'upper-bar':
    'P1.1 krom: identitetni pas izdelka. `variant: "upl"` je polna vrstica Unified Production Landscape. Prototipi uporabljajo `variant: "tool"` — enovrstično identiteto (handle, vloga, naslov) brez logotipa, Applications ali Configuration. Desni sloti so `ActionDescriptor`ji na gostitelju `toolbar-right`.',
  'filter-query-row':
    'P1.2.1 / P9 vrstica poizvedbe. Polja so `FieldDescriptor`ji (ista shema kot v telesu modala). `applyMode: "commit"` čaka na Search; `applyMode: "immediate"` uveljavi ob spremembi in običajno obdrži le Clear. Vrednosti niso živo stanje v JSON — ob izrisu veži `onFieldChange(name, value)` in `onAction` (`search` / `clear`).',
  'filter-chip-group':
    'Ekskluzivni statusni filtri iz `LOFIChip` — ne `LOFIButton`, ne `LOFIFilterBar`. Aktivni chip ima `selected` in **nima** `onClear` (brez ✕). Izbrani chip se obrne (ink fill) in ostane pritisnjen, dokler ni izbran drug; ponovni pritisk je no-op. Števila spadajo v oznako (`Unmapped (14)`). Razmik `$space-8` (16 px). `onAction` veži na `id` chipa.',
  sidebar:
    'P1.2.2 klasifikacijska tirnica. UPL stranske vrstice so zložljiv `LOFINavTree`. Orodne / obvestilne stranske vrstice dodajo naslov, neobvezni `LOFIToggle` group-by in dejanja nad drevesom. Izbira je `selectedId` plus `onSelect`. Strnitev je id dejanja (`collapseActionId`), ne boolean, ki ga set sam spreminja.',
  'main-workspace':
    'P1.2.3 vmesnik funkcije: drobtinica, naslov + značke, neobvezni zavihki, telo, lepljiva noga. Telo je `BodyConfig` (`form`, `table`, `copy`, `placeholder` ali `sections` z `LOFIToggle`). Ta set je srednji stolpec `upl-shell`, ne celotna aplikacija.',
  'summary-card':
    'Samo-za-branje povzetek entitete na preglednih zavihkih. Naslov, drobtinica, značke, pari oznaka/vrednost in strnjen grozd dejanj (Edit / Clone / Disable / Move / Remove). Glagoli v vrstici ostanejo `secondary` / `tertiary` / `destructive` — nikoli poln primary v stolpcu kartic (U5.2).',
  'list-header':
    'Vrstica upravljanja tabele: iskanje, potrditvena polja razredov in majhen Add commit. Živi nad podatkovno tabelo v main workspace, ne v P9 vrstici poizvedbe. Add je gostitelj `list-header`, da ostane strnjen ob filtrih.',
  'table-chrome':
    'P2 tabela plus dejanja v vrstici in prazno stanje. Stolpci / vrstice so serializirljivi deskriptorji. Dejanja v vrstici uporabljajo gostitelja `row-actions` (strnjeno, nikoli ne zapolnijo stolpca). Neobvezni `empty` je `EmptyDescriptor` za `LOFIEmptyState`. Sortiranje je zastavica `sortable` — set ne lasti stanja sortiranja.',
  'suggestion-row':
    'En predlog UI pod razširjeno entiteto mapiranja (P2.5 vgnezdeno telo). Zunanja oznaka, % ujemanja, Map (`LOFIStatefulButton` P3) in Unmap (onemogočen, dokler ta predlog ni sprejeti map). Na starša je lahko mapiran le en predlog; sorodni Map se po uspehu onemogočijo. V razširjenem telesu demo `LOFITable`, ne kot drugi modal.',
  'modal-editor':
    'P5 overlay za ustvarjanje / urejanje. Naslov, neobvezen opis, telo (`form`, `table`, `sections`, …) in grozd v nogi modala (dismiss levo od commit). P7 se sme naložiti na ta modal, ko je Save / Merge uničevalen — to je ločen `p7-confirm`, ne drugi urejevalnik. Id-je noge veži z `onAction`, polja z `onFieldChange`.',
  'p7-confirm':
    'P7 overlay samo za potrditev: naslov, sporočilo, dve dejanji. Brez obrazcev, tabel ali dodatnih polj. `confirm.destructive` se v hi-fi preslika v warning + fill (Discard). Edini overlay, ki se sme naložiti na `modal-editor`. Dismiss in confirm sta obvezna `ActionDescriptor`ja na gostitelju `p7-footer`.',
  'tool-shell':
    'Samostojna postavitev orodja (mapping, merge): identitetna zgornja vrstica, neobvezna vrstica iskanja s commit, neobvezni zavihki, neobvezni filtri-chipi, neobvezna bulk vrstica in tabela **ali** `children` za demo lastno razširljivo tabelo. Celozaslonski demoti nastavijo `framed: false`. Ni poln UPL.',
  'upl-shell':
    'Poln P1 workspace: zgornja vrstica, neobvezni moduli-zavihki, vrstica poizvedbe, stranska vrstica, main workspace. Privzeta lupina za `upl-management`. Vgnezdene konfiguracije ponovno uporabijo iste kinde (`upper-bar`, `filter-query-row`, `sidebar`, `main-workspace`), da najprej stoji lupina, reže telesa pa zamenjate pozneje.',
};

export const SET_KIND_INTROS: Record<DocLocale, Partial<Record<Kind, string>>> = {
  en: {},
  de: DE,
  sl: SL,
};
