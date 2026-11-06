# Postęp: Palapa Verde (strona i sklep)

Ostatnia aktualizacja: 2026-11-05 · gałąź `palapa-verde/shop` · wersja 0.1.0

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
- Testy: `pnpm check` (typecheck, 51 testów Vitest, build).
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
- Produkcja (https://palapa-verde.vercel.app): **od 2026-11-06 01:34 UTC jest tam inna, statyczna wersja**
  („El campo, hecho cocina.”), wdrożona z CLI w innej sesji, spoza gita. Kopia leży w
  `legacy/v6_2026-11-06_0134_jb4tzoi11/`. Promote sklepu czeka na decyzję właściciela, którą wersję zostawić.
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
- 2026-11-05: właściciel zatwierdził nowy wygląd („Wygląd OK”).
- 2026-11-05: odzyskany kod z Vercel, szkielet sklepu, warstwa integracji, testy, połączenie z Vercel.
  Właściciel odrzucił pierwszą wersję grafiki („strasznie”), więc grafika jest od nowa: produkty z wartością
  dodaną w opakowaniach według jego referencji, zdjęcia z ChatGPT (Codex).
