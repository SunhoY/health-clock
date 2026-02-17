import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeView } from './HomeView';

const AUTH_STORAGE_KEY = 'health-clock.google-auth';

interface StoredAuthSession {
  accessToken?: string;
  tokenType?: string;
}

const readAuthSession = (): StoredAuthSession | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuthSession;
  } catch {
    return null;
  }
};

const clearAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const Home = () => {
  const navigate = useNavigate();
  const [isCheckingSession, setIsCheckingSession] = useState(() => {
    return Boolean(readAuthSession()?.accessToken);
  });

  useEffect(() => {
    const session = readAuthSession();
    const accessToken = session?.accessToken;
    if (!accessToken) {
      setIsCheckingSession(false);
      return;
    }

    const tokenType = session?.tokenType ?? 'Bearer';
    let mounted = true;

    const verifySession = async () => {
      try {
        const response = await fetch('/api/routines', {
          headers: {
            Authorization: `${tokenType} ${accessToken}`
          }
        });

        if (response.ok) {
          navigate('/preset-selection', { replace: true });
          return;
        }

        if (response.status === 401 || response.status === 403) {
          clearAuthSession();
        }
      } catch {
        // keep current session for transient network errors
      } finally {
        if (mounted) {
          setIsCheckingSession(false);
        }
      }
    };

    void verifySession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleStartWorkout = () => {
    navigate('/preset-selection');
  };

  const handleStartGoogleLogin = () => {
    window.location.assign('/api/auth/google/start');
  };

  if (isCheckingSession) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-center text-sm text-slate-300">
        로그인 상태를 확인하고 있습니다.
      </main>
    );
  }

  return (
    <HomeView
      onStartWorkout={handleStartWorkout}
      onStartGoogleLogin={handleStartGoogleLogin}
    />
  );
};
