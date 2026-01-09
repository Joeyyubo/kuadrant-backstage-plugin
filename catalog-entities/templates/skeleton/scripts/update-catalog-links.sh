#!/bin/bash
# Script to update catalog-info.yaml with actual GitHub repo URLs
# This script extracts repo owner and name from the actual remoteUrl

REMOTE_URL="$1"
CATALOG_INFO_PATH="$2"

if [ -z "$REMOTE_URL" ] || [ -z "$CATALOG_INFO_PATH" ]; then
  echo "Usage: $0 <remoteUrl> <catalog-info.yaml path>"
  exit 1
fi

# Extract owner and repo name from remoteUrl
# Format: https://github.com/owner/repo or https://github.com/owner/repo.git
if [[ $REMOTE_URL =~ github\.com/([^/]+)/([^/]+) ]]; then
  REPO_OWNER="${BASH_REMATCH[1]}"
  REPO_NAME="${BASH_REMATCH[2]%.git}"  # Remove .git suffix if present
  
  # Convert to lowercase for GitHub Pages URL (GitHub Pages URLs are case-insensitive but lowercase is standard)
  REPO_OWNER_LOWER=$(echo "$REPO_OWNER" | tr '[:upper:]' '[:lower:]')
  
  # Update catalog-info.yaml
  # Use sed to replace the GitHub Pages URL
  if [ -f "$CATALOG_INFO_PATH" ]; then
    # Replace GitHub Pages URL pattern
    sed -i.bak "s|https://[^/]*\.github\.io/[^/]*/|https://${REPO_OWNER_LOWER}.github.io/${REPO_NAME}/|g" "$CATALOG_INFO_PATH"
    
    # Replace raw.githubusercontent.com URLs
    sed -i.bak "s|https://raw\.githubusercontent\.com/[^/]*/[^/]*/|https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/|g" "$CATALOG_INFO_PATH"
    
    # Replace github.com blob URLs
    sed -i.bak "s|https://github\.com/[^/]*/[^/]*/blob/|https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/|g" "$CATALOG_INFO_PATH"
    
    # Replace github.com repo URLs (without /blob/)
    sed -i.bak "s|https://github\.com/[^/]*/[^/\"']*\"|https://github.com/${REPO_OWNER}/${REPO_NAME}\"|g" "$CATALOG_INFO_PATH"
    sed -i.bak "s|https://github\.com/[^/]*/[^/\"']*'|https://github.com/${REPO_OWNER}/${REPO_NAME}'|g" "$CATALOG_INFO_PATH"
    
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


