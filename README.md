Workout App
Egy modern, React Native alapú fitness alkalmazás, amely személyre szabott edzésprogramokat kínál és nyomon követi a fejlődésedet.

Főbb Funkciók:
Profil: Magasság, testsúly és név alapján

Strukturált Edzésprogram: 5 hét × 5 nap × 5 gyakorlat

Automatikus Teljesítés Észlelés: Nap és hét teljesítés automatikus észlelése

Adat Szinkronizáció: MongoDB backendtel való folyamatos szinkronizáció

Reszponzív Design: Mobil első megközelítés

Telepítés és Futtatás:
Előfeltételek:
Node.js 16+

MongoDB 5+

Expo CLI

Backend Indítása:
bash
cd backend
npm install
docker-compose up -d
npm run dev
Frontend Indítása:
bash
cd frontend
npm install
npx expo start

Architektúra:
Frontend
React Native with Expo

TypeScript for type safety

Expo Router for navigation

AsyncStorage for local caching

Context API for state management

Backend
Node.js with Express

MongoDB with Mongoose

RESTful API design

CORS enabled for mobile

Adatmodell:
Workout Schema
javascript
{
  week: Number,      // 1-5
  day: Number,       // 1-5
  taskNumber: Number, // 1-5
  description: String,
  completed: Boolean
}
User Schema
javascript
{
  name: String,
  height: Number,
  weight: Number,
}

🛠️ Fejlesztési Útmutató
Új Gyakorlat Hozzáadása
MongoDB workouts kollekció frissítése
Backend API ellenőrzése

Stílus Módosítás
Fő stílusok: app/login.tsx és komponensek

Reszponzív breakpoint-ok: Flexbox alapú

Jellemzők
Implementált Funkciók
✅ Felhasználói bejelentkezés vendégként
✅ Heti és napi edzésprogramok
✅ Valós idejű progress követés
✅ Automatikus teljesítés észlelés
✅ Adat perzisztencia (local + cloud)


Közelgő Funkciók:
🔲 Testreszabható edzésprogramok
🔲 Részletes statisztikák
🔲 Social sharing
🔲 Offline mód fejlesztése

Teljesítmény:

Offline támogatás: Alapvető

Adat pontoság: 100%


Fejlesztők
Frontend logika: Istráb Csaba
Frontend UI: Müller Róbert
Backend API: Bihari Levente
Adatbázis: Lendvai-Benyó Dániel


Projekt Link: https://github.com/csabaistrab/workout_app_szfm_2025

Verzió Történet:

Alap funkciók implementálva

Tesztelés befejezve

Dokumentáció kész