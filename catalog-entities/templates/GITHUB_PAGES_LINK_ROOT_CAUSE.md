# GitHub Pages 链接错误 - 根本原因分析

## 问题现象

Catalog 中的 "View Portal (GitHub Pages)" 链接指向错误的 URL：
- **错误的链接**：`https://Joeyyubo.github.io/88jvc84m/`
- **正确的链接**：`https://joeyyubo.github.io/Alien-dev-portal/`

## 根本原因

### 核心问题

**模板在生成 `catalog-info.yaml` 时使用的是用户输入的 `repoName`，但实际创建的 repo 名称可能不同。**

### 详细分析

模板的工作流程：

1. **fetch 步骤**（第 1 步）：
   ```yaml
   - id: fetch
     action: fetch:template
     values:
       repoName: ${{ parameters.repoName }}  # 用户输入的 repo 名称
   ```
   - 此时生成 `catalog-info.yaml`，使用：`https://${{ values.repoOwner }}.github.io/${{ values.repoName }}/`
   - **问题**：使用的是用户输入的 `repoName`，可能是 `88jvc84m`

2. **publish 步骤**（第 2 步）：
   ```yaml
   - id: publish
     action: publish:github
     input:
       repoUrl: github.com?owner=${{ parameters.repoOwner }}&repo=${{ parameters.repoName }}
   ```
   - 创建实际的 GitHub repository
   - 输出 `remoteUrl`：`https://github.com/Joeyyubo/Alien-dev-portal`
   - **关键**：实际的 repo 名称是 `Alien-dev-portal`，不是用户输入的 `88jvc84m`

3. **register 步骤**（第 3 步）：
   - 使用已生成的 `catalog-info.yaml`（包含错误的链接）注册到 catalog

### 为什么用户输入的 repoName 和实际创建的不同？

可能的原因：
1. **用户输入错误**：创建时输入的 `repoName` 和实际想要的名称不同
2. **GitHub 自动修改**：如果 repo 名称已存在，GitHub 可能会自动修改
3. **模板逻辑问题**：模板可能在某些情况下使用了错误的 repo 名称

## 解决方案

### 方案 1: 使用 publish 步骤的实际输出（推荐但需要验证）

在 `publish` 步骤之后，使用实际的 `remoteUrl` 来更新 `catalog-info.yaml`。

**挑战**：Backstage scaffolder 可能不支持：
- 执行脚本
- 字符串操作函数（如 `replace`）
- 动态更新文件

### 方案 2: 修改模板，让用户输入正确的 repoName（临时方案）

**说明**：确保用户在创建 portal 时输入的 `repoName` 和实际创建的 repo 名称一致。

**缺点**：
- 依赖用户输入正确
- 如果 GitHub 自动修改名称，仍然会有问题

### 方案 3: 手动更新已存在的 portal（当前可行）

对于已经创建的 portal，手动更新 GitHub repo 中的 `catalog-info.yaml`：

1. 访问：https://github.com/Joeyyubo/Alien-dev-portal/edit/main/catalog-info.yaml
2. 更新链接为：
   ```yaml
   links:
     - url: https://joeyyubo.github.io/Alien-dev-portal/
       title: View Portal (GitHub Pages)
   ```
3. 提交更改
4. Catalog 会自动同步更新

## 推荐的长期解决方案

由于 Backstage scaffolder 的限制，最实用的方案是：

1. **修改模板 skeleton**：在 `catalog-info.yaml` 中使用占位符
2. **在 publish 之后更新**：使用脚本或 action 更新占位符
3. **或者**：修改模板逻辑，让 `catalog-info.yaml` 在 `publish` 之后生成

但由于 scaffolder 的限制，可能需要：
- 创建自定义的 scaffolder action
- 或者接受这个限制，要求用户确保输入的 repoName 正确

## 当前状态

已完成的修改：
1. ✅ 修改了 `catalog-info.yaml` 模板，使用占位符
2. ✅ 创建了更新脚本 `generate-catalog-info.sh`
3. ⚠️ 需要验证 scaffolder 是否支持在 publish 之后执行脚本更新

## 对于你的 Alien-dev-portal

**立即修复**：手动更新 GitHub repo 中的 `catalog-info.yaml`：

访问：https://github.com/Joeyyubo/Alien-dev-portal/edit/main/catalog-info.yaml

将链接更新为：
```yaml
links:
  - url: https://joeyyubo.github.io/Alien-dev-portal/
    title: View Portal (GitHub Pages)
    icon: web
    type: website
```

提交后，Catalog 会自动同步更新。


