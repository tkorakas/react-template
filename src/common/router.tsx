import { Suspense, lazy, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { PrivateRoute, PublicRoute } from '~/common/auth';
import { Loading } from '~/ui';

const AboutPage = lazy(() => import('~/features/about-page'));
const HomePage = lazy(() => import('~/features/home-page'));
const LoginPage = lazy(() => import('~/features/login'));
const MfaPage = lazy(() => import('~/features/mfa'));
const OAuthCallbackPage = lazy(() => import('~/features/oauth/callback'));
const RegisterPage = lazy(() => import('~/features/register'));
const AuthLayout = lazy(() =>
  import('~/ui/auth-layout').then(module => ({ default: module.AuthLayout }))
);

const withSuspense = (Component: ComponentType, key: string) => (
  <Suspense key={key} fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: withSuspense(HomePage, 'home-page'),
      },
      {
        path: '/about',
        element: withSuspense(AboutPage, 'about-page'),
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: '/login',
            element: withSuspense(LoginPage, 'login-page'),
          },
          {
            path: '/register',
            element: withSuspense(RegisterPage, 'register-page'),
          },
          {
            path: '/mfa',
            element: withSuspense(MfaPage, 'mfa-page'),
          },
        ],
      },
      {
        path: '/oauth/:provider/callback',
        element: withSuspense(OAuthCallbackPage, 'oauth-callback-page'),
      },
    ],
  },
]);
