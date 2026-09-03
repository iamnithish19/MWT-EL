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
        gridTemplateColumns: 'minmax(350px, 1.1fr) minmax(400px, 0.9fr)',
        background: 'radial-gradient(circle at 15% 20%, #0d1628 0%, #050811 100%)',
        color: '#fff',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* LEFT HALF: HOMEPAGE HERO SHOWCASE */}
      <div
        className="homepage-left-hero"
        style={{
          padding: '4rem 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.04) 0%, rgba(255, 215, 0, 0.02) 100%)'
        }}
      >
        <div>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #00F0FF 0%, #FFD700 100%)',
                color: '#000',
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
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', color: '#fff', display: 'block' }}>
                SMART FITNESS COMPANION
              </span>
              <span style={{ fontSize: '0.72rem', color: '#00F0FF', fontWeight: 700, letterSpacing: '0.1em' }}>
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
              background: 'linear-gradient(135deg, #FFFFFF 0%, #00F0FF 50%, #FFD700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            NEXT-GEN FITNESS & GYM MASTER PLATFORM
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, maxWidth: '560px', marginBottom: '2.5rem' }}>
            A complete dual-role ecosystem for <strong>Gym Masters</strong> & <strong>Gym Members</strong>. Monitor member vitals, assign custom workout routines, track daily macros, and compete on live synced leaderboards.
          </p>

          {/* Core Feature Showcase Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div
              style={{
                background: 'rgba(255, 215, 0, 0.06)',
                border: '1px solid rgba(255, 215, 0, 0.25)',
                borderRadius: '14px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>👑</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#FFD700', margin: '0 0 0.3rem 0' }}>
                GYM MASTER PORTAL
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
                Control center to audit member vitals, create workout plans, and set daily nutrition targets.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(0, 240, 255, 0.06)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                borderRadius: '14px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🏋️</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#00F0FF', margin: '0 0 0.3rem 0' }}>
                MEMBER DASHBOARD
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
                Personal fitness hub for live workout tracking, heart rate zones, sleep logs & habit streaks.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(57, 255, 20, 0.06)',
                border: '1px solid rgba(57, 255, 20, 0.25)',
                borderRadius: '14px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🏆</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#39FF14', margin: '0 0 0.3rem 0' }}>
                LIVE LEADERBOARD
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
                Compete with gym members with live profile name & avatar synchronization.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255, 0, 85, 0.06)',
                border: '1px solid rgba(255, 0, 85, 0.25)',
                borderRadius: '14px',
                padding: '1.25rem'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🤖</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#FF0055', margin: '0 0 0.3rem 0' }}>
                AI COACH INTELLIGENCE
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>
                AI insights on sleep recovery scores, optimal cardio zones & supplement stacks.
              </p>
            </div>
          </div>
        </div>

        {/* Footer System Badges */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#00F0FF', fontWeight: 700 }}>● Multi-User Roles Active</span>
          <span style={{ fontSize: '0.75rem', color: '#FFD700', fontWeight: 700 }}>● Gym Master Portal Included</span>
          <span style={{ fontSize: '0.75rem', color: '#39FF14', fontWeight: 700 }}>● 100% Local DB Storage</span>
        </div>
      </div>

      {/* RIGHT HALF: LOGIN & ACCOUNT REGISTRATION PANEL */}
      <div
        className="homepage-right-login"
        style={{
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto'
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: 0, color: '#fff' }}>
              SYSTEM ACCESS PORTAL
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.3rem' }}>
              Sign in to your account or register a new Gym Master / Member profile below.
            </p>
          </div>

          {error && <div className="login-error-alert mb-3">{error}</div>}

          {/* DUAL VISIBLE OPTIONS: BOTH SIGN IN & CREATE ACCOUNT ARE PROMINENTLY VISIBLE */}
          <div
            className="dual-access-options mb-4"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '0.4rem',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
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
                border: !isRegister ? '2.5px solid #00F0FF' : '1px solid transparent',
                background: !isRegister ? 'rgba(0, 240, 255, 0.18)' : 'transparent',
                color: !isRegister ? '#00F0FF' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: !isRegister ? '0 0 12px rgba(0, 240, 255, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.04em' }}>
                🔑 SIGN IN
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 600, marginTop: '2px' }}>
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
                border: isRegister ? '2.5px solid #FFD700' : '1px solid transparent',
                background: isRegister ? 'rgba(255, 215, 0, 0.18)' : 'transparent',
                color: isRegister ? '#FFD700' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: isRegister ? '0 0 12px rgba(255, 215, 0, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: 900, fontSize: '0.95rem', letterSpacing: '0.04em' }}>
                ✨ CREATE ACCOUNT
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 600, marginTop: '2px' }}>
                Register New User
              </div>
            </button>
          </div>

          {/* ACTIVE FORM CONTAINER */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* ROLE SELECTOR (VISIBLE DURING REGISTRATION) */}
            {isRegister && (
              <div className="form-group mb-4">
                <label style={{ color: '#FFD700', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>
                  CHOOSE YOUR ACCOUNT ROLE:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setRole('member')}
                    style={{
                      padding: '0.85rem 0.6rem',
                      borderRadius: '12px',
                      border: role === 'member' ? '2.5px solid #00F0FF' : '1.5px solid rgba(255,255,255,0.15)',
                      background: role === 'member' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: '68px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: role === 'member' ? '0 0 15px rgba(0, 240, 255, 0.3)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#00F0FF', letterSpacing: '0.04em' }}>
                      🏋️ GYM MEMBER
                    </div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 500, marginTop: '3px' }}>
                      Personal Fitness Tracking
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('gym_master')}
                    style={{
                      padding: '0.85rem 0.6rem',
                      borderRadius: '12px',
                      border: role === 'gym_master' ? '2.5px solid #FFD700' : '1.5px solid rgba(255,255,255,0.15)',
                      background: role === 'gym_master' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: '68px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: role === 'gym_master' ? '0 0 15px rgba(255, 215, 0, 0.3)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#FFD700', letterSpacing: '0.04em' }}>
                      👑 GYM MASTER
                    </div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.8, fontWeight: 500, marginTop: '3px' }}>
                      Coach & Trainer Control
                    </div>
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <div className="form-group mb-3">
                <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>FULL NAME</label>
                <input
                  type="text"
                  placeholder={role === 'gym_master' ? 'e.g. Master Coach Vance' : 'e.g. Alex Morgan'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
            )}

            <div className="form-group mb-3">
              <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>{isRegister ? 'EMAIL ADDRESS' : 'EMAIL OR USERNAME'}</label>
              <input
                type="text"
                placeholder={isRegister ? (role === 'gym_master' ? 'coach@gymmaster.fit' : 'alex@example.com') : 'marcus@gymmaster.fit or ava@companion.fit'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            <div className="form-group mb-3">
              <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            {isRegister && role === 'member' && (
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>AGE (YRS)</label>
                  <input
                    type="number"
                    min="12"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>WEIGHT (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>
            )}

            {isRegister && role === 'gym_master' && (
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>GYM / CLUB NAME</label>
                  <input
                    type="text"
                    placeholder="Iron Forge Gym"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>SPECIALTY TITLE</label>
                  <input
                    type="text"
                    placeholder="Head Strength Coach"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff' }}
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
                background: isRegister ? '#FFD700' : '#00F0FF',
                color: '#000000',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                boxShadow: isRegister ? '0 0 15px rgba(255,215,0,0.3)' : '0 0 15px rgba(0,240,255,0.3)',
                marginTop: '0.5rem'
              }}
            >
              {isRegister ? (role === 'gym_master' ? 'REGISTER GYM MASTER' : 'REGISTER GYM MEMBER') : 'AUTHENTICATE ACCESS'}
            </button>
          </form>

          {/* DEMO USER QUICK SELECTION */}
          <div className="demo-section" style={{ marginTop: '1.75rem' }}>
            <div className="demo-divider mb-3" style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: 900, color: '#00F0FF', letterSpacing: '0.08em', fontSize: '0.78rem' }}>
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
                      borderColor: isMaster ? '#FFD700' : '#00F0FF',
                      borderWidth: '1.5px',
                      borderRadius: '12px',
                      background: isMaster
                        ? 'linear-gradient(90deg, rgba(255,215,0,0.12) 0%, rgba(10,14,26,0.6) 100%)'
                        : 'linear-gradient(90deg, rgba(0,240,255,0.08) 0%, rgba(10,14,26,0.6) 100%)',
                      padding: '0.85rem 1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      cursor: 'pointer',
                      width: '100%',
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
                        border: isMaster ? '2px solid #FFD700' : '2px solid #00F0FF'
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
                        <span className="demo-user-name" style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                          {u.name}
                        </span>

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

                      <span className="demo-user-meta" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        {isMaster ? (u.specialty || 'Head Strength Coach') : `${u.fitness_level || 'Member'} • ${u.email}`}
                      </span>
                    </div>

                    <span
                      className="demo-user-arrow"
                      style={{
                        color: isMaster ? '#FFD700' : '#00F0FF',
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
          <div className="login-txt-export-section mt-4 pt-3" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex-between align-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7, fontWeight: 700 }}>💾 Text Storage Backup (.txt)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                type="button"
                className="btn btn-secondary text-xs"
                onClick={() => db.exportLoginHistoryAsText()}
                style={{
                  padding: '0.6rem 0.8rem',
                  fontSize: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#fff',
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
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#fff',
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
