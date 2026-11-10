# Postęp: Palapa Verde (strona i sklep)

Ostatnia aktualizacja: 2026-11-10 · gałąź `palapa-verde/shop` · wersja 0.2.0 (podgląd na Vercel)

## Stan

**Gotowe**
- Kod starej strony odzyskany z Vercel: wszystkie 5 wersji jest w `legacy/` (szczegóły w `legacy/README.md`).
- Sklep w Next.js 16, po hiszpańsku i angielsku:
  - strona główna: hero z całą linią produktów, pasek *campo → cocina → frasco*, produkty, sekcja „Hecho con Go Veggie Life”;
  - katalog z filtrem kategorii;
  - karty produktów: zdjęcie, nazwa w stylu etykiety, warzywa-bohaterowie, dostępność, tabela danych „Por confirmar”;
  - koszyk z formularzem zamówienia **testowego**;
  - panel `/es/admin` z brakującymi danymi, stanem integracji i listą decyzji biznesowych.
- Warstwa integracji z API goveggie.life: interfejs `CommerceProvider`, dane testowe (mock) i tymczasowy
  adapter HTTP z testami kontraktu. Opis w `docs/INTEGRATION.md`.
- Grafika według referencji opakowań od właściciela (`design-src/referencia-envases.jpg`).
  Zdjęcia wygenerował ChatGPT przez Codex; na stronie są podpisane „Imagen ilustrativa”.
- Testy: `pnpm check` (typecheck, 99 testów Vitest, build).
- Vercel: projekt `palapa-verde` podłączony do repozytorium (Root Directory `palapa-verde`). Każdy push
  poza `main` buduje podgląd. Build pomija commity, które nie zmieniają `palapa-verde/`.

**Podgląd:** adres w sekcji „Ostatni podgląd” niżej.

## Następne zadania (kolejność)
1. ~~Właściciel ocenia wygląd na podglądzie.~~ **Wygląd zatwierdzony 2026-11-05.** Następne poprawki grafik robimy przez
   Codex: prompt jest w `design-src/images-prompt.txt`, a referencja w `design-src/referencia-envases.jpg` (tylko lokalnie).
2. Uzupełnić dane produktów, gdy przyjdą od firmy (ceny, gramatura, skład, alergeny, termin, przechowywanie).
   Dziś są to `null` w `src/lib/commerce/mock/fixtures.ts`; docelowo przyjdą z API.
3. Prawdziwe zdjęcia produktów: podmienić pliki w `public/media/productos/` (te same nazwy) i zmienić `kind`
   na `"product"` w `src/lib/commerce/brand-content.ts`. Podpis „Imagen ilustrativa” zniknie sam.
4. Specyfikacja API goveggie.life: według listy kroków w `docs/INTEGRATION.md`.
5. Po decyzjach biznesowych: dostawa (strefy, koszty), płatności, dane firmy, zgoda na start (merge do `main`).
6. Dopiero przed startem: Vercel Pro, `SITE_INDEXABLE=true`, domena.

## Pytania do właściciela (decyzje biznesowe / płatne)
- Ceny, gramatura, skład, alergeny, termin przydatności i przechowywanie każdego z 5 produktów.
- Rejestracja sanitarna i etykiety: na jakim etapie jest każdy produkt?
- Dostawa: strefy, dni, koszt, odbiór osobisty, minimalne zamówienie.
- Płatności: który operator (np. Azul, CardNET), umowa, termin. Do tego czasu nic nie pobieramy.
- Vercel Pro (US$20/mies.): plan Hobby nie pozwala na sklep firmowy.
- Repozytorium `goveggie-web` jest publiczne. Czy tak ma zostać?
- Dane firmy do stopki (nazwa, RNC, kontakt, WhatsApp).

