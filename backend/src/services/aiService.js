import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const generateWorkoutPrompt = (user) => {
  return `Generate a personalized workout plan for a person with the following characteristics:
Age: ${user.age}
Weight: ${user.weight}kg
Height: ${user.height}cm
Fitness Level: ${user.fitnessLevel}
Focus Areas: ${user.workoutPreferences.focusAreas.join(', ')}
Time per Session: ${user.workoutPreferences.timePerSession} minutes

The workout plan should:
1. Be tailored to their fitness level
2. Include exercises that target their focus areas
3. Fit within their time constraints
4. Consider their BMI and physical condition
5. Include rep ranges and rest periods
6. Have progressive overload principles

Format the response as a structured workout plan for 5 days.`;
};

