import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Kyro</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={user?.picture} alt="" width={36} style={{ borderRadius: '50%' }} />
          <span>{user?.name}</span>
          <button onClick={logout}
            style={{ padding: '8px 16px', borderRadius: 8,
              border: '1px solid #ddd', cursor: 'pointer' }}>
            Log out
          </button>
        </div>
      </div>
      <p style={{ color: '#666', marginTop: 8 }}>
        Phase 1 complete — you're logged in as {user?.email}
      </p>
    </div>
  );
}