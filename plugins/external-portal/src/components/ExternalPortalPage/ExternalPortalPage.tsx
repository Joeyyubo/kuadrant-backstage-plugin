import React, { useState } from 'react';
import {
  Page,
  Header,
  Content,
  InfoCard,
} from '@backstage/core-components';
import { Grid, Typography, Button, Box, Chip, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { useNavigate } from 'react-router-dom';

export const ExternalPortalPage = () => {
  const catalogApi = useApi(catalogApiRef);
  const navigate = useNavigate();
  
  const { value, loading, error } = useAsync(async () => {
    const response = await catalogApi.getEntities({
      filter: {
        kind: 'component',
      },
    });
    return response.items;
  }, [catalogApi]);

  const entities = value || [];

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

  // Check if entity is boo-dev-portal API Portal
  const isBooDevPortal = (entity: any) => {
    const title = entity.metadata.title || entity.metadata.name || '';
    const name = entity.metadata.name || '';
    return title.toLowerCase().includes('boo-dev-portal') || 
           name.toLowerCase().includes('boo-dev-portal') ||
           title.toLowerCase().includes('boo') && title.toLowerCase().includes('api portal');
  };

  // Determine portal type (website or framework)
  // Framework portals typically have different characteristics or annotations
  const getPortalType = (entity: any): 'website' | 'framework' => {
    // Check if entity has annotations or metadata that indicate framework
    const annotations = entity.metadata.annotations || {};
    const description = entity.metadata.description || '';
    const title = entity.metadata.title || '';
    
    // Framework portals might have specific annotations or characteristics
    // For now, we'll check if it's a framework based on certain indicators
    // You can adjust this logic based on how framework portals are marked
    if (description.toLowerCase().includes('framework') || 
        description.toLowerCase().includes('rhdh') ||
        title.toLowerCase().includes('framework') ||
        annotations['backstage.io/template']?.includes('api-portal')) {
      return 'framework';
    }
    
    // Default to website for static HTML portals
    return 'website';
  };

  // Mock API data for Alien Developer Portal
  const mockApis = [
    { name: 'Flights API', version: 'v1.0', type: 'REST', status: 'Active' },
    { name: 'Pricing API', version: 'v1.2', type: 'REST', status: 'Active' },
    { name: 'Identity API', version: 'v2.0', type: 'REST', status: 'Active' },
    { name: 'Notification API', version: 'v1.5', type: 'REST', status: 'Active' },
  ];

  // Mock API data for boo-dev-portal API Portal
  const booDevPortalApis = [
    { name: 'User Management API', version: 'v2.1', type: 'REST', status: 'Active' },
    { name: 'Payment Processing API', version: 'v1.8', type: 'REST', status: 'Active' },
    { name: 'Analytics API', version: 'v3.0', type: 'REST', status: 'Active' },
  ];

  const handleCreateClick = () => {
    navigate('/create');
  };

  return (
    <Page themeId="tool">
      <Header
        title="External Portal"
        subtitle="Manage and access external developer portals"
      >
        <Box style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', position: 'relative' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            style={{ flexShrink: 0 }}
          >
            Create
          </Button>
        </Box>
      </Header>
      <Content>
        <Box style={{ scrollbarGutter: 'stable' }}>
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
              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                minHeight: '60vh',
                padding: '3rem 0'
              }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h3" style={{ 
                      fontWeight: 600, 
                      marginBottom: '1.5rem',
                      fontSize: '2rem'
                    }}>
                      No portals created yet
                    </Typography>
                    <Typography variant="body1" style={{ 
                      marginBottom: '2rem',
                      fontSize: '1rem',
                      color: '#666',
                      lineHeight: '1.6'
                    }}>
                      Make an external dev portal easier, more efficient, and help you get the job done. Use the Self service to create through your portal templates.
                    </Typography>
                    <Box style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/create')}
                        style={{
                          padding: '0.75rem 1.5rem',
                          fontSize: '1rem',
                          fontWeight: 500
                        }}
                      >
                        Go to Self service
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        startIcon={<HelpOutlineIcon />}
                        style={{
                          padding: '0.75rem 1.5rem',
                          fontSize: '1rem',
                          fontWeight: 500
                        }}
                      >
                        ? Support
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Box style={{
                      width: '100%',
                      maxWidth: '500px',
                      height: '400px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e0e0e0'
                    }}>
                      <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center' }}>
                        Illustration placeholder
                        <br />
                        (Illustration will be added here)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
          {portalEntities.map(entity => {
            const portalType = getPortalType(entity);
            const portalTitle = entity.metadata.title || entity.metadata.name;
            
            // API List component with collapse functionality
            const ApiListSection = () => {
              const [isExpanded, setIsExpanded] = useState(false);
              
              // Determine which API list to use and count
              let apiList: typeof mockApis = [];
              let apiCount = 0;
              
              if (isAlienPortal(entity)) {
                apiList = mockApis;
                apiCount = mockApis.length;
              } else if (isBooDevPortal(entity)) {
                apiList = booDevPortalApis;
                apiCount = booDevPortalApis.length;
              }
              
              // Don't render if no APIs
              if (apiCount === 0) {
                return null;
              }
              
              return (
                <Box style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', marginBottom: isExpanded ? '1rem' : '0', minHeight: '32px' }}>
                    <IconButton
                      size="small"
                      onClick={() => setIsExpanded(!isExpanded)}
                      style={{ padding: '4px', marginRight: '0.5rem', flexShrink: 0 }}
                    >
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                    <Typography variant="h6" style={{ fontSize: '1rem', fontWeight: 600, flex: 1 }}>
                      API List ({apiCount})
                    </Typography>
                  </Box>
                  {isExpanded && (
                    <Box>
                      {apiList.map((api, index) => (
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
                    </Box>
                  )}
                </Box>
              );
            };
            
            return (
            <Grid item xs={12} md={6} lg={4} key={entity.metadata.uid}>
              <Box style={{ height: '100%' }}>
                <InfoCard
                  title={
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{portalTitle}</span>
                      <Chip 
                        label={portalType === 'framework' ? 'Framework' : 'Website'} 
                        size="small"
                        color={portalType === 'framework' ? 'primary' : 'default'}
                        style={{ marginLeft: '0.5rem' }}
                      />
                    </Box>
                  }
                  subheader={entity.metadata.description}
                >
                {entity.metadata.links && (() => {
                  // Find Portal link (GitHub Pages)
                  const portalLink = entity.metadata.links.find(link => 
                    link.title?.includes('Portal') || link.title?.includes('GitHub Pages')
                  );
                  
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
                      {/* First link: Portal (GitHub Pages) */}
                      {portalLink && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          <a
                            href={portalLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#1976d2',
                              textDecoration: 'none',
                              fontWeight: 500
                            }}
                          >
                            {portalLink.title?.replace(' (GitHub Pages)', '') || 'View Portal'}
                          </a>
                        </div>
                      )}
                      {/* Second link: Repository (with repo name + " repo") */}
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
                            {repoName} repo
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <ApiListSection />
              </InfoCard>
              </Box>
            </Grid>
            );
          })}
          </Grid>
        </Box>
      </Content>
    </Page>
  );
};

