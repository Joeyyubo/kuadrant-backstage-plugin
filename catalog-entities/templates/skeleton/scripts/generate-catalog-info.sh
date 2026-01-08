#!/bin/bash
# Generate catalog-info.yaml with actual GitHub repo URLs
# This script is called after publish:github to generate the correct catalog-info.yaml

REMOTE_URL="$1"
PORTAL_NAME="$2"
DESCRIPTION="$3"
OWNER="$4"

if [ -z "$REMOTE_URL" ] || [ -z "$PORTAL_NAME" ]; then
  echo "Error: remoteUrl and portalName are required"
  exit 1
fi

# Extract owner and repo name from remoteUrl
# Format: https://github.com/owner/repo or https://github.com/owner/repo.git
if [[ $REMOTE_URL =~ github\.com/([^/]+)/([^/]+) ]]; then
  REPO_OWNER="${BASH_REMATCH[1]}"
  REPO_NAME="${BASH_REMATCH[2]%.git}"  # Remove .git suffix if present
  
  # Convert to lowercase for GitHub Pages URL
  REPO_OWNER_LOWER=$(echo "$REPO_OWNER" | tr '[:upper:]' '[:lower:]')
  
  # Generate catalog-info.yaml
  cat > catalog-info.yaml <<EOF
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ${PORTAL_NAME}
  title: ${PORTAL_NAME} Developer Portal
  description: ${DESCRIPTION:-Developer Portal}
  annotations:
    backstage.io/techdocs-ref: dir:.
  links:
    - url: https://${REPO_OWNER_LOWER}.github.io/${REPO_NAME}/
      title: View Portal (GitHub Pages)
      icon: web
      type: website
    - url: https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/index.html
      title: View HTML (Raw)
      icon: code
      type: sourcecode
    - url: https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/index.html
      title: View Source (index.html)
      icon: code
      type: sourcecode
    - url: https://github.com/${REPO_OWNER}/${REPO_NAME}
      title: Repository
      icon: github
      type: sourcecode
spec:
  type: service
  lifecycle: production
  owner: ${OWNER:-user:default/guest}
EOF

  echo "Generated catalog-info.yaml with actual repo URLs:"
  echo "  Owner: $REPO_OWNER"
  echo "  Repo: $REPO_NAME"
  echo "  GitHub Pages: https://${REPO_OWNER_LOWER}.github.io/${REPO_NAME}/"
else
  echo "Error: Invalid remoteUrl format: $REMOTE_URL"
  exit 1
fi

