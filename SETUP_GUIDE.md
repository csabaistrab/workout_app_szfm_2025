# Comprehensive Backend Setup & Testing Guide

Complete end-to-end guide for setting up your Workout App backend with Google Generative AI, MongoDB Atlas, and authentication.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Cloud Setup (Gemini API)](#google-cloud-setup)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Environment Configuration](#environment-configuration)
5. [Install & Run Backend](#install--run-backend)
6. [Automated Testing](#automated-testing)
7. [Manual Testing](#manual-testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js 18+** — Run `node --version` to check
- **npm 8+** — Run `npm --version` to check
- **Git** (optional) — for version control
- **Browser** — to access Google Cloud Console and MongoDB Atlas
- **Email** — for Google Cloud and MongoDB Atlas accounts

If you need to upgrade Node: https://nodejs.org/

---

## Google Cloud Setup

### Step 1: Create a Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Click the project dropdown at the top → **Select a Project** → **NEW PROJECT**
3. Enter a project name (e.g., "Workout App")
4. Click **CREATE**
5. Wait for the project to be created (may take 30 seconds)

### Step 2: Enable Billing

1. In the Google Cloud Console, click the **☰ Menu** → **Billing**
2. Click **LINK A BILLING ACCOUNT**
3. Follow the prompts to add a payment method (you get free trial credits)
4. Confirm billing is linked to your project

### Step 3: Enable the Generative Language API

1. Go to **APIs & Services** → **Library**
2. Search for "Generative Language API"
3. Click the result
4. Click **ENABLE**
5. Wait ~1 minute for it to activate

### Step 4: Create an API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. A dialog will show your new API key
4. Click the copy icon to copy it
5. **Save this API key somewhere safe** — you'll need it for `.env`

#### Optional: Restrict the API Key (Recommended for Production)

1. In the Credentials page, find your API key and click it
2. Under **Application restrictions**, select **HTTP referrers** (or **None** for localhost testing)
3. Under **API restrictions**, select **Generative Language API**
4. Click **SAVE**

### Step 5: Verify API Works (Optional)

Test your API key directly:

```bash
# Replace YOUR_API_KEY with your actual key
curl -X POST "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": { "text": "Say hello in one sentence" },
    "temperature": 0.7,
    "maxOutputTokens": 50
  }'
```

**Success response** will include:
```json
{
  "candidates": [
    {
      "output": "Hello! I'm here and ready to help."
    }
  ]
}
```

**Failure responses:**
- `API_KEY_INVALID` → Check your API key
- `QUOTA_EXCEEDED` → You've hit free tier limits
- `RESOURCE_EXHAUSTED` → API not fully enabled

---

## MongoDB Atlas Setup

### Step 1: Create a MongoDB Account

1. Go to https://www.mongodb.com/cloud/atlas/
2. Click **Try Free**
3. Sign up with email or Google/GitHub
4. Accept terms and verify email

### Step 2: Create a Cluster

1. On the dashboard, click **Build a Cluster**
2. Choose **M0 free tier**
3. Select a cloud provider and region (closest to you for best performance)
4. Click **Create** (wait 5-10 minutes)

### Step 3: Create a Database User

1. In your cluster page, go to **Security** → **Database Access**
2. Click **+ Add New Database User**
3. Enter username: `app_user` (or choose your own)
4. For password:
   - Select **Autogenerate Secure Password** (recommended)
   - OR manually enter a strong password (20+ chars with uppercase, numbers, symbols)
5. **Built-in role**: Select `readWrite` on your app database
6. Click **Add User**
7. **Copy the generated password** and save it somewhere safe

### Step 4: Configure Network Access

1. Still in your cluster, go to **Security** → **Network Access**
2. Click **+ Add IP Address**
3. Choose one:
   - **Add Current IP Address** (for your development machine)
   - OR **0.0.0.0/0** (allows all IPs — only for development/testing)
4. Click **Confirm**

### Step 5: Get the Connection String

1. In your cluster page, click **Connect**
2. Select **Connect Your Application**
3. Driver: **Node.js** / Version: **4.x or later**
4. Copy the connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Replace** `<username>` and `<password>` with your values
6. **Add the database name** at the end of the URL:
   ```
   mongodb+srv://app_user:YourPassword@cluster0.xxxxx.mongodb.net/workout_app?retryWrites=true&w=majority
   ```

7. **Save this connection string** — you'll need it in `.env`

### Step 6: Verify the Connection (Optional)

Install `mongosh` (MongoDB shell):

```bash
# On Windows, using npm
npm install -g mongosh

# Then connect
mongosh "mongodb+srv://app_user:YourPassword@cluster0.xxxxx.mongodb.net/workout_app"

# If connected, try
show collections
```

---

## Environment Configuration

### Step 1: Create `.env` File

In the `backend/` folder, create a new file named `.env` (note: starts with a dot):

```bash
# On macOS/Linux:
touch backend/.env

# On Windows (in PowerShell or Bash):
New-Item -Path backend\.env -ItemType File
# or just create it manually in a text editor
```

### Step 2: Fill in Your Values

Copy the template below and fill in your actual values:

```bash
# MongoDB Atlas Connection String
# Format: mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
MONGO_URI="mongodb+srv://app_user:YourPassword@cluster0.xxxxx.mongodb.net/workout_app?retryWrites=true&w=majority"

# JWT Secret (generate a strong random string)
# You can use: openssl rand -base64 32
JWT_SECRET="your-super-secret-random-string-minimum-32-characters-long"

# Google Generative AI (Gemini) API Key
# From Google Cloud Console Credentials page
GOOGLE_API_KEY="AIza..."

# Optional: Google Cloud settings
GOOGLE_PROJECT_ID="your-gcp-project-id"
GOOGLE_LOCATION="us-central1"
GOOGLE_MODEL="text-bison-001"

# Server Port (optional, defaults to 3000)
PORT=3000
```

### Step 3: Verify `.env` is Correct

- Open `backend/.env` in a text editor
- Check:
  - No trailing spaces after values
  - No quotes around values (unless shown in example)
  - All three required fields are present: `MONGO_URI`, `JWT_SECRET`, `GOOGLE_API_KEY`

### Step 4: Add `.env` to `.gitignore`

Make sure you NEVER commit `.env` to Git (it contains secrets!):

```bash
# In backend/.gitignore, add:
.env
.env.local
.env.*.local
```

---

## Install & Run Backend

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This installs all required packages including:
- Express (web framework)
- Mongoose (MongoDB client)
- bcrypt (password hashing)
- jsonwebtoken (JWT auth)
- dotenv (environment variables)

### Step 2: Verify Installation

```bash
# Check for errors
npm list
```

### Step 3: Start the Backend

```bash
npm run dev
```

**Expected output:**
```
✅ MongoDB connected
✅ Server running on port 3000
```

**If you see an error:**
- `Missing required environment variables: MONGO_URI, JWT_SECRET` → Check `.env` file
- `MongoDB connection error` → Check MONGO_URI and network access
- `Cannot find module` → Run `npm install` again
- `GOOGLE_API_KEY not set` → This is a warning; add it to `.env` for AI features

### Step 4: Keep Backend Running

Leave this terminal open and running. The backend is now accessible at:
- Local: `http://localhost:3000/api`
- Android emulator: `http://10.0.2.2:3000/api`

---

## Automated Testing

### Quick Test Suite

This runs 9 automated tests in sequence to verify everything works:

```bash
# In a NEW terminal (keep backend running in first terminal)
cd backend
node test-api.js
```

**What it tests:**
1. ✅ Google Generative API connection
2. ✅ MongoDB connectivity
3. ✅ User registration
4. ✅ User login
5. ✅ Authenticated plan generation (with AI)
6. ✅ Guest plan generation (no auth)
7. ✅ Fetching workouts
8. ✅ Updating workouts (marking complete)
9. ✅ Database verification

**Expected output:**
```
╔════════════════════════════════════════════════════════════════╗
║         WORKOUT APP - API & DATABASE TEST SUITE                ║
╚════════════════════════════════════════════════════════════════╝

✅ Google API Connection ✓
✅ MongoDB Connection ✓
✅ User Registration ✓
✅ User Login ✓
✅ Workout Plan Generation ✓
✅ Guest Plan Generation ✓
✅ Fetch Workouts ✓
✅ Update Workout ✓
✅ Database Query ✓

Result: 9/9 tests passed
```

### Inspect Your Database

After tests run, see what was created:

```bash
node inspect-db.js
```

**Example output:**
```
Connected to MongoDB

📦 users (1 documents)
  [1]
    {
      "_id": ObjectId("..."),
      "name": "TestUser_1234567890",
      "email": "test_1234567890@example.com",
      ...
    }

📦 workouts (40 documents)
  [1]
    {
      "_id": ObjectId("..."),
      "week": 1,
      "day": 1,
      "taskNumber": 1,
      "description": "Fekvőtámasz - 10 reps",
      "completed": false
    }
  ... and 39 more documents

Summary
  users: 1
  workouts: 40
```

---

## Manual Testing

For detailed curl examples and step-by-step manual testing, see `TESTING_GUIDE.md`.

Quick example:

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "age": 30,
    "weight": 75,
    "height": 180
  }'

# Response will include a token (save this)
# Then generate a plan:

curl -X POST http://localhost:3000/api/workouts/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_FROM_ABOVE" \
  -d '{}'
```

---

## Troubleshooting

### Backend won't start

**Error:** `Cannot find module 'express'`
```bash
npm install
npm start
```

**Error:** `Missing required environment variables`
- Check `.env` exists in `backend/` folder
- Verify it has `MONGO_URI` and `JWT_SECRET`
- No trailing spaces or special characters

### MongoDB connection fails

**Error:** `MongoNetworkError`
- Verify MONGO_URI in `.env` (check copy-paste)
- In MongoDB Atlas → Network Access, add your IP
- Ensure `/workout_app` database name is in the URL

**Error:** `authentication failed`
- Check username and password in connection string
- Verify they match what you created in MongoDB Atlas
- URL-encode special characters in password

### Google API doesn't work

**Error:** `Google Generative API error: 401`
- Copy API key correctly (no spaces or typos)
- Verify API key in Google Cloud Console is active
- Check Generative Language API is enabled

**Error:** `QUOTA_EXCEEDED`
- You've hit the free tier quota limit
- Wait a few minutes or upgrade billing

**Warning:** `GOOGLE_API_KEY not set`
- This is just a warning; system still works
- Without API key, plans use heuristic generation (no AI text)
- Add key to `.env` to enable AI

### Tests fail

**Error:** `Cannot find module`
```bash
cd backend
npm install
node test-api.js
```

**Error:** `Cannot connect to server`
- Ensure backend is running: `npm run dev` in another terminal
- Verify backend is on port 3000
- Check no firewall is blocking `localhost:3000`

---

## Next Steps

Once all tests pass (9/9):

1. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

2. **Test the full app:**
   - Register a new user
   - View your AI-generated workout plan
   - Mark workouts as complete
   - Check progress tracking

3. **Deploy to production:**
   - Choose a hosting provider (Railway, Render, Heroku)
   - Set environment variables there
   - Run tests on the deployed URL
   - Monitor database and API logs

---

## File Reference

```
backend/
├── .env                    ← YOUR SECRETS (do not commit!)
├── .env.example            ← Template for .env
├── package.json            ← Dependencies
├── src/
│   ├── index.js           ← Express app entry point
│   ├── config/
│   │   └── db.js          ← MongoDB connection
│   ├── models/
│   │   ├── User.js        ← User schema + password hashing
│   │   └── Workout.js     ← Workout schema
│   ├── controllers/
│   │   ├── authController.js    ← Register/login logic
│   │   └── workoutController.js ← Plan generation logic
│   ├── services/
│   │   └── aiService.js   ← Google Generative API client
│   ├── routes/
│   │   ├── auth.js        ← Auth endpoints
│   │   └── workouts.js    ← Workout endpoints
│   └── middleware/
│       └── auth.js        ← JWT verification
├── test-api.js            ← Automated test suite
├── inspect-db.js          ← Database inspector
├── TESTING_GUIDE.md       ← Detailed testing docs
└── README_TESTING.md      ← Test tools reference
```

---

## Quick Checklist

- [ ] Node.js 18+ installed
- [ ] Google Cloud project created
- [ ] Generative Language API enabled
- [ ] Google API key created and saved
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB user created (app_user)
- [ ] MongoDB network access configured
- [ ] MongoDB connection string copied
- [ ] `.env` file created in `backend/`
- [ ] `.env` filled with all required values
- [ ] `npm install` completed successfully
- [ ] `npm run dev` shows "MongoDB connected"
- [ ] `node test-api.js` shows 9/9 tests passed
- [ ] `node inspect-db.js` shows users and workouts

---

## Support

If you run into issues:

1. Check the **Troubleshooting** section above
2. Review backend logs: check the `npm run dev` terminal output
3. Read **TESTING_GUIDE.md** for detailed manual testing steps
4. Check database: `node inspect-db.js`
5. Verify API key: Use the curl test in the Google Cloud section

---

**Congratulations! Your backend is ready!** 🎉

Now you can:
- Start the frontend
- Register users
- Generate AI-powered workout plans
- Track progress

Let's build something amazing! 🚀
