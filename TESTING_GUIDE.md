# Testing Guide: Verifying API Connection, AI Generation, and Database Storage

This guide covers multiple ways to test your workout app backend to ensure:
1. Google Generative API is working
2. Users are being stored correctly in MongoDB
3. Workout plans are being generated and persisted
4. All endpoints are functioning properly

---

## Quick Start: Automated Test Suite

The easiest way to test everything at once is to use the test script:

### Step 1: Ensure Backend is Running
```bash
cd backend
npm run dev
```

### Step 2: Run the Test Suite
In a separate terminal:
```bash
cd backend
node test-api.js
```

**What it tests:**
- ✅ Google Generative API connection
- ✅ MongoDB connection
- ✅ User registration
- ✅ User login
- ✅ Authenticated workout plan generation
- ✅ Guest workout plan generation
- ✅ Fetching workouts
- ✅ Updating workouts (marking complete)
- ✅ Database records verification

**Expected output:**
```
✅ Google API Connection ✓
✅ User Registration ✓
✅ User Login ✓
✅ Workout Plan Generation ✓
✅ Fetch Workouts ✓
✅ Update Workout ✓
Result: 9/9 tests passed
```

---

## Manual Testing with Curl (Advanced)

If you want to test individual endpoints manually, use these curl commands:

### Test 1: Google API Connection (Quick Validation)
Test if your API key works by making a direct call:

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": { "text": "Say hello" },
    "temperature": 0.7,
    "maxOutputTokens": 100
  }'
```

Replace `YOUR_API_KEY` with your actual Google API key.

**Success response:** You'll see `"candidates": [{"output": "Hello..."}]`

**Failure responses:**
- `"error": "API_KEY_INVALID"` → API key is wrong or expired
- `"error": "QUOTA_EXCEEDED"` → You've hit the quota limit
- `"error": "PERMISSION_DENIED"` → Generative Language API not enabled in your GCP project

---

### Test 2: User Registration
Create a new test user (use a unique email each time):

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test_'$(date +%s)'@example.com",
    "password": "TestPassword123!",
    "age": 28,
    "weight": 75,
    "height": 180,
    "fitnessLevel": "beginner",
    "workoutPreferences": {
      "focusAreas": ["strength", "cardio"],
      "timePerSession": 45
    }
  }'
```

**Success response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test_1234567890@example.com",
    "age": 28,
    "weight": 75,
    "height": 180,
    "fitnessLevel": "beginner"
  }
}
```

**Save the token** from the response for the next tests.

---

### Test 3: User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test_1234567890@example.com",
    "password": "TestPassword123!"
  }'
```

**Success response:** Returns token and user object (same structure as registration)

---

### Test 4: Generate Workout Plan (Authenticated User)
Use the token from registration/login:

```bash
curl -X POST http://localhost:3000/api/workouts/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{}'
```

**Success response:**
```json
{
  "bmi": "23.1",
  "category": "normal",
  "plan": [
    {
      "id": "507f1f77bcf86cd799439012",
      "week": 1,
      "day": 1,
      "taskNumber": 1,
      "description": "Fekvőtámasz - 10 reps",
      "completed": false
    },
    ...
  ],
  "aiRaw": "Here's a personalized workout plan for you..."
}
```

**Key things to verify:**
- `plan` array has workout objects
- Each workout has `id`, `week`, `day`, `taskNumber`, `description`, `completed`
- `aiRaw` contains the AI-generated text plan
- Response includes `bmi` and `category`

---

### Test 5: Generate Workout Plan (Guest - No Auth)
```bash
curl -X POST http://localhost:3000/api/workouts/generate \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 85,
    "height": 175,
    "age": 35,
    "fitnessLevel": "intermediate"
  }'
```

**Expected:** Same structure as Test 4, but doesn't require authentication.

---

### Test 6: Fetch Workouts
Retrieve workouts for a specific week and day:

```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  "http://localhost:3000/api/workouts?week=1&day=1"
```

**Success response:** Array of workout objects:
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "week": 1,
    "day": 1,
    "taskNumber": 1,
    "description": "Fekvőtámasz - 10 reps",
    "completed": false
  },
  ...
]
```

---

### Test 7: Mark Workout as Complete
Update a workout by ID:

```bash
curl -X PUT http://localhost:3000/api/workouts/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"completed": true}'
```

**Success response:**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "week": 1,
  "day": 1,
  "taskNumber": 1,
  "description": "Fekvőtámasz - 10 reps",
  "completed": true
}
```

---

## MongoDB Direct Query (Using MongoDB Atlas UI)

To verify data is actually in your database:

### Via MongoDB Atlas Web UI:
1. Go to https://cloud.mongodb.com/
2. Select your Cluster → Collections
3. You'll see your database name (e.g., `workout_app`)
4. Inside, you'll see two collections:
   - `users` — contains registered users
   - `workouts` — contains generated workout tasks

### Example User Document:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Test User",
  "email": "test_1234567890@example.com",
  "passwordHash": "$2b$10$...",
  "age": 28,
  "weight": 75,
  "height": 180,
  "fitnessLevel": "beginner",
  "workoutPreferences": {
    "focusAreas": ["strength", "cardio"],
    "timePerSession": 45
  },
  "createdAt": ISODate("2025-11-12T10:30:00Z"),
  "updatedAt": ISODate("2025-11-12T10:30:00Z")
}
```

### Example Workout Document:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "week": 1,
  "day": 1,
  "taskNumber": 1,
  "description": "Fekvőtámasz - 10 reps",
  "completed": false
}
```

