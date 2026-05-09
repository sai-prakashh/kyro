import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const { saveToken } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    console.log('=== AUTH CALLBACK PAGE HIT ===');
    console.log('Token found:', token ? 'YES' : 'NO');

    if (token) {
      saveToken(token);
      window.history.replaceState({}, document.title, '/auth/callback');
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p>Signing you in to Kyro...</p>
    </div>
  );
}