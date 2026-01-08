import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';

/**
 * Configure scaffolder plugin to allow unauthenticated access for development
 */
export const scaffolderAuthModule = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'auth-config',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
      },
      async init({ httpRouter, httpAuth }) {
        // Allow unauthenticated access to scaffolder endpoints for development
        // This allows guest users to access scaffolder tasks and templates
        // The root path policy should catch all routes, but we also add explicit paths
        httpRouter.addAuthPolicy({
          path: '/',
          allow: 'unauthenticated',
        });
        // Explicit paths for common endpoints to ensure they work
        httpRouter.addAuthPolicy({
          path: '/v2/tasks',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/v2/tasks/:taskId',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/v2/tasks/:taskId/events',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/v2/tasks/:taskId/cancel',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/v2/templates',
          allow: 'unauthenticated',
        });
        httpRouter.addAuthPolicy({
          path: '/v2/actions',
          allow: 'unauthenticated',
        });
      },
    });
  },
});


