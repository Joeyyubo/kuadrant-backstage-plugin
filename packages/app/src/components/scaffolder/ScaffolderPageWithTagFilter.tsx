import React, { useEffect } from 'react';
import { ScaffolderPage } from '@backstage/plugin-scaffolder';
import { useSearchParams } from 'react-router-dom';
import { useEntityList, EntityTagFilter } from '@backstage/plugin-catalog-react';

/**
 * ScaffolderPage with automatic tag filter from URL parameters
 * 
 * This component reads tags from URL query parameters and automatically
 * sets the filter in the EntityListProvider context that ScaffolderPage uses internally.
 * 
 * IMPORTANT: This component must be used directly as a Route element, not wrapped.
 * ScaffolderPage is a Routable extension component and cannot be wrapped.
 * 
 * Usage:
 * <Route path="/create" element={<ScaffolderPageWithTagFilter headerOptions={{ title: 'Self-service' }} />} />
 */
export const ScaffolderPageWithTagFilter = (props: { headerOptions?: { title?: string } }) => {
  const [searchParams] = useSearchParams();
  const tagsParam = searchParams.get('tags');
  
  // Try to get updateFilters from EntityListProvider context
  // This will only work if ScaffolderPage uses EntityListProvider internally
  let updateFilters: ((filters: Record<string, any>) => void) | undefined;
  
  try {
    const entityListContext = useEntityList();
    updateFilters = entityListContext.updateFilters;
  } catch (error) {
    // If useEntityList is not available, ScaffolderPage might not use EntityListProvider
    // In that case, we'll just render ScaffolderPage without filter
    console.warn('EntityListProvider context not available, tag filter will not be applied');
  }

  useEffect(() => {
    if (tagsParam && updateFilters) {
      // Parse tags parameter (can be comma-separated or single value)
      const tags = tagsParam.split(',').map(tag => tag.trim()).filter(Boolean);
      
      if (tags.length > 0) {
        // Set tag filter after a short delay to ensure ScaffolderPage is fully mounted
        const timer = setTimeout(() => {
          updateFilters!({
            tags: tags.length === 1 
              ? new EntityTagFilter(tags[0])
              : new EntityTagFilter(tags),
          });
        }, 200);

        return () => clearTimeout(timer);
      }
    }
  }, [tagsParam, updateFilters]);

  // ScaffolderPage must be rendered directly without wrapper
  return <ScaffolderPage headerOptions={props.headerOptions} />;
};
