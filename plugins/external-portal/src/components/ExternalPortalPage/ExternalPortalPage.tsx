import React, { useState } from 'react';
import {
  Page,
  Header,
  Content,
  InfoCard,
} from '@backstage/core-components';
import { Grid, Typography, Button, Box, Menu, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { useNavigate } from 'react-router-dom';

export const ExternalPortalPage = () => {
  const catalogApi = useApi(catalogApiRef);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const { value, loading, error } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: {
        kind: 'component',
      },
    });
    return response.items;
  }, [catalogApi]);

  // Fetch portal-related templates
  const { value: templates, loading: templatesLoading } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: {
        kind: 'template',
      },
    });
    // Filter templates that contain 'portal' in title, name, or tags
    return response.items.filter(template => {
      const title = template.metadata.title || '';
      const name = template.metadata.name || '';
      const tags = template.metadata.tags || [];
      const tagStr = tags.join(' ').toLowerCase();
      return title.toLowerCase().includes('portal') || 
             name.toLowerCase().includes('portal') ||
             tagStr.includes('portal');
    });
  }, [catalogApi]);

  const entities = value || [];
  const portalTemplates = templates || [];

  // Filter components that have links to external portals
  const portalEntities = entities.filter(entity => 
    entity.metadata.links?.some(link => 
      link.title?.includes('Portal') || link.title?.includes('GitHub Pages')
    )
  );

  // Check if entity is Alien Developer Portal
  const isAlienPortal = (entity: any) => {
    const title = entity.metadata.title || entity.metadata.name || '';
    return title.toLowerCase().includes('alien') || 
           entity.metadata.name?.toLowerCase().includes('alien') ||
           entity.metadata.name === 'kksvoil';
  };

  // Mock API data for Alien Developer Portal
  const mockApis = [
    { name: 'Flights API', version: 'v1.0', type: 'REST', status: 'Active' },
    { name: 'Pricing API', version: 'v1.2', type: 'REST', status: 'Active' },
    { name: 'Identity API', version: 'v2.0', type: 'REST', status: 'Active' },
    { name: 'Notification API', version: 'v1.5', type: 'REST', status: 'Active' },
  ];

  const handleCreateDevPortalClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTemplateSelect = (templateName: string) => {
    navigate(`/create?template=${templateName}`);
    handleMenuClose();
  };

  return (
    <Page themeId="tool">
      <Header
        title="External Portal"
        subtitle="Manage and access external developer portals"
      >
        <Box style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateDevPortalClick}
            aria-controls="portal-menu"
            aria-haspopup="true"
          >
            Create external portal
          </Button>
          <Menu
            id="portal-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            getContentAnchorEl={null}
          >
            {templatesLoading ? (
              <MenuItem disabled>Loading templates...</MenuItem>
            ) : portalTemplates.length === 0 ? (
              <MenuItem disabled>No portal templates found</MenuItem>
            ) : (
              portalTemplates.map((template) => (
                <MenuItem
                  key={template.metadata.name}
                  onClick={() => handleTemplateSelect(template.metadata.name)}
                >
                  {template.metadata.title || template.metadata.name}
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>
      </Header>
      <Content>
        <Grid container spacing={3}>
          {loading && (
            <Grid item xs={12}>
              <Typography>Loading portals...</Typography>
            </Grid>
          )}
          {error && (
            <Grid item xs={12}>
              <Typography color="error">
                Error loading portals: {error instanceof Error ? error.message : String(error)}
              </Typography>
            </Grid>
          )}
          {!loading && !error && portalEntities.length === 0 && (
            <Grid item xs={12}>
              <InfoCard title="No Portals Found">
                <Typography>
                  No external portals have been created yet. Use the "Create a new portal" template
                  in the Self-service section to create your first portal.
                </Typography>
              </InfoCard>
            </Grid>
          )}
          {portalEntities.map(entity => (
            <Grid item xs={12} md={6} lg={4} key={entity.metadata.uid}>
              <InfoCard
                title={entity.metadata.title || entity.metadata.name}
                subheader={entity.metadata.description}
              >
                {entity.metadata.links && (() => {
                  // Find repository link to extract repo name and URL
                  const repoLink = entity.metadata.links.find(link => 
                    link.title?.includes('Repository')
                  );
                  
                  // Extract repo name from repository URL
                  const getRepoName = (url?: string): string => {
                    if (!url) return 'Repository';
                    try {
                      const match = url.match(/github\.com\/[^/]+\/([^/]+)/);
                      return match ? match[1] : 'Repository';
                    } catch {
                      return 'Repository';
                    }
                  };

                  const repoName = repoLink ? getRepoName(repoLink.url) : 'Repository';
                  const repoUrl = repoLink?.url;

                  return (
                    <div>
                      {entity.metadata.links
                        .filter(link => {
                          // Show Portal link (GitHub Pages)
                          if (link.title?.includes('Portal') || link.title?.includes('GitHub Pages')) {
                            return true;
                          }
                          // Skip HTML (Raw) and Repository links - we'll show repo name instead
                          if (link.title?.includes('HTML (Raw)') || link.title?.includes('Repository')) {
                            return false;
                          }
                          // Show other links
                          return true;
                        })
                        .map((link, index) => {
                          // Remove "(GitHub Pages)" from title
                          let displayTitle = link.title || 'View Portal';
                          if (displayTitle.includes('(GitHub Pages)')) {
                            displayTitle = displayTitle.replace(' (GitHub Pages)', '');
                          }

                          return (
                            <div key={index} style={{ marginBottom: '0.5rem' }}>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ 
                                  color: '#1976d2',
                                  textDecoration: 'none',
                                  fontWeight: 500
                                }}
                              >
                                {displayTitle}
                              </a>
                            </div>
                          );
                        })}
                      {/* Show repo name as replacement for "View HTML (Raw)" */}
                      {repoUrl && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          <a
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#1976d2',
                              textDecoration: 'none',
                              fontWeight: 500
                            }}
                          >
                            {repoName}
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })()}
                {isAlienPortal(entity) && (
                  <Box style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" gutterBottom style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                      API List
                    </Typography>
                    {mockApis.length === 0 ? (
                      <Typography variant="body2" color="textSecondary">
                        No APIs available
                      </Typography>
                    ) : (
                      <div>
                        {mockApis.map((api, index) => (
                          <Box
                            key={index}
                            style={{
                              padding: '0.75rem',
                              marginBottom: '0.5rem',
                              backgroundColor: '#f5f5f5',
                              borderRadius: '4px',
                              border: '1px solid #e0e0e0'
                            }}
                          >
                            <Typography variant="body2" style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                              {api.name}
                            </Typography>
                            <Box style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#666' }}>
                              <span>Version: {api.version}</span>
                              <span>Type: {api.type}</span>
                              <span style={{ color: '#4caf50', fontWeight: 500 }}>{api.status}</span>
                            </Box>
                          </Box>
                        ))}
                      </div>
                    )}
                  </Box>
                )}
              </InfoCard>
            </Grid>
          ))}
        </Grid>
      </Content>
    </Page>
  );
};

