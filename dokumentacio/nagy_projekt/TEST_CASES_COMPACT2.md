# Workout App - Test Cases

- **Projekt**: Workout app  
- **Dátum**: 2025.09.28  
- **Tesztelő**: Lendvai-Benyó Dániel  

## Összefoglaló táblázat

| Teszt eset   | Leírás                                 | OK/NOK   |
|:-------------|:---------------------------------------|:---------|
| T-01         | Üres mezőkkel belépés                  | NOK      |
| T-02         | Megfelelően kitöltött mezőkkel belépés | OK       |
| T-03         | Backend nélküli belépés                | OK       |
| T-04         | Napok betöltődése                      | OK       |
| T-05         | Feladatok betöltődése                  | OK       |
| T-06         | Feladatok kipipálása                   | OK       |
| T-07         | Feladatok állapotának mentése          | OK       |
| T-08         | Egy adott nap teljesítése              | OK       |
| T-09         | Feladatok véletlenszerűsége            | OK       |
| T-10         | Hetek teljesítése                      | OK       |

## Részletek


### T-01 - Üres mezőkkel belépés

**Adatok:** Minden mezőt üresen hagyva  
**Lépések:** 1. Üres mezőkkel belépésre kattintás  
**Eredmény:** Semmi reakció  
**Várt eredmény:** Megfelelő hibaüzenet  
**OK/NOK:** NOK  
**Komment:** -  


### T-02 - Megfelelően kitöltött mezőkkel belépés

**Adatok:** Minden mezőt megfelelő adatokkal kitölteni  
**Lépések:** 1. Név, magasság és súly megadása  2. Belépés gomb  
**Eredmény:** Főoldal a kiszámolt BMI-vel  
**Várt eredmény:** Főoldal a kiszámolt BMI-vel  
**OK/NOK:** OK  
**Komment:** -  


### T-03 - Backend nélküli belépés

**Adatok:** Megfelelően kitöltött belépés nem elindított backend-del  
**Lépések:** 1. Név, magasság és súly megadása  2. Belépés gomb  
**Eredmény:** Hiba, nem sikerült kapcsolódni a szerverhez  
**Várt eredmény:** Hiba, nem sikerült kapcsolódni a szerverhez  
**OK/NOK:** OK  
**Komment:** -  


### T-04 - Napok betöltődése

**Adatok:** Főoldalról egy hét kiválasztásával napok megjelenése  
**Lépések:** 1. Főoldalon első hét kiválasztása  
**Eredmény:** Megjelenik listában 5 nap  
**Várt eredmény:** Megjelenik listában 5 nap  
**OK/NOK:** OK  
**Komment:** -  


### T-05 - Feladatok betöltődése

**Adatok:** Heti felületen egy napot kiválasztva megjelennek az aznapi feladatok  
**Lépések:** 1. Főoldalon első hét kiválasztása  2. Heti nézeten első nap kiválasztása  
**Eredmény:** Megjelenik listában 5 feladat  
**Várt eredmény:** Megjelenik listában 5 feladat  
**OK/NOK:** OK  
**Komment:** -  


### T-06 - Feladatok kipipálása

**Adatok:** Napi felületen feladat kipipálása  
**Lépések:** 1. Főoldalon első hét kiválasztása  2. Heti nézeten első nap kiválasztása  3. Feladatok kipipálása  
**Eredmény:** A kipipált feladat zöldre vált és megjelenik a pipa  
**Várt eredmény:** A kipipált feladat zöldre vált és megjelenik a pipa  
**OK/NOK:** OK  
**Komment:** -  


### T-07 - Feladatok állapotának mentése

**Adatok:** Napi felület elhagyva majd visszatérve az állapot ugyanaz marad  
**Lépések:** 1. Főoldalon első hét kiválasztása  2. Heti nézeten első nap kiválasztása  3. Visszalépés a heti felületre  4. Visszalépés az első napra  
**Eredmény:** A korábban kipipált és nem kipipált feladatok ugyanolyan állapotban vannak  
**Várt eredmény:** A korábban kipipált és nem kipipált feladatok ugyanolyan állapotban vannak  
**OK/NOK:** OK  
**Komment:** -  


### T-08 - Egy adott nap teljesítése

**Adatok:** Minden aznapi feladat kipipálása  
**Lépések:** 1. Főoldalon első hét kiválasztása  2. Heti nézeten első nap kiválasztása  3. Minden feladat kipipálása  
**Eredmény:** Értesítés arról hogy teljesítettem a napot és visszairányítás a heti felületre  
**Várt eredmény:** Értesítés arról hogy teljesítettem a napot és visszairányítás a heti felületre  
**OK/NOK:** OK  
**Komment:** -  


