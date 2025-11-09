import { Button } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useOAuthButton } from './use-oauth-button';

interface OAuthButtonProps {
  provider: string;
  children: ReactNode;
  colorScheme?: string;
  variant?: 'outline' | 'plain' | 'solid' | 'subtle' | 'surface' | 'ghost';
}

export function OAuthButton({
  provider,
  children,
  colorScheme = 'gray',
  variant = 'outline',
}: OAuthButtonProps) {
  const { handleProviderLogin, isLoading } = useOAuthButton();

  return (
    <Button
      onClick={() => handleProviderLogin(provider)}
      loading={isLoading}
      colorScheme={colorScheme}
      variant={variant}
      width="100%"
    >
      {children}
    </Button>
  );
}
