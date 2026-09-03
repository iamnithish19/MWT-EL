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
      <div className="login-card" style={{ maxWidth: '540px', padding: '2.25rem' }}>
        <div className="login-header">
          <div className="brand">
            <span className="brand-mark">SFC//</span>
            <span className="brand-sub">Smart Fitness Companion</span>
          </div>
          <h2 className="login-title" style={{ fontSize: '1.5rem', fontWeight: 900 }}>
            {isRegister ? 'REGISTER NEW ACCOUNT' : 'MULTI-USER SYSTEM LOGIN'}
          </h2>
          <p className="login-subtitle">
            {isRegister
              ? 'Choose your role: GYM MASTER (Coach/Admin) or GYM MEMBER (Athlete).'
              : 'Sign in to access your GYM MEMBER Dashboard or GYM MASTER Portal.'}
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
            style={{ fontWeight: 800 }}
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
            style={{ fontWeight: 800 }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group mb-4">
              <label style={{ color: '#00F0FF', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                SELECT USER ROLE:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: '10px',
                    border: role === 'member' ? '2.5px solid #00F0FF' : '1px solid rgba(255,255,255,0.15)',
                    background: role === 'member' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: role === 'member' ? '0 0 15px rgba(0, 240, 255, 0.3)' : 'none'
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#00F0FF', letterSpacing: '0.04em' }}>
                    🏋️ GYM MEMBER
                  </div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 500, marginTop: '3px' }}>
                    Personal Workout Tracking
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('gym_master')}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: '10px',
                    border: role === 'gym_master' ? '2.5px solid #FFD700' : '1px solid rgba(255,255,255,0.15)',
                    background: role === 'gym_master' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: role === 'gym_master' ? '0 0 15px rgba(255, 215, 0, 0.3)' : 'none'
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#FFD700', letterSpacing: '0.04em' }}>
                    👑 GYM MASTER
                  </div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 500, marginTop: '3px' }}>
                    Coach & Trainer Management
                  </div>
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <div className="form-group">
              <label style={{ fontWeight: 700 }}>FULL NAME</label>
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
            <label style={{ fontWeight: 700 }}>{isRegister ? 'EMAIL ADDRESS' : 'EMAIL OR USERNAME'}</label>
            <input
              type="text"
              placeholder={isRegister ? (role === 'gym_master' ? 'coach@gymmaster.fit' : 'alex@example.com') : 'marcus@gymmaster.fit or ava@companion.fit'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: 700 }}>PASSWORD</label>
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
                <label style={{ fontWeight: 700 }}>AGE (YRS)</label>
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
                <label style={{ fontWeight: 700 }}>WEIGHT (KG)</label>
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
                <label style={{ fontWeight: 700 }}>GYM / CLUB NAME</label>
                <input
                  type="text"
                  placeholder="Iron Forge Gym"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 700 }}>SPECIALTY TITLE</label>
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

          <button type="submit" className="login-submit-btn" style={{ fontWeight: 900, letterSpacing: '0.05em' }}>
            {isRegister ? (role === 'gym_master' ? 'REGISTER GYM MASTER' : 'REGISTER GYM MEMBER') : 'AUTHENTICATE ACCESS'}
          </button>
        </form>

        <div className="demo-section" style={{ marginTop: '1.75rem' }}>
          <div className="demo-divider mb-3">
            <span style={{ fontWeight: 900, color: '#00F0FF', letterSpacing: '0.08em', fontSize: '0.78rem' }}>
              ⚡ QUICK LOGIN (GYM MASTER & GYM MEMBER)
            </span>
          </div>

          <div className="demo-users-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {existingUsers.map((u) => {
              const isMaster = u.role === 'gym_master';
              return (
                <button
                  key={u.user_id}
                  type="button"
                  className="demo-user-btn"
                  onClick={() => handleDemoLogin(u)}
                  style={{
                    borderColor: isMaster ? '#FFD700' : '#00F0FF',
                    borderWidth: '1.5px',
                    background: isMaster
                      ? 'linear-gradient(90deg, rgba(255,215,0,0.12) 0%, rgba(10,14,26,0.6) 100%)'
                      : 'linear-gradient(90deg, rgba(0,240,255,0.08) 0%, rgba(10,14,26,0.6) 100%)',
                    padding: '0.75rem 1rem'
                  }}
                >
                  <span
                    className="demo-user-avatar"
                    style={{
                      width: '42px',
                      height: '42px',
                      padding: 0,
                      overflow: 'hidden',
                      border: isMaster ? '2px solid #FFD700' : '2px solid #00F0FF'
                    }}
                  >
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      u.name.charAt(0)
                    )}
                  </span>

                  <div className="demo-user-info" style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="demo-user-name" style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                        {u.name}
                      </span>
                      {/* BOLD & CLEAR ROLE BADGE */}
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontWeight: 900,
                          letterSpacing: '0.06em',
                          background: isMaster ? '#FFD700' : '#00F0FF',
                          color: '#000000',
                          textTransform: 'uppercase',
                          boxShadow: isMaster ? '0 0 10px rgba(255,215,0,0.4)' : '0 0 10px rgba(0,240,255,0.4)'
                        }}
                      >
                        {isMaster ? '👑 GYM MASTER' : '🏋️ GYM MEMBER'}
                      </span>
                    </div>

                    <span className="demo-user-meta" style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px', display: 'block' }}>
                      {isMaster ? (u.specialty || 'Head Strength Coach') : `${u.fitness_level || 'Member'} • ${u.email}`}
                    </span>
                  </div>

                  <span className="demo-user-arrow" style={{ color: isMaster ? '#FFD700' : '#00F0FF', fontWeight: 900, fontSize: '1.2rem' }}>
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="login-txt-export-section mt-4 pt-3" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex-between align-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, fontWeight: 700 }}>💾 Text Storage Backup (.txt)</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={() => db.exportLoginHistoryAsText()}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6rem', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
            >
              📜 Download User Logins (.txt)
            </button>
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={() => db.exportDatabaseAsText()}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6rem', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
            >
              📄 Export Database (.txt)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
