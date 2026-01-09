import GlobalStyles from '@mui/material/GlobalStyles';

import { apis } from './apis';
import ScalprumRoot from './components/DynamicRoot/ScalprumRoot';
import { DefaultMainMenuItems } from './consts';
import { externalPortalPlugin } from '@kuadrant/external-portal-backstage-plugin-frontend';
import { StaticPlugins } from './components/DynamicRoot/DynamicRoot';

// The base UI configuration, these values can be overridden by values
// specified in external configuration files
const baseFrontendConfig = {
  context: 'frontend',
  data: {
    dynamicPlugins: {
      frontend: {
        'default.main-menu-items': DefaultMainMenuItems,
      },
    },
  },
};

// Static plugins that should not be loaded as dynamic plugins
const staticPlugins: StaticPlugins = {
  'external-portal': {
    plugin: externalPortalPlugin,
    module: () => import('@kuadrant/external-portal-backstage-plugin-frontend'),
  },
};

const AppRoot = () => (
  <>
    <GlobalStyles styles={{ html: { overflowY: 'hidden' } }} />
    <ScalprumRoot
      apis={apis}
      afterInit={() => import('./components/AppBase')}
      baseFrontendConfig={baseFrontendConfig}
      plugins={staticPlugins}
    />
  </>
);

export default AppRoot;
