import React, { useState, useEffect } from 'react';
import ProgressRing from './ProgressRing.jsx';
import * as aiService from '../services/aiService.js';

export default function Dashboard({ user, fitnessPlans, workouts, healthTrackers, devices, progressReports, onNavigate }) {
  const latestReport = [...progressReports].sort((a, b) => (a.report_date < b.report_date ? 1 : -1))[0];
  const latestHealth = [...healthTrackers].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))[0];
  const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.duration_minutes || 0), 0);
  const syncedDevices = devices.filter((d) => d.sync_status.toLowerCase() === 'synced').length;

  const [aiInsight, setAiInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');

  useEffect(() => {
    aiService.generateDailyMotivationQuote({ user }).then((q) => setDailyQuote(q));
  }, [user]);

  const handleGenerateDailyInsight = async () => {
    setLoadingAi(true);
    try {
      const text = await aiService.generateAiResponse({
        prompt: 'Give me a brief 2-sentence daily coaching tip based on my current vitals, weekly workout minutes, and recovery status.',
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

  return (
    <div>
      <div className="page-head flex-between align-center flex-wrap gap-2">
        <div className="flex align-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user?.name || 'Athlete'}
            className="avatar-lg"
          />
          <div>
            <div className="page-eyebrow">Executive Telemetry Overview</div>
            <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0] || 'Athlete'}</h1>
            <p className="page-desc">
              A snapshot of your fitness plans, vitals, hardware, and nutrition.
            </p>
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
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
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
              <h3 className="section-title text-md">Gemini AI Coach • Daily Vitals Insight</h3>
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
            Click "Generate Fresh AI Insight" to receive instant personalized coaching feedback based on your {latestHealth ? `${latestHealth.heart_rate} bpm heart rate` : 'health vitals'} and {totalMinutes} workout minutes.
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

      <div className="card section">
        <div className="card-title">Latest Progress Report</div>
        {latestReport ? (
          <div className="ring-wrap flex align-center gap-4">
            <ProgressRing value={latestReport.completion_percentage} />
            <div className="flex align-center gap-3 flex-1">
              {latestReport.image && (
                <img
                  src={latestReport.image}
                  alt="Progress Report Visual"
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <div>
                <div className="ring-label">On track</div>
                <div className="ring-caption">
                  Report generated {latestReport.report_date} — {latestReport.completion_percentage}%
                  of your weekly plan target completed.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">No progress reports generated yet.</div>
        )}
      </div>
    </div>
  );
}

