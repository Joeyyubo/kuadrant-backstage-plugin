# 测试 API-Only Portal 模板

## 前置条件

✅ 后端已运行（端口 7008）
✅ 前端已运行（端口 3001）
✅ 新模板文件已创建

## 测试步骤

### 1. 重启后端以加载新模板

新创建的模板需要重启后端才能被识别。

**方法 1: 如果使用 `yarn dev`**
- 停止当前进程（Ctrl+C）
- 重新运行：`yarn dev:backend`

**方法 2: 如果使用单独的终端**
- 停止后端进程
- 重新启动：`yarn dev:backend`

### 2. 访问 Self-service 页面

1. 打开浏览器访问：http://localhost:3001/create
2. 你应该能看到两个模板：
   - **Create a new portal** (完整门户)
   - **Create an API-only portal** (新创建的 API-only 门户) ✨

### 3. 创建测试 API Portal

点击 "Create an API-only portal" 模板，填写表单：

**必填字段：**
- **Portal name**: `test-api-portal` (或任何你喜欢的名称)
- **Description**: `Test API-only portal for RHDH`
- **Portal visibility**: 选择 `Public` 或 `Private`
- **Brand color**: `#F22626` (或任何颜色)
- **Owner**: 选择一个用户或组
- **Repository Owner**: 你的 GitHub 用户名（如 `Joeyyubo`）
- **Repository Name**: `test-api-portal` (或任何可用的 repo 名称)

**可选字段：**
- 保持默认值即可

### 4. 创建并等待完成

1. 点击 "Create" 按钮
2. 等待 scaffolder 任务完成（可能需要几分钟）
3. 任务完成后，你会看到：
   - Repository 链接
   - Open in catalog 链接

### 5. 验证创建结果

#### 5.1 检查 GitHub Repository

1. 访问创建的 GitHub repository
2. 检查文件：
   - ✅ `index.html` - 应该包含 API-only 门户内容
   - ✅ `catalog-info.yaml` - Backstage catalog 实体定义
   - ✅ `README.md` - 项目说明

#### 5.2 检查 GitHub Pages

1. 访问 GitHub Pages URL：`https://{repoOwner}.github.io/{repoName}/`
2. 验证页面显示：
   - ✅ 简化的导航栏（APIs, Documentation, Credentials, Support）
   - ✅ Hero 区域（"API Developer Portal"）
   - ✅ 6 个 API 卡片
   - ✅ API 文档区域
   - ✅ 5 步快速开始指南
   - ❌ 不应该有：商业案例、合作伙伴、广告区域

#### 5.3 检查 Backstage Catalog

1. 访问 Backstage Catalog：http://localhost:3001/catalog
2. 搜索你创建的 portal 名称
3. 验证：
   - ✅ 实体已注册
   - ✅ 链接正确（GitHub Pages, Repository 等）
   - ✅ 描述和元数据正确

### 6. 对比测试

**创建两个门户进行对比：**

1. **完整门户**：使用 "Create a new portal" 模板
2. **API-only 门户**：使用 "Create an API-only portal" 模板

**对比点：**
- 页面内容（API-only 应该更简洁）
- 文件大小（API-only 应该更小）
- 加载速度（API-only 应该更快）
- 功能差异（API-only 没有商业案例等）

## 预期结果

### ✅ 成功标志

- 模板出现在 Self-service 页面
- 可以成功创建 portal
- GitHub repository 包含正确的文件
- GitHub Pages 正确显示 API-only 门户
- Catalog 中正确注册实体
- 页面只包含 API 相关内容，没有商业案例等

### ❌ 可能的问题

1. **模板未出现**
   - 原因：后端未重启
   - 解决：重启后端

2. **创建失败**
   - 检查 GitHub token 配置
   - 检查 repo 名称是否已存在
   - 查看后端日志

3. **GitHub Pages 404**
   - 检查 GitHub Pages 设置
   - 确保 main 分支已启用
   - 参考 `GITHUB_PAGES_FIX.md`

4. **Catalog 链接错误**
   - 参考之前的修复方案
   - 手动更新 `catalog-info.yaml`

## 快速测试命令

```bash
# 1. 检查后端是否运行
curl http://localhost:7008/api/catalog/health

# 2. 检查前端是否运行
curl http://localhost:3001

# 3. 重启后端（如果需要）
cd "/Users/yxing/UXD-demo/external portal/kuadrant-backstage-plugin"
# 停止当前后端，然后：
yarn dev:backend
```

## 测试数据示例

```
Portal name: test-api-portal
Description: A test API-only portal for RHDH
Portal visibility: Public
Brand color: #F22626
Owner: user:default/guest
Repository Owner: Joeyyubo
Repository Name: test-api-portal
```

## 下一步

创建成功后，你可以：
1. 自定义 API 列表（编辑 `index.html`）
2. 添加真实的 API 文档链接
3. 修改样式和品牌颜色
4. 部署到生产环境


