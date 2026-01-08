import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';

/**
 * Configure catalog plugin to allow unauthenticated access for development
 */
export const catalogAuthModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'auth-config',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
      },
      async init({ httpRouter, httpAuth }) {
        // Allow unauthenticated access to all catalog endpoints for development
        // This allows guest users to access entity-facets and other catalog endpoints
        // Used by EntityKindPicker in catalog and API explorer pages
        // Add policies for specific paths to ensure they work
        httpRouter.addAuthPolicy({
          path: '/',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/entities',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/entities/facets',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/entities/:kind',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/entities/by-name/:kind/:namespace/:name',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/entities/by-query',
          allow: 'unauthenticated',
        });
        // Allow unauthenticated access to health check
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/locations',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/locations/:id',
          allow: 'unauthenticated',
        });
      },
    });
  },
});

