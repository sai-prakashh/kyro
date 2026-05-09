import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Kyro</h1>
        <p style={styles.subtitle}>Your AI personal assistant</p>
        <button onClick={login} style={styles.button}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
               alt="" width="20" style={{ marginRight: 10 }} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#f5f5f5' },
  card: { background: '#fff', padding: '48px 40px', borderRadius: 16,
    boxShadow: '0 2px 24px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: 360 },
  title: { fontSize: 36, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a' },
  subtitle: { color: '#666', marginBottom: 32 },
  button: { display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#fff', border: '1px solid #ddd', borderRadius: 8,
    padding: '12px 24px', fontSize: 15, cursor: 'pointer',
    width: '100%', fontWeight: 500, color: '#1a1a1a' }
};