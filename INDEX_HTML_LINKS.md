# Index.html 访问链接和文件路径

## 1. 模板文件（本地）

### 开发者门户模板
- **文件路径**：`catalog-entities/templates/skeleton/index.html`
- **完整路径**：`/Users/yxing/UXD-demo/external portal/kuadrant-backstage-plugin/catalog-entities/templates/skeleton/index.html`
- **用途**：这是 scaffolder 模板，用于创建新的开发者门户

### Backstage 应用入口
- **文件路径**：`packages/app/public/index.html`
- **完整路径**：`/Users/yxing/UXD-demo/external portal/kuadrant-backstage-plugin/packages/app/public/index.html`
- **用途**：Backstage 前端应用的入口 HTML 文件

## 2. 已部署的 GitHub Pages 链接

### Alien-dev-portal
- **GitHub Pages URL**：https://joeyyubo.github.io/Alien-dev-portal/
- **GitHub 仓库**：https://github.com/Joeyyubo/Alien-dev-portal
- **Raw HTML**：https://raw.githubusercontent.com/Joeyyubo/Alien-dev-portal/main/index.html
- **GitHub 源码**：https://github.com/Joeyyubo/Alien-dev-portal/blob/main/index.html

## 3. 本地访问方式

### 在浏览器中打开模板文件
```bash
# 方法 1: 使用 file:// 协议（注意：模板变量不会被替换）
open "file:///Users/yxing/UXD-demo/external portal/kuadrant-backstage-plugin/catalog-entities/templates/skeleton/index.html"

# 方法 2: 使用 VS Code 或编辑器打开
code "/Users/yxing/UXD-demo/external portal/kuadrant-backstage-plugin/catalog-entities/templates/skeleton/index.html"
```

### 启动本地服务器查看（推荐）
```bash
# 进入模板目录
cd "/Users/yxing/UXD-demo/external portal/kuadrant-backstage-plugin/catalog-entities/templates/skeleton"

# 使用 Python 启动本地服务器
python3 -m http.server 8000

# 然后在浏览器访问：http://localhost:8000/index.html
```

## 4. 快速访问命令

### 打开模板文件
```bash
open "/Users/yxing/UXD-demo/external portal/kuadrant-backstage-plugin/catalog-entities/templates/skeleton/index.html"
```

### 打开已部署的 GitHub Pages
```bash
open "https://joeyyubo.github.io/Alien-dev-portal/"
```

### 在 GitHub 上查看源码
```bash
open "https://github.com/Joeyyubo/Alien-dev-portal/blob/main/index.html"
```


