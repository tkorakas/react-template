import { useMutation } from '@tanstack/react-query';
import { getOAuthAuthUrl } from '~/data-access/auth/auth.api';

export function useOAuthButton() {
  const authUrlMutation = useMutation({
    mutationFn: (provider: string) => getOAuthAuthUrl(provider),
    onSuccess: data => {
      window.location.href = data.authUrl;
    },
  });

  return {
    handleProviderLogin: (provider: string) => authUrlMutation.mutate(provider),
    isLoading: authUrlMutation.isPending,
  };
}
