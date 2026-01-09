# GitHub Pages 链接错误问题 - 根本原因和解决方案

## 问题现象

Catalog 中的 "View Portal (GitHub Pages)" 链接指向错误的 URL：
- **错误的链接**：`https://Joeyyubo.github.io/88jvc84m/`
- **正确的链接**：`https://joeyyubo.github.io/Alien-dev-portal/`

## 根本原因分析

### 问题根源

模板的工作流程存在时序问题：

1. **fetch 步骤**（第 1 步）：
   - 使用用户输入的 `repoName` 参数生成 `catalog-info.yaml`
   - 此时使用的是：`${{ values.repoName }}` = 用户输入的 repo 名称
   - **问题**：用户输入的 `repoName` 可能与实际创建的 repo 名称不一致

2. **publish 步骤**（第 2 步）：
   - 使用 `publish:github` action 创建实际的 GitHub repository
   - 输出 `remoteUrl`：实际的 repo URL（如 `https://github.com/Joeyyubo/Alien-dev-portal`）
   - **关键**：实际的 repo 名称可能与用户输入的不同

3. **register 步骤**（第 3 步）：
   - 使用已生成的 `catalog-info.yaml`（包含错误的链接）注册到 catalog

### 为什么会出现不一致？

可能的原因：
1. **用户输入错误**：用户在创建时输入的 `repoName` 和实际想要的名称不同
2. **Repo 名称冲突**：如果 repo 名称已存在，GitHub 可能会自动修改名称
3. **大小写问题**：GitHub 用户名大小写敏感，但模板可能没有正确处理
4. **特殊字符处理**：repo 名称中的特殊字符可能被转换

### 实际案例

从你的情况看：
- 用户输入的 `repoName` 可能是：`88jvc84m`（可能是某个临时生成的名称或错误输入）
- 实际创建的 repo 是：`Alien-dev-portal`
- 所以生成的链接指向了错误的 repo

## 解决方案

### 方案 1: 使用占位符 + 脚本更新（已实现）

**修改内容：**

1. **修改 `catalog-info.yaml` 模板**：使用占位符而不是直接使用变量
   ```yaml
   links:
     - url: __GITHUB_PAGES_URL__
   ```

2. **添加更新脚本**：在 `publish` 之后执行脚本更新链接
   ```yaml
   - id: update-catalog-links
     name: Update Catalog Links
     action: fetch:plain
     input:
       url: ./scripts/update-catalog-info.sh
       values:
         remoteUrl: ${{ steps.publish.output.remoteUrl }}
   ```

3. **脚本功能**：从 `remoteUrl` 中提取实际的 repo owner 和 name，然后更新 `catalog-info.yaml`

**优点：**
- ✅ 使用实际的 repo URL，确保链接正确
- ✅ 自动处理大小写转换（GitHub Pages URL 使用小写）
- ✅ 不需要用户手动输入正确的 repo 名称

**限制：**
- ⚠️ 需要 `fetch:plain` 支持执行脚本（可能需要验证）

### 方案 2: 在 publish 之后重新生成 catalog-info.yaml（备选）

如果 `fetch:plain` 不支持执行脚本，可以：

1. 使用 `fetch:plain` 获取更新后的模板内容
2. 使用 `write:file` action（如果可用）写入文件

### 方案 3: 修改模板逻辑（长期方案）

修改模板，让 `catalog-info.yaml` 在 `publish` 步骤之后生成，而不是在 `fetch` 步骤时生成。

## 已实现的修复

### 1. 修改了 `catalog-info.yaml` 模板

使用占位符代替直接变量：
- `__GITHUB_PAGES_URL__` - GitHub Pages URL
- `__RAW_HTML_URL__` - Raw HTML URL
- `__SOURCE_HTML_URL__` - Source HTML URL
- `__REPO_URL__` - Repository URL

### 2. 创建了更新脚本

`scripts/update-catalog-info.sh`：
- 从 `publish:github` 的 `remoteUrl` 输出中提取实际的 repo owner 和 name
- 更新 `catalog-info.yaml` 中的占位符
- 处理大小写转换（GitHub Pages URL 使用小写）

### 3. 更新了模板流程

在 `publish` 步骤之后添加了 `update-catalog-links` 步骤。

## 验证

下次通过模板创建 portal 时：
1. `fetch` 步骤会生成包含占位符的 `catalog-info.yaml`
2. `publish` 步骤会创建实际的 GitHub repo
3. `update-catalog-links` 步骤会使用实际的 repo URL 更新链接
4. `register` 步骤会注册包含正确链接的实体

## 对于已存在的 Portal

对于已经创建的 portal（如 `Alien-dev-portal`），需要：

1. **手动更新 GitHub repo 中的 `catalog-info.yaml`**：
   - 访问：https://github.com/Joeyyubo/Alien-dev-portal/edit/main/catalog-info.yaml
   - 更新链接为正确的 URL
   - 提交更改

2. **或者等待 catalog 自动刷新**：
   - Catalog 会定期刷新 GitHub locations
   - 更新后的 `catalog-info.yaml` 会被自动同步

## 总结

**根本问题**：模板在生成 `catalog-info.yaml` 时使用的是用户输入的 `repoName`，但实际创建的 repo 名称可能不同。

**解决方案**：在 `publish` 步骤之后，使用实际的 repo URL 来更新 `catalog-info.yaml` 中的链接。


