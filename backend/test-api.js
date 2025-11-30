#!/usr/bin/env node
/**
 * Backend-local test runner
 * This file is a copy of the documentation test script but adapted to run from the `backend/` folder
 * so imports resolve against the backend's node_modules and src code.
 */
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load .env from backend
dotenv.config();

const API_BASE = process.env.API_BASE || 'http://localhost:3000/api';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(level, message, data = '') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp}]`;
  
  if (level === 'info') console.log(`${colors.cyan}${prefix} ℹ️  ${message}${colors.reset}`, data);
  if (level === 'success') console.log(`${colors.green}${prefix} ✅ ${message}${colors.reset}`, data);
  if (level === 'error') console.log(`${colors.red}${prefix} ❌ ${message}${colors.reset}`, data);
  if (level === 'warning') console.log(`${colors.yellow}${prefix} ⚠️  ${message}${colors.reset}`, data);
  if (level === 'section') console.log(`\n${colors.bright}${colors.blue}==== ${message} ====${colors.reset}\n`);
}

async function testGoogleAPI() {
  log('section', 'TEST 1: Google Generative API Connection');
  
  if (!GOOGLE_API_KEY) {
    log('error', 'GOOGLE_API_KEY not set in .env');
    return false;
  }

  log('info', 'Testing Google Generative API with a sample prompt...');

  const prompt = 'Generate a short 2-sentence fitness tip for beginners.';
  const url = 'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=' + encodeURIComponent(GOOGLE_API_KEY);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 100
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      log('error', `Google API returned ${res.status}`, errorText.substring(0, 200));
      return false;
    }

    const data = await res.json();
    if (data.candidates && data.candidates.length && (data.candidates[0].output || data.candidates[0].content || data.candidates[0].text)) {
      log('success', 'Google API Connection ✓');
      const sample = data.candidates[0].output || data.candidates[0].content || data.candidates[0].text;
      log('info', 'Sample response:', sample.substring(0, 100));
      return true;
    } else {
      log('error', 'Unexpected Google API response format', JSON.stringify(data).substring(0, 200));
      return false;
    }
  } catch (error) {
    log('error', 'Google API request failed', error.message);
    return false;
  }
}

async function testMongoDBConnection() {
  log('section', 'TEST 2: MongoDB Connection');

  if (!MONGO_URI) {
    log('error', 'MONGO_URI not set in .env');
    return false;
  }

  try {
    log('info', 'Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    log('success', 'MongoDB Connection ✓');
    return true;
  } catch (error) {
    log('error', 'MongoDB connection failed', error.message);
    return false;
  }
}

async function testUserRegistration() {
  log('section', 'TEST 3: User Registration');

  const testUser = {
    name: `TestUser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'TestPassword123!',
    age: 28,
    weight: 75,
    height: 180
  };

  log('info', `Registering user: ${testUser.email}`);

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const data = await res.json();

    if (!res.ok) {
      log('error', `Registration failed (${res.status})`, data.message);
      return null;
    }

    if (data.token && data.user) {
      log('success', 'User Registration ✓');
      log('info', `User ID: ${data.user.id}`);
      log('info', `Token: ${data.token.substring(0, 20)}...`);
      return { token: data.token, user: data.user, email: testUser.email, password: testUser.password };
    } else {
      log('error', 'Invalid registration response', JSON.stringify(data).substring(0, 200));
      return null;
    }
  } catch (error) {
    log('error', 'Registration request failed', error.message);
    return null;
  }
}

async function testLogin(email, password) {
  log('section', 'TEST 4: User Login');

  log('info', `Logging in with email: ${email}`);

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      log('error', `Login failed (${res.status})`, data.message);
      return null;
    }

    if (data.token && data.user) {
      log('success', 'User Login ✓');
      log('info', `Token: ${data.token.substring(0, 20)}...`);
      return data.token;
    } else {
      log('error', 'Invalid login response', JSON.stringify(data).substring(0, 200));
      return null;
    }
  } catch (error) {
    log('error', 'Login request failed', error.message);
    return null;
  }
}

async function testPlanGeneration(token, user) {
  log('section', 'TEST 5: Workout Plan Generation (Authenticated User)');

  log('info', 'Requesting AI-generated workout plan for authenticated user...');

  try {
    const res = await fetch(`${API_BASE}/workouts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({})
    });

    const data = await res.json();

    if (!res.ok) {
      log('error', `Plan generation failed (${res.status})`, data.message);
      return null;
    }

    if (data.plan && data.plan.length > 0) {
      log('success', 'Workout Plan Generation ✓');
      log('info', `Generated ${data.plan.length} workout tasks`);
      log('info', `BMI: ${data.bmi}, Category: ${data.category}`);
      if (data.aiRaw) {
        log('info', 'AI Raw Response:', data.aiRaw.substring(0, 150) + '...');
      }
      return data;
    } else {
      log('error', 'No plan data in response', JSON.stringify(data).substring(0, 200));
      return null;
    }
  } catch (error) {
    log('error', 'Plan generation request failed', error.message);
    return null;
  }
}

async function testPlanGenerationGuest() {
  log('section', 'TEST 6: Workout Plan Generation (Guest)');

  log('info', 'Requesting workout plan for guest (no auth)...');

  try {
    const res = await fetch(`${API_BASE}/workouts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weight: 80,
        height: 175,
        age: 32,
        fitnessLevel: 'intermediate'
      })
    });

    const data = await res.json();

    if (!res.ok) {
      log('error', `Guest plan generation failed (${res.status})`, data.message);
      return null;
    }

    if (data.plan && data.plan.length > 0) {
      log('success', 'Guest Plan Generation ✓');
      log('info', `Generated ${data.plan.length} workout tasks`);
      log('info', `BMI: ${data.bmi}, Category: ${data.category}`);
      return data;
    } else {
      log('error', 'No plan data in response', JSON.stringify(data).substring(0, 200));
      return null;
    }
  } catch (error) {
    log('error', 'Guest plan generation request failed', error.message);
    return null;
  }
}

