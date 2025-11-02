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

export const generateAIWorkoutPlan = async (user) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional fitness trainer creating personalized workout plans."
        },
        {
          role: "user",
          content: generateWorkoutPrompt(user)
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    // Parse and structure the AI response
    const workoutPlan = completion.choices[0].message.content;
    
    // Here you could add additional processing to parse the AI response
    // into a structured format that matches your Workout model
    
    return {
      rawPlan: workoutPlan,
      generatedAt: new Date(),
      userId: user.id
    };
  } catch (error) {
    console.error('Error generating AI workout plan:', error);
    throw new Error('Failed to generate AI workout plan');
  }
};

export const getExerciseRecommendations = async (user, currentExercise) => {
  try {
    const prompt = `Based on the user's profile:
    - Age: ${user.age}
    - Fitness Level: ${user.fitnessLevel}
    - Current Exercise: ${currentExercise}

    Suggest 3 alternative exercises that:
    1. Target the same muscle groups
    2. Match their fitness level
    3. Include proper form instructions
    4. List benefits and precautions`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a fitness expert providing exercise alternatives and proper form guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error getting exercise recommendations:', error);
    throw new Error('Failed to get exercise recommendations');
  }
};