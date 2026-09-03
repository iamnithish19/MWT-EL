import React, { useState } from 'react';

export default function CommunityLeaderboard({ rankings = [], currentUser, users = [], healthTrackers = [] }) {
  const [tab, setTab] = useState('steps');

  // Build dynamically synced rankings list including all registered users
  const masterList = [...rankings];

  if (users && users.length) {
    users.forEach((u) => {
      const existingIdx = masterList.findIndex(
        (r) => r.user_id === u.user_id || (r.name && r.name.replace(/\s*\(You\)$/i, '') === u.name)
      );

      // Latest step count for this user
      const userSteps = healthTrackers
        ? healthTrackers.filter((h) => h.user_id === u.user_id).slice(-1)[0]?.steps || (u.user_id === currentUser?.user_id ? 10230 : 8500)
        : 9000;

      if (existingIdx >= 0) {
        masterList[existingIdx] = {
          ...masterList[existingIdx],
          user_id: u.user_id,
          name: u.name,
          avatar: u.avatar || masterList[existingIdx].avatar,
          steps: Math.max(masterList[existingIdx].steps || 0, userSteps)
        };
      } else {
        masterList.push({
          rank: masterList.length + 1,
          user_id: u.user_id,
          name: u.name,
          steps: userSteps,
          points: 2100 + u.user_id * 150,
          badge: u.role === 'gym_master' ? 'Gym Master / Coach' : 'Fitness Challenger',
          avatar: u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`
        });
      }
    });
  }

  // Sort rankings by tab (steps or points)
  const sortedRankings = masterList
    .slice()
    .sort((a, b) => (tab === 'steps' ? (b.steps || 0) - (a.steps || 0) : (b.points || 0) - (a.points || 0)))
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  // Identify current user row & position
  const currentUserRankIndex = sortedRankings.findIndex(
    (r) => (currentUser && r.user_id === currentUser.user_id) || (currentUser && r.name === currentUser.name)
  );

  const userRankNumber = currentUserRankIndex >= 0 ? currentUserRankIndex + 1 : 2;
  const userRankEntry = currentUserRankIndex >= 0 ? sortedRankings[currentUserRankIndex] : null;

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Community & Leaderboards</h1>
          <p className="page-subtitle">
            Live fitness rankings synced directly with your user profile & activity.
          </p>
        </div>
      </header>

      <div className="grid grid-3 gap-3 mb-4">
        <div className="card text-center" style={{ border: '1px solid rgba(255, 215, 0, 0.3)', background: 'rgba(255, 215, 0, 0.05)' }}>
          <span className="stat-lbl">YOUR LEADERBOARD RANK</span>
          <div className="stat-num text-amber my-2" style={{ fontWeight: 900 }}>
            🏆 #{userRankNumber}
          </div>
          <span className="badge badge-accent">
            {currentUser?.role === 'gym_master' ? '👑 Gym Master' : userRankEntry?.badge || 'Consistency Champion'}
          </span>
        </div>

        <div className="card text-center">
          <span className="stat-lbl">WEEKLY COMMUNITY POINTS</span>
          <div className="stat-num text-cyan my-2" style={{ fontWeight: 900 }}>
            {userRankEntry ? `${userRankEntry.points.toLocaleString()} pts` : '2,410 pts'}
          </div>
          <span className="stat-lbl">+350 pts from yesterday</span>
        </div>

        <div className="card text-center">
          <span className="stat-lbl">ACTIVE CHALLENGE</span>
          <div className="stat-num text-emerald my-2" style={{ fontWeight: 900 }}>70K Steps</div>
          <span className="badge badge-success">85% Completed</span>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex-between align-center mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="section-title" style={{ margin: 0 }}>Weekly Fitness Leaderboard</h3>
            <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>
              Names & profile photos are live-synced with user accounts
            </span>
          </div>
          <div className="flex-gap">
            <button
              className={`btn btn-sm ${tab === 'steps' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTab('steps')}
              style={{ fontWeight: 700 }}
            >
              👟 Step Leaders
            </button>
            <button
              className={`btn btn-sm ${tab === 'points' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTab('points')}
              style={{ fontWeight: 700 }}
            >
              ⭐ Points Ranks
            </button>
          </div>
        </div>

        <div className="rankings-list">
          {sortedRankings.map((userRank) => {
            const isCurrentUser =
              currentUser &&
              (userRank.user_id === currentUser.user_id ||
                userRank.name.replace(/\s*\(You\)$/i, '') === currentUser.name);

            const displayName = isCurrentUser ? `${currentUser.name} (You)` : userRank.name;
            const displayAvatar = isCurrentUser
              ? currentUser.avatar || userRank.avatar
              : userRank.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userRank.name}`;

            return (
              <div
                key={userRank.user_id || userRank.rank}
                className={`rank-row p-3 mb-2 border-radius flex-between align-center ${isCurrentUser ? 'user-highlight' : ''}`}
                style={{
                  border: isCurrentUser ? '2px solid #00F0FF' : '1px solid rgba(255,255,255,0.08)',
                  background: isCurrentUser
                    ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.15) 0%, rgba(10, 14, 26, 0.6) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px'
                }}
              >
                <div className="flex-gap align-center">
                  <span
                    className={`rank-num ${userRank.rank === 1 ? 'gold' : userRank.rank === 2 ? 'silver' : 'bronze'}`}
                    style={{ fontWeight: 900, fontSize: '1.1rem', minWidth: '36px' }}
                  >
                    #{userRank.rank}
                  </span>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: isCurrentUser ? '2px solid #00F0FF' : '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <h4 className="font-bold text-md mb-0" style={{ color: isCurrentUser ? '#00F0FF' : '#fff', fontWeight: 800 }}>
                        {displayName}
                      </h4>
                      {isCurrentUser && (
                        <span style={{ fontSize: '0.65rem', background: '#00F0FF', color: '#000', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="badge badge-secondary text-xs" style={{ marginTop: '0.2rem', display: 'inline-block' }}>
                      {userRank.badge}
                    </span>
                  </div>
                </div>

                <div className="flex-gap align-center text-right">
                  <div>
                    <div className="font-bold text-lg text-cyan" style={{ fontWeight: 800 }}>
                      {tab === 'steps' ? `${userRank.steps.toLocaleString()} steps` : `${userRank.points.toLocaleString()} pts`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
