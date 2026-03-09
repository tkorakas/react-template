import { Suspense, lazy, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { PrivateRoute, PublicRoute } from '~/common/auth';
import { AppLayout, AuthLayout, Loading } from '~/common/ui';

const HomePage = lazy(() => import('~/features/home-page'));
const TeamMembersPage = lazy(
  () => import('~/features/team-members/team-members.page')
);
const CreateTeamMemberPage = lazy(
  () => import('~/features/team-members/create/create-team-member.page')
);
{{AUTH_IMPORTS}}
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
        element: <AppLayout />,
        children: [
{{PROTECTED_ROUTES}}
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
{{PUBLIC_CHILDREN}}
    ],
  },
]);
