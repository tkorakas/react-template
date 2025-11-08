import { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './use-auth';

export function PublicRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
