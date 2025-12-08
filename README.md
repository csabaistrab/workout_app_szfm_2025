# 🏋️ Workout App

Egy modern, React Native alapú személyi edzői alkalmazás AI-alapú edzésterv generálással és teljes körű fitness követéssel.

## ✨ Főbb Funkciók

### 👤 Felhasználói Profil
- **Teljes profil kezelés**: Név, email, életkor, súly, magasság
- **BMI számítás**: Automatikus kategorizálás (alulsúlyos, normál, túlsúlyos, elhízott)
- **Statisztikák**: Teljesített edzések száma, aktuális hét
- **Vendég mód**: Azonnali használat regisztráció nélkül

### 🤖 AI Edzésterv Generálás
- **Groq AI integráció** (Llama 3.1 modell)
- **Személyre szabott tervek**: Életkor, súly, magasság és fitness szint alapján
- **8 hetes program**: 8 hét × 5 nap × 5 gyakorlat (~200 feladat)
- **Intelligens ajánlások**: Bemelegítés, fő gyakorlatok, nyújtás

### 📅 Strukturált Edzésprogram
- **Heti bontás**: 8 hét követhető tervezés
- **Napi feladatok**: 5 gyakorlat minden edzésnapra
- **Valós idejű követés**: Checkbox alapú teljesítés jelölés
- **Automatikus haladás**: Nap teljesítve → Hét teljesítve

### 💾 Adatmegőrzés
- **AsyncStorage**: Helyi adattárolás
- **Felhasználónként elkülönítve**: Minden user saját adatokkal
- **Kijelentkezés után is megmarad**: userName alapú kulcsok
- **Offline működés**: Backend nélkül is használható

### 🎨 Modern UI/UX
- **Magyar nyelv**: Teljes lokalizáció
- **Reszponzív design**: Mobil és web támogatás
- **Emoji ikonok**: Vizuális visszajelzések (✅ 🏃 💪 🦵)
- **Intuitív navigáció**: Tab-alapú menü (Főoldal, Terv, Edzés, Profil)

---

## 🚀 Telepítés és Futtatás

