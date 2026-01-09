#!/bin/bash
# Script to update catalog-info.yaml with actual GitHub repo URLs from publish output
# This script is executed after publish:github to fix the links

REMOTE_URL="$1"
CATALOG_INFO_PATH="./catalog-info.yaml"

if [ -z "$REMOTE_URL" ]; then
  echo "Error: remoteUrl is required"
  exit 1
fi

# Extract owner and repo name from remoteUrl
# Format: https://github.com/owner/repo or https://github.com/owner/repo.git
if [[ $REMOTE_URL =~ github\.com/([^/]+)/([^/]+) ]]; then
  REPO_OWNER="${BASH_REMATCH[1]}"
  REPO_NAME="${BASH_REMATCH[2]%.git}"  # Remove .git suffix if present
  
  # Convert to lowercase for GitHub Pages URL (GitHub Pages URLs are case-insensitive but lowercase is standard)
  REPO_OWNER_LOWER=$(echo "$REPO_OWNER" | tr '[:upper:]' '[:lower:]')
  
  # Update catalog-info.yaml with actual URLs
  if [ -f "$CATALOG_INFO_PATH" ]; then
    # Replace placeholders with actual URLs
    sed -i.bak "s|__GITHUB_PAGES_URL__|https://${REPO_OWNER_LOWER}.github.io/${REPO_NAME}/|g" "$CATALOG_INFO_PATH"
    sed -i.bak "s|__RAW_HTML_URL__|https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/index.html|g" "$CATALOG_INFO_PATH"
    sed -i.bak "s|__SOURCE_HTML_URL__|https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/main/index.html|g" "$CATALOG_INFO_PATH"
    sed -i.bak "s|__REPO_URL__|https://github.com/${REPO_OWNER}/${REPO_NAME}|g" "$CATALOG_INFO_PATH"
    
    # Remove backup file
    rm -f "${CATALOG_INFO_PATH}.bak"
    
    echo "Updated catalog-info.yaml with actual repo URLs:"
    echo "  Owner: $REPO_OWNER"
    echo "  Repo: $REPO_NAME"
    echo "  GitHub Pages: https://${REPO_OWNER_LOWER}.github.io/${REPO_NAME}/"
  else
    echo "Error: catalog-info.yaml not found at $CATALOG_INFO_PATH"
    exit 1
  fi
else
  echo "Error: Invalid remoteUrl format: $REMOTE_URL"
  exit 1
fi


