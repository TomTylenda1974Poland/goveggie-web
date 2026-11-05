# Decyzje (Palapa Verde)

Rutynowe decyzje techniczne podjęte samodzielnie, z powodem. Decyzje biznesowe czekają w `PROGRESS.md`.

## 2026-11-05

1. **Repozytorium: wspólne `goveggie-web`, folder `palapa-verde/`.** Tam już był prototyp Palapa Verde,
   a rodzina Go Veggie Life ma tam swoje zasady (CLAUDE.md) i grafiki. Praca idzie na gałęzi
   `palapa-verde/shop`, a `main` zostaje nietknięty, dopóki właściciel nie zatwierdzi startu.
   Uwaga: repozytorium jest **publiczne**. Kod nie zawiera sekretów, ale o widoczności decyduje właściciel.
2. **Odzyskany kod.** Wszystkie pięć wersji strony z Vercel jest w `legacy/`. Wersja produkcyjna jest
   identyczna bajt w bajt z tym, co trzyma Vercel. Wersje v1–v4 nie były wcześniej w git.
3. **Technologia: Next.js 16 + TypeScript, bez frameworka CSS.** Jeden plik `globals.css` przenosi
   system z prototypu (białe tło, czarne ramki 2 px, Archivo Black, Inter, Cormorant Garamond) z akcentem
   `#1E7A34` zamiast dawnego `#1F5B1F`, zgodnie z briefem. pnpm, Vitest.
4. **Języki: hiszpański najpierw (`/es`), angielski (`/en`)**, jak w prototypie i całej rodzinie. `/` → `/es`.
5. **Brakujące dane = `null`, nigdy wymyślone.** Sklep pokazuje „Precio por confirmar” / „Por confirmar”,
   a `/admin` liczy braki. Test `rules.test.ts` pilnuje, żeby dane testowe nie dostały cen ani składu.
6. **Opisy produktów: brak.** Każdy opis sugerowałby skład, więc pole zostaje puste do czasu tekstu od firmy.
   Angielskie nazwy to dosłowne tłumaczenia hiszpańskich.
7. **Zdjęcia: zdjęcia składników Go Veggie Life** (kolendra, marchew, awokado) z repozytorium, wyraźnie
   podpisane „Foto del ingrediente — foto del producto pendiente”. Buraka i auyamy nie ma, więc są ryciny.
   Zdjęcie papryki zostało odrzucone: to papryka słodka, nie jalapeño.
8. **Ryciny botaniczne: oryginalne rysunki SVG** (`engravings.tsx`, pierwsza wersja od Codex), bez pobierania
   cudzych grafik.
9. **Warstwa integracji jako interfejs `CommerceProvider`** z dwiema implementacjami (mock i adapter
   goveggie.life) i wspólnym testem kontraktu. Szczegóły w `INTEGRATION.md`.
10. **Stany magazynowe w danych testowych są fikcyjne** i obejmują wszystkie stany (dostępny, ostatnie sztuki,
    wyprzedany). Na górze strony jest żółty pasek „Prototipo con datos de prueba”.
11. **Zamówienia: tylko testowe.** `/api/orders` waliduje i sprawdza stan, ale nic nie zapisuje i nikomu
    nie wysyła. Brak płatności.
12. **Panel admin jest tylko do odczytu i bez hasła.** Pokazuje wyłącznie braki w danych, nic poufnego.
    Ma `noindex`. Edycja danych pojawi się razem z API albo z decyzją o CMS.
13. **Cała strona ma `noindex`**, dopóki `SITE_INDEXABLE` nie dostanie wartości `true` przy starcie.

14. **Grafika według referencji opakowań właściciela** (zatwierdzona 2026-11-05): słoiki dla chutney i pesto,
    przezroczyste pojemniki dla hummusów i salsy, łukowa etykieta, szeryfowe PALAPA VERDE, ryciny warzyw.
    Na etykietach na zdjęciach nie ma gramatury, opisu ani „MANTENER REFRIGERADO”, bo to dane do potwierdzenia.
    Typografia strony: Archivo Black dla nagłówków rodziny, Playfair Display dla marki i nazw produktów
    (jak na etykiecie), Cormorant Garamond italic dla linii opisowych.
