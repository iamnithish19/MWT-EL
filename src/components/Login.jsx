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
    <div
      className="login-page-homepage"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'minmax(360px, 1.1fr) minmax(400px, 0.9fr)',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* LEFT HALF: HOMEPAGE HERO SHOWCASE (LIGHT THEME) */}
      <div
        className="homepage-left-hero"
        style={{
          padding: '4rem 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'
        }}
      >
        <div>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div
              style={{
                background: '#ca8a04',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '1.25rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '10px',
                letterSpacing: '0.05em'
              }}
            >
              SFC//
            </div>
            <div>
              <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.05em', color: '#0f172a', display: 'block' }}>
                SMART FITNESS COMPANION
              </span>
              <span style={{ fontSize: '0.72rem', color: '#ca8a04', fontWeight: 800, letterSpacing: '0.1em' }}>
                MULTI-USER GYM ECOSYSTEM
              </span>
            </div>
          </div>

          {/* Hero Titles */}
          <h1
            style={{
              fontSize: '2.75rem',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              color: '#0f172a'
            }}
          >
            NEXT-GEN FITNESS & <br />
            <span style={{ color: '#ca8a04' }}>GYM MASTER PLATFORM</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, maxWidth: '560px', marginBottom: '2.5rem' }}>
            A complete dual-role ecosystem for <strong>Gym Masters</strong> & <strong>Gym Members</strong>. Monitor member vitals, assign custom workout routines, track daily macros, and compete on live synced leaderboards.
          </p>

          {/* Core Feature Showcase Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div
              style={{
                background: '#fef9c3',
                border: '1px solid #fef08a',
                borderRadius: '14px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>👑</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#854d0e', margin: '0 0 0.3rem 0' }}>
                GYM MASTER PORTAL
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#713f12', margin: 0, lineHeight: 1.4 }}>
                Control center to audit member vitals, create workout plans, and set daily nutrition targets.
              </p>
            </div>

            <div
              style={{
                background: '#dbeafe',
                border: '1px solid #bfdbfe',
                borderRadius: '14px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🏋️</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#1e40af', margin: '0 0 0.3rem 0' }}>
                MEMBER DASHBOARD
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#1e3a8a', margin: 0, lineHeight: 1.4 }}>
                Personal fitness hub for live workout tracking, heart rate zones, sleep logs & habit streaks.
              </p>
            </div>

            <div
              style={{
                background: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '14px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🏆</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#166534', margin: '0 0 0.3rem 0' }}>
                LIVE LEADERBOARD
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#14532d', margin: 0, lineHeight: 1.4 }}>
                Compete with gym members with live profile name & avatar synchronization.
              </p>
            </div>

            <div
              style={{
                background: '#f3e8ff',
                border: '1px solid #e9d5ff',
                borderRadius: '14px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🤖</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#6b21a8', margin: '0 0 0.3rem 0' }}>
                AI COACH INTELLIGENCE
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#581c87', margin: 0, lineHeight: 1.4 }}>
                AI insights on sleep recovery scores, optimal cardio zones & supplement stacks.
              </p>
            </div>
          </div>
        </div>

        {/* Footer System Badges */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 800 }}>● Multi-User Roles Active</span>
          <span style={{ fontSize: '0.75rem', color: '#ca8a04', fontWeight: 800 }}>● Gym Master Portal Included</span>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 800 }}>● 100% Local DB Storage</span>
        </div>
      </div>

      {/* RIGHT HALF: LOGIN & ACCOUNT REGISTRATION PANEL (LIGHT THEME) */}
      <div
        className="homepage-right-login"
        style={{
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#f8fafc',
          overflowY: 'auto'
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, color: '#0f172a' }}>
              SYSTEM ACCESS PORTAL
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.3rem' }}>
              Sign in to your account or register a new Gym Master / Member profile below.
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1rem'
              }}
            >
              {error}
            </div>
          )}

          {/* DUAL VISIBLE OPTIONS: BOTH SIGN IN & CREATE ACCOUNT ARE PROMINENTLY VISIBLE */}
          <div
            className="dual-access-options mb-4"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              background: '#e2e8f0',
              padding: '0.35rem',
              borderRadius: '14px'
            }}
          >
            {/* OPTION 1: SIGN IN */}
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
              style={{
                padding: '0.85rem 0.5rem',
                borderRadius: '10px',
                border: !isRegister ? '2px solid #2563eb' : '1px solid transparent',
                background: !isRegister ? '#ffffff' : 'transparent',
                color: !isRegister ? '#1e40af' : '#475569',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: !isRegister ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.04em' }}>
                🔑 SIGN IN
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 700, marginTop: '2px' }}>
                Existing Accounts
              </div>
            </button>

            {/* OPTION 2: CREATE ACCOUNT */}
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
              style={{
                padding: '0.85rem 0.5rem',
                borderRadius: '10px',
                border: isRegister ? '2px solid #ca8a04' : '1px solid transparent',
                background: isRegister ? '#ffffff' : 'transparent',
                color: isRegister ? '#854d0e' : '#475569',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: isRegister ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.04em' }}>
                ✨ CREATE ACCOUNT
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 700, marginTop: '2px' }}>
                Register New User
              </div>
            </button>
          </div>

          {/* ACTIVE FORM CONTAINER */}
          <form
            onSubmit={handleSubmit}
            className="login-form"
            style={{
              background: '#ffffff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}
          >
            {/* ROLE SELECTOR (VISIBLE DURING REGISTRATION) */}
            {isRegister && (
              <div className="form-group mb-4">
                <label style={{ color: '#ca8a04', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>
                  CHOOSE YOUR ACCOUNT ROLE:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setRole('member')}
                    style={{
                      padding: '0.85rem 0.6rem',
                      borderRadius: '12px',
                      border: role === 'member' ? '2.5px solid #2563eb' : '1.5px solid #e2e8f0',
                      background: role === 'member' ? '#dbeafe' : '#f8fafc',
                      color: '#000000',
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: '68px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: role === 'member' ? '0 2px 10px rgba(37,99,235,0.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#1e40af', letterSpacing: '0.04em' }}>
                      🏋️ GYM MEMBER
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#1e3a8a', fontWeight: 600, marginTop: '3px' }}>
                      Personal Fitness Tracking
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('gym_master')}
                    style={{
                      padding: '0.85rem 0.6rem',
                      borderRadius: '12px',
                      border: role === 'gym_master' ? '2.5px solid #ca8a04' : '1.5px solid #e2e8f0',
                      background: role === 'gym_master' ? '#fef9c3' : '#f8fafc',
                      color: '#000000',
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: '68px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: role === 'gym_master' ? '0 2px 10px rgba(202,138,4,0.15)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#854d0e', letterSpacing: '0.04em' }}>
                      👑 GYM MASTER
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#713f12', fontWeight: 600, marginTop: '3px' }}>
                      Coach & Trainer Control
                    </div>
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <div className="form-group mb-3">
                <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>FULL NAME</label>
                <input
                  type="text"
                  placeholder={role === 'gym_master' ? 'e.g. Master Coach Vance' : 'e.g. Alex Morgan'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.7rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>
            )}

            <div className="form-group mb-3">
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>{isRegister ? 'EMAIL ADDRESS' : 'EMAIL OR USERNAME'}</label>
              <input
                type="text"
                placeholder={isRegister ? (role === 'gym_master' ? 'coach@gymmaster.fit' : 'alex@example.com') : 'marcus@gymmaster.fit or ava@companion.fit'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.7rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
              />
            </div>

            <div className="form-group mb-3">
              <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.7rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
              />
            </div>

            {isRegister && role === 'member' && (
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>AGE (YRS)</label>
                  <input
                    type="number"
                    min="12"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>WEIGHT (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
              </div>
            )}

            {isRegister && role === 'gym_master' && (
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>GYM / CLUB NAME</label>
                  <input
                    type="text"
                    placeholder="Iron Forge Gym"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>SPECIALTY TITLE</label>
                  <input
                    type="text"
                    placeholder="Head Strength Coach"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
                borderRadius: '10px',
                background: isRegister ? '#ca8a04' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginTop: '0.5rem'
              }}
            >
              {isRegister ? (role === 'gym_master' ? 'REGISTER GYM MASTER' : 'REGISTER GYM MEMBER') : 'AUTHENTICATE ACCESS'}
            </button>
          </form>

          {/* DEMO USER QUICK SELECTION (LIGHT THEME) */}
          <div className="demo-section" style={{ marginTop: '1.75rem' }}>
            <div className="demo-divider mb-3" style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 900, color: '#ca8a04', letterSpacing: '0.08em', fontSize: '0.78rem' }}>
                ⚡ QUICK DEMO ACCOUNTS (GYM MASTER & MEMBERS)
              </span>
            </div>

            <div className="demo-users-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {existingUsers.map((u) => {
                const isMaster = u.role === 'gym_master';
                return (
                  <button
                    key={u.user_id}
                    type="button"
                    className="demo-user-btn"
                    onClick={() => handleDemoLogin(u)}
                    style={{
                      borderColor: isMaster ? '#fef08a' : '#bfdbfe',
                      borderWidth: '1.5px',
                      borderRadius: '12px',
                      background: isMaster ? '#fef9c3' : '#ffffff',
                      padding: '0.85rem 1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      cursor: 'pointer',
                      width: '100%',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span
                      className="demo-user-avatar"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        padding: 0,
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: isMaster ? '2px solid #ca8a04' : '2px solid #2563eb'
                      }}
                    >
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        u.name.charAt(0)
                      )}
                    </span>

                    <div className="demo-user-info" style={{ textAlign: 'left', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {/* BOLD BLACK FONT DEMO USER NAME */}
                        <span className="demo-user-name" style={{ fontWeight: 900, fontSize: '0.95rem', color: '#000000' }}>
                          {u.name}
                        </span>

                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            fontWeight: 900,
                            letterSpacing: '0.06em',
                            background: isMaster ? '#ca8a04' : '#2563eb',
                            color: '#ffffff',
                            textTransform: 'uppercase'
                          }}
                        >
                          {isMaster ? '👑 GYM MASTER' : '🏋️ GYM MEMBER'}
                        </span>
                      </div>

                      <span className="demo-user-meta" style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                        {isMaster ? (u.specialty || 'Head Strength Coach') : `${u.fitness_level || 'Member'} • ${u.email}`}
                      </span>
                    </div>

                    <span
                      className="demo-user-arrow"
                      style={{
                        color: isMaster ? '#ca8a04' : '#2563eb',
                        fontWeight: 900,
                        fontSize: '1.2rem',
                        marginLeft: 'auto'
                      }}
                    >
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BACKUP DATA EXPORTS */}
          <div className="login-txt-export-section mt-4 pt-3" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <div className="flex-between align-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 800 }}>💾 Text Storage Backup (.txt)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                type="button"
                className="btn btn-secondary text-xs"
                onClick={() => db.exportLoginHistoryAsText()}
                style={{
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.75rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#0f172a',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                📜 Download Logins (.txt)
              </button>
              <button
                type="button"
                className="btn btn-secondary text-xs"
                onClick={() => db.exportDatabaseAsText()}
                style={{
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.75rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#0f172a',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                📄 Export Database (.txt)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
