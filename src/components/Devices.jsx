import React, { useState } from 'react';

export default function Devices({ devices = [], onAdd, onDelete, onToggleSync }) {
  const [form, setForm] = useState({ model: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!form.model.trim()) return;
    onAdd({
      model: form.model,
      sync_status: 'Pending',
      battery: 100,
      last_sync: 'Just now'
    });
    setForm({ model: '' });
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <div className="page-eyebrow">Wearables & Hardware →</div>
          <h1 className="page-title">Devices</h1>
          <p className="page-subtitle">
            Manage smart wearables and equipment synced to your fitness account.
          </p>
        </div>
      </header>

      <div className="grid grid-3 section mb-6">
        {devices.map((d) => {
          const isSynced = d.sync_status === 'Synced';
          const defaultDevImg = 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=400&q=80';
          return (
            <div className="card device-card flex-col flex-between" key={d.device_id}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="badge badge-accent" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    device_id #{d.device_id}
                  </span>
                  <span className={`pill ${isSynced ? 'ok' : 'warn'}`}>
                    {isSynced ? '● Synced' : '▲ Pending'}
                  </span>
                </div>

                <div className="flex align-center gap-3 mb-3">
                  <img
                    src={d.image || defaultDevImg}
                    alt={d.model}
                    className="device-img-thumb"
                  />
                  <div>
                    <div className="stat-value" style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
                      {d.model}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 4, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        🔋 {d.battery !== undefined ? `${d.battery}%` : '85%'}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        🕒 {d.last_sync || 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  className={`btn btn-sm ${isSynced ? 'btn-secondary' : 'btn-warning'}`}
                  onClick={() => onToggleSync(d.device_id, d.sync_status)}
                  style={{ flex: 1 }}
                >
                  <span>{isSynced ? '🔄' : '⚡'}</span>
                  <span>{isSynced ? 'Toggle Sync' : 'Sync Now'}</span>
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(d.device_id)}
                >
                  <span>🗑️</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
        {devices.length === 0 && <div className="empty-state">No devices registered.</div>}
      </div>

      <div className="card">
        <div className="card-title mb-2">Register New Device</div>
        <form className="inline-form" style={{ borderTop: 'none', paddingTop: 0 }} onSubmit={submit}>
          <div className="field" style={{ flex: 1, minWidth: 240 }}>
            <label>Device Model</label>
            <input
              value={form.model}
              onChange={(e) => setForm({ model: e.target.value })}
              placeholder="e.g. PulseBand X3 Pro, SmartScale v2"
              required
            />
          </div>
          <button className="btn btn-primary" type="submit">
            <span>+</span> Register Device
          </button>
        </form>
      </div>
    </div>
  );
}
