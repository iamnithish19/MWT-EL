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
          role: u.role || masterList[existingIdx].role,
          avatar: u.avatar || masterList[existingIdx].avatar,
          steps: Math.max(masterList[existingIdx].steps || 0, userSteps)
        };
      } else {
        masterList.push({
          rank: masterList.length + 1,
          user_id: u.user_id,
          name: u.name,
          role: u.role || 'member',
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
        <div className="card text-center" style={{ border: '1px solid rgba(255, 215, 0, 0.4)', background: 'rgba(255, 215, 0, 0.08)' }}>
          <span className="stat-lbl" style={{ fontWeight: 800 }}>YOUR LEADERBOARD RANK</span>
          <div className="stat-num text-amber my-2" style={{ fontWeight: 900, fontSize: '2.2rem' }}>
            🏆 #{userRankNumber}
          </div>
          <span className="badge badge-accent" style={{ fontWeight: 800 }}>
            {currentUser?.role === 'gym_master' ? '👑 Gym Master' : userRankEntry?.badge || 'Consistency Champion'}
          </span>
        </div>

        <div className="card text-center">
          <span className="stat-lbl" style={{ fontWeight: 800 }}>WEEKLY COMMUNITY POINTS</span>
          <div className="stat-num text-cyan my-2" style={{ fontWeight: 900, fontSize: '2.2rem' }}>
            {userRankEntry ? `${userRankEntry.points.toLocaleString()} pts` : '2,410 pts'}
          </div>
          <span className="stat-lbl">+350 pts from yesterday</span>
        </div>

        <div className="card text-center">
          <span className="stat-lbl" style={{ fontWeight: 800 }}>ACTIVE CHALLENGE</span>
          <div className="stat-num text-emerald my-2" style={{ fontWeight: 900, fontSize: '2.2rem' }}>70K Steps</div>
          <span className="badge badge-success" style={{ fontWeight: 800 }}>85% Completed</span>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex-between align-center mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="section-title" style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>
              🏆 Weekly Fitness Leaderboard
            </h3>
            <span style={{ fontSize: '0.8rem', opacity: 0.8, color: '#00F0FF', fontWeight: 600 }}>
              ● Live names & user profile sync enabled
            </span>
          </div>
          <div className="flex-gap">
            <button
              className={`btn btn-sm ${tab === 'steps' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTab('steps')}
              style={{ fontWeight: 900, fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              👟 Step Leaders
            </button>
            <button
              className={`btn btn-sm ${tab === 'points' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTab('points')}
              style={{ fontWeight: 900, fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              ⭐ Points Ranks
            </button>
          </div>
        </div>

        <div className="rankings-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {sortedRankings.map((userRank) => {
            const isCurrentUser =
              currentUser &&
              (userRank.user_id === currentUser.user_id ||
                userRank.name.replace(/\s*\(You\)$/i, '') === currentUser.name);

            const isGymMaster = userRank.role === 'gym_master' || (isCurrentUser && currentUser?.role === 'gym_master');

            const displayName = isCurrentUser ? `${currentUser.name} (You)` : userRank.name;
            const displayAvatar = isCurrentUser
              ? currentUser.avatar || userRank.avatar
              : userRank.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userRank.name}`;

            return (
              <div
                key={userRank.user_id || userRank.rank}
                className="rank-row flex-between align-center"
                style={{
                  padding: '1rem 1.25rem',
                  border: isCurrentUser
                    ? '2.5px solid #00F0FF'
                    : isGymMaster
                    ? '1.5px solid #FFD700'
                    : '1px solid rgba(255,255,255,0.12)',
                  background: isCurrentUser
                    ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.18) 0%, rgba(10, 14, 26, 0.75) 100%)'
                    : isGymMaster
                    ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 14, 26, 0.6) 100%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '14px',
                  boxShadow: isCurrentUser
                    ? '0 0 15px rgba(0, 240, 255, 0.25)'
                    : isGymMaster
                    ? '0 0 12px rgba(255, 215, 0, 0.15)'
                    : 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <div className="flex-gap align-center" style={{ gap: '1.25rem' }}>
                  {/* Rank Badge */}
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      minWidth: '40px',
                      color: userRank.rank === 1 ? '#FFD700' : userRank.rank === 2 ? '#C0C0C0' : userRank.rank === 3 ? '#CD7F32' : '#00F0FF'
                    }}
                  >
                    #{userRank.rank}
                  </span>

                  {/* Avatar */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: isCurrentUser
                        ? '2.5px solid #00F0FF'
                        : isGymMaster
                        ? '2.5px solid #FFD700'
                        : '1.5px solid rgba(255,255,255,0.3)',
                      boxShadow: isCurrentUser
                        ? '0 0 10px rgba(0,240,255,0.5)'
                        : isGymMaster
                        ? '0 0 10px rgba(255,215,0,0.5)'
                        : 'none'
                    }}
                  >
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* User Name & Role Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      {/* BOLD & CLEAR DISPLAY NAME */}
                      <h4
                        style={{
                          margin: 0,
                          fontSize: '1.15rem',
                          fontWeight: 900,
                          color: isCurrentUser ? '#00F0FF' : isGymMaster ? '#FFD700' : '#FFFFFF',
                          letterSpacing: '0.02em',
                          textShadow: isCurrentUser ? '0 0 10px rgba(0, 240, 255, 0.4)' : 'none'
                        }}
                      >
                        {displayName}
                      </h4>

                      {/* CLEAR ROLE TAG */}
                      {isGymMaster ? (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            background: '#FFD700',
                            color: '#000000',
                            fontWeight: 900,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '5px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            boxShadow: '0 0 8px rgba(255, 215, 0, 0.4)'
                          }}
                        >
                          👑 GYM MASTER
                        </span>
                      ) : isCurrentUser ? (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            background: '#00F0FF',
                            color: '#000000',
                            fontWeight: 900,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '5px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            boxShadow: '0 0 8px rgba(0, 240, 255, 0.4)'
                          }}
                        >
                          🏋️ YOU
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: 800,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '5px',
                            textTransform: 'uppercase'
                          }}
                        >
                          🏋️ MEMBER
                        </span>
                      )}
                    </div>

                    <span
                      className="badge badge-secondary text-xs"
                      style={{
                        marginTop: '0.25rem',
                        display: 'inline-block',
                        fontWeight: 700,
                        opacity: 0.85
                      }}
                    >
                      {userRank.badge}
                    </span>
                  </div>
                </div>

                {/* Score Stats */}
                <div className="text-right">
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      color: tab === 'steps' ? '#00F0FF' : '#FFD700'
                    }}
                  >
                    {tab === 'steps' ? `${userRank.steps.toLocaleString()} steps` : `${userRank.points.toLocaleString()} pts`}
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
