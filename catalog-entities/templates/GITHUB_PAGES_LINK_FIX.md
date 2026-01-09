# GitHub Pages 链接错误问题分析和修复

## 问题现象

Catalog 中的 "View Portal (GitHub Pages)" 链接指向错误的 URL：
- **错误的链接**：`https://Joeyyubo.github.io/88jvc84m/`
- **正确的链接**：`https://joeyyubo.github.io/Alien-dev-portal/`

## 根本原因分析

### 问题根源

模板的工作流程是：

1. **fetch 步骤**：生成 `catalog-info.yaml`，使用用户输入的 `repoName` 参数
   ```yaml
   - url: https://${{ values.repoOwner }}.github.io/${{ values.repoName }}/
   ```

2. **publish 步骤**：创建实际的 GitHub repository
   - 使用 `publish:github` action
   - 实际创建的 repo 名称可能与用户输入的 `repoName` 不同

3. **register 步骤**：注册到 catalog
   - 使用已生成的 `catalog-info.yaml`（包含错误的链接）

### 为什么会出现不一致？

可能的原因：
1. **用户输入错误**：用户在创建时输入的 `repoName` 和实际想要的名称不同
2. **Repo 名称冲突**：如果 repo 名称已存在，GitHub 可能会自动修改名称
3. **大小写问题**：GitHub 用户名大小写敏感，但模板可能没有正确处理
4. **特殊字符处理**：repo 名称中的特殊字符可能被转换

### 实际案例

从你的情况看：
- 用户输入的 `repoName` 可能是：`88jvc84m`（可能是某个临时生成的名称）
- 实际创建的 repo 是：`Alien-dev-portal`
- 所以生成的链接指向了错误的 repo

## 解决方案

### 方案 1: 使用 publish 步骤的输出动态更新链接（推荐）

在 `publish` 步骤之后，添加一个步骤来更新 `catalog-info.yaml`，使用实际的 repo URL：

```yaml
- id: update-catalog-info
  name: Update Catalog Info
  action: write:file
  input:
    path: ./catalog-info.yaml
    content: |
      apiVersion: backstage.io/v1alpha1
      kind: Component
      metadata:
        name: ${{ parameters.portalName }}
        title: ${{ parameters.portalName }} Developer Portal
        description: ${{ parameters.description }}
        annotations:
          backstage.io/techdocs-ref: dir:.
        links:
          - url: ${{ steps.publish.output.remoteUrl | replace('github.com', 'github.io') | replace('.git', '/') }}
            title: View Portal (GitHub Pages)
            icon: web
            type: website
          # ... 其他链接
```

**问题**：Backstage scaffolder 可能不支持这种复杂的字符串操作。

### 方案 2: 使用脚本解析 repo URL（更可靠）

添加一个步骤，使用脚本从 `remoteUrl` 中提取 repo owner 和 name：

```yaml
- id: extract-repo-info
  name: Extract Repo Info
  action: fetch:plain
  input:
    url: ./scripts/extract-repo-info.sh
    values:
      remoteUrl: ${{ steps.publish.output.remoteUrl }}
```

### 方案 3: 修改模板，在 publish 之后重新生成 catalog-info.yaml（最简单）

在 `publish` 步骤之后，添加一个步骤来更新 `catalog-info.yaml`：

```yaml
- id: update-catalog-links
  name: Update Catalog Links
  action: write:file
  input:
    path: ./catalog-info.yaml
    # 使用实际的 remoteUrl 来构建链接
```

### 方案 4: 使用 catalog:register 的自动发现（最佳方案）

实际上，`catalog:register` action 应该能够从 repo 中读取 `catalog-info.yaml`，但问题是这个文件已经在 `fetch` 步骤时生成了，包含了错误的链接。

**最佳解决方案**：在 `publish` 之后，使用脚本或 action 来更新 `catalog-info.yaml` 中的链接，使用实际的 repo URL。

## 推荐的修复方案

我建议使用一个自定义的 scaffolder action 或者在 publish 之后添加一个步骤来更新链接。但由于 Backstage scaffolder 的限制，最简单的方法是：

1. **修改模板 skeleton**：不在 `catalog-info.yaml` 中硬编码 GitHub Pages 链接
2. **在 publish 之后更新**：使用 `write:file` action 更新链接

或者，更实用的方案：

**在模板中添加一个步骤，使用 `publish:github` 的输出来自动更新 `catalog-info.yaml`**


