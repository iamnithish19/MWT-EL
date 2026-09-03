import React, { useState } from 'react';
import * as db from '../services/db.js';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(65);

  const existingUsers = db.getAll('users');

  const handleDemoLogin = (user) => {
    setError('');
    onLoginSuccess(user);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        if (!name.trim() || !email.trim() || !password) {
          setError('Please fill in all required fields.');
          return;
        }
        const newUser = db.registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
          age,
          weight
        });
        onLoginSuccess(newUser);
      } else {
        if (!email.trim()) {
          setError('Please enter your email or username.');
          return;
        }
        const user = db.authenticateUser(email, password);
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="brand">
            <span className="brand-mark">SFC//</span>
            <span className="brand-sub">Smart Fitness Companion</span>
          </div>
          <h2 className="login-title">
            {isRegister ? 'JOIN THE PROGRAM' : 'SYSTEM ACCESS'}
          </h2>
          <p className="login-subtitle">
            {isRegister
              ? 'Create your account to start tracking workouts, vitals & devices.'
              : 'Log in to access your personalized fitness dashboard.'}
          </p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <div className="login-tabs">
          <button
            type="button"
            className={`tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>{isRegister ? 'EMAIL ADDRESS' : 'EMAIL OR USERNAME'}</label>
            <input
              type="text"
              placeholder={isRegister ? 'alex@example.com' : 'ava@companion.fit or Ava Thompson'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegister && (
            <div className="form-row">
              <div className="form-group">
                <label>AGE (YRS)</label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>WEIGHT (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="login-submit-btn">
            {isRegister ? 'REGISTER & ENTER' : 'AUTHENTICATE'}
          </button>
        </form>

        <div className="demo-section">
          <div className="demo-divider">
            <span>OR QUICK DEMO LOGIN</span>
          </div>
          <div className="demo-users-list">
            {existingUsers.map((u) => (
              <button
                key={u.user_id}
                type="button"
                className="demo-user-btn"
                onClick={() => handleDemoLogin(u)}
              >
                <span className="demo-user-avatar" style={{ padding: 0, overflow: 'hidden' }}>
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    u.name.charAt(0)
                  )}
                </span>
                <div className="demo-user-info">
                  <span className="demo-user-name">{u.name}</span>
                  <span className="demo-user-meta">User ID #{u.user_id}</span>
                </div>
                <span className="demo-user-arrow">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="login-txt-export-section mt-4 pt-3 border-t border-secondary" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex-between align-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7 }}>💾 Text Storage Backup (.txt)</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={() => db.exportLoginHistoryAsText()}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6rem', color: '#fff', cursor: 'pointer' }}
            >
              📜 Download User Logins (.txt)
            </button>
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={() => db.exportDatabaseAsText()}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6rem', color: '#fff', cursor: 'pointer' }}
            >
              📄 Export Database (.txt)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
