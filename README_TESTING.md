# Backend Testing Tools & Guide

This directory includes automated testing scripts to verify your entire Workout App backend is working correctly.

## 📋 Quick Reference

| Tool | Purpose | Command |
|------|---------|---------|
| **test-api.js** | Full automated test suite (9 tests) | `node test-api.js` |
| **inspect-db.js** | View what's in your MongoDB database | `node inspect-db.js` |
| **TESTING_GUIDE.md** | Detailed manual testing guide with curl examples | (read as markdown) |

---

## 🚀 Quick Start (Recommended)

### 1. Start Backend
```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ MongoDB connected
✅ Server running on port 3000
```

### 2. Run Automated Tests (in a new terminal)
```bash
cd backend
node test-api.js
```

**What it does:**
- ✅ Tests Google Generative API connection
- ✅ Tests MongoDB connectivity
- ✅ Creates a test user (registration)
- ✅ Tests user login
- ✅ Generates AI workout plan (authenticated)
- ✅ Generates workout plan for guest (no auth)
- ✅ Fetches workouts from database
- ✅ Marks a workout as completed
- ✅ Queries the database to verify data storage

**Expected result:**
```
Result: 9/9 tests passed
```

### 3. Inspect Your Database
After running the tests, see what was created:

```bash
node inspect-db.js
```

**Example output:**
```
Connected to MongoDB

📦 users (1 documents)
  [1] { _id: ..., email: "test_123@example.com", name: "TestUser_1234567890", age: 28, ... }

📦 workouts (40 documents)
  [1] { _id: ..., week: 1, day: 1, taskNumber: 1, description: "Fekvőtámasz - 10 reps", completed: false, ... }
  [2] { _id: ..., week: 1, day: 1, taskNumber: 2, description: "Guggolás - 15 reps", completed: false, ... }
  [3] { _id: ..., week: 1, day: 1, taskNumber: 3, description: "Plank - 30 reps", completed: false, ... }
  ... and 37 more documents

Summary
  users: 1
  workouts: 40
```

---

## 🧪 What Each Test Checks

### Test 1: Google Generative API Connection
- **Tests:** Can we reach Google's API and get a response?
- **Checks:** API key validity, API enablement, quota
- **Success:** Returns a sample fitness tip
- **Failure:** Check API key, enable Generative Language API, verify billing

### Test 2: MongoDB Connection
- **Tests:** Can we connect to MongoDB Atlas?
- **Checks:** Connection string, network access, credentials
- **Success:** "Connected to MongoDB"
- **Failure:** Check MONGO_URI in .env, verify IP is whitelisted

### Test 3: User Registration
- **Tests:** Can we create a new user?
- **Checks:** User model validation, password hashing, token generation
- **Success:** Returns user object and JWT token
- **Failure:** Check auth controller, ensure bcrypt is installed

### Test 4: User Login
- **Tests:** Can existing users log in?
- **Checks:** Password verification, token generation
- **Success:** Returns token and user data
- **Failure:** Check password hashing, JWT secret

### Test 5: Workout Plan Generation (Authenticated)
- **Tests:** Can we generate a plan using a user's stored profile?
- **Checks:** Google API call, database save, AI response parsing
- **Success:** Returns 40 workout tasks with AI description
- **Failure:** Check Google API key or connection

### Test 6: Workout Plan Generation (Guest)
- **Tests:** Can we generate a plan without authentication?
- **Checks:** Body parameter handling, guest flow
- **Success:** Returns 40 workout tasks
- **Failure:** Check route configuration, model name

### Test 7: Fetch Workouts
- **Tests:** Can we retrieve workouts from the database?
- **Checks:** Query filtering, JWT validation
- **Success:** Returns array of workout objects for week 1, day 1
- **Failure:** Check workout model, query logic

### Test 8: Update Workout
- **Tests:** Can we mark a workout as complete?
- **Checks:** Database update, completion tracking
- **Success:** Workout object shows `completed: true`
- **Failure:** Check update controller, model schema

### Test 9: Database Verification
- **Tests:** Is data actually stored in MongoDB?
- **Checks:** Collection existence, document count, field values
- **Success:** Shows user and workout documents
- **Failure:** Check MongoDB connection

---

## 🔍 Manual Testing (Advanced)

For detailed curl commands and manual API testing, see **TESTING_GUIDE.md**.

Quick example:
```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Dani","email":"dani@test.com","password":"secret","age":30,"weight":75,"height":180}'

# Generate a plan (guest)
curl -X POST http://localhost:3000/api/workouts/generate \
  -H "Content-Type: application/json" \
  -d '{"weight":75,"height":180}'
```

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Check Node version (need 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check .env exists and has MONGO_URI, JWT_SECRET
cat .env
```

### Tests fail with "Cannot find module"
```bash
# Make sure you're in the backend directory
cd backend

# Install missing dependencies
npm install

# Run test
node test-api.js
```

### "Google API error: 401"
- Check API key in `.env` is correct
- Enable Generative Language API in GCP Console
- Verify billing is enabled
- Try the direct API test in TESTING_GUIDE.md

### "MongoDB connection failed"
- Verify MONGO_URI in `.env`
- Check IP is whitelisted in Atlas Network Access
- Ensure `/workout_app` database name is in the connection string
- Try connecting with mongosh: `mongosh <MONGO_URI>`

### "GOOGLE_API_KEY not set"
- This is just a warning; the system will still work
- Add your API key to `.env` to enable AI features
- Without it, plans use heuristic generation (still 40 tasks, but no AI text)

---

## 📊 Expected Data Structure

After running tests, your MongoDB should contain:

### Users Collection
```json
{
  "_id": ObjectId("..."),
  "name": "TestUser_1234567890",
  "email": "test_1234567890@example.com",
  "passwordHash": "$2b$10$...",
  "age": 28,
  "weight": 75,
  "height": 180,
  "fitnessLevel": "beginner",
  "workoutPreferences": {
    "focusAreas": [],
    "timePerSession": 30
  },
  "lastWorkoutGeneration": null,
  "createdAt": "2025-11-12T10:30:00Z",
  "updatedAt": "2025-11-12T10:30:00Z"
}
```

### Workouts Collection
```json
{
  "_id": ObjectId("..."),
  "week": 1,
  "day": 1,
  "taskNumber": 1,
  "description": "Fekvőtámasz - 10 reps",
  "completed": false
}
```

---

## 🎯 Next Steps

After confirming all tests pass:

1. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

2. **Test the full app flow:**
   - Sign up with new credentials
   - View generated plan
   - Mark workouts as complete
   - Check frontend shows correct progress

3. **Check frontend data:**
   - AsyncStorage should have `authToken` and `user`
   - Inspect browser/emulator storage if needed

4. **Production deployment:**
   - Set environment variables on hosting provider
   - Run tests on deployed URL
   - Monitor database for real user data

---

## 📞 Help & Support

- **Tests failing?** Check TESTING_GUIDE.md troubleshooting section
- **API errors?** Check backend logs with `npm run dev`
- **Database issues?** Use `inspect-db.js` to see what's there
- **Google API problems?** Verify GCP project setup in the main README

---

**Happy testing!** 🚀