## Ostatni podgląd
- Gałąź (zawsze najnowsza wersja): https://palapa-verde-git-palapa-verde-shop-donpollolococabarete-9718.vercel.app/es
- Wdrożenie z 2026-11-05: `dpl_Chqk54KV7Aw3nitQNSstjfdwKkpk`, commit `0c05bc1`, status READY.
- **Produkcja (https://palapa-verde.vercel.app) = sklep z tej gałęzi od 2026-11-06.** Właściciel zgodził się
  zastąpić nocną wersję. Wdrożenie `dpl_FCqWavB3Z9sg8DGhfe9cPsjxGY4v` to build produkcyjny commita `89d9234`
  (redeploy podglądu `dpl_DwJaMUc3DxK1ZFwmsT6He4HU4hHD`; samo promote podglądu Vercel odrzucił błędem 422).
  `main` nie był ruszany.
- Wycofanie: w Vercel → palapa-verde → Deployments → „Promote” przy `dpl_eWiEes4PdhFK4LkKvJoigfHsRvav`
  (nocna wersja, kopia w `legacy/v6_…`) albo `dpl_AQ1kji2AAs2KL7DT8SXjam8pVfFh` (stary one-pager).
- **Uwaga:** `main` nadal ma stary `palapa-verde/index.html`. Push do `main`, który zmieni folder `palapa-verde/`,
  albo `vercel --prod` z innej sesji nadpisze produkcję. Przed takim krokiem trzeba najpierw zrobić merge tej gałęzi
  (i rozwiązać sprawę projektu `catalog`, opisaną niżej).
- Sprawdzone na podglądzie: wszystkie strony zwracają 200, nieznana strona 404, `noindex` jest,
  zamówienie testowe przez `/api/orders` działa.

## Uwagi techniczne
- Projekt Vercel **catalog** (domena catalog.goveggie.life, założony w innej sesji) też jest podłączony
  do `goveggie-web`. Każdy push buduje również jego podgląd, a push do `main` wdroży jego produkcję.
  **Sprawdzone 2026-11-05:** buildy Git projektu `catalog` serwują stronę GoVeggie z katalogu głównego repo
  („GoVeggie — Prototipo web”), a produkcja `catalog` to inna strona („Catálogo de productos — GoVeggie”),
  wdrożona z CLI. **Pierwszy push do `main` podmieniłby więc catalog.goveggie.life na stronę główną GoVeggie.**
  Zanim cokolwiek trafi do `main`, właściciel musi zdecydować, co z projektem `catalog` (odłączyć od Git
  albo ustawić „Ignored Build Step” na `exit 0`). Nie zmieniałem go: to inny projekt z domeną goveggie.life.
- Przegląd kodu przez Codex (`codex review --base main`) znalazł 3 rzeczy i wszystkie są poprawione:
  brak obrazów (dodane), zdjęcia z API z obcej domeny (`unoptimized`), limit czasu nie obejmował
  odczytu odpowiedzi (poprawione, jest test).
- Wtyczki Codex nie ma w tej sesji Claude Code. Używany jest Codex CLI 0.166 (logowanie przez ChatGPT):
  `codex exec` do zadań i obrazów, `codex review` do przeglądu.
- Referencja opakowań (`design-src/referencia-envases.jpg`) jest tylko lokalnie i nie trafia do gita,
  bo repozytorium jest publiczne. Prompt do obrazów jest w `design-src/images-prompt.txt`.

## Dziennik
- 2026-11-06: **szkice przepisów widoczne na produkcji** z decyzji właściciela („Pokaż szkice”): zmienna Vercel
  `SHOW_DRAFT_RECIPES=true` (tylko Production), wdrożenie `dpl_FHSNac83D11sYS5SSmhXErm79ekM`. Przepisy mają oznaczenie
  „Borrador · pendiente de prueba en cocina”, notę o braku testu, `noindex` i bez danych strukturalnych. Ukrycie: usunąć
  zmienną lub ustawić `false` i przebudować produkcję.
- 2026-11-06: **na produkcję trafiła wersja z podglądu** (commit `81e5c29`, wdrożenie `dpl_6fuEtnhaNpqhpkmAwNbPfdfCLRt2`),
  za zgodą właściciela („Tak, na produkcję”). Smoke test na https://palapa-verde.vercel.app przechodzi. Na produkcji szkice
  przepisów są ukryte (`SHOW_DRAFT_RECIPES` nieustawione), strona ma `noindex`. Wycofanie: Vercel → palapa-verde →
  Deployments → „Promote” przy `dpl_FCqWavB3Z9sg8DGhfe9cPsjxGY4v` (poprzedni sklep) albo `dpl_eWiEes4PdhFK4LkKvJoigfHsRvav` (wersja nocna).
- 2026-11-06 (samodzielnie, „co możesz, rób sam”): zmiany Codex (relacja „owned” wg decyzji właściciela, logo SVG,
  bezpieczniejsze przepisy) sprawdzone i zacommitowane (`b8cd41c`); Lighthouse mobile na buildzie produkcyjnym:
  wydajność 87–92, dostępność 100, dobre praktyki 100; `pnpm smoke <url>` do sprawdzania wdrożeń (przechodzi na
  podglądzie). Zabezpieczenie projektu `catalog` zablokowane przez uprawnienia (wspólny zasób) — do zrobienia
  przez właściciela, instrukcja w `docs/strategy/09-verification-and-handoff.md`.
- 2026-11-06 (runda 2, według briefu właściciela): audyt i plan, rekomendacja relacji marek, uczciwy prelaunch
  (bez koszyka, fikcyjnych stanów i cen), przepisy (10 szkiców ES/EN, filtry, skalowanie, druk, WhatsApp),
  strony: Dónde comprar, Nosotros, FAQ, Negocios; QR `/p/{qrId}`; analityka bez dostawcy; plan social media
  i checklista zdjęć (Codex); 2 przeglądy Codex wdrożone. Szczegóły: `docs/strategy/09-verification-and-handoff.md`,
  decyzje do potwierdzenia: `docs/APPROVAL_CHECKLIST.md`. Wypchnięte za zgodą właściciela; podgląd: https://palapa-verde-git-palapa-verde-shop-donpollolococabarete-9718.vercel.app/es
  (produkcja bez zmian).
- 2026-11-06: sklep wdrożony na produkcję palapa-verde.vercel.app za zgodą właściciela („Tak, zastąp”).
  Nocna wersja z innej sesji jest zarchiwizowana w `legacy/v6_2026-11-06_0134_jb4tzoi11/`.
- 2026-11-05: właściciel zatwierdził nowy wygląd („Wygląd OK”).
- 2026-11-05: odzyskany kod z Vercel, szkielet sklepu, warstwa integracji, testy, połączenie z Vercel.
  Właściciel odrzucił pierwszą wersję grafiki („strasznie”), więc grafika jest od nowa: produkty z wartością
  dodaną w opakowaniach według jego referencji, zdjęcia z ChatGPT (Codex).

## 6 listopada 2026 — aktualizacja lokalna po decyzji właściciela

Palapa Verde jest marką Go Veggie Life, głównego dostawcy jej składników. Zatwierdzony podpis pozostaje na stronie i wizualizacjach. Fakt konkretnego pochodzenia składnika wymaga sprawdzenia dla danego produktu. Producent i podmiot rejestrujący są odrębnymi, nieuzupełnionymi polami.

W obu językach doprecyzowano dziesięć przepisów do testów kuchennych. Przelicznik zachowuje drobne miary i stałą ilość oleju dla tego samego naczynia. Wersja do druku uwzględnia wybraną liczbę porcji. Szkic pozwala przygotować listę zakupów z oznaczeniem statusu i alergenów. Udostępnianie publicznego linku jest dostępne dla zatwierdzonej receptury na docelowej domenie. Prawdziwa fotografia dania wyświetli się, kiedy redakcja uzupełni plik i opisy. Cała dziesiątka pozostaje w stanie draft.

Zmiany sprawdzono lokalnie w kopii roboczej. Realne zdjęcia, test kuchenny, zatwierdzenie sklepów, etykiet i odbiorcy kontaktu pozostają zadaniami zespołu.

Do nagłówka i stopki w obu językach dodano nowy znak Palapa Verde: dwie lekkie linie dachu nad nazwą oraz zatwierdzony podpis właścicielski. Wersje SVG mają litery zamienione na krzywe; ikona karty używa samego daszku. Archiwalny znak, packshoty i materiały etykietowe zachowano. Przed użyciem na opakowaniach potrzebna jest fizyczna próba skali na właściwym materiale.

6 listopada 2026 właściciel wybrał wariant B „Lekka palapa”. Daszek ma 28% optycznej szerokości nazwy Palapa Verde. Hiszpańska i angielska wersja mają mniejszy, wyśrodkowany podpis kursywą pod nazwą marki. Podpis ma łagodniejszy odcień zieleni i zajmuje 72% szerokości nazwy po hiszpańsku oraz około 65% po angielsku. Pliki SVG zawierają podpisy „Una marca de Go Veggie Life” i „A brand of Go Veggie Life”.

Właściciel wskazał planszę z czterema przezroczystymi opakowaniami jako wzorzec stylistyczny. Etykiety na historycznej planszy mają jasne pole z łukiem i cienkim czarnym obrysem, rycinę głównego składnika, szeryfową nazwę produktu i czarny wariant B z małym podpisem Go Veggie Life. Kolor wnosi produkt i fotografia świeżych składników.

Aktualizacja decyzji o etykietach: u góry stosujemy sam znak B Palapa Verde i nazwę produktu. Ostatnim elementem frontu jest mniejszy znak Go Veggie Life z opakowań (symbol i zapis „goveggie.life” jako jedna grafika). Propozycja tekstu przed znakiem to „Una marca de” po hiszpańsku i „by” po angielsku. Podgląd wykorzystuje czarny znak z planszy „Go Veggie Label Design Comparison”. Do wydania produkcyjnego potrzebny jest wzorcowy plik znaku i próba druku. Decyzja dotyczy opakowań.

6 listopada 2026 — decyzja właściciela o druku: wszystkie naklejki Palapa Verde mają cztery proste krawędzie i kąty proste; nie stosujemy łuków ani specjalnego wykrojnika. Rycina i daszek są jedynie nadrukiem. Wymiary dotyczą całej naklejki: pierwsza przymiarka 100 × 75 mm (szer. × wys.), porównawczo 100 × 100 mm. Wymiar do produkcji ustalamy osobno po przymiarce na kubku i słoiku.

6 listopada 2026 — lokalne zdjęcia ilustracyjne: pięć osobnych ujęć i jedno grupowe dla Palapa Verde. Prostokątne naklejki mają ostre narożniki. Znak B zajmuje górę, oryginalna rycina ze starszego zdjęcia znajduje się z lewej strony nazwy produktu, a na samym dole pojawia się „Una marca de” i kolorowy znak z web.goveggie.life.

6 listopada 2026 — opublikowano zdjęcia wszystkich pięciu produktów i ujęcie grupowe z prostokątnymi etykietami. Produkcja https://palapa-verde.vercel.app/es, commit 1aafe07, wdrożenie dpl_A3ahJ93hT2rpWEj252EKyWaUA8Vt. Zweryfikowano publiczne pliki oraz wyświetlane wersje sześciu zdjęć, pnpm smoke i 76 testów. Poprzednia produkcja: dpl_FHSNac83D11sYS5SSmhXErm79ekM.

6 listopada 2026 — podgląd strefy Hoteles y restaurantes w ES/EN. Wspólne wejście dla świeżych warzyw Go Veggie Life i przetworów Palapa Verde, dostępne przez stronę główną i Negocios. Gramatury oznaczają propozycje do prób, a zapytanie klient sam udostępnia przedstawicielowi. Bezpośredni odbiorca sprzedażowy czeka na potwierdzenie w CONTACT.

6 listopada 2026 — połączenie dwóch wersji strefy (decyzja właściciela „Połącz obie wersje”): osobna strona `/hoteles-restaurantes` zawiera teraz też linię profesional (formaty „Propuesto · por confirmar”, zdjęcie z ChatGPT, etykieta) i przycisk do strony Go Veggie Life dla gastronomii. Gramatury prób (500 g, 1 kg, 5 lb) usunięte do czasu potwierdzenia; pilnuje tego test. `/negocios` ma krótki odsyłacz. Gałąź `palapa-verde/horeca`, tylko podgląd.

6 listopada 2026 — ilustracje dla profesjonalnych kuchni, punktów sprzedaży i historii obu marek. Otoczenie i opakowania są rytowane w graficie, a kolor pokazuje żywność. Na pojemnikach Palapa Verde używamy prostokątnej etykiety o ostrych narożnikach, z delikatnym daszkiem na górze i oryginalnym znakiem Go Veggie Life na dole. Skrzynki świeżych surowców noszą znak Go Veggie Life. Formatów proponowanych nie przedstawiamy jako dostępnych. Wtórne opakowania dla gastronomii mogą być zamykanymi pojemnikami przeznaczonymi do kontaktu z żywnością. Etykieta demonstracyjna rozróżnia dane producenta od pól uzupełnianych po otwarciu. Formularz prosi o produkt i strefę dostawy; szkic można poprawić, skopiować lub udostępnić. Bezpośredni odbiorca Palapa Verde nadal wymaga potwierdzenia w CONTACT.

6 listopada 2026 — sekcja powiązania marek na stronie głównej używa ilustracji współpracy z Go Veggie Life w ES/EN. Strona Negocios ma dwujęzyczny formularz zapytania. Właściciel potwierdził odrębny adres Palapa Verde info@palapaverde.com do zapytań handlowych. Na stronie biznesowej i w strefie gastronomii klient wysyła przygotowaną wiadomość ze swojej aplikacji pocztowej.

6 listopada 2026 — na stronie Negocios w ES i EN klient widzi kontakt przed ilustracją. Wybór typu firmy, tematu i osobny ekran podglądu zastąpiło jedno opcjonalne pole wiadomości. Przycisk od razu otwiera szkic do info@palapaverde.com, a widoczny adres można skopiować również bez aplikacji pocztowej.

6 listopada 2026 — kontakt dla hoteli i restauracji w ES i EN znajduje się przed ilustracją. Klient może dopisać dowolną wiadomość lub od razu otworzyć pocztę. Linki przy proponowanych opakowaniach i produktach Palapa Verde uzupełniają szkic zapytania o wybraną pozycję. Oba formularze korzystają ze wspólnego komponentu i zatwierdzonego adresu handlowego.

6 listopada 2026 — nawigacja mieści się w jednym wierszu na telefonie, z rozwijanym menu ES/EN i wejściem dla gastronomii. Każda karta produktu prowadzi do kontaktu z zachowaniem produktu; ta sama ścieżka działa z pustej listy sklepów. Linki w obie strony między markami zachowują wybrany język. Dziesięć kart przepisów i ich strony otrzymały ilustracje gotowych dań, a pięć produktów dostało osobny widok konsystencji. Prawdziwe zdjęcia mają pierwszeństwo, a statusy receptur pozostają draft do czasu prób w kuchni. Web Analytics na planie Hobby mierzy odsłony i urządzenia na produkcji; rzeczywisty odbiór wiadomości wymaga odrębnego potwierdzenia w poczcie.

OpenSRS pokazuje info@palapaverde.com jako aktywną skrzynkę. Podczas sprawdzenia publiczne resolwery zwróciły SERVFAIL dla NS, MX i A. Tymczasowy formularz pozwala zapisać zapytanie jako plik tekstowy albo otworzyć szkic. Ustaw PALAPA_EMAIL_DELIVERY=ready dopiero po potwierdzonej dostawie wiadomości z zewnątrz. Sam klik, zapis pliku i otwarcie szkicu nie są liczone jako zapytania odebrane przez zespół.

6 listopada 2026 — pierwsze dwie karty procesu na stronie głównej ES/EN pokazują marchew i kolendrę oraz ucieranie pesto; ilustracje używają koloru dla żywności i grafitu dla dłoni i narzędzi. W strefie gastronomii obraz dania wypełnia kolumnę na laptopie aż do podpisu. Ułatwiono wybór liczby porcji, druk karty przepisu i przejście do etykiety. Materiały do rzeczywistej próby kuchennej są pod /equipo/prueba-de-cocina.html: karta ES, zdjęcia zapisywane w tym urządzeniu, eksport ZIP, praca po pierwszym pobraniu bez sieci i PDF Carta w dwóch proponowanych rozmiarach. Karta zawiera wyłącznie dane wpisane przez osobę wykonującą próbę. Przy aktualizacji zasobów /equipo należy zmienić wersję cache w sw.js.

Na telefonach zwinięta nawigacja pozostaje przy górze ekranu, a komunikat o rozwoju zostaje przy początku dokumentu. Główne wejścia do gastronomii otwierają początek strony, także po wybraniu tej samej podstrony. Celowe odsyłacze do etykiety, opakowań i formularza zachowują swoje kotwice i odstęp pod paskiem.

Wszystkie sześć pozycji mobilnego menu w ES i EN korzysta z tej samej zasady: wybór zakładki zamyka menu i otwiera stronę od góry, także przy ponownym wyborze bieżącej zakładki. Logo w nagłówku prowadzi na początek strony głównej. Przycisk Wstecz pozostawia przywracanie pozycji przeglądarce.

7 listopada 2026 — w rejestrze kuchni dodano kartę hotelowej próby hummusu z marchwi. Po wpisaniu rzeczywistych pomiarów gramów na zmianie i liczby porcji karta wylicza ilość podaną na porcję, pozwala skopiować podsumowanie do rejestru i drukuje się na Carta. Dane prób wprowadza zespół na urządzeniu. Karta i rejestr są dostępne offline po pierwszym pełnym wczytaniu.

10 listopada 2026 — tekst wpisany w formularzu zapytania (Negocios oraz Hoteles y restaurantes) zostaje po zmianie języka ES/EN i po powrocie na stronę w tej samej karcie przeglądarki. Każde zapytanie (ogólne, o produkt, o opakowanie) ma własny szkic; pole celowo wyczyszczone zostaje puste, a nietknięta podpowiedź nadal zmienia język razem ze stroną. Tak samo zachowuje się liczba porcji wybrana w przepisie. Szkic i liczba porcji są tylko w pamięci sesji karty: nie trafiają do adresu, analityki ani na serwer. Przy zablokowanej pamięci przeglądarki szkic trzyma się do przeładowania strony.

Ze stopki dla klientów zniknął link „Admin”. Adresy /es/admin i /en/admin działają jak dotąd i nadal nie mają logowania (tylko noindex i robots), więc usunięcie linku niczego nie zabezpiecza. Etykieta nawigacji w stopce jest teraz po hiszpańsku i po angielsku.

Poprawkę formularza i stopki przygotował Codex jako patch; tutaj została sprawdzona i nałożona bez zmian. Doszły testy formularza i liczby porcji w środowisku przeglądarkowym (nowa zależność tylko do testów: jsdom 30.1.3) oraz kontrola w `pnpm smoke`, że strony dla klientów nie linkują do /admin. Sprawdzone: `pnpm check` (typecheck, 99 testów, build), `pnpm smoke` na lokalnym buildzie produkcyjnym oraz ręcznie w przeglądarce po hiszpańsku i angielsku, na komputerze i w szerokości telefonu.
