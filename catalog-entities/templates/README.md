# Developer Portal Template

This template allows you to create a new developer portal application with customizable branding and domain settings.

## Template Features

The template includes the following configuration options:

1. **Portal name** - The name of your developer portal
2. **Description** - A detailed description of your portal
3. **Portal visibility** - Control who can access the portal (Private or Public)
4. **Brand color** - The primary brand color for your portal (hex format)
5. **Domain** - Option to automatically generate a domain for the portal
6. **Owner** - Select the owner of the component
7. **Repository URL** - GitHub repository URL where the portal will be published

## Usage

1. Navigate to the "Create" page in Backstage
2. Select "Create a new portal" template
3. Fill in all the required fields
4. Click "Create" to generate your portal application

## Generated Application

The template creates a static HTML application that includes:

- A customizable header with your portal name and description
- Brand color theming throughout the application
- Sample API listings section
- Responsive design
- Ready-to-deploy static files

## Deployment

The generated portal can be deployed to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Azure Static Web Apps

## Template Structure

- `developer-portal.yaml` - The template definition
- `developer-portal-skeleton/` - The template skeleton files
  - `catalog-info.yaml` - Backstage catalog entity definition
  - `index.html` - Main portal HTML file
  - `README.md` - Portal documentation
  - `.gitignore` - Git ignore file

## Notes

- The template skeleton is located at `./skeleton` relative to the template file
- Ensure the skeleton directory is accessible via Git URL if using remote template storage
- The portal visibility setting affects the generated HTML but does not enforce access control - you'll need to configure this at the hosting/deployment level

