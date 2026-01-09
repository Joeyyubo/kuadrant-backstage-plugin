# GitHub Pages 自动配置修复

## 问题描述

通过 "Create a portal" 模板创建的 portal，GitHub Pages 链接返回 404，因为：
- GitHub Pages 没有在 repository settings 中启用
- 没有选择 "deploy from a branch" 并设置为 main 分支的 root

## 解决方案

已在模板 skeleton 中添加了 GitHub Actions workflow (`.github/workflows/pages.yml`)，用于自动配置和部署 GitHub Pages。

### 工作原理

1. **自动部署**：当代码推送到 `main` 分支时，GitHub Actions 会自动触发部署
2. **自动启用 Pages**：使用 GitHub Actions 部署时，GitHub 会自动启用 Pages 功能
3. **无需手动配置**：用户不需要在 repository settings 中手动配置

### 添加的文件

- `.github/workflows/pages.yml` - GitHub Actions workflow 文件
  - 监听 `main` 分支的 push 事件
  - 使用 GitHub Pages Actions 自动部署
  - 配置了正确的权限和并发控制

### 工作流程

1. 用户通过模板创建 portal
2. 代码推送到 GitHub repository
3. GitHub Actions workflow 自动触发
4. 自动部署到 GitHub Pages
5. Portal 在几分钟内可用

### 优势

- ✅ **无需手动配置**：创建 repo 后自动工作
- ✅ **自动化**：每次 push 到 main 分支都会自动部署
- ✅ **标准化**：所有通过模板创建的 portal 都使用相同的部署流程
- ✅ **可靠**：使用 GitHub 官方 Actions

### 验证

创建新的 portal 后，可以：

1. **检查 Actions**：
   - 访问 `https://github.com/<owner>/<repo>/actions`
   - 应该能看到 "Deploy to GitHub Pages" workflow 运行

2. **检查 Pages**：
   - 访问 `https://github.com/<owner>/<repo>/settings/pages`
   - 应该能看到 "GitHub Actions" 作为 source

3. **访问 Portal**：
   - 等待几分钟让部署完成
   - 访问 `https://<owner>.github.io/<repo>/`
   - 应该能看到 portal 页面

### 注意事项

- 首次部署可能需要几分钟时间
- 如果 repo 是 Private，需要确保 GitHub Pages 设置允许 Private repos（可能需要 GitHub Pro/Team/Enterprise）
- 如果遇到权限问题，检查 repository settings > Actions > General > Workflow permissions

### 回退方案

如果 GitHub Actions 部署有问题，用户仍然可以：
1. 在 repository settings 中手动启用 GitHub Pages
2. 选择 "Deploy from a branch"
3. 选择 `main` 分支和 `/ (root)` 目录


