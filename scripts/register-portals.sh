#!/bin/bash

# Script to register portal locations in Backstage catalog
# Usage: ./register-portals.sh <repo-url-1> <repo-url-2> ...
# Example: ./register-portals.sh https://github.com/owner/repo1 https://github.com/owner/repo2

BACKEND_URL="${BACKEND_URL:-http://localhost:7008}"

if [ $# -eq 0 ]; then
  echo "Usage: $0 <repo-url-1> <repo-url-2> ..."
  echo ""
  echo "Examples:"
  echo "  $0 https://github.com/myorg/myportal"
  echo "  $0 https://github.com/myorg/portal1 https://github.com/myorg/portal2"
  echo ""
  echo "The script will register each repo's catalog-info.yaml location."
  exit 1
fi

for repo_url in "$@"; do
  # Convert repo URL to catalog-info.yaml URL
  # Handle different GitHub URL formats
  if [[ $repo_url == *"github.com"* ]]; then
    # Remove trailing slash if present
    repo_url="${repo_url%/}"
    # Convert to blob URL format
    if [[ $repo_url == *".git" ]]; then
      repo_url="${repo_url%.git}"
    fi
    # Extract owner and repo name
    if [[ $repo_url =~ github\.com/([^/]+)/([^/]+) ]]; then
      owner="${BASH_REMATCH[1]}"
      repo="${BASH_REMATCH[2]}"
      catalog_url="https://github.com/${owner}/${repo}/blob/main/catalog-info.yaml"
      
      echo "Registering: ${catalog_url}"
      
      response=$(curl -s -w "\n%{http_code}" -X POST "${BACKEND_URL}/api/catalog/locations" \
        -H "Content-Type: application/json" \
        -d "{
          \"type\": \"url\",
          \"target\": \"${catalog_url}\"
        }")
      
      http_code=$(echo "$response" | tail -n1)
      body=$(echo "$response" | sed '$d')
      
      if [ "$http_code" -eq 201 ]; then
        echo "✅ Successfully registered: ${owner}/${repo}"
        echo "   Location: ${catalog_url}"
      elif [ "$http_code" -eq 409 ]; then
        echo "⚠️  Already registered: ${owner}/${repo}"
      else
        echo "❌ Failed to register: ${owner}/${repo}"
        echo "   HTTP Code: ${http_code}"
        echo "   Response: ${body}"
      fi
      echo ""
    else
      echo "❌ Invalid GitHub URL format: ${repo_url}"
    fi
  else
    echo "❌ Unsupported URL format: ${repo_url}"
    echo "   Only GitHub URLs are supported"
  fi
done

echo "Done! Check the catalog at http://localhost:3001/catalog"


