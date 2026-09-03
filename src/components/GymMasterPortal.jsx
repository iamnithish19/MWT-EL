import React, { useState } from 'react';
import * as db from '../services/db.js';

export default function GymMasterPortal({ currentUser, allUsers, fitnessPlans, workouts, healthTrackers, nutritionPlans, progressReports, sleepLogs, onRefresh }) {
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  
  // Modals state
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);

  // Form states for Plan Assignment
  const [planName, setPlanName] = useState('');
  const [workoutType, setWorkoutType] = useState('Power Hypertrophy Routine');
  const [durationMinutes, setDurationMinutes] = useState(45);

  // Form states for Nutrition Assignment
  const [dietType, setDietType] = useState('High Protein Athlete');
  const [dailyCalories, setDailyCalories] = useState(2500);
  const [proteinG, setProteinG] = useState(160);
  const [carbsG, setCarbsG] = useState(250);
  const [fatsG, setFatsG] = useState(70);

  const [notification, setNotification] = useState('');

  const members = (allUsers || []).filter((u) => u.role !== 'gym_master');
  const analytics = db.getGymAnalytics();

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (m.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel === 'All' || m.fitness_level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleAssignPlan = (e) => {
    e.preventDefault();
    if (!selectedMember || !planName.trim()) return;

    db.assignPlanToMember(selectedMember.user_id, planName.trim(), workoutType, durationMinutes);
    showToast(`✅ Workout plan "${planName}" assigned to ${selectedMember.name}!`);
    setShowPlanModal(false);
    setPlanName('');
    onRefresh();
  };

  const handleAssignNutrition = (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    db.assignNutritionToMember(selectedMember.user_id, {
      diet_type: dietType,
      daily_calories: dailyCalories,
      protein_g: proteinG,
      carbs_g: carbsG,
      fats_g: fatsG
    });
    showToast(`🥗 Nutrition targets updated for ${selectedMember.name}!`);
    setShowNutritionModal(false);
    onRefresh();
  };

  return (
    <div className="gym-master-portal p-6" style={{ padding: '2rem' }}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#00F0FF',
            color: '#0A0E1A',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 700,
            zIndex: 9999,
            boxShadow: '0 10px 30px rgba(0, 240, 255, 0.4)'
          }}
        >
          {notification}
        </div>
      )}

      {/* Top Banner Header */}
      <div
        className="master-banner mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(10, 14, 26, 0.8) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #FFD700',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
            }}
          >
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=250&q=80'}
              alt={currentUser.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {currentUser.name}
              </h1>
              <span
                style={{
                  background: '#FFD700',
                  color: '#000',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}
              >
                👑 GYM MASTER / COACH
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
              {currentUser.gym_name || 'Iron Forge Performance Gym'} • {currentUser.specialty || 'Head Performance Coach'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn"
            onClick={() => {
              if (members.length) {
                setSelectedMember(members[0]);
                setShowPlanModal(true);
              }
            }}
            style={{
              background: '#FFD700',
              color: '#0A0E1A',
              fontWeight: 700,
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ➕ Assign New Plan
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div
        className="analytics-grid mb-6"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <div
          className="stat-card"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '1.5rem'
          }}
        >
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🏋️ ACTIVE GYM MEMBERS
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00F0FF', marginTop: '0.5rem' }}>
            {analytics.totalMembers}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#39FF14', marginTop: '0.25rem' }}>
            ● All accounts registered & active
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '1.5rem'
          }}
        >
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📋 ACTIVE WORKOUT PLANS
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFD700', marginTop: '0.5rem' }}>
            {analytics.totalActivePlans}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>
            {analytics.totalWorkouts} total routines assigned
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '1.5rem'
          }}
        >
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📈 AVG MEMBER PROGRESS
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#39FF14', marginTop: '0.5rem' }}>
            {analytics.avgCompletionRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>
            Based on completed report milestones
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '1.5rem'
          }}
        >
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔥 TOTAL GYM ACTIVITY
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FF0055', marginTop: '0.5rem' }}>
            {analytics.totalGymSteps.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>
            Combined member step activity
          </div>
        </div>
      </div>

      {/* Member Management Roster Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            🏋️ Member Management Roster
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
            Select any member to assign customized workout plans, update nutrition, or audit vitals.
          </p>
        </div>

        {/* Filters & Search */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Search member name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '0.55rem 1rem',
              color: '#fff',
              fontSize: '0.85rem',
              width: '240px'
            }}
          />

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '0.55rem 1rem',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          >
            <option value="All" style={{ background: '#0A0E1A' }}>All Levels</option>
            <option value="Beginner" style={{ background: '#0A0E1A' }}>Beginner</option>
            <option value="Intermediate" style={{ background: '#0A0E1A' }}>Intermediate</option>
            <option value="Advanced" style={{ background: '#0A0E1A' }}>Advanced</option>
          </select>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {filteredMembers.map((m) => {
          const userPlans = (fitnessPlans || []).filter((p) => p.user_id === m.user_id);
          const userVitals = (healthTrackers || []).filter((h) => h.user_id === m.user_id).slice(-1)[0];
          const userNutri = (nutritionPlans || []).filter((n) => n.user_id === m.user_id).slice(-1)[0];
          const userReport = (progressReports || []).filter((pr) => pr.user_id === m.user_id).slice(-1)[0];

          return (
            <div
              key={m.user_id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <div>
                {/* Member Profile Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #00F0FF'
                    }}
                  >
                    <img
                      src={m.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.name}`}
                      alt={m.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{m.email}</div>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        background: 'rgba(0, 240, 255, 0.15)',
                        color: '#00F0FF',
                        fontWeight: 600,
                        marginTop: '0.2rem',
                        display: 'inline-block'
                      }}
                    >
                      {m.fitness_level || 'Member'} • {m.age} yrs • {m.weight} kg
                    </span>
                  </div>
                </div>

                {/* Member Metrics summary */}
                <div
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Latest Heart Rate:</span>
                    <div style={{ fontWeight: 700, color: '#FF0055' }}>
                      {userVitals ? `❤️ ${userVitals.heart_rate} BPM` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Daily Steps:</span>
                    <div style={{ fontWeight: 700, color: '#39FF14' }}>
                      {userVitals ? `👟 ${userVitals.steps.toLocaleString()}` : '0 steps'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Active Plans:</span>
                    <div style={{ fontWeight: 700, color: '#FFD700' }}>
                      {userPlans.length ? `${userPlans.length} Active` : 'None'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Target Calories:</span>
                    <div style={{ fontWeight: 700, color: '#00F0FF' }}>
                      {userNutri ? `🥗 ${userNutri.daily_calories} kcal` : 'Unassigned'}
                    </div>
                  </div>
                </div>

                {/* Completion Bar */}
                {userReport && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>
                      <span>Report Progress Score</span>
                      <span style={{ fontWeight: 700, color: '#39FF14' }}>{userReport.completion_percentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${userReport.completion_percentage}%`, height: '100%', background: 'linear-gradient(90deg, #00F0FF, #39FF14)', borderRadius: '3px' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Master */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => {
                    setSelectedMember(m);
                    setShowPlanModal(true);
                  }}
                  style={{
                    background: 'rgba(255, 215, 0, 0.15)',
                    border: '1px solid rgba(255, 215, 0, 0.4)',
                    color: '#FFD700',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  📋 Assign Workout
                </button>
                <button
                  onClick={() => {
                    setSelectedMember(m);
                    setShowNutritionModal(true);
                  }}
                  style={{
                    background: 'rgba(0, 240, 255, 0.15)',
                    border: '1px solid rgba(0, 240, 255, 0.4)',
                    color: '#00F0FF',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  🥗 Assign Nutrition
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PLAN ASSIGNMENT MODAL */}
      {showPlanModal && selectedMember && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#0A0E1A',
              border: '1px solid #FFD700',
              borderRadius: '16px',
              padding: '2rem',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 0 30px rgba(255,215,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#FFD700', fontSize: '1.25rem', fontWeight: 800 }}>
                📋 ASSIGN WORKOUT PLAN
              </h3>
              <button
                onClick={() => setShowPlanModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.25rem' }}>
              Assigning new routine directly to member: <strong style={{ color: '#fff' }}>{selectedMember.name}</strong>
            </p>

            <form onSubmit={handleAssignPlan}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  PLAN NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Power Shred v2"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  WORKOUT ROUTINE TYPE
                </label>
                <select
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                >
                  <option value="Power Hypertrophy Routine" style={{ background: '#0A0E1A' }}>Power Hypertrophy Routine</option>
                  <option value="HIIT Conditioning Circuit" style={{ background: '#0A0E1A' }}>HIIT Conditioning Circuit</option>
                  <option value="Strength & Mobility Focus" style={{ background: '#0A0E1A' }}>Strength & Mobility Focus</option>
                  <option value="Endurance Cardio Burner" style={{ background: '#0A0E1A' }}>Endurance Cardio Burner</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  DURATION (MINUTES)
                </label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#FFD700',
                  color: '#0A0E1A',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                CONFIRM & ASSIGN PLAN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NUTRITION ASSIGNMENT MODAL */}
      {showNutritionModal && selectedMember && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem'
          }}
        >
          <div
            style={{
              background: '#0A0E1A',
              border: '1px solid #00F0FF',
              borderRadius: '16px',
              padding: '2rem',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 0 30px rgba(0,240,255,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#00F0FF', fontSize: '1.25rem', fontWeight: 800 }}>
                🥗 ASSIGN NUTRITION TARGETS
              </h3>
              <button
                onClick={() => setShowNutritionModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.25rem' }}>
              Configuring diet & macro goals for <strong style={{ color: '#fff' }}>{selectedMember.name}</strong>
            </p>

            <form onSubmit={handleAssignNutrition}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  DIET TYPE
                </label>
                <input
                  type="text"
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    DAILY CALORIES
                  </label>
                  <input
                    type="number"
                    value={dailyCalories}
                    onChange={(e) => setDailyCalories(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    PROTEIN (G)
                  </label>
                  <input
                    type="number"
                    value={proteinG}
                    onChange={(e) => setProteinG(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    CARBS (G)
                  </label>
                  <input
                    type="number"
                    value={carbsG}
                    onChange={(e) => setCarbsG(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    FATS (G)
                  </label>
                  <input
                    type="number"
                    value={fatsG}
                    onChange={(e) => setFatsG(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: '#00F0FF',
                  color: '#0A0E1A',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                APPLY NUTRITION TARGETS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
