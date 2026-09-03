import React, { useState, useRef } from 'react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80'
];

export default function Profile({ user, onUpdateProfile }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    age: user.age || 25,
    weight: user.weight || 65,
    height: user.height || 170,
    fitness_level: user.fitness_level || 'Intermediate',
    bio: user.bio || '',
    avatar: user.avatar || ''
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

  const handleSelectPreset = (url) => {
    setForm((f) => ({ ...f, avatar: url }));
    setSaved(false);
    setError('');
  };

  const handleRemovePhoto = () => {
    setForm((f) => ({ ...f, avatar: '' }));
    setSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(user.user_id, {
      name: form.name,
      email: form.email,
      age: Number(form.age),
      weight: Number(form.weight),
      height: Number(form.height),
      fitness_level: form.fitness_level,
      bio: form.bio,
      avatar: form.avatar
    });
    setSaved(true);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">User Profile & Account</h1>
          <p className="page-subtitle">
            Manage your personal fitness identity, profile picture, biometric targets, and body metrics.
          </p>
        </div>
      </header>

      <div className="grid grid-3 gap-4 mb-4">
        {/* Profile Card & Avatar Uploader */}
        <div className="card text-center flex-col align-center p-4">
          <h3 className="section-title mb-3">Profile Photo</h3>

          {/* Avatar Display */}
          <div className="relative mb-3" style={{ width: 120, height: 120, margin: '0 auto' }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '44px',
                fontWeight: 'bold',
                color: '#fff',
                border: '4px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            >
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt={form.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span>{(form.name || 'U').charAt(0).toUpperCase()}</span>
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
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                cursor: 'pointer'
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

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              📤 Upload Photo
            </button>
            {form.avatar && (
              <button
                type="button"
                className="btn btn-danger text-xs"
                onClick={handleRemovePhoto}
              >
                🗑️ Remove
              </button>
            )}
          </div>

          {/* Presets Gallery */}
          <div className="w-full mt-2 pt-3 border-t">
            <label className="input-label text-xs mb-2 block">Or choose a preset avatar:</label>
            <div className="flex justify-center gap-2 flex-wrap">
              {PRESET_AVATARS.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Preset ${idx + 1}`}
                  onClick={() => handleSelectPreset(url)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: form.avatar === url ? '2px solid var(--primary, #6366f1)' : '2px solid transparent',
                    opacity: form.avatar === url ? 1 : 0.7,
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Form Controls */}
        <div className="card grid-span-2">
          <h3 className="section-title mb-3">Personal Details & Biometrics</h3>

          <form onSubmit={handleSubmit} className="form-grid gap-3">
            <div>
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={form.name}
                onChange={handleChange('name')}
                required
              />
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={handleChange('email')}
              />
            </div>

            <div>
              <label className="input-label">Age (years)</label>
              <input
                type="number"
                min="10"
                max="120"
                className="input-field"
                value={form.age}
                onChange={handleChange('age')}
                required
              />
            </div>

            <div>
              <label className="input-label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                className="input-field"
                value={form.weight}
                onChange={handleChange('weight')}
                required
              />
            </div>

            <div>
              <label className="input-label">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                className="input-field"
                value={form.height}
                onChange={handleChange('height')}
              />
            </div>

            <div>
              <label className="input-label">Fitness Experience Level</label>
              <select
                className="select-input"
                value={form.fitness_level}
                onChange={handleChange('fitness_level')}
              >
                <option value="Beginner">Beginner (0-1 years)</option>
                <option value="Intermediate">Intermediate (1-3 years)</option>
                <option value="Advanced">Advanced (3+ years)</option>
                <option value="Elite Athlete">Elite Athlete / Pro</option>
              </select>
            </div>

            <div className="full-width grid-span-2">
              <label className="input-label">Bio & Primary Fitness Goals</label>
              <textarea
                className="input-field"
                rows="3"
                value={form.bio}
                onChange={handleChange('bio')}
                placeholder="Share your athletic focus (e.g. Marathon prep, muscle gain, fat loss)..."
              />
            </div>

            {error && <div className="text-xs text-danger grid-span-2">{error}</div>}

            <div className="flex align-center gap-3 grid-span-2 mt-2">
              <button className="btn btn-primary" type="submit">
                💾 Save Profile Changes
              </button>
              {saved && (
                <span className="text-sm text-success flex align-center gap-1">
                  ✅ Profile & Avatar updated successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
