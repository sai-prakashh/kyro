import { useAuth } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={styles.page}>
      {/* Top navbar */}
      <div style={styles.nav}>
        <span style={styles.logo}>Kyro</span>
        <div style={styles.navRight}>
          <img src={user?.picture} alt="" width={32}
            style={{ borderRadius: '50%' }} />
          <span style={styles.userName}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>Log out</button>
        </div>
      </div>

      {/* Chat area */}
      <div style={styles.main}>
        <ChatBox />
      </div>
    </div>
  );
}

const styles = {
  page:      { display: 'flex', flexDirection: 'column',
               height: '100vh', background: '#fff' },
  nav:       { display: 'flex', justifyContent: 'space-between',
               alignItems: 'center', padding: '14px 24px',
               borderBottom: '1px solid #e5e7eb' },
  logo:      { fontSize: 20, fontWeight: 700, color: '#1a1a1a' },
  navRight:  { display: 'flex', alignItems: 'center', gap: 12 },
  userName:  { fontSize: 14, color: '#374151' },
  logoutBtn: { padding: '6px 14px', borderRadius: 8,
               border: '1px solid #e5e7eb', cursor: 'pointer',
               fontSize: 13, background: '#fff' },
  main:      { flex: 1, overflow: 'hidden', padding: '20px 24px',
               maxWidth: 800, width: '100%',
               margin: '0 auto', display: 'flex', flexDirection: 'column' },
};