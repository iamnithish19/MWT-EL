import React, { useState, useEffect } from 'react';
import * as aiService from '../services/aiService.js';

export default function WorkoutLive({ workouts = [], exercises = [], onCompleteSession, user }) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0]?.workout_id || 1);
  const [secondsActive, setSecondsActive] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [heartRate, setHeartRate] = useState(132);
  const [formAdvice, setFormAdvice] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);

  const activeWorkout = workouts.find((w) => w.workout_id === Number(selectedWorkoutId)) || workouts[0];
  const activeExercises = exercises.filter((e) => e.workout_id === activeWorkout?.workout_id);
  const currentExercise = activeExercises[currentExIndex] || activeExercises[0];

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsActive((prev) => prev + 1);
        setHeartRate(125 + Math.floor(Math.sin(Date.now() / 1000) * 15));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleToggleSet = (exId, setNum) => {
    const key = `${exId}_${setNum}`;
    setCompletedSets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinishWorkout = () => {
    setIsRunning(false);
    alert(`🎉 Workout session completed in ${formatTimer(secondsActive)}! Great effort!`);
    if (onCompleteSession) onCompleteSession(activeWorkout, secondsActive);
  };

  const handleFetchFormAdvice = async () => {
    if (!currentExercise) return;
    setLoadingForm(true);
    try {
      const advice = await aiService.generateExerciseFormAdvice({
        exerciseName: currentExercise.name,
        user
      });
      setFormAdvice(advice);
    } catch (err) {
      alert(`AI Form Cue Notice: ${err.message}`);
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Live Workout Session</h1>
          <p className="page-subtitle">Interactive timer, set completion logger, and real-time intensity tracking.</p>
        </div>
        <div className="flex-gap">
          {!isRunning ? (
            <button className="btn btn-primary" onClick={() => setIsRunning(true)}>
              ▶ START WORKOUT
            </button>
          ) : (
            <button className="btn btn-warning" onClick={() => setIsRunning(false)}>
              ⏸ PAUSE SESSION
            </button>
          )}
          <button className="btn btn-success" onClick={handleFinishWorkout}>
            ✓ FINISH SESSION
          </button>
        </div>
      </header>

      <div className="card mb-4 flex-between align-center flex-wrap gap-3">
        <div>
          <label className="input-label">Select Active Workout Plan:</label>
          <select
            className="select-input"
            value={selectedWorkoutId}
            onChange={(e) => {
              setSelectedWorkoutId(Number(e.target.value));
              setCurrentExIndex(0);
              setFormAdvice(null);
            }}
          >
            {workouts.map((w) => (
              <option key={w.workout_id} value={w.workout_id}>
                {w.type} ({w.duration_minutes} mins)
              </option>
            ))}
          </select>
        </div>

        <div className="live-stat-badge">
          <span className="stat-label">ELAPSED TIME</span>
          <span className="stat-value timer-digits">{formatTimer(secondsActive)}</span>
        </div>

        <div className="live-stat-badge">
          <span className="stat-label">LIVE HEART RATE</span>
          <span className="stat-value hr-val">❤️ {heartRate} BPM</span>
        </div>
      </div>

      {currentExercise ? (
        <div className="card live-exercise-card mb-4">
          <div className="flex-between align-center mb-3 flex-wrap gap-2">
            <div>
              <span className="badge badge-accent">Exercise {currentExIndex + 1} of {activeExercises.length}</span>
              <h2 className="section-title mt-1">{currentExercise.name}</h2>
            </div>
            <div className="flex-gap flex-wrap">
              <button
                className="btn btn-primary text-xs flex align-center gap-1"
                onClick={handleFetchFormAdvice}
                disabled={loadingForm}
              >
                {loadingForm ? '⏳ Gemini Biomechanics...' : '🧘 AI Form Check Cues'}
              </button>

              <button
                className="btn btn-secondary btn-sm"
                disabled={currentExIndex === 0}
                onClick={() => {
                  setCurrentExIndex((i) => Math.max(0, i - 1));
                  setFormAdvice(null);
                }}
              >
                ◀ Previous
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentExIndex === activeExercises.length - 1}
                onClick={() => {
                  setCurrentExIndex((i) => Math.min(activeExercises.length - 1, i + 1));
                  setFormAdvice(null);
                }}
              >
                Next ▶
              </button>
            </div>
          </div>

          {/* AI Form Advice Card */}
          {formAdvice && (
            <div className="p-3 mb-3 border-radius border-primary bg-surface text-sm">
              <div className="flex-between align-center mb-2 border-b pb-1">
                <strong className="text-primary text-xs flex align-center gap-1">
                  🤖 Gemini Biomechanical Cues for {formAdvice.exercise || currentExercise.name}
                </strong>
                <button className="btn btn-secondary text-xs p-1" onClick={() => setFormAdvice(null)}>
                  ✕ Dismiss
                </button>
              </div>
              <p className="my-1"><strong>📐 Setup:</strong> {formAdvice.setup_cue}</p>
              <p className="my-1"><strong>⚡ Execution:</strong> {formAdvice.execution_cue}</p>
              <p className="my-1 text-amber"><strong>⚠️ Flaw to Avoid:</strong> {formAdvice.common_mistake}</p>
              <p className="my-1 text-cyan"><strong>🛡️ Joint Safety:</strong> {formAdvice.safety_tip}</p>
            </div>
          )}

          <div className="grid grid-3 gap-3 mb-4">
            <div className="stat-box">
              <div className="stat-num">{currentExercise.sets}</div>
              <div className="stat-lbl">TARGET SETS</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{currentExercise.reps}</div>
              <div className="stat-lbl">REPS PER SET</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">
                {Array.from({ length: currentExercise.sets }).filter((_, idx) => completedSets[`${currentExercise.exercise_id}_${idx + 1}`]).length} / {currentExercise.sets}
              </div>
              <div className="stat-lbl">COMPLETED</div>
            </div>
          </div>

          <h4 className="input-label mb-2">Set Logger Checklist:</h4>
          <div className="sets-grid">
            {Array.from({ length: currentExercise.sets }).map((_, idx) => {
              const setNum = idx + 1;
              const isDone = completedSets[`${currentExercise.exercise_id}_${setNum}`];
              return (
                <button
                  key={setNum}
                  type="button"
                  className={`set-btn ${isDone ? 'done' : ''}`}
                  onClick={() => handleToggleSet(currentExercise.exercise_id, setNum)}
                >
                  <span className="set-name">SET {setNum}</span>
                  <span className="set-reps">{currentExercise.reps} REPS</span>
                  <span className="set-icon">{isDone ? '✓ DONE' : '⭕ MARK DONE'}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="card text-center p-4">No exercises configured for this workout session.</div>
      )}
    </div>
  );
}

