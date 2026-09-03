import React, { useState } from 'react';

export default function CommunityLeaderboard({ rankings = [] }) {
  const [tab, setTab] = useState('steps');

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Community & Leaderboards</h1>
          <p className="page-subtitle">Compete with friends, climb global step ranks, and earn achievement badges.</p>
        </div>
      </header>

      <div className="grid grid-3 gap-3 mb-4">
        <div className="card text-center">
          <span className="stat-lbl">YOUR LEADERBOARD RANK</span>
          <div className="stat-num text-amber my-2">🏆 #2</div>
          <span className="badge badge-accent">Consistency Champion</span>
        </div>

        <div className="card text-center">
          <span className="stat-lbl">WEEKLY COMMUNITY POINTS</span>
          <div className="stat-num text-cyan my-2">2,410 pts</div>
          <span className="stat-lbl">+350 pts from yesterday</span>
        </div>

        <div className="card text-center">
          <span className="stat-lbl">ACTIVE CHALLENGE</span>
          <div className="stat-num text-emerald my-2">70K Steps</div>
          <span className="badge badge-success">85% Completed</span>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex-between align-center mb-3">
          <h3 className="section-title">Weekly Fitness Leaderboard</h3>
          <div className="flex-gap">
            <button className={`btn btn-sm ${tab === 'steps' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('steps')}>
              Step Leaders
            </button>
            <button className={`btn btn-sm ${tab === 'points' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('points')}>
              Points Ranks
            </button>
          </div>
        </div>

        <div className="rankings-list">
          {rankings.map((userRank) => {
            const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';
            return (
              <div
                key={userRank.rank}
                className={`rank-row p-3 mb-2 border-radius flex-between align-center ${userRank.name.includes('(You)') ? 'user-highlight' : ''}`}
              >
                <div className="flex-gap align-center">
                  <span className={`rank-num ${userRank.rank === 1 ? 'gold' : userRank.rank === 2 ? 'silver' : 'bronze'}`}>
                    #{userRank.rank}
                  </span>
                  <img
                    src={userRank.avatar || defaultAvatar}
                    alt={userRank.name}
                    className="avatar-sm"
                  />
                  <div>
                    <h4 className="font-bold text-md mb-0">{userRank.name}</h4>
                    <span className="badge badge-secondary text-xs">{userRank.badge}</span>
                  </div>
                </div>

                <div className="flex-gap align-center text-right">
                  <div>
                    <div className="font-bold text-lg text-cyan">
                      {tab === 'steps' ? `${userRank.steps.toLocaleString()} steps` : `${userRank.points} pts`}
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
