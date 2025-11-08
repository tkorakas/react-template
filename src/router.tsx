import { createBrowserRouter } from 'react-router-dom';

import AboutPage from '~/features/AboutPage';
import HomePage from '~/features/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
]);
