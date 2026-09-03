import React, { useState } from 'react';
import * as aiService from '../services/aiService.js';

function ExerciseList({ exercises, onAdd, onDelete }) {
  const [form, setForm] = useState({ name: '', sets: '', reps: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    onAdd({ name: form.name, sets: Number(form.sets) || 0, reps: Number(form.reps) || 0 });
    setForm({ name: '', sets: '', reps: '' });
  };

  return (
    <div style={{ marginTop: 10 }}>
      {exercises.map((ex) => (
        <span key={ex.exercise_id} className="exercise-tag">
          {ex.name} · {ex.sets}×{ex.reps}
          <button
            className="icon-btn"
            style={{ padding: '1px 6px', fontSize: 10 }}
            onClick={() => onDelete(ex.exercise_id)}
          >
            ✕
          </button>
        </span>
      ))}
      <form onSubmit={submit} style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input-field-sm"
          placeholder="exercise name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          style={{ width: 150 }}
        />
        <input
          className="input-field-sm"
          placeholder="sets"
          type="number"
          value={form.sets}
          onChange={(e) => setForm((f) => ({ ...f, sets: e.target.value }))}
          style={{ width: 65 }}
        />
        <input
          className="input-field-sm"
          placeholder="reps"
          type="number"
          value={form.reps}
          onChange={(e) => setForm((f) => ({ ...f, reps: e.target.value }))}
          style={{ width: 65 }}
        />
        <button className="icon-btn" type="submit">
          + exercise
        </button>
      </form>
    </div>
  );
}

function WorkoutBlock({ workout, exercises, onAddExercise, onDeleteExercise, onDeleteWorkout }) {
  const defaultWorkoutImg = 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=600&q=80';
  return (
    <div className="workout-row">
      <div className="workout-head">
        <div className="flex align-center gap-2">
          <img
            src={workout.image || defaultWorkoutImg}
            alt={workout.type}
            style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
          />
          <strong>{workout.type}</strong>
        </div>
        <span>
          <span className="pill">{workout.duration_minutes} min</span>{' '}
          <button className="icon-btn" onClick={() => onDeleteWorkout(workout.workout_id)}>
            delete
          </button>
        </span>
      </div>
      <ExerciseList
        exercises={exercises}
        onAdd={(payload) => onAddExercise(workout.workout_id, payload)}
        onDelete={onDeleteExercise}
      />
    </div>
  );
}

function PlanCard({ plan, workouts, exercises, actions }) {
  const [form, setForm] = useState({ type: '', duration_minutes: '' });
  const defaultPlanImg = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80';

  const submit = (e) => {
    e.preventDefault();
    if (!form.type) return;
    actions.onAddWorkout(plan.plan_id, {
      type: form.type,
      duration_minutes: Number(form.duration_minutes) || 0
    });
    setForm({ type: '', duration_minutes: '' });
  };

  return (
    <div className="plan-block p-0 overflow-hidden" style={{ overflow: 'hidden', borderRadius: '8px' }}>
      <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
        <img
          src={plan.image || defaultPlanImg}
          alt={plan.plan_name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: '#fff'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>{plan.plan_name}</h3>
            <div className="plan-meta" style={{ color: 'rgba(255,255,255,0.7)' }}>
              plan_id #{plan.plan_id} · starts {plan.start_date}
            </div>
          </div>
          <button className="icon-btn text-rose" style={{ background: 'rgba(255,255,255,0.2)' }} onClick={() => actions.onDeletePlan(plan.plan_id)}>
            delete plan
          </button>
        </div>
      </div>

      <div className="p-4">
        {workouts.length === 0 && <div className="empty-state">No workouts in this plan yet.</div>}

        {workouts.map((w) => (
          <WorkoutBlock
            key={w.workout_id}
            workout={w}
            exercises={exercises.filter((e) => e.workout_id === w.workout_id)}
            onAddExercise={actions.onAddExercise}
            onDeleteExercise={actions.onDeleteExercise}
            onDeleteWorkout={actions.onDeleteWorkout}
          />
        ))}

      <form className="inline-form" onSubmit={submit}>
        <div className="field">
          <label>Workout type</label>
          <input
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            placeholder="e.g. Leg Day"
          />
        </div>
        <div className="field">
          <label>Duration (min)</label>
          <input
            type="number"
            value={form.duration_minutes}
            onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))}
          />
        </div>
        <button className="btn" type="submit">
          + workout
        </button>
      </form>
      </div>
    </div>
  );
}

export default function FitnessPlans({ plans, workouts, exercises, actions, user }) {
  const [form, setForm] = useState({ plan_name: '', start_date: '' });
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiGoal, setAiGoal] = useState('Hypertrophy & Lean Muscle Gain');

  const submitPlan = (e) => {
    e.preventDefault();
    if (!form.plan_name || !form.start_date) return;
    actions.onAddPlan(form);
    setForm({ plan_name: '', start_date: '' });
  };

  const handleAiGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const generated = await aiService.generateAiWorkoutPlan({
        goal: aiGoal,
        durationWeeks: 4,
        user
      });

      if (generated && generated.plan_name) {
        const today = new Date().toISOString().slice(0, 10);
        actions.onAddPlan({
          plan_name: `🤖 ${generated.plan_name}`,
          start_date: today
        });
      }
    } catch (err) {
      alert(`AI Plan Generator Notice: Added sample plan (${err.message})`);
      const today = new Date().toISOString().slice(0, 10);
      actions.onAddPlan({
        plan_name: `🤖 AI Custom ${aiGoal} Plan`,
        start_date: today
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div>
      <div className="page-head flex-between align-center flex-wrap gap-2">
        <div>
          <div className="page-eyebrow">has → contains → consists_of</div>
          <h1 className="page-title">Fitness Plans</h1>
          <p className="page-desc">
            Custom plans and workouts built manually or generated live by your Gemini AI Coach.
          </p>
        </div>
        <div className="flex align-center gap-2">
          <input
            type="text"
            className="input-field-sm"
            style={{ width: '220px' }}
            placeholder="Target Goal (e.g. Endurance)"
            value={aiGoal}
            onChange={(e) => setAiGoal(e.target.value)}
          />
          <button
            className="btn btn-primary text-xs flex align-center gap-1"
            onClick={handleAiGeneratePlan}
            disabled={isGeneratingPlan}
          >
            {isGeneratingPlan ? '⏳ Gemini Generating...' : '🤖 AI Generate Plan'}
          </button>
        </div>
      </div>

      {plans.length === 0 && <div className="empty-state">No fitness plans yet — add one below or generate with Gemini AI!</div>}

      {plans.map((plan) => (
        <PlanCard
          key={plan.plan_id}
          plan={plan}
          workouts={workouts.filter((w) => w.plan_id === plan.plan_id)}
          exercises={exercises}
          actions={actions}
        />
      ))}

      <div className="card">
        <div className="card-title">New Fitness Plan</div>
        <form className="inline-form" style={{ borderTop: 'none', paddingTop: 0 }} onSubmit={submitPlan}>
          <div className="field">
            <label>Plan name</label>
            <input
              value={form.plan_name}
              onChange={(e) => setForm((f) => ({ ...f, plan_name: e.target.value }))}
              placeholder="e.g. Marathon Prep"
            />
          </div>
          <div className="field">
            <label>Start date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
            />
          </div>
          <button className="btn" type="submit">
            + plan
          </button>
        </form>
      </div>
    </div>
  );
}

