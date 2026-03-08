import { Box } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';
import { Loading } from '~/common/ui';
import { useAuth } from './use-auth';

export function AuthManager({ children }: PropsWithChildren) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Loading />
      </Box>
    );
  }

  return <>{children}</>;
}
