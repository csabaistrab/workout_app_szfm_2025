import fetch from 'node-fetch';

// Support multiple AI providers
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText';

if (!GROQ_API_KEY && !GOOGLE_API_KEY) {
  console.warn('⚠️ No AI API key set (GROQ_API_KEY or GOOGLE_API_KEY) — AI features will fallback to heuristic plans');
}

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

async function callGroqGenerate(prompt, { temperature = 0.7, maxTokens = 1200 } = {}) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not set');

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant', // Fast and free model
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const rawPlan = data?.choices?.[0]?.message?.content || null;
  if (!rawPlan) throw new Error('No AI-generated text returned from Groq');
  return rawPlan;
}

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
    const prompt = buildPrompt(user);
    let rawPlan = null;

    // Try Groq first (faster and free)
    if (GROQ_API_KEY) {
      try {
        rawPlan = await callGroqGenerate(prompt);
        console.log('✅ AI plan generated using Groq');
      } catch (err) {
        console.warn('Groq API failed, trying Google:', err?.message);
      }
    }

    // Fallback to Google if Groq failed or not configured
    if (!rawPlan && GOOGLE_API_KEY) {
      rawPlan = await callGoogleGenerate(prompt);
      console.log('✅ AI plan generated using Google');
    }

    if (!rawPlan) {
      throw new Error('No AI API key configured (need GROQ_API_KEY or GOOGLE_API_KEY)');
    }

    return {
      rawPlan,
      generatedAt: new Date(),
      userId: user.id || null,
    };
  } catch (error) {
    console.error('Error generating AI workout plan:', error?.message || error);
    throw error;
  }
};

export const getExerciseRecommendations = async (user, currentExercise) => {
  try {
    const prompt = `Based on the user's profile:\n- Age: ${user.age}\n- Fitness Level: ${user.fitnessLevel}\n- Current Exercise: ${currentExercise}\n\nSuggest 3 alternative exercises that target similar muscle groups, include brief form tips, benefits and any precautions.`;
    
    let raw = null;
    if (GROQ_API_KEY) {
      try {
        raw = await callGroqGenerate(prompt, { temperature: 0.6, maxTokens: 400 });
      } catch (err) {
        console.warn('Groq failed for exercise recommendations, trying Google');
      }
    }
    
    if (!raw && GOOGLE_API_KEY) {
      raw = await callGoogleGenerate(prompt, { temperature: 0.6, maxOutputTokens: 400 });
    }
    
    if (!raw) throw new Error('No AI API configured');
    return raw;
  } catch (error) {
    console.error('Error getting exercise recommendations:', error?.message || error);
    throw error;
  }
};