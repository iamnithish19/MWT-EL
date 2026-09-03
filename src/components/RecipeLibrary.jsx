import React, { useState, useRef } from 'react';
import * as aiService from '../services/aiService.js';

export default function RecipeLibrary({ recipes = [], onAddToPlan, user }) {
  const [filterCat, setFilterCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedRecipe, setScannedRecipe] = useState(null);
  const fileInputRef = useRef(null);

  const filtered = recipes.filter((r) => {
    const matchesCat = filterCat === 'All' || r.category === filterCat;
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleScanMealImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const base64 = uploadEvent.target.result;
      setIsScanning(true);
      try {
        const recipe = await aiService.generateAiRecipeFromImage({ imageBase64: base64, user });
        setScannedRecipe({
          recipe_id: Date.now(),
          title: recipe.title || 'Scanned Meal',
          category: recipe.category || 'High Protein',
          calories: recipe.calories || 550,
          protein: recipe.protein || 40,
          carbs: recipe.carbs || 50,
          fats: recipe.fats || 15,
          prep: recipe.description || 'Meal scanned with Gemini AI Vision analysis.',
          time: 'Instant'
        });
      } catch (err) {
        alert(`AI Scanner Notice: ${err.message}`);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page-container">
      <header className="page-header flex-between align-center flex-wrap gap-2">
        <div>
          <h1 className="page-title">Recipe & Meal Library</h1>
          <p className="page-subtitle">Explore high-protein recipes or scan food photos with Gemini AI Vision.</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleScanMealImage}
          />
          <button
            className="btn btn-primary text-xs flex align-center gap-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
          >
            {isScanning ? '⏳ Gemini Scanning Photo...' : '📷 AI Photo Meal Scanner'}
          </button>
        </div>
      </header>

      {/* Scanned Recipe Banner */}
      {scannedRecipe && (
        <div className="card mb-4 p-4 border-primary bg-surface">
          <div className="flex-between align-center mb-2">
            <span className="badge badge-success">📸 Scanned Recipe Result</span>
            <button className="btn btn-secondary text-xs p-1" onClick={() => setScannedRecipe(null)}>
              ✕ Clear
            </button>
          </div>
          {scannedRecipe.image && (
            <img
              src={scannedRecipe.image}
              alt="Scanned Meal"
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
            />
          )}
          <h3 className="section-title text-md mb-1">{scannedRecipe.title}</h3>
          <p className="stat-lbl mb-3">{scannedRecipe.prep}</p>

          <div className="macro-row p-2 mb-3">
            <div className="macro-chip">
              <span className="stat-num text-sm">{scannedRecipe.calories}</span>
              <span className="stat-lbl text-xs">CALORIES</span>
            </div>
            <div className="macro-chip">
              <span className="stat-num text-sm text-cyan">{scannedRecipe.protein}g</span>
              <span className="stat-lbl text-xs">PROTEIN</span>
            </div>
            <div className="macro-chip">
              <span className="stat-num text-sm text-emerald">{scannedRecipe.carbs}g</span>
              <span className="stat-lbl text-xs">CARBS</span>
            </div>
            <div className="macro-chip">
              <span className="stat-num text-sm text-amber">{scannedRecipe.fats}g</span>
              <span className="stat-lbl text-xs">FATS</span>
            </div>
          </div>

          <button
            className="btn btn-primary w-full text-xs"
            onClick={() => {
              if (onAddToPlan) onAddToPlan(scannedRecipe);
              alert(`Added "${scannedRecipe.title}" to your Nutrition Plan!`);
              setScannedRecipe(null);
            }}
          >
            + Add Scanned Meal to Nutrition Plan
          </button>
        </div>
      )}

      <div className="card mb-4 flex-between align-center flex-wrap gap-3">
        <div className="flex-gap align-center flex-wrap">
          <input
            type="text"
            className="input-field"
            placeholder="🔍 Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {['All', 'High Protein', 'Breakfast', 'Dinner', 'Snack'].map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${filterCat === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-2 gap-4">
        {filtered.map((recipe) => (
          <div key={recipe.recipe_id} className="card recipe-card p-0 overflow-hidden" style={{ overflow: 'hidden' }}>
            {recipe.image && (
              <div className="card-media">
                <img src={recipe.image} alt={recipe.title} className="card-media-img" />
                <div className="card-media-badge">
                  <span className="badge badge-accent">{recipe.category}</span>
                </div>
                <div className="card-media-time">⏱ {recipe.time}</div>
              </div>
            )}
            <div className="p-4">
              {!recipe.image && (
                <div className="flex-between align-center mb-2">
                  <span className="badge badge-accent">{recipe.category}</span>
                  <span className="stat-lbl">⏱ {recipe.time}</span>
                </div>
              )}

              <h3 className="recipe-title mb-2" style={{ fontSize: '18px', fontWeight: 800 }}>{recipe.title}</h3>
              <p className="recipe-prep mb-3 text-xs text-secondary">{recipe.prep}</p>

              <div className="macro-row p-2 mb-3">
                <div className="macro-chip">
                  <span className="stat-num text-sm">{recipe.calories}</span>
                  <span className="stat-lbl text-xs">CALORIES</span>
                </div>
                <div className="macro-chip">
                  <span className="stat-num text-sm text-cyan">{recipe.protein}g</span>
                  <span className="stat-lbl text-xs">PROTEIN</span>
                </div>
                <div className="macro-chip">
                  <span className="stat-num text-sm text-emerald">{recipe.carbs}g</span>
                  <span className="stat-lbl text-xs">CARBS</span>
                </div>
                <div className="macro-chip">
                  <span className="stat-num text-sm text-amber">{recipe.fats}g</span>
                  <span className="stat-lbl text-xs">FATS</span>
                </div>
              </div>

              <button
                className="btn btn-secondary w-full"
                onClick={() => {
                  if (onAddToPlan) onAddToPlan(recipe);
                  alert(`Added "${recipe.title}" to your Nutrition Plan!`);
                }}
              >
                + Add to Daily Meal Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

