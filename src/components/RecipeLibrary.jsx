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
    <div className="page-container" style={{ padding: '2rem' }}>
      <header className="page-header flex-between align-center flex-wrap gap-2 mb-4">
        <div>
          <div className="page-eyebrow" style={{ fontWeight: 900, color: '#ca8a04', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            MEAL & NUTRITION CATALOG →
          </div>
          <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0.2rem 0' }}>
            Recipe & Meal Library
          </h1>
          <p className="page-subtitle" style={{ fontWeight: 600, color: '#64748b' }}>
            Explore high-protein recipes or scan meal photos with Gemini AI Vision analysis.
          </p>
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
            style={{ fontWeight: 900, padding: '0.65rem 1.1rem', borderRadius: '8px', cursor: 'pointer' }}
          >
            {isScanning ? '⏳ Gemini Scanning Photo...' : '📷 AI Photo Meal Scanner'}
          </button>
        </div>
      </header>

      {/* Scanned Recipe Banner */}
      {scannedRecipe && (
        <div
          className="card mb-4 p-4"
          style={{
            border: '2px solid #ca8a04',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #fef9c3 0%, #ffffff 100%)',
            boxShadow: '0 4px 15px rgba(202,138,4,0.15)'
          }}
        >
          <div className="flex-between align-center mb-2">
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 900,
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                background: '#ca8a04',
                color: '#ffffff',
                textTransform: 'uppercase'
              }}
            >
              📸 Scanned Recipe Result
            </span>
            <button
              onClick={() => setScannedRecipe(null)}
              style={{ background: 'none', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '1rem', color: '#0f172a' }}
            >
              ✕ Clear
            </button>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0.5rem 0 0.2rem 0' }}>
            {scannedRecipe.title}
          </h3>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '1rem' }}>
            {scannedRecipe.prep}
          </p>

          {/* Macro Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.75rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>{scannedRecipe.calories}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>CALORIES</div>
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#2563eb' }}>{scannedRecipe.protein}g</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase' }}>PROTEIN</div>
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#16a34a' }}>{scannedRecipe.carbs}g</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#16a34a', textTransform: 'uppercase' }}>CARBS</div>
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ca8a04' }}>{scannedRecipe.fats}g</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#ca8a04', textTransform: 'uppercase' }}>FATS</div>
            </div>
          </div>

          <button
            className="btn btn-primary w-full text-xs"
            onClick={() => {
              if (onAddToPlan) onAddToPlan(scannedRecipe);
              alert(`Added "${scannedRecipe.title}" to your Nutrition Plan!`);
              setScannedRecipe(null);
            }}
            style={{ fontWeight: 900, padding: '0.75rem', borderRadius: '8px', width: '100%', cursor: 'pointer' }}
          >
            + Add Scanned Meal to Nutrition Plan
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        className="card mb-4 p-3 flex-between align-center flex-wrap gap-3"
        style={{ borderRadius: '14px', border: '1px solid #e2e8f0' }}
      >
        <div className="flex-gap align-center flex-wrap" style={{ gap: '0.6rem', display: 'flex', alignItems: 'center', width: '100%' }}>
          <input
            type="text"
            className="input-field"
            placeholder="🔍 Search recipes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontWeight: 800,
              flex: 1,
              minWidth: '220px'
            }}
          />

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['All', 'High Protein', 'Breakfast', 'Dinner', 'Snack'].map((cat) => {
              const isActive = filterCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  style={{
                    padding: '0.55rem 0.95rem',
                    borderRadius: '8px',
                    border: isActive ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: isActive ? '#2563eb' : '#ffffff',
                    color: isActive ? '#ffffff' : '#0f172a',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recipes Cards Grid */}
      <div className="grid grid-2 gap-4">
        {filtered.map((recipe) => (
          <div
            key={recipe.recipe_id}
            className="card recipe-card p-0 overflow-hidden"
            style={{
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              background: '#ffffff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {recipe.image && (
              <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span
                    style={{
                      background: '#ca8a04',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {recipe.category}
                  </span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    background: 'rgba(15,23,42,0.85)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px'
                  }}
                >
                  ⏱ {recipe.time}
                </div>
              </div>
            )}

            <div className="p-4" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {!recipe.image && (
                  <div className="flex-between align-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span
                      style={{
                        background: '#ca8a04',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {recipe.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>⏱ {recipe.time}</span>
                  </div>
                )}

                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
                  {recipe.title}
                </h3>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                  {recipe.prep}
                </p>
              </div>

              <div>
                {/* High Contrast Macro Chips Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.5rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.65rem',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>{recipe.calories}</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>KCAL</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#2563eb' }}>{recipe.protein}g</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase' }}>PROT</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#16a34a' }}>{recipe.carbs}g</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#16a34a', textTransform: 'uppercase' }}>CARB</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#ca8a04' }}>{recipe.fats}g</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#ca8a04', textTransform: 'uppercase' }}>FAT</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onAddToPlan) onAddToPlan(recipe);
                    alert(`Added "${recipe.title}" to your Nutrition Plan!`);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.2)'
                  }}
                >
                  + Add to Daily Meal Plan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
