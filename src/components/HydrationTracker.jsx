import React, { useState } from 'react';

export default function HydrationTracker({ hydrationLogs = [], onAddHydration }) {
  const currentLog = hydrationLogs[hydrationLogs.length - 1] || { amount_ml: 2250, target_ml: 3000 };
  const [customMl, setCustomMl] = useState('250');

  const pct = Math.min(100, Math.round((currentLog.amount_ml / currentLog.target_ml) * 100));

  const handleAdd = (ml) => {
    const newAmount = currentLog.amount_ml + Number(ml);
    onAddHydration({
      date: new Date().toISOString().slice(0, 10),
      amount_ml: newAmount,
      target_ml: currentLog.target_ml
    });
  }; 
 
  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Water & Hydration Tracker</h1>
          <p className="page-subtitle">Monitor fluid intake, set daily hydration targets, and log water consumption.</p>
        </div>
      </header>

      <div className="grid grid-2 gap-4 mb-4">
        <div className="card text-center flex-center flex-col p-4">
          <h3 className="section-title mb-3">Daily Hydration Progress</h3>
          <div className="hydration-ring-wrapper my-3">
            <div className="score-ring-lg text-cyan">{pct}%</div>
          </div>
          <div className="text-xl font-bold mt-2">
            {currentLog.amount_ml} <span className="stat-lbl">/ {currentLog.target_ml} ml</span>
          </div>
          <p className="stat-lbl mt-1">{currentLog.target_ml - currentLog.amount_ml > 0 ? `${currentLog.target_ml - currentLog.amount_ml} ml remaining to hit goal` : '🎉 Goal Achieved!'}</p>
        </div>

        <div className="card">
          <h3 className="section-title mb-3">Quick Fluid Intake Buttons</h3>
          <div className="grid grid-3 gap-3 mb-4">
            <button className="btn btn-secondary p-3 flex-col flex-center" onClick={() => handleAdd(250)}>
              <span className="text-2xl">🥛</span>
              <span className="font-bold mt-1">+250 ml</span>
              <span className="stat-lbl">Glass of Water</span>
            </button>
            <button className="btn btn-secondary p-3 flex-col flex-center" onClick={() => handleAdd(500)}>
              <span className="text-2xl">🧴</span>
              <span className="font-bold mt-1">+500 ml</span>
              <span className="stat-lbl">Water Bottle</span>
            </button>
            <button className="btn btn-secondary p-3 flex-col flex-center" onClick={() => handleAdd(750)}>
              <span className="text-2xl">🍾</span>
              <span className="font-bold mt-1">+750 ml</span>
              <span className="stat-lbl">Sports Flask</span>
            </button>
          </div>

          <hr className="divider my-3" />

          <h4 className="input-label mb-2">Custom Intake Logger</h4>
          <div className="flex-gap">
            <input
              type="number"
              className="input-field"
              value={customMl}
              onChange={(e) => setCustomMl(e.target.value)}
              placeholder="Amount in ml"
            />
            <button className="btn btn-primary" onClick={() => handleAdd(customMl)}>
              Log Intake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
    