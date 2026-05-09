import { useState } from 'react';
import { askKyro } from '../services/api';

const AGENT_COLORS = {
  research: { bg: '#EEF2FF', color: '#4338CA', label: 'Research' },
  calendar: { bg: '#F0FDF4', color: '#166534', label: 'Calendar' },
  email:    { bg: '#FFF7ED', color: '#9A3412', label: 'Email' },
};

export default function ChatBox() {
  const [message, setMessage]   = useState('');
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(false);

  const send = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message.trim();
    setMessage('');
    setHistory(h => [...h, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const data = await askKyro(userMsg);
      setHistory(h => [...h, { role: 'kyro', data }]);
    } catch (err) {
      setHistory(h => [...h, {
        role: 'kyro',
        data: { error: 'Something went wrong. Please try again.' }
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Message history */}
      <div style={styles.history}>
        {history.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyTitle}>What can I help you with?</p>
            <div style={styles.suggestions}>
              {[
                'Research Razorpay',
                'Book a meeting tomorrow at 3pm',
                'Check my emails',
                'Research OpenAI and book a call on Friday'
              ].map(s => (
                <button key={s} style={styles.suggestion}
                  onClick={() => setMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} style={{
            ...styles.bubble,
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {msg.role === 'user' ? (
              <div style={styles.userBubble}>{msg.text}</div>
            ) : (
              <KyroResponse data={msg.data} />
            )}
          </div>
        ))}

        {loading && (
          <div style={styles.bubble}>
            <div style={styles.kyroBubble}>
              <span style={styles.thinking}>Kyro is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={styles.inputRow}>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask Kyro anything..."
          style={styles.input}
          rows={1}
        />
        <button onClick={send} disabled={loading || !message.trim()}
          style={{
            ...styles.sendBtn,
            opacity: loading || !message.trim() ? 0.5 : 1
          }}>
          Send
        </button>
      </div>
    </div>
  );
}

function KyroResponse({ data }) {
  if (data.error) {
    return <div style={styles.kyroBubble}><p style={{ color: '#dc2626' }}>{data.error}</p></div>;
  }

  const { intent, results } = data;

  return (
    <div style={styles.kyroBubble}>
      {/* Detected agents */}
      <div style={styles.agentRow}>
        {intent?.agents?.map(agent => {
          const c = AGENT_COLORS[agent] || { bg: '#f3f4f6', color: '#374151', label: agent };
          return (
            <span key={agent} style={{ ...styles.agentBadge, background: c.bg, color: c.color }}>
              {c.label} agent
            </span>
          );
        })}
      </div>

      {/* Results per agent */}
      {results && Object.entries(results).map(([agent, result]) => (
        <div key={agent} style={styles.resultBlock}>
          <p style={styles.resultTitle}>
            {AGENT_COLORS[agent]?.label || agent}
          </p>
          <p style={styles.resultText}>{result.message}</p>
          {result.query && <p style={styles.resultMeta}>Query: <b>{result.query}</b></p>}
          {result.action && <p style={styles.resultMeta}>Action: <b>{result.action}</b></p>}
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper:      { display: 'flex', flexDirection: 'column', height: '100%', gap: 16 },
  history:      { flex: 1, overflowY: 'auto', display: 'flex',
                  flexDirection: 'column', gap: 12, padding: '8px 0' },
  empty:        { display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  flex: 1, gap: 20, padding: 40 },
  emptyTitle:   { fontSize: 18, color: '#6b7280', margin: 0 },
  suggestions:  { display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  suggestion:   { background: '#f9fafb', border: '1px solid #e5e7eb',
                  borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
                  fontSize: 13, color: '#374151' },
  bubble:       { display: 'flex', maxWidth: '85%' },
  userBubble:   { background: '#1a1a1a', color: '#fff', borderRadius: 12,
                  padding: '10px 16px', fontSize: 14, lineHeight: 1.5 },
  kyroBubble:   { background: '#f9fafb', border: '1px solid #e5e7eb',
                  borderRadius: 12, padding: '14px 16px',
                  fontSize: 14, lineHeight: 1.6, width: '100%' },
  thinking:     { color: '#9ca3af', fontStyle: 'italic' },
  agentRow:     { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
  agentBadge:   { fontSize: 12, fontWeight: 500, padding: '3px 10px',
                  borderRadius: 20, display: 'inline-block' },
  resultBlock:  { borderLeft: '3px solid #e5e7eb', paddingLeft: 12, marginBottom: 10 },
  resultTitle:  { fontWeight: 600, margin: '0 0 4px', fontSize: 13 },
  resultText:   { color: '#6b7280', margin: '0 0 4px', fontSize: 13 },
  resultMeta:   { color: '#374151', margin: 0, fontSize: 13 },
  inputRow:     { display: 'flex', gap: 10, alignItems: 'flex-end' },
  input:        { flex: 1, border: '1px solid #e5e7eb', borderRadius: 10,
                  padding: '12px 16px', fontSize: 14, resize: 'none',
                  fontFamily: 'inherit', outline: 'none', lineHeight: 1.5 },
  sendBtn:      { background: '#1a1a1a', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '12px 20px', fontSize: 14,
                  cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' },
};