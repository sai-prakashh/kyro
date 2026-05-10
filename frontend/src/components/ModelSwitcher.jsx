import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export default function ModelSwitcher({ selectedModel, onSelect }) {
  const [models, setModels]   = useState([]);
  const [open, setOpen]       = useState(false);
  const ref                   = useRef();

  useEffect(() => {
    const token = localStorage.getItem('kyro_token');
    axios.get(`${BACKEND}/api/kyro/models`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setModels(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = models.find(m => m.id === selectedModel) || models[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={styles.trigger}>
        <span style={{ color: current?.color || '#00d4ff' }}>
          {current?.icon || '✦'}
        </span>
        <span style={styles.modelName}>
          {current ? `${current.provider} — ${current.name}` : 'AUTO'}
        </span>
        <span style={styles.chevron}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropHeader}>SELECT AI MODEL</div>

          {/* Auto option */}
          <div
            onClick={() => { onSelect(null); setOpen(false); }}
            style={{
              ...styles.option,
              ...(selectedModel === null ? styles.optionActive : {})
            }}>
            <span style={{ color: '#00d4ff', fontSize: 16 }}>⚡</span>
            <div style={styles.optionInfo}>
              <div style={styles.optionName}>AUTO FALLBACK</div>
              <div style={styles.optionSub}>KYRO picks the best available</div>
            </div>
            {selectedModel === null && <span style={styles.check}>✓</span>}
          </div>

          <div style={styles.divider} />

          {models.map(model => (
            <div
              key={model.id}
              onClick={() => { onSelect(model.id); setOpen(false); }}
              style={{
                ...styles.option,
                ...(selectedModel === model.id ? styles.optionActive : {})
              }}>
              <span style={{ color: model.color, fontSize: 16 }}>{model.icon}</span>
              <div style={styles.optionInfo}>
                <div style={styles.optionName}>{model.name}</div>
                <div style={styles.optionSub}>{model.provider} · FREE</div>
              </div>
              {selectedModel === model.id && (
                <span style={{ ...styles.check, color: model.color }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  trigger: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(0,212,255,0.05)',
    border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: 6, padding: '6px 12px', cursor: 'pointer',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: 'rgba(0,212,255,0.7)',
    letterSpacing: '0.5px', transition: 'all 0.2s'
  },
  modelName: { maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chevron:   { fontSize: 8, color: 'rgba(0,212,255,0.4)' },
  dropdown: {
    position: 'absolute', top: '110%', right: 0, width: 280,
    background: '#020e18',
    border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: 10, zIndex: 999, overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.05)'
  },
  dropHeader: {
    padding: '10px 14px', fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'rgba(0,212,255,0.3)', letterSpacing: 2,
    borderBottom: '1px solid rgba(0,212,255,0.08)'
  },
  option: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px', cursor: 'pointer', transition: 'all 0.15s',
    borderBottom: '1px solid rgba(0,212,255,0.04)'
  },
  optionActive: { background: 'rgba(0,212,255,0.06)' },
  optionInfo:   { flex: 1 },
  optionName: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: 'rgba(0,212,255,0.8)', letterSpacing: 0.5
  },
  optionSub: { fontSize: 10, color: 'rgba(0,212,255,0.3)', marginTop: 2 },
  check:     { fontSize: 12, color: '#00ff88' },
  divider:   { height: 1, background: 'rgba(0,212,255,0.08)', margin: '4px 0' }
};
