#!/bin/bash
# Script to update Alien-dev-portal catalog-info.yaml with correct links

cat > /tmp/catalog-info-fixed.yaml <<'EOF'
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: kksvoil
  title: kksvoil Developer Portal
  description: fdsfsc
  annotations:
    backstage.io/techdocs-ref: dir:.
  links:
    - url: https://joeyyubo.github.io/Alien-dev-portal/
      title: View Portal (GitHub Pages)
      icon: web
      type: website
    - url: https://raw.githubusercontent.com/Joeyyubo/Alien-dev-portal/main/index.html
      title: View HTML (Raw)
      icon: code
      type: sourcecode
    - url: https://github.com/Joeyyubo/Alien-dev-portal/blob/main/index.html
      title: View Source (index.html)
      icon: code
      type: sourcecode
    - url: https://github.com/Joeyyubo/Alien-dev-portal
      title: Repository
      icon: github
      type: sourcecode
spec:
  type: service
  lifecycle: production
  owner: user:default/guest
EOF

echo "已生成更新后的 catalog-info.yaml 文件："
echo ""
cat /tmp/catalog-info-fixed.yaml
echo ""
echo "请复制上面的内容，然后在 GitHub 上更新："
echo "https://github.com/Joeyyubo/Alien-dev-portal/edit/main/catalog-info.yaml"

