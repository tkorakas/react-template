import { createBrowserRouter } from 'react-router-dom';

import { PrivateRoute, PublicRoute } from '~/common/auth';
import AboutPage from '~/features/about-page';
import HomePage from '~/features/home-page';
import LoginPage from '~/features/login';
import MfaPage from '~/features/mfa';
import OAuthCallbackPage from '~/features/oauth/callback';
import RegisterPage from '~/features/register';
import { AuthLayout } from '~/ui/auth-layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <HomePage />
      </PrivateRoute>
    ),
  },
  {
    path: '/about',
    element: (
      <PrivateRoute>
        <AboutPage />
      </PrivateRoute>
    ),
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: '/mfa',
        element: <MfaPage />,
      },
    ],
  },

  {
    path: '/oauth/:provider/callback',
    element: (
      <PublicRoute>
        <OAuthCallbackPage />
      </PublicRoute>
    ),
  },
]);
