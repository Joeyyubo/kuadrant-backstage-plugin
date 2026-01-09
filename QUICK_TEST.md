# 快速测试 API-Only Portal 模板

## 🚀 快速开始

### 1. 重启后端（必需）

新模板需要重启后端才能被识别。

**在运行后端的终端中：**
- 按 `Ctrl+C` 停止后端
- 运行：`yarn dev:backend`
- 等待后端完全启动（看到 "Listening on port 7008"）

### 2. 访问 Self-service 页面

打开浏览器：**http://localhost:3001/create**

你应该能看到：
- ✅ **Create a new portal** (完整门户)
- ✅ **Create an API-only portal** (新模板) 🆕

### 3. 创建测试 Portal

点击 **"Create an API-only portal"**，填写：

```
Portal name: test-api-portal
Description: Test API-only portal
Portal visibility: Public
Brand color: #F22626
Owner: user:default/guest
Repository Owner: [你的 GitHub 用户名]
Repository Name: test-api-portal
```

点击 **Create** 并等待完成（约 2-5 分钟）

### 4. 验证结果

✅ **GitHub Repository**: 检查文件是否正确
✅ **GitHub Pages**: 访问 `https://[用户名].github.io/test-api-portal/`
✅ **Backstage Catalog**: 检查实体是否注册

## 📋 预期结果

API-only 门户应该包含：
- ✅ 6 个 API 卡片
- ✅ API 文档区域
- ✅ 快速开始指南
- ❌ **不包含**：商业案例、合作伙伴、广告

## 🔍 如果模板未出现

1. 确认后端已重启
2. 检查后端日志是否有错误
3. 验证模板文件路径：
   ```
   catalog-entities/templates/api-portal.yaml
   catalog-entities/templates/api-portal-skeleton/
   ```

## 📚 详细文档

查看 `TEST_API_PORTAL_TEMPLATE.md` 获取完整测试指南。


