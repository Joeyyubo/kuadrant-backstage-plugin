import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const externalPortalPlugin = createPlugin({
  id: 'external-portal',
  routes: {
    root: rootRouteRef,
  },
});

export const ExternalPortalPage = externalPortalPlugin.provide(
  createRoutableExtension({
    name: 'ExternalPortalPage',
    component: () =>
      import('./components/ExternalPortalPage').then(m => m.ExternalPortalPage),
    mountPoint: rootRouteRef,
  }),
);