async function testFetchWorkouts(token) {
  log('section', 'TEST 7: Fetch Workouts');

  log('info', 'Fetching workouts for week 1, day 1...');

  try {
    const res = await fetch(`${API_BASE}/workouts?week=1&day=1`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      log('error', `Fetch failed (${res.status})`, data.message);
      return null;
    }

    if (Array.isArray(data) && data.length > 0) {
      log('success', 'Fetch Workouts ✓');
      log('info', `Retrieved ${data.length} workouts`);
      log('info', `First workout: ${data[0].description}`);
      return data[0];
    } else {
      log('warning', 'No workouts found', 'Array is empty or invalid');
      return null;
    }
  } catch (error) {
    log('error', 'Fetch request failed', error.message);
    return null;
  }
}

async function testUpdateWorkout(token, workoutId) {
  log('section', 'TEST 8: Update Workout (Mark Complete)');

  if (!workoutId) {
    log('warning', 'No workout ID provided, skipping update test');
    return null;
  }

  log('info', `Marking workout ${workoutId} as completed...`);

  try {
    const res = await fetch(`${API_BASE}/workouts/${workoutId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed: true })
    });

    const data = await res.json();

    if (!res.ok) {
      log('error', `Update failed (${res.status})`, data.message);
      return null;
    }

    if (data.completed === true) {
      log('success', 'Workout Update ✓');
      log('info', `Workout marked as completed`);
      return data;
    } else {
      log('error', 'Workout not properly updated', JSON.stringify(data).substring(0, 200));
      return null;
    }
  } catch (error) {
    log('error', 'Update request failed', error.message);
    return null;
  }
}

async function queryDatabase() {
  log('section', 'TEST 9: Database Verification');

  try {
    // Import models after mongoose is connected
    const { default: User } = await import('./src/models/User.js');
    const { default: Workout } = await import('./src/models/Workout.js');

    log('info', 'Querying Users collection...');
    const userCount = await User.countDocuments();
    const lastUser = await User.findOne().sort({ createdAt: -1 });

    log('success', `Total users in DB: ${userCount}`);
    if (lastUser) {
      log('info', `Latest user: ${lastUser.email} (${lastUser.name})`);
      log('info', `  - Age: ${lastUser.age}, Weight: ${lastUser.weight}kg, Height: ${lastUser.height}cm`);
      log('info', `  - Fitness Level: ${lastUser.fitnessLevel}`);
    }

    log('info', 'Querying Workouts collection...');
    const workoutCount = await Workout.countDocuments();
    const latestWorkouts = await Workout.find().sort({ createdAt: -1 }).limit(3);

    log('success', `Total workouts in DB: ${workoutCount}`);
    if (latestWorkouts.length > 0) {
      log('info', 'Latest 3 workouts:');
      latestWorkouts.forEach((w, idx) => {
        log('info', `  ${idx + 1}. Week ${w.week}, Day ${w.day}, Task ${w.taskNumber}: ${w.description} (completed: ${w.completed})`);
      });
    }

    return true;
  } catch (error) {
    log('error', 'Database query failed', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log(`\n${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════════════╗
║         WORKOUT APP - API & DATABASE TEST SUITE                ║
║  Testing: Google API | MongoDB | Auth | Workouts | Database    ║
╚════════════════════════════════════════════════════════════════╝
${colors.reset}\n`);

  const results = {};

  // Test 1: Google API
  results.googleAPI = await testGoogleAPI();

  // Test 2: MongoDB Connection
  results.mongoConnection = await testMongoDBConnection();
  if (!results.mongoConnection) {
    log('error', 'Cannot continue without MongoDB connection');
    process.exit(1);
  }

  // Test 3: User Registration
  const authData = await testUserRegistration();
  results.userRegistration = !!authData;

  // Test 4: User Login
  if (authData) {
    const loginToken = await testLogin(authData.email, authData.password);
    results.userLogin = !!loginToken;

    // Test 5: Plan Generation (Authenticated)
    const planData = await testPlanGeneration(loginToken, authData.user);
    results.planGeneration = !!planData;

    // Test 7: Fetch Workouts
    const workout = await testFetchWorkouts(loginToken);
    results.fetchWorkouts = !!workout;

    // Test 8: Update Workout
    if (workout) {
      const updated = await testUpdateWorkout(loginToken, workout.id);
      results.updateWorkout = !!updated;
    }
  }

  // Test 6: Guest Plan Generation
  const guestPlan = await testPlanGenerationGuest();
  results.guestPlanGeneration = !!guestPlan;

  // Test 9: Database Verification
  results.databaseQuery = await queryDatabase();

  // Summary
  log('section', 'TEST SUMMARY');
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`;
    console.log(`  ${status} - ${test}`);
  });

  console.log(`\n${colors.bright}Result: ${passed}/${total} tests passed${colors.reset}\n`);

  // Close MongoDB connection
  await mongoose.connection.close();
  process.exit(passed === total ? 0 : 1);
}

// Run all tests
runAllTests().catch(error => {
  log('error', 'Test suite failed with error', error.message);
  process.exit(1);
});
