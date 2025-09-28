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

