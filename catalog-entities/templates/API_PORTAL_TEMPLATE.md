# API-Only Portal Template

## 概述

这是一个专注于 API 的轻量级开发者门户模板，专为 Red Hat Developer Hub (RHDH) 设计。与完整的开发者门户相比，这个模板移除了所有非 API 相关的内容，专注于 API 发现、文档和集成。

## 模板位置

- **模板定义文件**: `catalog-entities/templates/api-portal.yaml`
- **模板骨架**: `catalog-entities/templates/api-portal-skeleton/`

## 主要特性

### ✅ 包含的功能

1. **API 探索区域**
   - 6 个示例 API 卡片（Flights, Pricing, Identity, Notification, Analytics, Security）
   - API 元数据（类型、版本、认证方式）
   - 每个 API 的详细描述

2. **API 文档区域**
   - Getting Started Guide
   - API Reference
   - Code Samples
   - SDKs & Libraries
   - Best Practices
   - Changelog

3. **快速开始指南**
   - 5 步集成流程
   - 清晰的步骤说明

4. **导航和认证**
   - 简化的导航菜单（APIs, Documentation, Credentials, Support）
   - 登录/注册按钮

### ❌ 移除的内容

与完整门户相比，API-only 模板移除了：
- 商业成功案例
- 合作伙伴展示
- 广告占位符
- 复杂的 Hero 区域图片
- 不必要的营销内容

## 使用方法

### 1. 在 Backstage 中创建 API Portal

1. 访问 Backstage Self-service 页面
2. 选择 "Create an API-only portal" 模板
3. 填写表单：
   - **Portal name**: 你的 API 门户名称
   - **Description**: 门户描述
   - **Portal visibility**: Public 或 Private
   - **Brand color**: 品牌颜色（十六进制格式，如 #F22626）
   - **Owner**: 组件所有者
   - **Repository Owner**: GitHub 用户名或组织名
   - **Repository Name**: GitHub 仓库名称

4. 点击 "Create" 开始创建

### 2. 自定义 API 列表

创建后，编辑 `index.html` 文件中的 API 卡片：

```html
<div class="api-card">
    <div class="api-icon">✈</div>
    <h3>Your API Name</h3>
    <p>Your API description...</p>
    <div class="api-meta">
        <span>REST</span>
        <span>v1.0</span>
        <span>OAuth 2.0</span>
    </div>
    <a href="#" class="explore-btn">Explore API</a>
</div>
```

### 3. 更新 API 文档链接

在 `index.html` 中找到文档卡片部分，更新链接：

```html
<div class="doc-card">
    <h3>Getting Started Guide</h3>
    <p>Learn the basics...</p>
    <a href="YOUR_DOC_URL">Read Guide →</a>
</div>
```

## 文件结构

```
api-portal-skeleton/
├── index.html          # 主 HTML 文件（API-only 门户）
├── catalog-info.yaml   # Backstage catalog 实体定义
└── README.md          # 项目说明文档
```

## 与完整门户的对比

| 特性 | API-Only Portal | Full Developer Portal |
|------|----------------|---------------------|
| API 探索 | ✅ | ✅ |
| API 文档 | ✅ | ✅ |
| 快速开始 | ✅ | ✅ |
| 商业案例 | ❌ | ✅ |
| 合作伙伴 | ❌ | ✅ |
| 广告区域 | ❌ | ✅ |
| 复杂 Hero | ❌ | ✅ |
| 文件大小 | 较小 | 较大 |

## 部署

创建后，模板会自动：
1. 发布到 GitHub
2. 注册到 Backstage Catalog
3. 可以通过 GitHub Pages 访问

访问链接格式：
- GitHub Pages: `https://{repoOwner}.github.io/{repoName}/`
- GitHub 仓库: `https://github.com/{repoOwner}/{repoName}`

## 自定义建议

### 添加更多 API

在 `index.html` 的 `.api-grid` 部分添加更多 API 卡片。

### 修改样式

所有样式都在 `<style>` 标签中，使用 CSS 变量：
- `--brand-color`: 品牌颜色
- `--primary-blue`: 主色调
- `--light-blue`: 浅蓝色背景
- `--light-gray`: 浅灰色背景

### 集成真实 API 文档

将文档卡片中的链接指向你的实际 API 文档：
- Swagger/OpenAPI 文档
- Postman Collection
- 自定义文档站点

## 示例

创建后的门户将包含：
- 6 个示例 API（可根据需要修改）
- 6 个文档资源卡片
- 5 步快速开始指南
- 响应式设计，支持移动端

## 注意事项

1. **GitHub Pages 配置**: 确保 GitHub Pages 已正确配置（通常会自动配置）
2. **链接更新**: 创建后，可能需要手动更新 `catalog-info.yaml` 中的 GitHub Pages 链接（如果 repo 名称与输入不同）
3. **API 内容**: 模板中的 API 都是示例，需要替换为你的实际 API

## 相关文档

- [完整开发者门户模板](./developer-portal.yaml)
- [GitHub Pages 配置说明](./GITHUB_PAGES_FIX.md)
- [Catalog 持久化说明](../../CATALOG_PERSISTENCE.md)