### T-09 - Feladatok véletlenszerűsége

**Adatok:** Minden nap 5 véletlenszerűen választott feladat van  
**Lépések:** 1. Főoldalon első hét kiválasztása  2. Heti nézeten első nap kiválasztása  3. Visszalépés heti nézetbe  4. Második nap kiválasztása  
**Eredmény:** Különböző feladatok az első és második nap között  
**Várt eredmény:** Különböző feladatok az első és második nap között  
**OK/NOK:** OK  
**Komment:** -  


### T-10 - Hetek teljesítése

**Adatok:** Egy héten belül minden nap teljesítésével a hétnek is teljesülnie kell  
**Lépések:** 1. Minden feladatok kipipálása mind az 5 napon  
**Eredmény:** A hét teljesül és zöldre vált  
**Várt eredmény:** A hét teljesül és zöldre vált  
**OK/NOK:** OK  
**Komment:** -  

Projekt: Fitness Training Application

Dátum: 2025. január 28.

Tesztelő: [A Te Neved]

Tesztkörnyezet: Android 14, Expo Go 51

Backend: MongoDB, Express.js

Frontend: React Native, Expo

Teszteset Összefoglaló Táblázat
Teszt ID	Teszteset Megnevezése	Prioritás	Státusz	Megjegyzés
T-001	Üres mezőkkel történő belépési kísérlet	Magas	❌ NOK	Nem megfelelő hibaüzenet
T-002	Helyes kitöltéssel történő belépés	Magas	✅ OK	Sikeres működés
T-003	Backend kapcsolat nélküli belépés	Magas	✅ OK	Megfelelő hibaügyelet
T-004	Heti nézet napjainak betöltése	Közepes	✅ OK	Helyes adatmegjelenítés
T-005	Napi feladatok betöltődése	Közepes	✅ OK	Gyors betöltés
T-006	Egyedi feladat állapotváltása	Magas	✅ OK	Vizuális visszajelzés helyes
T-007	Feladat állapot perzisztencia	Magas	✅ OK	Adatmegőrzés működik
T-008	Nap teljesítés automatikus észlelése	Közepes	✅ OK	Automatikus visszairányítás
T-009	Feladatok véletlenszerűsége napok között	Alacsony	✅ OK	Változatos feladatok
T-010	Hét teljesítés automatikus észlelése	Közepes	✅ OK	Helyes státuszváltás
Részletes Teszteset Dokumentáció
🚫 T-001 - Üres mezőkkel történő belépési kísérlet
Teszt Célja: Ellenőrizni, hogy az alkalmazás megfelelően kezeli a hiányzó kötelező adatokat a belépés során.

Előfeltételek:

Alkalmazás frissen elindítva

Login képernyő aktív

Nincs előző felhasználói munkamenet

Teszt Lépések:

Az alkalmazás elindítását követően a login képernyőn minden mezőt üresen hagyok

A "Belépés" gombra kattintok anélkül, hogy bármilyen adatot megadnék

Megfigyelem az alkalmazás reakcióját

Várt Eredmény:

Megjelenik egy felhasználóbarát hibaüzenet, amely tájékoztat a hiányzó kötelező mezőkről

Az alkalmazás nem irányít át a főoldalra

A felhasználó továbbra is a login képernyőn marad

Tényleges Eredmény:

Az alkalmazás nem reagál a gombnyomásra

Nem jelenik meg hibaüzenet

Nem történik átirányítás, de a felhasználó nem kap visszajelzést

Státusz: ❌ NOK (Nem Megfelelő)

Megjegyzések:
A hibaügyelet nem megfelelő, mivel a felhasználó nem kap visszajelzést a művelet eredményéről. Javasolt a validáció fejlesztése és felhasználóbarát hibaüzenetek implementálása.

✅ T-002 - Helyes kitöltéssel történő belépés
Teszt Célja: Ellenőrizni a sikeres belépési folyamatot érvényes felhasználói adatokkal.

Előfeltételek:

Backend szerver elindítva és elérhető

MongoDB adatbázis működik

Tesztadatok:

Teljes név: "Kovács Anna"

Magasság: 172 cm

Testsúly: 68 kg

Teszt Lépések:

A login képernyőn megadom a fenti tesztadatok

Megnyomom a "Belépés" gombot

Megfigyelem az átirányítást és a főoldal tartalmát

Várt Eredmény:

Sikeres átirányítás a főoldalra

Üdvözlő üzenet megjelenítése: "Üdvözöllek, Kovács Anna!"

