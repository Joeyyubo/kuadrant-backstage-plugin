#!/bin/bash
# Quick demo setup - creates minimal cluster and imports demo data
# This is faster than full kuadrant installation

set -e

CLUSTER_NAME=${CLUSTER_NAME:-local-cluster}
LOCALBIN=$(pwd)/bin
KIND_VERSION=v0.20.0

echo "🚀 Quick Demo Setup"
echo ""

# Check Docker
if ! docker ps >/dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop first."
  exit 1
fi

# Check if cluster exists
if kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
  echo "⚠️  Cluster ${CLUSTER_NAME} already exists"
  read -p "Delete and recreate? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    kind delete cluster --name ${CLUSTER_NAME}
  else
    echo "Using existing cluster..."
  fi
fi

# Create cluster if needed
if ! kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
  echo "📦 Creating kind cluster..."
  ${LOCALBIN}/kind-${KIND_VERSION} create cluster --name ${CLUSTER_NAME} --config scripts/kind-cluster.yaml
  kubectl cluster-info --context kind-${CLUSTER_NAME}
  echo ""
fi

# Install CRDs
echo "📋 Installing CRDs..."
kubectl apply -f crds/
echo ""

# Create namespaces
echo "📁 Creating namespaces..."
kubectl create namespace toystore --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace api-gateway --dry-run=client -o yaml | kubectl apply -f -
echo ""

# Install demo resources (only APIProduct and PlanPolicy, skip Gateway/Istio dependencies)
echo "📦 Installing demo resources..."

# Extract PlanPolicy and APIProduct using Python (more reliable)
python3 << 'PYTHON_SCRIPT'
import yaml
import sys

try:
    with open('demo/toystore-demo.yaml', 'r') as f:
        docs = list(yaml.safe_load_all(f))
    
    planpolicy = None
    apiproduct = None
    
    for doc in docs:
        if doc and doc.get('kind') == 'PlanPolicy':
            planpolicy = doc
        elif doc and doc.get('kind') == 'APIProduct':
            apiproduct = doc
    
    if planpolicy:
        with open('/tmp/planpolicy.yaml', 'w') as f:
            f.write('---\n')
            yaml.dump(planpolicy, f, default_flow_style=False)
        print('✅ PlanPolicy extracted')
        
    if apiproduct:
        with open('/tmp/apiproduct.yaml', 'w') as f:
            f.write('---\n')
            yaml.dump(apiproduct, f, default_flow_style=False)
        print('✅ APIProduct extracted')
except Exception as e:
    print(f'Error extracting YAML: {e}')
    sys.exit(1)
PYTHON_SCRIPT

# Apply extracted resources
if [ -s /tmp/planpolicy.yaml ]; then
  kubectl apply -f /tmp/planpolicy.yaml
fi
if [ -s /tmp/apiproduct.yaml ]; then
  kubectl apply -f /tmp/apiproduct.yaml
fi

# Cleanup
rm -f /tmp/planpolicy.yaml /tmp/apiproduct.yaml

echo ""
echo "✅ Demo data imported!"
echo ""
echo "Verify with:"
echo "  kubectl get apiproducts -n toystore"
echo "  kubectl get planpolicies -n toystore"
echo ""
echo "Refresh your browser to see the data!"

