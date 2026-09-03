import React, { useState } from 'react';
import * as db from '../services/db.js';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [role, setRole] = useState('member'); // 'member' | 'gym_master'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(65);
  const [gymName, setGymName] = useState('Iron Forge Gym');
  const [specialty, setSpecialty] = useState('Head Performance Coach');

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
        if (!name.trim() || !email.trim()) {
          setError('Please fill in all required fields.');
          return;
        }
        const newUser = db.registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          age,
          weight,
          gym_name: gymName,
          specialty
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
      <div className="login-card" style={{ maxWidth: '520px' }}>
        <div className="login-header">
          <div className="brand">
            <span className="brand-mark">SFC//</span>
            <span className="brand-sub">Smart Fitness Companion</span>
          </div>
          <h2 className="login-title">
            {isRegister ? 'REGISTER USER ACCOUNT' : 'MULTI-USER SYSTEM ACCESS'}
          </h2>
          <p className="login-subtitle">
            {isRegister
              ? 'Select your user role (Gym Master or Member) to create your account.'
              : 'Sign in to access your personalized Member Dashboard or Gym Master Control Center.'}
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
            <div className="form-group mb-3">
              <label style={{ color: '#00F0FF', fontWeight: 600 }}>SELECT ACCOUNT ROLE</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: role === 'member' ? '2px solid #00F0FF' : '1px solid rgba(255,255,255,0.15)',
                    background: role === 'member' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  🏋️ Gym Member
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 400, marginTop: '2px' }}>Personal fitness tracking</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('gym_master')}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: role === 'gym_master' ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.15)',
                    background: role === 'gym_master' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  👑 Gym Master / Coach
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 400, marginTop: '2px' }}>Manage members & plans</div>
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label>FULL NAME</label>
              <input
                type="text"
                placeholder={role === 'gym_master' ? 'e.g. Master Coach Vance' : 'e.g. Alex Morgan'}
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
              placeholder={isRegister ? (role === 'gym_master' ? 'coach@gymmaster.fit' : 'alex@example.com') : 'marcus@gymmaster.fit or ava@companion.fit'}
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

          {isRegister && role === 'member' && (
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

          {isRegister && role === 'gym_master' && (
            <div className="form-row">
              <div className="form-group">
                <label>GYM / CLUB NAME</label>
                <input
                  type="text"
                  placeholder="Iron Forge Gym"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>SPECIALTY TITLE</label>
                <input
                  type="text"
                  placeholder="Head Strength Coach"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="login-submit-btn">
            {isRegister ? (role === 'gym_master' ? 'REGISTER GYM MASTER' : 'REGISTER MEMBER') : 'AUTHENTICATE'}
          </button>
        </form>

        <div className="demo-section">
          <div className="demo-divider">
            <span>SELECT DEMO USER LOGIN</span>
          </div>

          <div className="demo-users-list" style={{ gap: '0.5rem' }}>
            {existingUsers.map((u) => {
              const isMaster = u.role === 'gym_master';
              return (
                <button
                  key={u.user_id}
                  type="button"
                  className="demo-user-btn"
                  onClick={() => handleDemoLogin(u)}
                  style={{
                    borderColor: isMaster ? 'rgba(255, 215, 0, 0.4)' : 'rgba(0, 240, 255, 0.2)',
                    background: isMaster ? 'linear-gradient(90deg, rgba(255,215,0,0.08) 0%, rgba(255,255,255,0.02) 100%)' : undefined
                  }}
                >
                  <span className="demo-user-avatar" style={{ padding: 0, overflow: 'hidden', border: isMaster ? '2px solid #FFD700' : '1px solid #00F0FF' }}>
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      u.name.charAt(0)
                    )}
                  </span>
                  <div className="demo-user-info" style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="demo-user-name" style={{ fontWeight: 600 }}>{u.name}</span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          fontWeight: 700,
                          background: isMaster ? '#FFD700' : 'rgba(0, 240, 255, 0.2)',
                          color: isMaster ? '#000' : '#00F0FF',
                          textTransform: 'uppercase'
                        }}
                      >
                        {isMaster ? '👑 GYM MASTER' : '🏋️ MEMBER'}
                      </span>
                    </div>
                    <span className="demo-user-meta" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      {isMaster ? (u.specialty || 'Head Coach') : `${u.fitness_level || 'Member'} • ${u.email}`}
                    </span>
                  </div>
                  <span className="demo-user-arrow" style={{ color: isMaster ? '#FFD700' : '#00F0FF' }}>→</span>
                </button>
              );
            })}
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
