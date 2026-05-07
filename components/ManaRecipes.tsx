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
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [customIngredients, setCustomIngredients] = useState('');
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  const handleGenerateRecipe = async () => {
    if (!customIngredients.trim()) return;
    setIsGenerating(true);
    try {
      const resultText = await generateRecipeIdea(customIngredients);
      const newRecipe: Recipe = {
        id: Date.now().toString(),
        title: '✨ AI Mana Meal',
        description: resultText.slice(0, 100) + '...',
        ingredients: [customIngredients],
        instructions: [resultText],
        tags: ['AI Generated'],
        prepTime: 'Custom',
        calories: 0
      };
      setRecipes([newRecipe, ...recipes]);
      setCustomIngredients('');
      setExpandedRecipe(newRecipe.id);
    } catch (e) {
      console.error(e);
      alert('Failed to generate recipe. Coach Grace is fasting right now!');
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
    <div className="pb-24">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Mana Kitchen</h2>
        <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Icons.Flame size={12} />
          Carnivore Fuel
        </span>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-5 mt-4">
        <button
          onClick={() => setActiveTab('RECIPES')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'RECIPES' 
              ? 'bg-white text-red-700 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Icons.Utensils size={14} />
          Recipes
        </button>
        <button
          onClick={() => setActiveTab('PLAN')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'PLAN' 
              ? 'bg-white text-red-700 shadow-sm' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Icons.Calendar size={14} />
          Feast Planner
        </button>
      </div>

      {activeTab === 'RECIPES' ? (
        <>
          {/* AI Recipe Generator */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100 mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                <Icons.Sparkles size={14} className="text-amber-600" />
              </div>
              AI Recipe Creator
            </h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customIngredients}
                onChange={(e) => setCustomIngredients(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateRecipe()}
                placeholder="e.g. Ground beef, heavy cream..."
                className="flex-1 text-sm border border-amber-200 rounded-xl px-4 py-3 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-300 bg-white transition-all"
              />
              <button 
                onClick={handleGenerateRecipe}
                disabled={isGenerating}
                className="bg-gradient-to-br from-purple-600 to-purple-800 text-white p-3 rounded-xl disabled:opacity-50 shadow-md shadow-purple-500/20 transition-all active:scale-95"
              >
                {isGenerating ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Icons.Send size={18} />}
              </button>
            </div>
          </div>

          {/* Recipe List */}
          <div className="space-y-4">
            {recipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800">{recipe.title}</h3>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-medium">{recipe.prepTime}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{recipe.description}</p>
                  
                  {recipe.tags.includes('AI Generated') ? (
                    <div className="bg-gradient-to-br from-purple-50 to-amber-50 p-4 rounded-xl text-sm whitespace-pre-wrap text-slate-700 leading-relaxed border border-purple-100/50">
                      {recipe.instructions[0]}
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {recipe.tags.map(tag => (
                          <span key={tag} className="text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                        className="w-full py-2.5 text-sm font-bold text-purple-600 border border-purple-100 rounded-xl hover:bg-purple-50 transition-all"
                      >
                        {expandedRecipe === recipe.id ? 'Hide' : 'View'} Instructions
                      </button>
                      
                      {expandedRecipe === recipe.id && (
                        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ingredients</h4>
                            <ul className="space-y-1">
                              {recipe.ingredients.map((ing, i) => (
                                <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                                  {ing}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Steps</h4>
                            <ol className="space-y-2">
                              {recipe.instructions.map((step, i) => (
                                <li key={i} className="text-sm text-slate-600 flex gap-3">
                                  <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-rose-700 via-red-800 to-rose-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">3-Day Mana Feast</h3>
              <p className="text-sm text-white/70 mb-4">Ask Coach Grace to organize your nutrition for the week.</p>
              <button 
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan}
                className="bg-white text-red-800 font-bold py-3 px-5 rounded-xl shadow-md hover:bg-gray-50 disabled:opacity-75 flex items-center gap-2 transition-all active:scale-[0.97]"
              >
                {isGeneratingPlan ? <Icons.Sparkles className="animate-spin" size={16}/> : <Icons.Calendar size={16} />}
                {isGeneratingPlan ? 'Consulting the Spirit...' : 'Generate Meal Plan'}
              </button>
            </div>
          </div>

          {mealPlan && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Icons.BookOpen size={16} className="text-amber-600" />
                </div>
                <h4 className="font-bold text-slate-700">Your Nourishment Guide</h4>
              </div>
              <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                {mealPlan}
              </div>
            </div>
          )}
          
          {!mealPlan && !isGeneratingPlan && (
            <div className="text-center text-slate-300 py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Utensils size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium">No plan generated yet.</p>
              <p className="text-xs mt-1 text-slate-300">Click the button above to receive your mana.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};