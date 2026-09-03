import React, { useState } from 'react';

const NAV_GROUPS = [
  {
    category: 'OVERVIEW & ACTIVE',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: '📊' },
      { key: 'workout-live', label: 'Live Workout', icon: '⏱️', badge: 'LIVE' },
      { key: 'reports', label: 'Progress Reports', icon: '📈' }
    ]
  },   
  {
    category: 'FITNESS & TRAINING',
    items: [
      { key: 'plans', label: 'Fitness Plans', icon: '🏋️‍♂️' },
      { key: 'goals', label: 'Goals & Milestones', icon: '🎯' },
      { key: 'heart-zones', label: 'Heart Rate Zones', icon: '❤️' }
    ]   
  },   
  {   
    category: 'HEALTH & RECOVERY',
    items: [
      { key: 'health', label: 'Health Vitals', icon: '🩺' },
      { key: 'sleep', label: 'Sleep & Recovery', icon: '🌙' },
      { key: 'hydration', label: 'Water & Hydration', icon: '💧' },
      { key: 'supplements', label: 'Supplement Stack', icon: '💊' }
    ]
  },
  {
    category: 'NUTRITION & BODY',
    items: [
      { key: 'nutrition', label: 'Nutrition Plan', icon: '🥗' },
      { key: 'recipes', label: 'Recipe Library', icon: '🍲' },
      { key: 'macro-calc', label: 'Macro Calculator', icon: '🧮' },
      { key: 'body-comp', label: 'Body Composition', icon: '📏' }
    ]
  },
  {
    category: 'COMMUNITY & AI',
    items: [
      { key: 'community', label: 'Leaderboard', icon: '🏆' },
      { key: 'habits', label: 'Habit Streaks', icon: '🔥' },
      { key: 'devices', label: 'Devices & Sync', icon: '⌚' }
    ]
  },
  {     
    category: 'SYSTEM & ACCOUNT',
    items: [
      { key: 'profile', label: 'User Profile', icon: '👤' },
      { key: 'settings', label: 'Settings & Data', icon: '⚙️' }
    ]
  }
];

export default function Sidebar({ active, onNavigate, currentUser, onLogout }) {
  const [search, setSearch] = useState('');
  const isGymMaster = currentUser && currentUser.role === 'gym_master';

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">SFC//</span>
        <span className="brand-sub">Smart Fitness Companion</span>
      </div>

      {currentUser && (
        <div
          className="user-badge mb-3"
          style={{
            border: isGymMaster ? '1px solid rgba(255, 215, 0, 0.4)' : undefined,
            background: isGymMaster ? 'rgba(255, 215, 0, 0.08)' : undefined
          }}
        >
          <div
            className="user-avatar"
            style={{
              padding: 0,
              overflow: 'hidden',
              border: isGymMaster ? '2px solid #FFD700' : '1px solid #00F0FF'
            }}
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div className="user-info">
            <span className="user-name" style={{ fontWeight: 700 }}>{currentUser.name}</span>
            <span
              className="user-role"
              style={{
                color: isGymMaster ? '#FFD700' : '#00F0FF',
                fontWeight: 700,
                fontSize: '0.7rem'
              }}
            >
              {isGymMaster ? '👑 GYM MASTER / COACH' : '🏋️ GYM MEMBER'}
            </span>
          </div>
        </div>
      )}

      {/* GYM MASTER SPECIAL CONTROL ITEM */}
      {isGymMaster && (
        <div className="nav-group mb-3">
          <div className="nav-category-header" style={{ color: '#FFD700' }}>👑 GYM MASTER MANAGEMENT</div>
          <ul className="nav-list">
            <li>
              <button
                className={`nav-item${active === 'gym-master' ? ' active' : ''}`}
                onClick={() => onNavigate('gym-master')}
                style={{
                  background: active === 'gym-master' ? '#FFD700' : 'rgba(255, 215, 0, 0.15)',
                  color: active === 'gym-master' ? '#000' : '#FFD700',
                  fontWeight: 700,
                  border: '1px solid rgba(255, 215, 0, 0.4)'
                }}
              >
                <span className="nav-icon">👑</span>
                <span className="nav-label">Gym Master Control</span>
                <span className="nav-badge" style={{ background: '#000', color: '#FFD700' }}>ADMIN</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      <div className="px-2 mb-3">
        <input
          type="text"
          className="input-field-sm w-full"
          placeholder="🔎 Search modules..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="nav-scroll-area">
        {NAV_GROUPS.map((group) => {
          const matchingItems = group.items.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
          );
          if (matchingItems.length === 0) return null;

          return (
            <div key={group.category} className="nav-group mb-3">
              <div className="nav-category-header">{group.category}</div>
              <ul className="nav-list">
                {matchingItems.map((item) => (
                  <li key={item.key}>
                    <button
                      className={`nav-item${active === item.key ? ' active' : ''}`}
                      onClick={() => onNavigate(item.key)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        {onLogout && (
          <button type="button" className="logout-btn" onClick={onLogout}>
            LOG OUT
          </button>
        )}
        <div className="db-info">
          SMART FITNESS SUITE<br />
          local database v4 (Multi-User)<br />
          persisted to localStorage
        </div>
      </div>
    </aside>
  );
}