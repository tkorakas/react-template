import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '~/common/auth';
import { oauthCallback } from '~/data-access/api';

export function useOAuthHandler() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false);

  const callbackMutation = useMutation({
    mutationFn: ({ provider, code }: { provider: string; code: string }) =>
      oauthCallback(provider, code),
    onSuccess: user => {
      setUser(user);
    },
    onError: () => {
      navigate('/login', { replace: true });
    },
  });

  useEffect(() => {
    const code = searchParams.get('code');
    const provider = searchParams.get('provider') || 'github';
    if (!code || !provider) {
      navigate('/login', { replace: true });
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;
    callbackMutation.mutate({ provider, code });
  }, [searchParams, callbackMutation, navigate]);

  return {
    isLoading: callbackMutation.isPending,
  };
}
