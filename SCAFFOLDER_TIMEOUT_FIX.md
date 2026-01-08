# Scaffolder GitHub 推送超时问题修复

## 问题描述

通过模板创建 portal 时，在推送到 GitHub 仓库时出现超时错误：

```
error: Failed to push to repo
Error: Request timed out
```

## 问题原因

1. **默认超时时间太短**：Backstage scaffolder 默认任务超时时间是 5 分钟（300 秒）
2. **网络延迟**：推送到 GitHub 可能需要更长时间，特别是在网络较慢的情况下
3. **GitHub API 限流**：如果请求频率过高，可能触发 GitHub API 限流

## 解决方案

### 1. 增加任务超时时间（已修复）

已在 `app-config.local.yaml` 中添加了 scaffolder 配置：

```yaml
scaffolder:
  defaultAuthor:
    name: Backstage
    email: backstage@backstage.io
  defaultCommitMessage: 'chore: created via Backstage scaffolder'
  taskTimeout: 600 # 增加任务超时时间到 10 分钟（默认是 5 分钟）
```

**说明：**
- `taskTimeout`: 任务超时时间（秒）
- 默认值：300 秒（5 分钟）
- 新值：600 秒（10 分钟）

### 2. 检查 GitHub Token 权限

确保 GitHub Personal Access Token 具有以下权限：

- ✅ `repo` - 完整仓库访问权限（包括创建、推送、删除）
- ✅ `workflow` - 如果需要使用 GitHub Actions

**检查方法：**
1. 访问：https://github.com/settings/tokens
2. 找到你使用的 token
3. 检查权限范围

**如果权限不足：**
1. 删除旧 token
2. 创建新 token，选择 `repo` 和 `workflow` 权限
3. 更新 `app-config.local.yaml` 中的 token

### 3. 检查网络连接

如果网络较慢或不稳定：

1. **检查代理设置**：
   - 如果使用代理，确保 Backstage 后端可以访问 GitHub
   - 检查 `HTTP_PROXY` 和 `HTTPS_PROXY` 环境变量

2. **测试 GitHub 连接**：
   ```bash
   curl -I https://api.github.com
   ```

### 4. 处理 GitHub API 限流

如果遇到 API 限流：

1. **检查限流状态**：
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/rate_limit
   ```

2. **等待限流重置**：GitHub API 限流通常每小时重置

3. **使用 GitHub App**（推荐用于生产环境）：
   - GitHub App 有更高的 API 限流
   - 配置更安全

## 验证修复

修复后，重新尝试创建 portal：

1. **重启 Backstage 后端**：
   ```bash
   # 停止当前服务
   # 重新启动
   yarn dev:backend
   ```

2. **创建新的 portal**：
   - 访问 `/create` 页面
   - 选择 "Create a new portal" 模板
   - 填写信息并创建

3. **观察日志**：
   - 检查后端日志，确认没有超时错误
   - 如果仍然超时，可以进一步增加 `taskTimeout` 值

## 进一步优化

如果问题仍然存在，可以：

1. **进一步增加超时时间**：
   ```yaml
   scaffolder:
     taskTimeout: 900 # 15 分钟
   ```

2. **检查 GitHub 仓库大小**：
   - 如果模板文件很大，推送可能需要更长时间
   - 考虑优化模板，减少文件大小

3. **使用 GitHub App**：
   - 更稳定的认证方式
   - 更高的 API 限流
   - 更好的安全性

## 常见问题

### Q: 超时时间设置后仍然超时？

A: 可能的原因：
1. 网络连接问题
2. GitHub API 限流
3. Token 权限不足
4. 仓库创建失败

**解决方案：**
- 检查后端日志获取详细错误信息
- 验证 GitHub token 权限
- 测试网络连接到 GitHub

### Q: 如何知道当前超时设置？

A: 检查配置文件中的 `scaffolder.taskTimeout` 值，或查看后端启动日志。

### Q: 可以针对特定模板设置不同的超时吗？

A: 目前 Backstage 的 scaffolder 配置是全局的，所有模板使用相同的超时设置。

## 相关配置

其他可能相关的配置：

```yaml
backend:
  # 如果使用代理
  # 可以通过环境变量设置：
  # HTTP_PROXY=http://proxy:port
  # HTTPS_PROXY=http://proxy:port
```

## 参考

- [Backstage Scaffolder 配置文档](https://backstage.io/docs/features/software-templates/configuration)
- [GitHub API 限流文档](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