### Előfeltételek
- Node.js 16+
- MongoDB 5+ vagy MongoDB Atlas (opcionális)
- Expo CLI
- Groq API kulcs (ingyenes: https://console.groq.com/)

### Backend Indítása

```bash
cd backend
npm install

# MongoDB indítása Docker-rel (ajánlott)
docker-compose up -d

# Vagy MongoDB Atlas connection string a .env fájlban
# MONGO_URI=mongodb+srv://...

# .env fájl létrehozása és kitöltése
# GROQ_API_KEY=gsk_...
# MONGO_URI=mongodb://localhost:27017/workout_app
# JWT_SECRET=your-secret-key

npm run dev
```

### Frontend Indítása

```bash
cd frontend
npm install
npx expo start

# Web: nyomd meg a 'w' billentyűt
# Android: 'a' (emulátor) vagy Expo Go QR kód szkennelés
# iOS: 'i' (emulátor) vagy Camera app QR kód szkennelés
```

---

## 🏗️ Architektúra

### Frontend Stack
- **React Native** + **Expo** (SDK 54)
- **TypeScript** a típusbiztonságért
- **Expo Router** fájl-alapú navigációval
- **AsyncStorage** helyi adattároláshoz
- **Platform-aware API calls** (web/native)

### Backend Stack
- **Node.js** + **Express** 
- **MongoDB** + **Mongoose** ODM
- **JWT** token-alapú autentikáció
- **Groq AI API** (Llama 3.1-8b-instant modell)
- **RESTful API** design
- **CORS** enabled mobil támogatással

### Projekt Struktúra

```
workout_app_szfm_2025/
├── backend/
│   ├── src/
│   │   ├── controllers/       # API endpoint logika
│   │   ├── models/            # Mongoose sémák
│   │   ├── routes/            # Express route-ok
│   │   ├── services/          # AI és üzleti logika
│   │   ├── middleware/        # Auth middleware
│   │   └── config/            # DB konfiguráció
│   ├── .env                   # Környezeti változók
│   └── docker-compose.yml     # MongoDB Docker setup
│
└── frontend/
    ├── app/
    │   ├── (tabs)/            # Tab navigáció
    │   │   ├── index.tsx      # Főoldal (hetek listája)
    │   │   ├── plan.tsx       # Terv tab (AI generálás)
    │   │   ├── workout.tsx    # Edzés tab (feladatok)
    │   │   └── profile.tsx    # Profil tab
    │   ├── _components/       # Újrafelhasználható komponensek
    │   ├── home.tsx           # Főoldal komponens
    │   ├── week.tsx           # Hét nézet (5 nap)
    │   └── day.tsx            # Nap nézet (5 feladat)
    └── services/
        ├── authService.ts     # Auth API hívások
        ├── workoutService.ts  # Workout API hívások
        └── storageKeys.ts     # Felhasználó-specifikus kulcsok
```

---

## 📊 Adatmodellek

### Workout Schema (MongoDB)
```javascript
{
  week: Number,          // 1-8
  day: Number,           // 1-5 (hétfő-péntek)
  taskNumber: Number,    // 1-5
  description: String,   // "Fekvőtámasz - 15 reps"
  completed: Boolean,    // false alapértelmezetten
  user: ObjectId         // User referencia
}
```

### User Schema (MongoDB)
```javascript
{
  name: String,
  email: String,
  password: String,      // bcrypt hash
  age: Number,
  weight: Number,        // kg
  height: Number,        // cm
  fitnessLevel: String,  // 'beginner', 'intermediate', 'advanced'
  workoutPreferences: {
    focusAreas: [String],
    timePerSession: Number
  }
}
```

### AsyncStorage Kulcsok (Frontend)
```
{userName}:week{N}-done              // Hét teljesítve
{userName}:week{N}-day{D}-done       // Nap teljesítve
{userName}:task-{N}-{D}-{ID}         // Feladat teljesítve
generatedPlan                         // AI által generált terv
aiPlanText                            // AI szöveges javaslat
userName, authToken, user, userBmi    // Auth adatok
```

---

## 🛠️ API Végpontok

### Auth Endpoints
```
POST /api/auth/register    # Új felhasználó regisztráció
POST /api/auth/login       # Bejelentkezés
PUT  /api/auth/profile     # Profil frissítés
```

### Workout Endpoints
```
GET  /api/workouts?week={N}&day={D}  # Feladatok lekérése
POST /api/workouts/generate          # AI terv generálás
PUT  /api/workouts/:id               # Feladat frissítés
```

---

## ✅ Implementált Funkciók

- ✅ **Felhasználói regisztráció/bejelentkezés** (vendég mód is)
- ✅ **Profil szerkesztés** (név, életkor, súly, magasság)
- ✅ **AI edzésterv generálás** (Groq API + Llama 3.1)
- ✅ **8 hetes edzésprogram** (8 hét × 5 nap × 5 feladat)
- ✅ **Valós idejű progress követés** (feladat/nap/hét teljesítés)
- ✅ **Adat perzisztencia** (AsyncStorage + MongoDB)
- ✅ **Automatikus teljesítés észlelés** (minden feladat → nap kész)
- ✅ **Felhasználónkénti elkülönítés** (userName-alapú kulcsok)
- ✅ **Offline mód** (backend nélkül is működik mock adatokkal)
- ✅ **Platform-aware** (web és mobil támogatás)
- ✅ **Magyar lokalizáció** (teljes UI)

---

## 🔮 Közelgő Funkciók

- 🔲 **Testreszabható edzésprogramok** (saját gyakorlatok hozzáadása)
- 🔲 **Részletes statisztikák** (grafikonok, trendek)
- 🔲 **Social sharing** (eredmények megosztása)
- 🔲 **Push notifikációk** (edzés emlékeztetők)
- 🔲 **Video útmutatók** (gyakorlatok bemutatása)
- 🔲 **Táplálkozási tanácsok** (AI-alapú)

---

## 🧪 Tesztelés

```bash
# Backend tesztek (ha vannak)
cd backend
npm test

# Frontend tesztek
cd frontend
npm test
```

---

## 📈 Teljesítmény

- **Offline támogatás**: Teljes (AsyncStorage alapú)
- **Adat pontosság**: 100% (felhasználónkénti elkülönítés)
- **API válaszidő**: <500ms (Groq AI: ~2-3s terv generálásnál)
- **Bundle méret**: ~10MB (Expo optimalizált)

---

## 👥 Fejlesztők

| Szerepkör | Név |
|-----------|-----|
| Frontend logika | Istráb Csaba |
| Frontend UI | Müller Róbert |
| Backend API | Bihari Levente |
| Adatbázis | Lendvai-Benyó Dániel |

---

## 🔗 Linkek

- **GitHub Repository**: https://github.com/csabaistrab/workout_app_szfm_2025
- **Groq AI**: https://console.groq.com/
- **Expo**: https://expo.dev/

---

## 📝 Verzió Történet

### v1.0.0 (2025-12-07)
- ✅ Alap funkciók implementálva
- ✅ AI terv generálás (Groq API)
- ✅ Felhasználói profil kezelés
- ✅ 8 hetes edzésprogram
- ✅ AsyncStorage perzisztencia
- ✅ Magyar lokalizáció
- ✅ Tesztelés befejezve
- ✅ Dokumentáció kész

---

## 📄 Licenc

Ez a projekt oktatási célból készült a Szoftverfejlesztési módszertanok tárgy keretében.

---

## 🙏 Köszönetnyilvánítás

- **Groq** az ingyenes AI API-ért
- **Expo** a React Native fejlesztői eszközökért
- **MongoDB** az adatbázis megoldásért