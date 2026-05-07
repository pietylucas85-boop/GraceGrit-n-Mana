export enum View {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PHOTO_JOURNAL = 'PHOTO_JOURNAL',
  MANA_RECIPES = 'MANA_RECIPES',
  WORKOUTS = 'WORKOUTS',
  COACH = 'COACH',
}

export interface UserProfile {
  name: string;
  pin: string;
  joinDate: string;
  streakDays: number;
  lastActiveDate: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  prepTime: string;
  calories: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  type: 'BEFORE' | 'DURING' | 'AFTER';
  imageUrl: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GeneratedWorkoutRoutine {
  title: string;
  duration: string;
  powerVerse: string;
  verseReference: string;
  exercises: string[];
}

export interface Workout {
  id: string;
  title: string;
  focus: string;
  duration: string;
  exercises: string[];
  powerVerse: string; // The scripture powering the workout
  verseReference: string;
  completed?: boolean;
}

export interface MealPlanDay {
  day: string;
  meals: string[];
  spiritualFocus: string;
}

// Daily scripture rotation
export const DAILY_VERSES = [
  { text: "She sets about her work vigorously; her arms are strong for her tasks.", ref: "Proverbs 31:17" },
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "Do you not know that your bodies are temples of the Holy Spirit?", ref: "1 Corinthians 6:19" },
  { text: "The LORD is my strength and my shield; my heart trusts in him, and he helps me.", ref: "Psalm 28:7" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged.", ref: "Joshua 1:9" },
  { text: "But those who hope in the LORD will renew their strength.", ref: "Isaiah 40:31" },
  { text: "For physical training is of some value, but godliness has value for all things.", ref: "1 Timothy 4:8" },
  { text: "Charm is deceptive, and beauty is fleeting; but a woman who fears the LORD is to be praised.", ref: "Proverbs 31:30" },
  { text: "She is clothed with strength and dignity; she can laugh at the days to come.", ref: "Proverbs 31:25" },
  { text: "The joy of the LORD is your strength.", ref: "Nehemiah 8:10" },
  { text: "Create in me a pure heart, O God, and renew a steadfast spirit within me.", ref: "Psalm 51:10" },
  { text: "He gives strength to the weary and increases the power of the weak.", ref: "Isaiah 40:29" },
  { text: "Therefore, if anyone is in Christ, the new creation has come.", ref: "2 Corinthians 5:17" },
  { text: "His mercies are new every morning; great is your faithfulness.", ref: "Lamentations 3:23" },
];

export const getTodaysVerse = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
};