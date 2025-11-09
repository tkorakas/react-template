import { createBrowserRouter } from 'react-router-dom';

import { PrivateRoute, PublicRoute } from '~/common/auth';
import AboutPage from '~/features/about-page';
import HomePage from '~/features/home-page';
import LoginPage from '~/features/login';
import MfaPage from '~/features/mfa';
import RegisterPage from '~/features/register';

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
]);