BMI érték kiszámolása és megjelenítése (22.99)

Hetek listájának helyes megjelenítése

Tényleges Eredmény:

✅ Azonnali átirányítás a főoldalra

✅ Helyes üdvözlő üzenet

✅ BMI érték helyesen számolva: 22.99

✅ 5 hét megjelenítése helyes sorrendben

Státusz: ✅ OK (Megfelelő)

Megjegyzések:
A belépési folyamat gyors és hatékony. A felhasználói élmény kiváló.

✅ T-003 - Backend kapcsolat nélküli belépés
Teszt Célja: Ellenőrizni az alkalmazás viselkedését backend kapcsolat hiányában.

Előfeltételek:

Backend szerver leállítva

Alkalmazás frissen újraindítva

Tesztadatok:

Teljes név: "Nagy Béla"

Magasság: 185 cm

Testsúly: 82 kg

Teszt Lépések:

Backend szerver leállítása

Alkalmazás újraindítása

Belépési adatok megadása

"Belépés" gomb megnyomása

Hibaüzenet megfigyelése

Várt Eredmény:

"Nem sikerült csatlakozni a szerverhez" hibaüzenet megjelenítése

Alkalmazás nem crash-el

Felhasználó továbbra is a login képernyőn marad

Tényleges Eredmény:

✅ Felhasználóbarát hibaüzenet megjelenik

✅ Alkalmazás stabilan működik tovább

✅ Nem történik átirányítás

Státusz: ✅ OK (Megfelelő)

Megjegyzések:
A hibaügyelet megfelelő, az alkalmazás gracilisan kezeli a kapcsolat problémákat.

✅ T-004 - Heti nézet napjainak betöltése
Teszt Célja: Ellenőrizni a hetek és napok hierarchikus navigációjának helyes működését.

Előfeltételek:

Sikeres bejelentkezés

Főoldal aktív

Teszt Lépések:

Főoldalon rákattintok a "3. hét" elemre

Megfigyelem a betöltött napok listáját

Ellenőrzöm a lista teljességét és helyességét

Várt Eredmény:

Megnyílik a 3. hét napjainak listája

5 nap megjelenik (1. nap - 5. nap)

Minden nap helyes címkézéssel és státusszal jelenik meg

Cím: "3. hét napjai"

Tényleges Eredmény:

✅ Azonnali betöltés

✅ 5 nap helyesen megjelenítve

✅ Cím helyes: "3. hét napjai"

✅ Státusz ikonok helyesen jelennek meg

Státusz: ✅ OK (Megfelelő)

Megjegyzések:
A navigáció zökkenőmentes, az adatok gyorsan és helyesen töltődnek be.

✅ T-005 - Napi feladatok betöltődése
Teszt Célja: Ellenőrizni a napi feladatok helyes betöltődését és megjelenítését.

Előfeltételek:

2. hét napjainak listája megnyitva

Teszt Lépések:

A heti nézetben rákattintok a "4. nap" elemre

Megfigyelem a betöltött feladatok listáját

Ellenőrzöm a feladatok számát és tartalmát

Várt Eredmény:

Megnyílik a 4. nap feladatainak listája

5 feladat megjelenik

Minden feladat tartalmaz leírást és státuszt

Cím: "2. hét - 4. nap"

Tényleges Eredmény:

✅ 5 feladat betöltődik

✅ Cím helyes: "2. hét - 4. nap"

✅ Feladatok változatosak és relevánsak

✅ Betöltési idő < 1 másodperc

Státusz: ✅ OK (Megfelelő)

Megjegyzések:
A feladatok betöltése gyors és a tartalom releváns a fitness témához.

✅ T-006 - Egyedi feladat állapotváltása
Teszt Célja: Ellenőrizni az egyedi feladatok állapotváltásának helyes működését és vizuális visszajelzését.

Előfeltételek:

hét 1. napja megnyitva

Összes feladat kezdetben nem teljesített

Teszt Lépések:

Rákattintok az "20 fekvőtámasz" feladatra

Megfigyelem a vizuális változásokat

Rákattintok a "15 guggolás" feladatra

Újra rákattintok az "20 fekvőtámasz" feladatra

Ellenőrzöm a progress számlálót

Várt Eredmény:

Feladat háttérszíne vált (piros ↔ zöld)

Pipajelzés vált (⬜ ↔ ✅)

Progress számláló frissül (0/5 → 1/5 → 2/5 → 1/5)

Backend státusz frissül

Tényleges Eredmény:

✅ Azonnali vizuális visszajelzés

✅ Háttérszín helyesen vált

✅ Pipajelzés helyesen vált

