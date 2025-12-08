# Workout App – Tesztelési Jegyzőkönyv

**Projekt:** Workout App\
**Tesztelő:** Bihari Levente\
**Dátum:** 2025.12.07

---

## Összefoglaló teszt táblázat

| Teszt‑ID | Teszteset röviden                           | Eredmény | Megjegyzés                        |
| -------- | ------------------------------------------- | -------- | --------------------------------- |
| TC-01    | Belépés üres adatokkal                      | ❌ NOK    | Nincs hibaüzenet                  |
| TC-02    | Belépés teljes adatokkal                    | ✅ OK     | Sikeres belépés                   |
| TC-03    | Hetek listájának megjelenítése              | ✅ OK     | Hetek listája rendben             |
| TC-04    | Nap kiválasztása, feladatok betöltése       | ✅ OK     | Feladatok láthatóak               |
| TC-05    | Egy feladat kipipálása                      | ✅ OK     | Vizuális státusz frissül          |
| TC-06    | Több feladat kipipálása + visszalépés       | ✅ OK     | Állapot megmarad                  |
| TC-07    | Nap automatikus teljesítése                 | ✅ OK     | Nap státusz frissül               |
| TC-08    | Hét lezárása minden nap teljesítve          | ✅ OK     | Hét státusza frissül              |
| TC-09    | Feladatlista véletlenszerűsége napok között | ✅ OK     | Napok feladatai nem ismétlődnek   |
| TC-10    | Backend‑hiba login próbálkozás              | ✅ OK     | Hibaüzenet megjelenik, app stabil |
| TC-11    | Kilépés / újraindítás utáni állapotmegőrzés | ✅ OK     | Adatok megmaradnak                |
| TC-12    | Felhasználói adat módosítása + új belépés   | ✅ OK     | Adatok frissülnek, UI rendben     |

---

## Rövid tesztesetek

### TC-01 – Belépés üres mezőkkel

- **Lépések:** Minden mezőt üresen hagyok, majd belépés gombra kattintok.
- **Várt:** Hibaüzenet jelenjen meg.
- **Tényleges:** Nem történik semmi.
- **Státusz:** ❌ NOK

### TC-02 – Belépés teljes adatokkal

- **Lépések:** Kitöltöm a mezőket (név, magasság, súly), majd belépés.
- **Várt:** Főoldal megjelenik, felhasználói adatok helyesek.
- **Tényleges:** Belépés OK, UI rendben.
- **Státusz:** ✅ OK

### TC-03 – Hetek betöltése

- **Lépések:** A belépés után megnézem a hetek listáját.
- **Várt:** Minden hét látható.
- **Tényleges:** Hetek rendben megjelennek.
- **Státusz:** ✅ OK

### TC-04 – Nap kiválasztás, feladatok betöltése

- **Lépések:** Hetet választok, majd egy napot.
- **Várt:** Nap feladatlistája megjelenik.
- **Tényleges:** Feladatlista rendben.
- **Státusz:** ✅ OK

### TC-05 – Egy feladat kipipálása

- **Lépések:** Egy feladatra kattintok.
- **Várt:** Checkbox/pipa és vizuális státusz frissül.
- **Tényleges:** Státusz helyesen változik.
- **Státusz:** ✅ OK

### TC-06 – Több feladat kipipálása + visszalépés

- **Lépések:** Több feladat kipipálása, majd kilépés és utána visszalépés.
- **Várt:** Feladatok státusza megmarad.
- **Tényleges:** Megmarad a feladatoknak a státusza.
- **Státusz:** ✅ OK

### TC-07 – Nap automatikus teljesítése

- **Lépések:** Az adott nap összes feladata kipipálása.
- **Várt:** Nap státusz automatikusan teljesítve.
- **Tényleges:** Nap lezáródik, státusz frissül.
- **Státusz:** ✅ OK

### TC-08 – Hét lezárása

- **Lépések:** Minden nap teljes, minden feladat kipipálva, utána visszalépés főnézetre.
- **Várt:** Hét státusza teljes, vizuálisan jelölve.
- **Tényleges:** Hét státusza rendben.
- **Státusz:** ✅ OK

### TC-09 – Feladatlista véletlenszerűsége napok között

- **Lépések:** Különböző napokat nézek egymás után.
- **Várt:** Napok feladatai változatosak, nem ismétlődnek.
- **Tényleges:** Feladatlista változatos.
- **Státusz:** ✅ OK

### TC-10 – Backend‑hiba login próbálkozás

- **Lépések:** Backend leállítva, login próbálkozás.
- **Várt:** Hibaüzenet, app nem omlik össze.
- **Tényleges:** Hibaüzenet rendben, app stabil.
- **Státusz:** ✅ OK

### TC-11 – Kilépés / újraindítás utáni állapotmegőrzés

- **Lépések:** Feladatok kipipálása, majd kilépés és újra belépés.
- **Várt:** Állapot megmarad.
- **Tényleges:** Állapot rendben.
- **Státusz:** ✅ OK

### TC-12 – Felhasználói adat módosítása + új belépés

- **Lépések:** Profil módosítás (magasság/súly), utána kilépés és újra bejelentkezés.
- **Várt:** Adatok frissülnek, UI rendben.
- **Tényleges:** Adatok módosultak.
- **Státusz:** ✅ OK
