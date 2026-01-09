import React from 'react';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';

/**
 * Custom ScaffolderPage wrapper
 * 
 * Note: ScaffolderPage is a Routable extension component and cannot be wrapped.
 * We simply pass through to ScaffolderPage. Tag filtering via URL parameters
 * should be handled by ScaffolderPage internally if supported, or we may need
 * to implement a different approach.
 */
export const CustomScaffolderPage = (props: { headerOptions?: { title?: string } }) => {
  // ScaffolderPage must be rendered directly without wrapper
  // Tag filtering will need to be handled differently, possibly through
  // ScaffolderPage's internal filter mechanism or by modifying the navigation
  return <ScaffolderPage headerOptions={props.headerOptions} />;
};