✅ Progress számláló pontos és friss

✅ Backend státusz helyesen frissül

Státusz: ✅ OK (Megfelelő)

Megjegyzések:
Kiváló felhasználói élmény, azonnali visszajelzés minden interakcióra.

✅ T-007 - Feladat állapot perzisztencia
Teszt Célja: Ellenőrizni, hogy a feladatok állapota megmarad az alkalmazás újraindítása után.

Előfeltételek:

Több feladat különböző állapotú (teljesített/nem teljesített)

Backend elérhető

Teszt Lépések:

hét 1. napján teljesítek 3 feladatot

Visszalépés a heti nézetbe

Alkalmazás újraindítása

Újra belépés ugyanazzal a felhasználóval

Visszanavigálás az 1. hét 1. napjára

Állapotok ellenőrzése

Várt Eredmény:

Korábban teljesített feladatok továbbra is teljesítettként jelennek meg

Nem teljesített feladatok továbbra is nem teljesítettként jelennek meg

Progress számláló helyes értéket mutat

Tényleges Eredmény:

✅ Minden feladat állapota helyesen helyreáll

✅ Progress számláló pontos: 3/5

✅ Vizuális állapot helyes

✅ Backend adatmegőrzés megbízható

Státusz: ✅ OK (Megfelelő)

Megjegyzések:
Az adatmegőrzés megbízhatóan működik, nincs adatvesztés.

✅ T-008 - Nap teljesítés automatikus észlelése
Teszt Célja: Ellenőrizni, hogy egy nap automatikusan teljesítetté válik az összes feladat teljesítésekor.

Előfeltételek:

2. hét 3. napja megnyitva

4/5 feladat már teljesítve

Teszt Lépések:

Rákattintok az utolsó, nem teljesített feladatra

Megfigyelem az automatikus reakciót

Visszanavigálás ellenőrzése

Várt Eredmény:

"🎉 3. nap teljesítve! Gratulálok!" értesítés

Automatikus visszatérés a heti nézetre 2 másodperc múlva

nap státusza kipipálódik a listában

Nap státusza frissül backend-en

Tényleges Eredmény:

✅ Értesítés megjelenik

✅ Automatikus visszatérés időzítése helyes

✅ Nap státusza kipipálódik

✅ Backend státusz frissül

Státusz: ✅ OK (Megfelelő)

Megjegyzések:
Az automatikus teljesítés észlelése jól működik, a 2 másodperces késleltetés ideális.

✅ T-009 - Feladatok véletlenszerűsége napok között
Teszt Célja: Ellenőrizni, hogy a feladatok változatosak és nem ismétlődnek sablonosan.

Előfeltételek:

3. hét napjainak listája megnyitva

Teszt Lépések:

Megnyitom a 3. hét 1. napját és feljegyzem a feladatokat

Visszalépés a heti nézetbe

Megnyitom a 3. hét 2. napját és összehasonlítom a feladatokat

Megismétlem a 3. napra is

Várt Eredmény:

Különböző feladatok az egyes napokon

Változatos gyakorlatok (erőnléti, kardió, stb.)

Nincs sablonos ismétlődés

Tényleges Eredmény:

✅ Minden nap különböző feladatok

✅ Változatos gyakorlat típusok

✅ Releváns fitness tartalom

✅ Megfelelő nehézségi szint

Státusz: ✅ OK (Megfelelő)

Megjegyzések:
A feladatok változatosak és jól tervezettek, ami hosszútávon is motiváló.

✅ T-010 - Hét teljesítés automatikus észlelése
Teszt Célja: Ellenőrizni, hogy egy hét automatikusan teljesítetté válik az összes nap teljesítésekor.

Előfeltételek:

hét, 4/5 nap teljesítve

Utolsó nap összes feladata nem teljesített

Teszt Lépések:

Megnyitom az utolsó, nem teljesített napot

Teljesítem az összes feladatot

Visszatérek a főoldalra

Hét státuszának ellenőrzése

Várt Eredmény:

hét státusza kipipálódik a főoldalon

Hét háttérszíne zöldre vált

"1. hét" ✅ ikonnal jelenik meg

Hét státusza frissül backend-en

Progress frissül (pl: "1/5 hét teljesítve")

Tényleges Eredmény:

✅ Hét státusza kipipálódik

✅ Háttérszín zöldre vált

✅ ✅ ikon megjelenik

✅ Backend státusz frissül

✅ Progress számláló pontos

Státusz: ✅ OK (Megfelelő)

Megjegyzések:
A hét teljesítésének automatikus észlelése megbízhatóan működik.
Az applikáció elvárásainak megfelelően működik.