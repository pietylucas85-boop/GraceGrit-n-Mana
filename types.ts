export enum View {
  DASHBOARD = 'DASHBOARD',
  PHOTO_JOURNAL = 'PHOTO_JOURNAL',
  MANA_RECIPES = 'MANA_RECIPES',
  WORKOUTS = 'WORKOUTS',
  COACH = 'COACH',
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
  day: string; // e.g., "Monday"
  meals: string[];
  spiritualFocus: string;
}