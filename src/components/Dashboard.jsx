import React, { useState, useEffect } from 'react';
import ProgressRing from './ProgressRing.jsx';
import * as aiService from '../services/aiService.js';
import { calculatePersonalBmiAnalysis } from '../services/bmiAnalysis.js';

export default function Dashboard({ user, fitnessPlans, workouts, healthTrackers, devices, progressReports, onNavigate, onAddNutrition, onAddPlan }) {
  const latestReport = [...progressReports].sort((a, b) => (a.report_date < b.report_date ? 1 : -1))[0];
  const latestHealth = [...healthTrackers].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))[0];
  const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.duration_minutes || 0), 0);
  const syncedDevices = devices.filter((d) => d.sync_status.toLowerCase() === 'synced').length;

  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');

  // Calculate live Personal BMI, Age BMR, Target Calories, Macros & Recommended Exercises
  const bmiAnalysis = calculatePersonalBmiAnalysis(user);

  useEffect(() => {
    aiService.generateDailyMotivationQuote({ user }).then((q) => setDailyQuote(q));
  }, [user]);

  const handleGenerateDailyInsight = async () => {
    setLoadingAi(true);
    try {
      const text = await aiService.generateAiResponse({
        prompt: `My BMI is ${bmiAnalysis.bmi} (${bmiAnalysis.bmiCategory}) and I am ${bmiAnalysis.age} years old. Give me a brief 2-sentence daily coaching tip based on my BMI, vitals, and workout status.`,
        user,
        metrics: { fitnessPlans, workouts, healthTrackers, progressReports }
      });
      setAiInsight(text);
    } catch (err) {
      setAiInsight(`⚡ **Daily AI Recommendation**: Maintain consistency! Focus on ${user?.fitness_level || 'Intermediate'} progressive overload, drink 3L water, and aim for 8 hours sleep.`);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleApplyBmiNutrition = () => {
    if (onAddNutrition) {
      onAddNutrition({
        daily_calories: bmiAnalysis.targetCalories,
        diet_type: `📊 Auto-BMI: ${bmiAnalysis.recommendedDiet}`,
        protein_g: bmiAnalysis.proteinG,
        carbs_g: bmiAnalysis.carbsG,
        fats_g: bmiAnalysis.fatsG
      });
      alert(`✅ Applied Recommended BMI Nutrition Target!\nDaily Target: ${bmiAnalysis.targetCalories} kcal\nDiet: ${bmiAnalysis.recommendedDiet}\nMacros: ${bmiAnalysis.proteinG}g Protein / ${bmiAnalysis.carbsG}g Carbs / ${bmiAnalysis.fatsG}g Fats`);
    } else {
      if (onNavigate) onNavigate('nutrition');
    }
  };

  const handleApplyBmiWorkoutRoutine = () => {
    if (onAddPlan) {
      onAddPlan({
        plan_name: `BMI Recommended (${bmiAnalysis.bmiCategory}) Routine`,
        start_date: new Date().toISOString().slice(0, 10),
        workout_type: bmiAnalysis.workoutFocus,
        duration_minutes: 45
      });
      alert(`🏋️ Applied Recommended Exercise Routine!\nRoutine: ${bmiAnalysis.workoutFocus}\nAssigned Exercises: ${bmiAnalysis.recommendedExercises.map(e => e.name).join(', ')}`);
    } else {
      if (onNavigate) onNavigate('plans');
    }
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="page-head flex-between align-center flex-wrap gap-2 mb-4">
        <div className="flex align-center gap-3">
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2.5px solid #2563eb',
              boxShadow: '0 2px 8px rgba(37,99,235,0.2)'
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.name || 'Athlete'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div className="page-eyebrow" style={{ fontWeight: 900, color: '#ca8a04', textTransform: 'uppercase' }}>
              EXECUTIVE TELEMETRY OVERVIEW →
            </div>
            <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0.2rem 0' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Athlete'}
            </h1>
            <p className="page-desc" style={{ fontWeight: 600, color: '#64748b' }}>
              Real-time snapshot of your personal BMI analysis, vitals, nutrition, and recommended exercise routines.
            </p>
          </div>
        </div>
      </div>

      {/* AUTOMATIC PERSONAL BMI & AGE TELEMETRY ANALYSIS CARD */}
      <div
        className="card mb-6 p-4"
        style={{
          borderRadius: '16px',
          border: `2px solid ${bmiAnalysis.bmiColor}`,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
        }}
      >
        <div className="flex-between align-center flex-wrap gap-2 mb-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>📊</span>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
                PERSONAL BMI & AGE TELEMETRY ANALYSIS
              </h2>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                Logged-in User Profile: {user?.name || 'Athlete'} ({bmiAnalysis.age} Yrs) • Weight: {bmiAnalysis.weight} kg • Height: {bmiAnalysis.height} cm
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              background: bmiAnalysis.bmiBg,
              border: `1.5px solid ${bmiAnalysis.bmiColor}`,
              color: bmiAnalysis.bmiColor,
              fontWeight: 900,
              fontSize: '0.9rem'
            }}
          >
            BMI: {bmiAnalysis.bmi} • {bmiAnalysis.bmiCategory}
          </div>
        </div>

        {/* 2-COLUMN ANALYSIS & RECOMMENDATIONS */}
        <div className="grid grid-2 gap-4 mb-4">
          {/* COLUMN 1: SUGGESTED NUTRITION & MACROS */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#ca8a04', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                🥗 RECOMMENDED NUTRITION & CALORIES (BASED ON BMI & BMR)
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.3rem 0' }}>
                {bmiAnalysis.recommendedDiet}
              </h3>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2563eb', marginBottom: '0.75rem' }}>
                {bmiAnalysis.targetCalories.toLocaleString()} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>kcal / day (BMR: {bmiAnalysis.bmr} kcal)</span>
              </div>

              {/* Macro Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>
                <div style={{ background: '#fef9c3', border: '1px solid #fef08a', borderRadius: '8px', padding: '0.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#854d0e' }}>PROTEIN</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ca8a04' }}>{bmiAnalysis.proteinG}g</div>
                </div>
                <div style={{ background: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#1e40af' }}>CARBS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2563eb' }}>{bmiAnalysis.carbsG}g</div>
                </div>
                <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#166534' }}>FATS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a' }}>{bmiAnalysis.fatsG}g</div>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', margin: 0, lineHeight: 1.45 }}>
                💡 <em>{bmiAnalysis.ageAdvice}</em>
              </p>
            </div>

            <button
              onClick={handleApplyBmiNutrition}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#ca8a04',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginTop: '1rem',
                boxShadow: '0 2px 6px rgba(202,138,4,0.2)'
              }}
            >
              ⚡ Apply Suggested BMI Nutrition Target ({bmiAnalysis.targetCalories} kcal)
            </button>
          </div>

          {/* COLUMN 2: RECOMMENDED EXERCISE ROUTINE */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                🏋️ RECOMMENDED EXERCISE ROUTINES (TAILORED TO BMI & AGE)
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                {bmiAnalysis.workoutFocus}
              </h3>

              {/* Recommended Exercises List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {bmiAnalysis.recommendedExercises.map((e, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '0.55rem 0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#0f172a', fontWeight: 900, display: 'block' }}>{e.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Focus: {e.focus}</span>
                    </div>
                    <span
                      style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}
                    >
                      {e.sets} x {e.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyBmiWorkoutRoutine}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 900,
                fontSize: '0.85rem',
                cursor: 'pointer',
                marginTop: '1rem',
                boxShadow: '0 2px 6px rgba(37,99,235,0.2)'
              }}
            >
              🏋️ Add Recommended BMI Exercise Routine
            </button>
          </div>
        </div>
      </div>

      {/* Featured Visual Action Cards Grid */}
      <div className="grid grid-2 gap-4 mb-4">
        <div
          className="card p-0 overflow-hidden"
          style={{ position: 'relative', height: '160px', borderRadius: '12px', cursor: 'pointer' }}
          onClick={() => onNavigate && onNavigate('workout-live')}
        >
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
            alt="Featured Workout"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), rgba(15,23,42,0.2))' }} />
          <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, color: '#fff' }} className="flex-between align-center">
            <div>
              <span className="badge badge-accent mb-1">🔥 Featured Workout</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Summer Shred • Cardio & HIIT</h3>
            </div>
            <button className="btn btn-primary text-xs">⚡ Launch Live Session</button>
          </div>
        </div>

        <div
          className="card p-0 overflow-hidden"
          style={{ position: 'relative', height: '160px', borderRadius: '12px', cursor: 'pointer' }}
          onClick={() => onNavigate && onNavigate('recipes')}
        >
          <img
            src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80"
            alt="Healthy Nutrition"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), rgba(15,23,42,0.2))' }} />
          <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, color: '#fff' }} className="flex-between align-center">
            <div>
              <span className="badge badge-success mb-1">🥗 High Protein Recipe</span>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Grilled Salmon Quinoa Bowl</h3>
            </div>
            <button className="btn btn-secondary text-xs">📖 View Recipe</button>
          </div>
        </div>
      </div>

      {/* AI Daily Persona Motivation Banner */}
      {dailyQuote && (
        <div
          className="card mb-4 p-3 border-radius flex align-center gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(99, 102, 241, 0.12))',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}
        >
          <span className="text-2xl">🔥</span>
          <div className="flex-1">
            <span className="text-xs text-primary font-bold uppercase tracking-wider">AI Coach Motivation of the Day</span>
            <p className="text-sm font-semibold text-main mt-1 italic">
              {dailyQuote}
            </p>
          </div>
        </div>
      )}

      {/* AI Daily Coach Card */}
      <div
        className="card section p-4 border-primary mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}
      >
        <div className="flex-between align-center mb-2 flex-wrap gap-2">
          <div className="flex align-center gap-2">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="section-title text-md">Gemini AI Coach • Daily Vitals & BMI Insight</h3>
              <p className="stat-lbl text-xs">Real-time AI telemetry analysis for {user?.name || 'you'}</p>
            </div>
          </div>

          <button
            className="btn btn-secondary text-xs"
            onClick={handleGenerateDailyInsight}
            disabled={loadingAi}
          >
            {loadingAi ? 'Analyzing Telemetry...' : '⚡ Generate Fresh AI Insight'}
          </button>
        </div>

        {aiInsight ? (
          <div className="p-3 bg-surface border-radius text-sm text-secondary mt-2 leading-relaxed">
            {aiInsight.split('\n').map((line, idx) => (
              <p key={idx} className="my-1">{line}</p>
            ))}
          </div>
        ) : (
          <p className="text-xs text-secondary mt-1">
            Click "Generate Fresh AI Insight" to receive instant personalized coaching feedback based on your BMI of {bmiAnalysis.bmi}, {latestHealth ? `${latestHealth.heart_rate} bpm heart rate` : 'health vitals'}, and {totalMinutes} workout minutes.
          </p>
        )}
      </div>

      <div className="grid grid-4 section">
        <div className="card">
          <div className="card-title">Active Plans</div>
          <div className="stat-value">{fitnessPlans.length}</div>
          <div className="stat-sub">{workouts.length} workouts scheduled</div>
        </div>
        <div className="card">
          <div className="card-title">Weekly Minutes</div>
          <div className="stat-value accent">{totalMinutes}</div>
          <div className="stat-sub">across all workouts</div>
        </div>
        <div className="card">
          <div className="card-title">Latest Heart Rate</div>
          <div className="stat-value">{latestHealth ? `${latestHealth.heart_rate} bpm` : '—'}</div>
          <div className="stat-sub">
            {latestHealth ? new Date(latestHealth.timestamp).toLocaleString() : 'no records yet'}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Devices Synced</div>
          <div className="stat-value">
            {syncedDevices}/{devices.length}
          </div>
          <div className="stat-sub">connected hardware</div>
        </div>
      </div>
    </div>
  );
}
