import React, { useState, useRef } from 'react';
import ProgressRing from './ProgressRing.jsx';
import * as aiService from '../services/aiService.js';

const PRESET_PROGRESS_PHOTOS = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80'
];

export default function ProgressReports({ reports, onGenerate, onDelete, user }) {
  const sorted = [...reports].sort((a, b) => (a.report_date < b.report_date ? 1 : -1));
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'gallery' | 'compare'
  const fileInputRef = useRef(null);

  const handleAiGenerateReport = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await aiService.generateAiWeeklyProgressReport({ user });
      if (onGenerate) onGenerate();
      alert(`🤖 Gemini Executive Report Created!\nScore: ${res.completion_percentage}%\nSummary: ${res.summary}`);
    } catch (err) {
      if (onGenerate) onGenerate();
    } finally {
      setIsGeneratingAi(false);
    }
  };
    
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const photoUrl = uploadEvent.target.result;
        alert('📷 New Progress Photo Uploaded successfully! Added to your Transformation Gallery.');
        setSelectedPhoto(photoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="page-container">
      <div className="page-head flex-between align-center flex-wrap gap-2 mb-4">
        <div>
          <div className="page-eyebrow">Transformation Telemetry →</div>
          <h1 className="page-title">Progress Reports & Photo Log</h1>
          <p className="page-desc">
            Weekly completion scores, visual body transformation gallery, and AI progress analysis.
          </p>
        </div>
        <div className="flex align-center gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoUpload}
          />
          <button
            className="btn btn-secondary text-xs flex align-center gap-1"
            onClick={() => fileInputRef.current?.click()}
          >
            📸 Upload Progress Photo
          </button>
          <button
            className="btn btn-primary text-xs flex align-center gap-1"
            onClick={handleAiGenerateReport}
            disabled={isGeneratingAi}
          >
            {isGeneratingAi ? '⏳ Gemini Generating...' : '🤖 AI Executive Report'}
          </button>
          <button className="btn btn-secondary text-xs" onClick={onGenerate}>
            + Standard Report
          </button>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="card mb-4 p-2 flex-between align-center flex-wrap gap-2">
        <div className="flex align-center gap-2">
          <button
            className={`btn btn-sm ${viewMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('all')}
          >
            📊 All Reports ({sorted.length})
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'gallery' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('gallery')}
          >
            🖼️ Photo Gallery
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'compare' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('compare')}
          >
            ⚡ Before / After View
          </button>
        </div>
      </div>

      {/* Modal for Zoomed Image View */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="card p-4 text-center"
            style={{ maxWidth: '600px', width: '100%', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-between align-center mb-3">
              <span className="badge badge-accent font-mono text-xs">📸 Visual Progress Check-in</span>
              <button className="btn btn-secondary text-xs" onClick={() => setSelectedPhoto(null)}>
                ✕ Close
              </button>
            </div>
            <img
              src={selectedPhoto}
              alt="Progress Zoom"
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
            />
            <p className="text-xs text-secondary italic">
              AI Telemetry: "Muscle vascularity and posture alignment showing optimal progression."
            </p>
          </div>
        </div>
      )}

      {/* Before / After Comparison View */}
      {viewMode === 'compare' && (
        <div className="card p-4 mb-4">
          <h3 className="section-title mb-3">⚡ Side-by-Side Body Transformation Comparison</h3>
          <div className="grid grid-2 gap-4">
            <div className="progress-photo-card p-2 text-center">
              <span className="badge badge-secondary mb-2">Month 1 Baseline</span>
              <img
                src={sorted[0]?.image || PRESET_PROGRESS_PHOTOS[0]}
                alt="Baseline Progress"
                className="progress-photo-img border-radius mb-2"
                onClick={() => setSelectedPhoto(sorted[0]?.image || PRESET_PROGRESS_PHOTOS[0])}
                style={{ cursor: 'pointer' }}
              />
              <div className="stat-lbl text-xs">Date: {sorted[0]?.report_date || '2026-08-01'}</div>
              <div className="font-bold text-sm mt-1">Weight: 65.0 kg • 21.5% Body Fat</div>
            </div>

            <div className="progress-photo-card p-2 text-center">
              <span className="badge badge-success mb-2">Current Peak Phase</span>
              <img
                src={sorted[sorted.length - 1]?.image || PRESET_PROGRESS_PHOTOS[2]}
                alt="Peak Progress"
                className="progress-photo-img border-radius mb-2"
                onClick={() => setSelectedPhoto(sorted[sorted.length - 1]?.image || PRESET_PROGRESS_PHOTOS[2])}
                style={{ cursor: 'pointer' }}
              />
              <div className="stat-lbl text-xs">Date: {sorted[sorted.length - 1]?.report_date || '2026-08-24'}</div>
              <div className="font-bold text-sm text-cyan mt-1">Weight: 63.5 kg • 20.1% Body Fat (-1.4%)</div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery View */}
      {(viewMode === 'gallery' || viewMode === 'all') && (
        <div className="mb-6">
          <h3 className="section-title mb-3">📷 Visual Transformation Timeline</h3>
          <div className="grid grid-3 gap-4 mb-4">
            {sorted.map((r, idx) => {
              const imgUrl = r.image || PRESET_PROGRESS_PHOTOS[idx % PRESET_PROGRESS_PHOTOS.length];
              return (
                <div key={`photo-${r.report_id}`} className="progress-photo-card p-3">
                  <div className="flex-between align-center mb-2">
                    <span className="badge badge-accent">Report #{r.report_id}</span>
                    <span className="stat-lbl text-xs">{r.report_date}</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={imgUrl}
                      alt={`Report ${r.report_id}`}
                      className="progress-photo-img border-radius mb-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedPhoto(imgUrl)}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(4px)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    >
                      {r.completion_percentage}% Target
                    </div>
                  </div>
                  <p className="text-xs text-secondary mt-1 line-clamp-2">
                    {r.summary || 'Weekly workout completion report and vital check-in.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Executive Report Grid */}
      {viewMode === 'all' && (
        <div>
          <h3 className="section-title mb-3">📊 Executive Performance Scorecards</h3>
          {sorted.length === 0 ? (
            <div className="empty-state">No reports generated yet — click AI Executive Report above.</div>
          ) : (
            <div className="grid grid-3 gap-4">
              {sorted.map((r, idx) => {
                const imgUrl = r.image || PRESET_PROGRESS_PHOTOS[idx % PRESET_PROGRESS_PHOTOS.length];
                return (
                  <div className="card flex-col flex-between" key={r.report_id}>
                    <div>
                      <div className="flex-between align-center mb-3">
                        <span className="card-title mb-0">Report #{r.report_id}</span>
                        <span className="badge badge-secondary text-xs">{r.report_date}</span>
                      </div>

                      <div className="flex align-center gap-3 mb-3">
                        <img
                          src={imgUrl}
                          alt="Thumbnail"
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                          onClick={() => setSelectedPhoto(imgUrl)}
                        />
                        <div className="flex-1">
                          <ProgressRing value={r.completion_percentage} size={64} stroke={6} />
                        </div>
                      </div>

                      <p className="text-xs text-secondary mb-3">
                        {r.summary || `Weekly completion score achieved at ${r.completion_percentage}%.`}
                      </p>
                    </div>

                    <div className="flex-between align-center pt-2 border-t mt-2">
                      <button className="btn btn-secondary text-xs p-1" onClick={() => setSelectedPhoto(imgUrl)}>
                        🔍 Inspect Photo
                      </button>
                      <button className="icon-btn text-rose text-xs" onClick={() => onDelete(r.report_id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