---

## MongoDB Direct Query (Command Line)

If you have `mongosh` installed locally:

```bash
# Connect to your MongoDB Atlas cluster
mongosh "mongodb+srv://app_user:YourPassword@cluster0.xxxxx.mongodb.net/workout_app"

# View all users
db.users.find()

# Count users
db.users.countDocuments()

# Find a specific user by email
db.users.findOne({ email: "test_1234567890@example.com" })

# View all workouts
db.workouts.find()

# Count workouts
db.workouts.countDocuments()

# Find workouts for week 1, day 1
db.workouts.find({ week: 1, day: 1 })

# Find completed workouts
db.workouts.find({ completed: true })

# Exit mongosh
exit
```

---

## Checking Backend Logs for AI Generation

When a plan is generated, your backend logs should show:

**Success case:**
```
2025-11-12T10:30:00 ✅ Server running on port 3000
2025-11-12T10:30:15 [POST /api/auth/register] User registered: test_1234567890@example.com
2025-11-12T10:30:20 [POST /api/workouts/generate] Generating plan with AI...
2025-11-12T10:30:25 [POST /api/workouts/generate] Plan generated: 40 tasks saved to database
```

**Failure case (Google API error):**
```
2025-11-12T10:30:25 Error generating AI workout plan (Google): Google Generative API error: 401 Unauthorized
2025-11-12T10:30:25 [POST /api/workouts/generate] Falling back to heuristic plan...
2025-11-12T10:30:26 [POST /api/workouts/generate] Plan generated: 40 tasks saved to database (heuristic, no AI)
```

---

## Common Issues and How to Fix Them

### Issue 1: "Google Generative API error: 401"
**Cause:** API key is invalid or doesn't have permission.

**Fix:**
1. Verify your API key in `.env` is correct (no extra spaces)
2. Confirm the Generative Language API is enabled in your GCP project
3. Check that the API key isn't restricted to a different API
4. Verify your Google Cloud project has billing enabled

### Issue 2: "Cannot connect to MongoDB"
**Cause:** Connection string is wrong or IP is not whitelisted.

**Fix:**
1. In MongoDB Atlas → Network Access, verify your current IP is whitelisted
2. Double-check the connection string: `mongodb+srv://app_user:password@cluster.xxxxx.mongodb.net/workout_app?...`
3. Ensure database name is included (e.g., `/workout_app`)
4. Make sure no special characters in password need URL encoding

### Issue 3: "Missing required environment variables"
**Cause:** `.env` file doesn't exist or is missing values.

**Fix:**
1. Create `.env` in the `backend/` folder (copy from `.env.example`)
2. Fill in all required values: `MONGO_URI`, `JWT_SECRET`, `GOOGLE_API_KEY`
3. Verify no trailing spaces or quotes in values

### Issue 4: "GOOGLE_API_KEY not set — AI features will be disabled"
**This is a warning, not an error.** It means:
- The backend still works
- Workout plans will be generated (heuristic, not AI)
- Set `GOOGLE_API_KEY` in `.env` to enable AI features

### Issue 5: Test script says "Cannot find module"
**Fix:** Make sure you're running the test from the `backend/` directory:
```bash
cd backend
node test-api.js
```

---

## What to Look For: Confirming AI Generation

When you run a plan generation request, the response includes `aiRaw`. This field contains the actual text generated by Google's AI.

**Example `aiRaw` output:**
```
"Here's a personalized 5-day fitness plan tailored to your fitness level and goals:

Day 1: Full Body Strength
- Warm-up: 5 minutes of light cardio
- Squats: 3 sets of 10 reps
- Push-ups: 3 sets of 8 reps
- Rest: 60 seconds between sets

Day 2: Cardio & Core...
"
```

**If `aiRaw` is null or empty:**
- The Google API wasn't available
- The backend fell back to the heuristic plan (still works fine)
- Check your `.env` for `GOOGLE_API_KEY` and verify it's valid

---

## Complete Test Workflow

Here's the recommended step-by-step testing flow:

1. **Backend running?**
   ```bash
   npm run dev
   # Should show: ✅ MongoDB connected, ✅ Server running on port 3000
   ```

2. **Run automated tests:**
   ```bash
   node test-api.js
   # Should show: Result: 9/9 tests passed
   ```

3. **Check database via Atlas UI:**
   - Go to https://cloud.mongodb.com/
   - See new `users` and `workouts` collections with data

4. **Check Google API logs:**
   - Open your backend logs terminal
   - Look for AI plan generation messages

5. **Manual curl test (optional):**
   ```bash
   # Test a specific endpoint
   curl -X POST http://localhost:3000/api/auth/register ...
   ```

6. **Start frontend and test full flow:**
   ```bash
   npm start # in frontend folder
   # Register → Plan generates → See workouts in app
   ```

---

## Summary

- **Auto test suite:** `node test-api.js` (tests everything)
- **Manual API tests:** Use curl commands in this guide
- **Database verification:** MongoDB Atlas UI or `mongosh`
- **AI check:** Look for `aiRaw` field in plan response or backend logs
- **Troubleshooting:** Refer to the Common Issues section

You now have full testing coverage for your entire system! 🚀
