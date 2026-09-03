import React, { useState, useRef } from 'react';
import { generateLetterAvatarSvg } from '../services/db.js';

export default function Profile({ user, onUpdateProfile }) {
  const defaultLetterAvatar = generateLetterAvatarSvg(user.name || 'User', user?.role === 'gym_master');

  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    age: user.age || 25,
    weight: user.weight || 65,
    height: user.height || 170,
    fitness_level: user.fitness_level || 'Intermediate',
    bio: user.bio || '',
    avatar: user.avatar || defaultLetterAvatar
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSaved(false);
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((f) => ({ ...f, avatar: event.target.result }));
      setSaved(false);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleResetToFirstLetter = () => {
    const letterAvatar = generateLetterAvatarSvg(form.name || user.name || 'User', user?.role === 'gym_master');
    setForm((f) => ({ ...f, avatar: letterAvatar }));
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAvatar = form.avatar || generateLetterAvatarSvg(form.name, user?.role === 'gym_master');
    onUpdateProfile(user.user_id, {
      name: form.name,
      email: form.email,
      age: Number(form.age),
      weight: Number(form.weight),
      height: Number(form.height),
      fitness_level: form.fitness_level,
      bio: form.bio,
      avatar: finalAvatar
    });
    setSaved(true);
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <header className="page-header mb-4">
        <div>
          <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
            User Profile & Account
          </h1>
          <p className="page-subtitle" style={{ fontWeight: 600, color: '#64748b' }}>
            Manage your personal fitness identity, profile picture, biometric targets, and body metrics.
          </p>
        </div>
      </header>

      {saved && (
        <div
          style={{
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}
        >
          ✅ Profile updated successfully! Profile photo & First Letter avatar synced across all modules.
        </div>
      )}

      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-3 gap-4">
        {/* Profile Avatar Card (No Preset Avatars) */}
        <div className="card text-center p-4" style={{ borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
          <h3 className="section-title mb-3" style={{ fontSize: '1.1rem', fontWeight: 900 }}>
            Profile Avatar
          </h3>

          {/* Avatar Display Container */}
          <div className="relative mb-3" style={{ width: 120, height: 120, margin: '0 auto', position: 'relative' }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                overflow: 'hidden',
                border: user?.role === 'gym_master' ? '4px solid #ca8a04' : '4px solid #2563eb',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: user?.role === 'gym_master' ? '#ca8a04' : '#2563eb'
              }}
            >
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt={form.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '54px', fontWeight: 900, color: '#ffffff' }}>
                  {(form.name || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 38,
                height: 38,
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                background: '#2563eb',
                color: '#ffffff',
                border: '2px solid #ffffff'
              }}
              onClick={() => fileInputRef.current?.click()}
              title="Upload new profile photo"
            >
              📷
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className="flex justify-center gap-2 mb-3" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={() => fileInputRef.current?.click()}
              style={{ fontWeight: 800, padding: '0.5rem 0.85rem', borderRadius: '8px' }}
            >
              📤 Upload Custom Photo
            </button>

            <button
              type="button"
              className="btn text-xs"
              onClick={handleResetToFirstLetter}
              style={{ fontWeight: 800, padding: '0.5rem 0.85rem', borderRadius: '8px', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1' }}
            >
              🔤 Reset to First Letter
            </button>
          </div>

          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', margin: 0, lineHeight: 1.4 }}>
            Default profile photo automatically uses your <strong>First Letter</strong>. Upload a custom image or click "Reset to First Letter".
          </p>
        </div>

        {/* Form Controls */}
        <div className="card grid-span-2 p-4" style={{ borderRadius: '16px', border: '1px solid #e2e8f0', background: '#ffffff', gridColumn: 'span 2' }}>
          <h3 className="section-title mb-3" style={{ fontSize: '1.2rem', fontWeight: 900 }}>
            Personal Details & Biometrics
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>FULL NAME</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>AGE (YRS)</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={handleChange('age')}
                  required
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>WEIGHT (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.weight}
                  onChange={handleChange('weight')}
                  required
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>HEIGHT (CM)</label>
                <input
                  type="number"
                  value={form.height}
                  onChange={handleChange('height')}
                  required
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>FITNESS LEVEL</label>
                <select
                  value={form.fitness_level}
                  onChange={handleChange('fitness_level')}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800 }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert / Master">Expert / Master</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>ACCOUNT ROLE</label>
                <input
                  type="text"
                  value={user?.role === 'gym_master' ? '👑 GYM MASTER / COACH' : '🏋️ GYM MEMBER'}
                  disabled
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 900, background: '#f8fafc', color: user?.role === 'gym_master' ? '#ca8a04' : '#2563eb' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>PERSONAL BIO & GOALS</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={handleChange('bio')}
                placeholder="Tell us about your fitness targets..."
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.85rem', fontWeight: 900, fontSize: '0.95rem', borderRadius: '10px', marginTop: '0.5rem', cursor: 'pointer' }}
            >
              💾 Save Profile & Sync First-Letter Avatar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
