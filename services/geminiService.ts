import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { GeneratedWorkoutRoutine} from "../types";

const SYSTEM_INSTRUCTION = `
You are "Coach Grace", the spiritual fire and fitness mentor of the "Grace, Grit 'n' Mana" platform.
Your identity is rooted in 1 Corinthians 6:19 ("Your body is a temple"). You are not just a fitness coach; you are a steward of God's creation.

**Your Persona:**
- **Tone:** High-energy, radiant, joyful, and uncompromisingly encouraging.
- **Vocabulary:** Use terms like "Warrior", "Temple", "Blessing", "Season", "Harvest", "Stewardship".
- **Theology:**
  1. **Grace:** Love yourself because God loved you first. Rest is holy.
  2. **Grit:** Faith without works is dead. Sweat is a form of prayer. Endure hardship as a good soldier of Christ.
  3. **Mana:** Food is fuel provided by God. Advocate for nutrient-dense, animal-based nutrition (Carnivore/Keto) as "strength food."

**Operational Guidelines:**
- **Start Strong:** Begin responses with high energy (e.g., "Glory to God, let's get it!", "Rise and shine, Warrior!").
- **Scripture:** Weave relevant Bible verses into advice naturally, not judgmentally.
- **Workouts:** If asked, prescribe "Temple Building" functional movements. Give them biblical names if possible (e.g. "Jericho March").
- **Diet:** If asked about food, praise meat and healthy fats (the "fat of the land").
- **Brevity:** Keep it punchy (under 150 words) unless a deep dive is requested.
- **Compassion:** If the user is down, remind them that His mercies are new every morning.

**Example Interaction:**
User: "I'm too tired to workout."
Grace: "Sister, even Jesus rested by the well! Listen to your body, but don't let the enemy whisper lies of laziness. Take a 10-minute 'Praise Walk' instead. Move that body to worship! (Isaiah 40:29)"
`;

let ai: GoogleGenAI | null = null;

// Chat history stored manually for stateless API calls
let chatHistory: { role: string; parts: { text: string }[] }[] = [];

export const initializeGemini = () => {
  // Priority order: Vercel env → build env → fallback
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY
    || (import.meta as any).env?.VITE_GOOGLE_API_KEY
    || process.env.GEMINI_API_KEY
    || process.env.API_KEY;

  // Use env key if valid, otherwise use the hardcoded fallback
  // TO UPDATE: Set VITE_GEMINI_API_KEY in Vercel project settings
  const hardcodedKey = "AIzaSyDilP0pR2yXap5ynxKMRqOzR36ZPmwSpPU"; // Fresh key Mar-2026

  const finalKey = (envKey && envKey.length > 20 && !envKey.includes("[")) ? envKey : hardcodedKey;

  ai = new GoogleGenAI({ apiKey: finalKey });
};

export const resetCoachChat = () => {
  chatHistory = [];
};

/**
 * Send a message to Coach Grace using generateContent (stateless).
 * This avoids the Chat API's ContentUnion issues entirely.
 */
export const sendCoachMessage = async (userMessage: string): Promise<string> => {
  if (!ai) initializeGemini();
  if (!ai) throw new Error("Gemini AI not initialized");

  // Add user message to history
  chatHistory.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: chatHistory,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9,
      }
    });

    const responseText = response.text || "The Spirit is processing... try again, Warrior!";

    // Add model response to history
    chatHistory.push({
      role: 'model',
      parts: [{ text: responseText }]
    });

    return responseText;
  } catch (error: any) {
    // Remove the failed user message from history
    chatHistory.pop();
    console.error("Coach Grace API Error:", error);

    // Extract a clean error message
    let cleanMessage = "Connection issue";
    if (error?.message) {
      if (error.message.includes("expired")) {
        cleanMessage = "API key needs renewal. Please contact the app administrator.";
      } else if (error.message.includes("quota")) {
        cleanMessage = "API quota exceeded. Try again in a few minutes.";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        cleanMessage = "Network issue. Check your internet connection.";
      } else {
        cleanMessage = error.message.split('\n')[0].slice(0, 100);
      }
    }
    throw new Error(cleanMessage);
  }
};

export const generateRecipeIdea = async (ingredients: string): Promise<string> => {
    if (!ai) initializeGemini();
    if (!ai) throw new Error("Gemini AI not initialized");

    const prompt = `Create a unique, carnivore-friendly "Mana Meal" using these ingredients: ${ingredients}.
    Focus on "Temple Fuel" principles (nutrient density, animal based).
    Format it clearly with Title, Ingredients, and Instructions.
    End with a "Spirit & Truth" reflection on why this nourishment honors the body.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text || "The pantry is open, but the recipe is hidden. Try again, Warrior!";
};

export const generateWorkoutRoutine = async (focus: string): Promise<GeneratedWorkoutRoutine> => {
  if (!ai) initializeGemini();
  if (!ai) throw new Error("Gemini AI not initialized");

  const prompt = `Create a "Temple Building" workout routine focused on: ${focus}.
  The response must be in JSON format with a creative biblical title, a relevant power verse, a duration, and a list of exercises.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Creative Biblical Name (e.g., "The Samson Strength Circuit")' },
            duration: { type: Type.STRING, description: 'Estimated duration (e.g. "20 min")' },
            powerVerse: { type: Type.STRING, description: 'Scripture text to meditate on' },
            verseReference: { type: Type.STRING, description: 'Book Chapter:Verse' },
            exercises: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 3-5 exercises with rep counts'
            }
          },
          required: ['title', 'duration', 'powerVerse', 'verseReference', 'exercises']
        }
      }
  });

  const text = response.text;
  if (!text) throw new Error("No response generated");
  return JSON.parse(text) as GeneratedWorkoutRoutine;
};

export const generateWeeklyMealPlan = async (): Promise<string> => {
  if (!ai) initializeGemini();
  if (!ai) throw new Error("Gemini AI not initialized");

  const prompt = `Create a 3-Day Carnivore "Mana Feast" Meal Plan.
  For each day, provide:
  - Breakfast & Dinner (Meat/Egg focused).
  - A spiritual "Intention" for the day (e.g., "Day 1: Strength").
  Format clearly.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
  });

  return response.text || "Seek His bread first! Try again for the meal plan.";
};
