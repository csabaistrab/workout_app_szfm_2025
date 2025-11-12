// Google Generative API (Gemini / text-bison) integration via REST
// Using only Google's Generative Language API for AI-powered workout recommendations

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PROJECT = process.env.GOOGLE_PROJECT_ID || process.env.GOOGLE_PROJECT || '';
const GOOGLE_LOCATION = process.env.GOOGLE_LOCATION || 'us-central1';
const GOOGLE_MODEL = process.env.GOOGLE_MODEL || 'text-bison-001';

const buildPrompt = (user, extra = '') => {
  const focus = (user.workoutPreferences && user.workoutPreferences.focusAreas && user.workoutPreferences.focusAreas.length)
    ? user.workoutPreferences.focusAreas.join(', ')
    : 'general fitness';

  return `Generate a personalized, practical and safe workout plan for a person with the following characteristics:\n` +
    `Age: ${user.age}\nWeight: ${user.weight} kg\nHeight: ${user.height} cm\nFitness Level: ${user.fitnessLevel}\nFocus Areas: ${focus}\nTime per Session: ${user.workoutPreferences?.timePerSession || 30} minutes\n\n` +
    `Requirements:\n` +
    `1) Tailor difficulty to the fitness level.\n` +
    `2) Include exercises, sets, reps/duration and rest suggestions.\n` +
    `3) Provide a 5-day plan with short descriptions and progressive cues.\n` +
    `4) Flag any precautions for higher-risk users (elderly, obesity).\n` +
    `${extra}\n`;
};

async function callGoogleGenerate(prompt, { temperature = 0.7, maxOutputTokens = 800 } = {}) {
  if (!GOOGLE_API_KEY) throw new Error('GOOGLE_API_KEY not configured');

  const base = process.env.GOOGLE_API_BASE || 'https://generativelanguage.googleapis.com';
  const path = `/v1beta2/models/${encodeURIComponent(GOOGLE_MODEL)}:generate`;
  const url = `${base}${path}?key=${encodeURIComponent(GOOGLE_API_KEY)}`;

  const body = {
    prompt: { text: prompt },
    temperature,
    maxOutputTokens
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Google Generative API error: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();

  if (data.candidates && data.candidates.length) {
    return data.candidates[0].output || data.candidates[0].content || data.candidates[0].text || JSON.stringify(data.candidates[0]);
  }

  if (data.choices && data.choices.length) {
    return data.choices[0].text || data.choices[0].message?.content || JSON.stringify(data.choices[0]);
  }

  if (data.output) return data.output;

  return JSON.stringify(data);
}

export const generateAIWorkoutPlan = async (user) => {
  try {
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY not set');
    }

    const prompt = buildPrompt(user);
    const raw = await callGoogleGenerate(prompt, { temperature: 0.7, maxOutputTokens: 1200 });

    return {
      rawPlan: raw,
      generatedAt: new Date(),
      userId: user.id || null
    };
  } catch (error) {
    console.error('Error generating AI workout plan (Google):', error?.message || error);
    throw error;
  }
};

export const getExerciseRecommendations = async (user, currentExercise) => {
  try {
    if (!GOOGLE_API_KEY) throw new Error('GOOGLE_API_KEY not configured');
    const prompt = `Based on the user's profile:\n- Age: ${user.age}\n- Fitness Level: ${user.fitnessLevel}\n- Current Exercise: ${currentExercise}\n\nSuggest 3 alternative exercises that target similar muscle groups, include brief form tips, benefits and any precautions.`;
    const raw = await callGoogleGenerate(prompt, { temperature: 0.6, maxOutputTokens: 400 });
    return raw;
  } catch (error) {
    console.error('Error getting exercise recommendations (Google):', error?.message || error);
    throw error;
  }
};