import React, { useState, useEffect } from 'react';
import * as db from '../services/db';
import * as aiService from '../services/aiService';

export default function Settings({ onRefreshData }) {
  const [units, setUnits] = useState('metric');
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  // AI State
  const [apiKey, setApiKeyInput] = useState('');
  const [selectedModel, setSelectedModelInput] = useState(aiService.DEFAULT_MODEL);
  const [selectedPersona, setSelectedPersonaInput] = useState(aiService.getSelectedPersona());
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState({ loading: false, msg: '', type: '' });

  useEffect(() => {
    setApiKeyInput(aiService.getApiKey());
    setSelectedModelInput(aiService.getSelectedModel());
    setSelectedPersonaInput(aiService.getSelectedPersona());
  }, []);

  const handleSaveApiKey = () => {
    aiService.setApiKey(apiKey);
    aiService.setSelectedModel(selectedModel);
    aiService.setSelectedPersona(selectedPersona);
    setTestStatus({ loading: false, msg: 'Settings saved successfully!', type: 'success' });
    setTimeout(() => setTestStatus({ loading: false, msg: '', type: '' }), 3000);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestStatus({ loading: false, msg: 'Please enter a Gemini API Key to test.', type: 'error' });
      return;
    }

    setTestStatus({ loading: true, msg: 'Testing Gemini API Connection...', type: 'info' });
    try {
      aiService.setApiKey(apiKey);
      aiService.setSelectedModel(selectedModel);
      aiService.setSelectedPersona(selectedPersona);
      await aiService.testApiKey(apiKey);
      setTestStatus({ loading: false, msg: '✅ API Key is valid! Gemini AI connected successfully.', type: 'success' });
    } catch (err) {
      setTestStatus({ loading: false, msg: `❌ Connection failed: ${err.message}`, type: 'error' });
    }
  };

  const handleClearApiKey = () => {
    aiService.clearApiKey();
    setApiKeyInput('');
    setTestStatus({ loading: false, msg: 'API Key cleared. AI Coach will run in demo mode.', type: 'info' });
  };

  const handleExportDB = () => {
    const data = db.exportDatabase();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sfc_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReseed = () => {
    if (confirm('Are you sure you want to reset all data back to original seed defaults?')) {
      db.resetDatabase();
      onRefreshData();
      alert('Database successfully restored to default state!');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Settings & System Preferences</h1>
          <p className="page-subtitle">Manage AI integration, system units, database state, and telemetry preferences.</p>
        </div>
      </header>

      {/* AI Integration Card */}
      <div className="card mb-4 border-primary">
        <div className="flex-between align-center mb-3">
          <div>
            <h3 className="section-title">🤖 AI Virtual Coach Integration (Google Gemini API)</h3>
            <p className="stat-lbl">Connect your free Google Gemini API key to activate live personalized AI coaching.</p>
          </div>
          <span className={`badge ${apiKey ? 'badge-success' : 'badge-warning'}`}>
            {apiKey ? '🟢 Gemini Connected' : '🟡 Free API Key Needed'}
          </span>
        </div>

        <div className="form-grid gap-3">
          <div>
            <label className="input-label flex-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary"
                style={{ textDecoration: 'underline' }}
              >
                🔗 Get Free API Key (Google AI Studio)
              </a>
            </label>
            <div className="flex gap-2">
              <input
                type={showKey ? 'text' : 'password'}
                className="input-field flex-1"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-secondary text-xs"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="grid grid-2 gap-2">
            <div>
              <label className="input-label">AI Model Tier</label>
              <select
                className="select-input"
                value={selectedModel}
                onChange={(e) => setSelectedModelInput(e.target.value)}
              >
                {aiService.AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Default Coach Persona</label>
              <select
                className="select-input"
                value={selectedPersona}
                onChange={(e) => setSelectedPersonaInput(e.target.value)}
              >
                {aiService.COACH_PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>


        {testStatus.msg && (
          <div
            className={`p-3 mt-3 border-radius text-sm ${
              testStatus.type === 'success'
                ? 'bg-success-light text-success'
                : testStatus.type === 'error'
                ? 'bg-danger-light text-danger'
                : 'bg-surface text-secondary'
            }`}
            style={{
              backgroundColor: testStatus.type === 'success' ? '#10B98122' : testStatus.type === 'error' ? '#EF444422' : '#1E293B',
              border: `1px solid ${testStatus.type === 'success' ? '#10B981' : testStatus.type === 'error' ? '#EF4444' : '#334155'}`
            }}
          >
            {testStatus.msg}
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button className="btn btn-primary" onClick={handleSaveApiKey}>
            💾 Save Key & Model
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleTestConnection}
            disabled={testStatus.loading}
          >
            {testStatus.loading ? 'Testing...' : '⚡ Test Connection'}
          </button>
          {apiKey && (
            <button className="btn btn-danger" onClick={handleClearApiKey}>
              🗑️ Clear Key
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-2 gap-4 mb-4">
        <div className="card">
          <h3 className="section-title mb-3">Application Preferences</h3>
          <div className="form-grid">
            <div>
              <label className="input-label">Measurement System</label>
              <select className="select-input" value={units} onChange={(e) => setUnits(e.target.value)}>
                <option value="metric">Metric System (kg, cm, ml)</option>
                <option value="imperial">Imperial System (lbs, inches, oz)</option>
              </select>
            </div>

            <div className="flex-between align-center my-2 p-2 border-radius bg-surface">
              <div>
                <strong className="text-md">Push & Daily Habit Reminders</strong>
                <p className="stat-lbl">Receive notifications for hydration, workouts, and supplements.</p>
              </div>
              <input
                type="checkbox"
                className="checkbox-custom"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </div>

            <div className="flex-between align-center my-2 p-2 border-radius bg-surface">
              <div>
                <strong className="text-md">Background Device Auto-Sync</strong>
                <p className="stat-lbl">Sync wearable pulse and steps automatically every 15 minutes.</p>
              </div>
              <input
                type="checkbox"
                className="checkbox-custom"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title mb-3">Database & Text Storage Tools</h3>
          <p className="stat-lbl mb-3">
            All your health, workout, and sleep telemetry is stored locally in your browser's persistent database and auto-synchronized to plain text files (`.txt`).
          </p>

          <div className="flex-col gap-3">
            <button className="btn btn-secondary w-full text-left p-3" onClick={() => db.exportLoginHistoryAsText()}>
              <span className="text-lg">📜</span>
              <div className="ml-2 inline-block">
                <strong>Export User Login History (.txt)</strong>
                <p className="stat-lbl">Download text file log (`user_logins.txt`) recording every user login ({db.getAll('userLogins').length} users recorded).</p>
              </div>
            </button>

            <button className="btn btn-secondary w-full text-left p-3" onClick={() => db.exportDatabaseAsText()}>
              <span className="text-lg">📄</span>
              <div className="ml-2 inline-block">
                <strong>Export Full Database (.txt)</strong>
                <p className="stat-lbl">Download complete text snapshot of all database tables in human-readable plain text format.</p>
              </div>
            </button>

            <button className="btn btn-secondary w-full text-left p-3" onClick={handleExportDB}>
              <span className="text-lg">📥</span>
              <div className="ml-2 inline-block">
                <strong>Export Local Database (JSON)</strong>
                <p className="stat-lbl">Download full raw JSON backup of all tables.</p>
              </div>
            </button>

            <button className="btn btn-danger w-full text-left p-3" onClick={handleReseed}>
              <span className="text-lg">🔄</span>
              <div className="ml-2 inline-block">
                <strong>Reset Database to Seed Defaults</strong>
                <p className="stat-lbl text-rose">Wipes custom modifications and restores demo seed.</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
