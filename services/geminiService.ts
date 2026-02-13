import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { GeneratedWorkoutRoutine } from "../types";

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
let chatSession: Chat | null = null;

export const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    return;
  }
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getCoachChat = (): Chat => {
  if (!ai) initializeGemini();
  if (!ai) throw new Error("Gemini AI not initialized");

  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const generateRecipeIdea = async (ingredients: string): Promise<string> => {
    if (!ai) initializeGemini();
    if (!ai) throw new Error("Gemini AI not initialized");

    const prompt = `Create a unique, carnivore-friendly "Mana Meal" using these ingredients: ${ingredients}. 
    Focus on "Temple Fuel" principles (nutrient density, animal based). 
    Format it clearly with Title, Ingredients, and Instructions. 
    End with a "Spirit & Truth" reflection on why this nourishment honors the body.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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
      model: 'gemini-3-flash-preview',
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
      model: 'gemini-3-flash-preview',
      contents: prompt,
  });

  return response.text || "Seek His bread first! Try again for the meal plan.";
};