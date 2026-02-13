import React, { useState } from 'react';
import { Icons } from './Icons';
import { Recipe } from '../types';
import { generateRecipeIdea, generateWeeklyMealPlan } from '../services/geminiService';

const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Warrior Ribeye & Butter',
    description: 'Classic fuel for the temple. Pure protein and healthy fats.',
    ingredients: ['16oz Ribeye Steak', '2 tbsp Grass-fed Butter', 'Sea Salt'],
    instructions: ['Sear steak in cast iron.', 'Finish with butter.', 'Rest for 5 mins.'],
    tags: ['Carnivore', 'High Protein'],
    prepTime: '15 min',
    calories: 1200
  },
  {
    id: '2',
    title: 'Graceful Eggs & Bacon',
    description: 'A morning offering of energy.',
    ingredients: ['4 Large Pasture Eggs', '4 strips Beef Bacon', 'Tallow'],
    instructions: ['Fry bacon until crisp.', 'Cook eggs in bacon fat.', 'Season lightly.'],
    tags: ['Breakfast', 'Keto'],
    prepTime: '10 min',
    calories: 600
  }
];

export const ManaRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [activeTab, setActiveTab] = useState<'RECIPES' | 'PLAN'>('RECIPES');
  
  // Recipe Gen State
  const [isGenerating, setIsGenerating] = useState(false);
  const [customIngredients, setCustomIngredients] = useState('');

  // Meal Plan Gen State
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleGenerateRecipe = async () => {
    if (!customIngredients.trim()) return;
    setIsGenerating(true);
    try {
      const resultText = await generateRecipeIdea(customIngredients);
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        title: 'AI Custom Mana Meal',
        description: resultText.slice(0, 100) + '...',
        ingredients: [customIngredients],
        instructions: [resultText],
        tags: ['AI Generated'],
        prepTime: 'Unknown',
        calories: 0
      };
      setRecipes([newRecipe, ...recipes]);
      setCustomIngredients('');
    } catch (e) {
      console.error(e);
      alert('Failed to generate recipe. Check API Key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
        const plan = await generateWeeklyMealPlan();
        setMealPlan(plan);
    } catch (e) {
        console.error(e);
        alert('Coach Grace is fasting right now (API Error). Try again!');
    } finally {
        setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Mana Kitchen</h2>
        <span className="bg-mana-red/10 text-mana-red text-xs font-bold px-2 py-1 rounded-full">Carnivore Fuel</span>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200 p-1 rounded-xl mb-6">
        <button
            onClick={() => setActiveTab('RECIPES')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'RECIPES' 
                ? 'bg-white text-mana-red shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icons.Utensils size={14} />
            Recipes
          </button>
          <button
            onClick={() => setActiveTab('PLAN')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'PLAN' 
                ? 'bg-white text-mana-red shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icons.Calendar size={14} />
            Feast Planner
          </button>
      </div>

      {activeTab === 'RECIPES' ? (
        <>
            {/* AI Recipe Generator */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
                <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Icons.Sparkles size={16} className="text-grace-gold" />
                    AI Recipe Creator
                </h3>
                <div className="flex gap-2">
                <input 
                    type="text" 
                    value={customIngredients}
                    onChange={(e) => setCustomIngredients(e.target.value)}
                    placeholder="e.g. Ground beef, heavy cream..."
                    className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-royal-purple"
                />
                <button 
                    onClick={handleGenerateRecipe}
                    disabled={isGenerating}
                    className="bg-royal-purple text-white p-2 rounded-lg disabled:opacity-50"
                >
                    {isGenerating ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Icons.Send size={20} />}
                </button>
                </div>
            </div>

            {/* Recipe List */}
            <div className="space-y-4">
                {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                    <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-800">{recipe.title}</h3>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">{recipe.prepTime}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{recipe.description}</p>
                    
                    {recipe.tags.includes('AI Generated') ? (
                        <div className="bg-slate-50 p-3 rounded text-sm whitespace-pre-wrap text-slate-700">
                            {recipe.instructions[0]}
                        </div>
                    ) : (
                        <>
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {recipe.tags.map(tag => (
                                <span key={tag} className="text-xs font-medium text-royal-purple bg-royal-purple/5 px-2 py-1 rounded">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <button className="w-full py-2 text-sm font-semibold text-royal-purple border border-royal-purple/20 rounded-lg hover:bg-royal-purple/5">
                            View Instructions
                        </button>
                        </>
                    )}
                    </div>
                </div>
                ))}
            </div>
        </>
      ) : (
        /* Meal Planner View */
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-mana-red to-red-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">3-Day Mana Feast</h3>
                    <p className="text-sm opacity-90 mb-4">Ask Coach Grace to organize your nutrition for the week.</p>
                    <button 
                        onClick={handleGeneratePlan}
                        disabled={isGeneratingPlan}
                        className="bg-white text-mana-red font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-75 flex items-center gap-2"
                    >
                        {isGeneratingPlan ? <Icons.Sparkles className="animate-spin" size={16}/> : <Icons.Calendar size={16} />}
                        {isGeneratingPlan ? 'Consulting the Spirit...' : 'Generate Meal Plan'}
                    </button>
                </div>
                <div className="absolute -bottom-4 -right-4 text-white opacity-10">
                    <Icons.Utensils size={120} />
                </div>
            </div>

            {mealPlan && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                        <Icons.BookOpen size={20} className="text-grace-gold" />
                        <h4 className="font-bold text-slate-700">Your Nourishment Guide</h4>
                    </div>
                    <div className="prose prose-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {mealPlan}
                    </div>
                </div>
            )}
            
            {!mealPlan && !isGeneratingPlan && (
                <div className="text-center text-slate-400 py-10">
                    <p>No plan generated yet.</p>
                    <p className="text-xs mt-1">Click the button above to receive your mana.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};