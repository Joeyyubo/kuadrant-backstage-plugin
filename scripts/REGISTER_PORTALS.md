# 重新注册 Portal 到 Catalog

由于之前使用内存数据库，之前注册的 portal 位置已经丢失。使用以下方法可以重新注册它们。

## 方法 1: 使用脚本批量注册（推荐）

### 使用 Bash 脚本

```bash
cd kuadrant-backstage-plugin/scripts
./register-portals.sh https://github.com/owner/repo1 https://github.com/owner/repo2
```

### 使用 Node.js 脚本

```bash
cd kuadrant-backstage-plugin/scripts
node register-portal.js https://github.com/owner/repo1 https://github.com/owner/repo2
```

**示例：**
```bash
# 注册单个 portal
./register-portals.sh https://github.com/myorg/myportal

# 注册多个 portals
./register-portals.sh \
  https://github.com/myorg/portal1 \
  https://github.com/myorg/portal2 \
  https://github.com/myorg/portal3
```

## 方法 2: 通过 Catalog Import 页面（最简单）

1. 打开浏览器，访问：`http://localhost:3001/catalog-import`
2. 在输入框中输入 GitHub repo URL，例如：`https://github.com/owner/repo`
3. 点击 "Analyze" 或 "Import"
4. Backstage 会自动检测 `catalog-info.yaml` 并注册

**优点：**
- 图形界面，操作简单
- 可以预览将要注册的实体
- 不需要命令行

## 方法 3: 使用 curl 命令

```bash
curl -X POST http://localhost:7008/api/catalog/locations \
  -H "Content-Type: application/json" \
  -d '{
    "type": "url",
    "target": "https://github.com/owner/repo/blob/main/catalog-info.yaml"
  }'
```

**注意：** 需要将 `owner/repo` 替换为实际的 GitHub 用户名和组织名。

## 方法 4: 添加到配置文件（不推荐）

如果只有少量固定的 portals，可以添加到 `app-config.local.yaml`：

```yaml
catalog:
  locations:
    - type: file
      target: ../../catalog-entities/all.yaml
    - type: url
      target: https://github.com/owner/repo1/blob/main/catalog-info.yaml
    - type: url
      target: https://github.com/owner/repo2/blob/main/catalog-info.yaml
```

**缺点：**
- 需要手动维护
- 每次添加新 portal 都需要修改配置文件并重启
- 不推荐用于动态创建的 portals

## 查找你的 Portal Repos

如果你不记得之前创建的 repo URL，可以通过以下方式查找：

1. **GitHub 网站：**
   - 登录 GitHub
   - 查看你的 repositories
   - 查找通过 portal 模板创建的 repos

2. **GitHub API：**
   ```bash
   # 列出你的所有 repos（需要 GitHub token）
   curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/user/repos | grep -E '"name"|"html_url"'
   ```

3. **检查 GitHub Pages：**
   - 如果你记得 portal 的 GitHub Pages URL（如 `https://username.github.io/repo-name/`）
   - 可以反推出 repo URL：`https://github.com/username/repo-name`

## 验证注册是否成功

注册后，可以通过以下方式验证：

1. **查看 Catalog：**
   - 访问 `http://localhost:3001/catalog`
   - 搜索你的 portal 名称
   - 应该能看到对应的 Component 实体

2. **查看 Location：**
   - 访问 `http://localhost:7008/api/catalog/locations`
   - 应该能看到注册的 location

3. **检查 External Portal 页面：**
   - 访问 `http://localhost:3001/external-portal`
   - 应该能看到所有已注册的 portals

## 常见问题

### Q: 注册后仍然看不到实体？

A: 可能的原因：
1. `catalog-info.yaml` 文件不存在或路径不正确
2. GitHub token 没有权限访问该 repo
3. 需要等待几秒钟让 catalog 刷新

### Q: 如何更新已注册的 portal？

A: Catalog 会自动定期刷新 GitHub locations。你也可以：
1. 在 Catalog 页面点击实体，然后点击 "Refresh" 按钮
2. 或者等待自动刷新（通常几分钟）

### Q: 可以批量注册吗？

A: 可以！使用脚本方法可以一次注册多个 repos：
```bash
./register-portals.sh \
  https://github.com/owner/repo1 \
  https://github.com/owner/repo2 \
  https://github.com/owner/repo3
```

## 下一步

注册完成后：
1. ✅ Portal 会出现在 Catalog 中
2. ✅ Portal 会出现在 External Portal 页面
3. ✅ 即使重启 Backstage，portal 也会保留（因为现在使用文件数据库）

