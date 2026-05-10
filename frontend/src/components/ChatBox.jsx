import { useState } from 'react';
import { askKyro } from '../services/api';
import KyroLogo from './KyroLogo';

const AGENT_COLORS = {
  research: { bg: 'rgba(112,0,255,0.12)', color: '#bf7fff', label: 'RESEARCH' },
  calendar: { bg: 'rgba(0,255,136,0.08)', color: '#00ff88', label: 'CALENDAR' },
  email:    { bg: 'rgba(255,107,0,0.08)',  color: '#ff9d4d', label: 'EMAIL'    },
};

const SUGGESTIONS = [
  'Research Razorpay',
  'Book a meeting tomorrow at 3pm',
  'Check my emails',
  'Research OpenAI and book a call on Friday',
];

export default function ChatBox({ selectedModel }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message.trim();
    setMessage('');
    setHistory(h => [...h, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const data = await askKyro(userMsg, selectedModel);
      setHistory(h => [...h, { role: 'kyro', data }]);
    } catch (err) {
      setHistory(h => [...h, {
        role: 'kyro',
        data: { error: 'All systems busy. Please try again.' }
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.history}>

        {history.length === 0 && (
          <div style={styles.empty}>
            <div style={styles.emptyRing}>
              <KyroLogo size={48} />
            </div>
            <p style={styles.emptyTitle}>AWAITING OPERATOR INPUT</p>
            <p style={styles.emptySub}>One command. KYRO handles the rest.</p>
            <div style={styles.suggestions}>
              {SUGGESTIONS.map(s => (
                <button key={s} style={styles.suggestion} onClick={() => setMessage(s)}>
                  ↗ {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} style={{
            ...styles.bubbleWrap,
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {msg.role === 'user'
              ? <div style={styles.userBubble}>{msg.text}</div>
              : <KyroResponse data={msg.data} />
            }
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.bubbleWrap, justifyContent: 'flex-start' }}>
            <div style={styles.kyroBubble}>
              <div style={styles.thinkingRow}>
                <div style={{ ...styles.tDot, animationDelay: '0s',   background: '#8b5cf6' }} />
                <div style={{ ...styles.tDot, animationDelay: '0.15s', background: '#06b6d4' }} />
                <div style={{ ...styles.tDot, animationDelay: '0.3s',  background: '#a78bfa' }} />
                <span style={styles.thinkingLabel}>KYRO PROCESSING ···</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={styles.inputZone}>
        <div style={styles.inputWrap}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKey}
            placeholder="ENTER COMMAND ···"
            style={styles.input}
            rows={1}
          />
          <button onClick={send} disabled={loading || !message.trim()}
            style={{ ...styles.sendBtn, opacity: loading || !message.trim() ? 0.4 : 1 }}>
            ↑
          </button>
        </div>
        <div style={styles.inputHint}>
          <span style={styles.hintTxt}>KYRO · AI PERSONAL OS · BETA</span>
          <span style={styles.hintTxt}>ENTER TO EXECUTE · SHIFT+ENTER FOR NEW LINE</span>
        </div>
      </div>

      <style>{`
        @keyframes tdot {
          0%,60%,100% { transform:translateY(0);opacity:0.3; }
          30% { transform:translateY(-5px);opacity:1; }
        }
        @keyframes shimmer {
          0%,100% { opacity:0.4; } 50% { opacity:1; }
        }
      `}</style>
    </div>
  );
}

function KyroResponse({ data }) {
  if (data.error) {
    return (
      <div style={styles.kyroBubble}>
        <p style={{ color: '#ff4d4d', fontFamily: "'Share Tech Mono',monospace", fontSize: 12, margin: 0 }}>
          ⚠ {data.error}
        </p>
      </div>
    );
  }

  const { intent, results, usedModel } = data;

  return (
    <div style={styles.kyroBubble}>
      {usedModel && (
        <div style={styles.modelTag}>
          <span style={{ color: usedModel.color }}>{usedModel.icon}</span>
          <span>{usedModel.provider} · {usedModel.name}</span>
        </div>
      )}
      <div style={styles.agentRow}>
        {intent?.agents?.map(agent => {
          const c = AGENT_COLORS[agent] || { bg: 'rgba(255,255,255,0.05)', color: '#9ca3af', label: agent };
          return (
            <span key={agent} style={{ ...styles.agentBadge, background: c.bg, color: c.color }}>
              <span style={styles.agentDot} />
              {c.label}
            </span>
          );
        })}
      </div>
      {intent?.agents?.length > 1 && (
        <div style={styles.parallelNote}>
          FIRING <span style={{ color: '#00ff88' }}>{intent.agents.length} AGENTS</span> IN PARALLEL ···
        </div>
      )}
      <div style={styles.resultGrid}>
        {results && Object.entries(results).map(([agent, result]) => {
          const c = AGENT_COLORS[agent] || { color: '#9ca3af', label: agent };
          return (
            <div key={agent} style={styles.resultCard}>
              <div style={{ ...styles.resultLabel, color: c.color }}>
                {c.label} // {result.action || result.query || 'EXECUTE'}
              </div>
              <div style={styles.resultVal}>{result.message}</div>
              {result.query  && <div style={styles.resultMeta}>TARGET: <b>{result.query}</b></div>}
              {result.action && <div style={styles.resultMeta}>ACTION: <b>{result.action.toUpperCase()}</b></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', height: '100%',
    background: '#05050a', fontFamily: "'Share Tech Mono','Courier New',monospace"
  },
  history: {
    flex: 1, overflowY: 'auto', display: 'flex',
    flexDirection: 'column', gap: 14, padding: '24px 28px',
    scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.15) transparent'
  },
  empty: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    flex: 1, gap: 14, padding: 40
  },
  emptyRing: {
    width: 88, height: 88, borderRadius: '50%',
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 30px rgba(99,102,241,0.12)', marginBottom: 4
  },
  emptyTitle: {
    fontSize: 13, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 3, margin: 0
  },
  emptySub: {
    fontSize: 11, color: 'rgba(255,255,255,0.18)',
    letterSpacing: 1, margin: 0
  },
  suggestions: {
    display: 'flex', flexWrap: 'wrap',
    gap: 8, justifyContent: 'center', marginTop: 8
  },
  suggestion: {
    background: 'rgba(99,102,241,0.06)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: 4, padding: '7px 14px', cursor: 'pointer',
    fontSize: 11, color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.5, transition: 'all 0.2s',
    fontFamily: "'Share Tech Mono',monospace"
  },
  bubbleWrap: { display: 'flex', width: '100%' },
  userBubble: {
    background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15))',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: '2px 14px 14px 2px',
    padding: '10px 16px', maxWidth: '65%',
    fontSize: 13, color: '#e8e8ff',
    lineHeight: 1.55, fontWeight: 500, letterSpacing: 0.3
  },
  kyroBubble: {
    background: 'rgba(5,5,18,0.95)',
    border: '1px solid rgba(99,102,241,0.12)',
    borderRadius: '14px 2px 14px 14px',
    padding: '14px 16px', maxWidth: '88%',
    backdropFilter: 'blur(16px)'
  },
  modelTag: {
    display: 'flex', alignItems: 'center', gap: 6,
    marginBottom: 10, fontSize: 9,
    color: 'rgba(255,255,255,0.25)', letterSpacing: 1
  },
  agentRow: { display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' },
  agentBadge: {
    display: 'flex', alignItems: 'center', gap: 5,
    fontSize: 9, fontWeight: 700, padding: '3px 9px',
    borderRadius: 2, letterSpacing: 1.5,
    border: '1px solid currentColor'
  },
  agentDot: {
    width: 5, height: 5, borderRadius: '50%',
    background: 'currentColor', display: 'inline-block',
    animation: 'shimmer 1.5s infinite'
  },
  parallelNote: {
    fontSize: 9, color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1, marginBottom: 10
  },
  resultGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
  resultCard: {
    background: 'rgba(99,102,241,0.04)',
    border: '1px solid rgba(99,102,241,0.1)',
    borderRadius: 6, padding: '10px 12px'
  },
  resultLabel: {
    fontSize: 9, letterSpacing: 2, marginBottom: 6, fontWeight: 700
  },
  resultVal: {
    fontSize: 12, color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5, marginBottom: 4
  },
  resultMeta: {
    fontSize: 10, color: 'rgba(255,255,255,0.25)',
    letterSpacing: 0.5, margin: 0
  },
  thinkingRow: { display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' },
  tDot: {
    width: 6, height: 6, borderRadius: '50%',
    animation: 'tdot 1.2s infinite'
  },
  thinkingLabel: {
    fontSize: 9, color: 'rgba(255,255,255,0.2)',
    letterSpacing: 2, marginLeft: 4
  },
  inputZone: {
    padding: '12px 28px 18px',
    borderTop: '1px solid rgba(99,102,241,0.08)'
  },
  inputWrap: {
    background: 'rgba(5,5,18,0.98)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 8, padding: '12px 14px',
    display: 'flex', alignItems: 'flex-end', gap: 10
  },
  input: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'rgba(255,255,255,0.8)', fontSize: 13, resize: 'none',
    lineHeight: 1.5, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 0.3
  },
  sendBtn: {
    width: 34, height: 34, borderRadius: 6,
    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s', flexShrink: 0
  },
  inputHint: {
    display: 'flex', justifyContent: 'space-between',
    marginTop: 8, padding: '0 2px'
  },
  hintTxt: {
    fontSize: 8, color: 'rgba(255,255,255,0.12)', letterSpacing: 1.5
  }
};