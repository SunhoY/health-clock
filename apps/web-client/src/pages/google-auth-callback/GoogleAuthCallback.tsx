import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleAuthCallbackView } from './GoogleAuthCallbackView';
import { setSessionMode, storeAuthSession } from '../../shared/sessionMode';

type CallbackStatus = 'loading' | 'error';

interface GoogleExchangeResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  user: {
    id: string;
    email: string;
  };
}

export const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasRequestedRef = useRef(false);
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [message, setMessage] = useState('로그인 처리 중입니다.');

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }
    hasRequestedRef.current = true;

    const oauthError = searchParams.get('error');
    if (oauthError) {
      setStatus('error');
      setMessage('Google 로그인 요청이 취소되었거나 거부되었습니다.');
      return;
    }

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (!code || !state) {
      setStatus('error');
      setMessage('로그인 정보가 올바르지 않습니다.');
      return;
    }

    const exchangeAuthCode = async () => {
      try {
        const response = await fetch('/api/auth/google/exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        });

        const payload = (await response.json()) as
          | GoogleExchangeResponse
          | { message?: string };
        if (!response.ok) {
          const reason =
            typeof payload === 'object' && payload && 'message' in payload
              ? String(payload.message ?? '')
              : '';
          throw new Error(reason);
        }

        storeAuthSession({
          ...payload,
          provider: 'google',
          receivedAt: Date.now(),
        });
        setSessionMode('authenticated');

        navigate('/preset-selection', { replace: true });
      } catch {
        setStatus('error');
        setMessage('로그인 처리에 실패했습니다. 다시 시도해 주세요.');
      }
    };

    void exchangeAuthCode();
  }, [navigate, searchParams]);

  return (
    <GoogleAuthCallbackView
      title={status === 'loading' ? '로그인 연결 중' : '로그인 실패'}
      description={message}
      showHomeButton={status === 'error'}
      onGoHome={() => navigate('/')}
    />
  );
};
