import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';
import ModelSwitcher from '../components/ModelSwitcher';
import KyroLogo from '../components/KyroLogo';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <div style={styles.page}>

      {/* Top navbar */}
      <div style={styles.nav}>
        <div style={styles.navLeft}>
          <div style={styles.logoPill}>
            <KyroLogo size={26} />
            <span style={styles.logo}>KYRO</span>
          </div>
          <span style={styles.logoBadge}>AI · PERSONAL · OS</span>
        </div>

        <div style={styles.navCenter}>
          <ModelSwitcher selectedModel={selectedModel} onSelect={setSelectedModel} />
        </div>

        <div style={styles.navRight}>
          <img src={user?.picture} alt={user?.name} width={30}
            style={styles.avatar} />
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.name?.toUpperCase()}</span>
            <span style={styles.userRole}>OPERATOR</span>
          </div>
          <button onClick={logout} style={styles.logoutBtn}>LOGOUT</button>
        </div>
      </div>

      {/* Chat area */}
      <div style={styles.main}>
        <ChatBox selectedModel={selectedModel} />
      </div>

    </div>
  );
}

const styles = {
  page: {
    display: 'flex', flexDirection: 'column',
    height: '100vh', background: '#05050a',
    fontFamily: "'Share Tech Mono', 'Courier New', monospace"
  },
  nav: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '12px 24px',
    borderBottom: '1px solid rgba(0,212,255,0.1)',
    background: 'rgba(0,5,10,0.98)',
    backdropFilter: 'blur(20px)',
    position: 'relative', zIndex: 10
  },
  navLeft: {
    display: 'flex', alignItems: 'center', gap: 12
  },
  logoPill: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: 100, padding: '5px 14px 5px 8px',
  },
  logo: {
    fontSize: 15, fontWeight: 900, letterSpacing: 4,
    color: '#fff',
    fontFamily: "'Orbitron', 'Share Tech Mono', monospace"
  },
  logoBadge: {
    fontSize: 9, color: 'rgba(0,212,255,0.3)',
    letterSpacing: 2, borderLeft: '1px solid rgba(0,212,255,0.12)',
    paddingLeft: 12
  },
  navCenter: {
    display: 'flex', alignItems: 'center'
  },
  navRight: {
    display: 'flex', alignItems: 'center', gap: 10
  },
  avatar: {
    borderRadius: '50%',
    border: '1px solid rgba(99,102,241,0.4)',
    boxShadow: '0 0 10px rgba(99,102,241,0.2)'
  },
  userInfo: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end'
  },
  userName: {
    fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1
  },
  userRole: {
    fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5
  },
  logoutBtn: {
    padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
    fontSize: 10, letterSpacing: 1.5, fontWeight: 600,
    background: 'transparent',
    border: '1px solid rgba(0,212,255,0.15)',
    color: 'rgba(0,212,255,0.4)',
    fontFamily: "'Share Tech Mono', monospace",
    transition: 'all 0.2s'
  },
  main: {
    flex: 1, overflow: 'hidden',
    display: 'flex', flexDirection: 'column'
  }
};