# Catalog 实体持久化问题解决方案

## 问题描述

通过 "Create a portal" 模板创建的 repo，一开始会显示在 catalog 中，但后来就找不到了，即使 repo 还存在。

## 问题原因

1. **数据库使用内存存储**：配置中使用 `connection: ':memory:'`，所有数据存储在内存中
2. **Location 实体丢失**：当模板执行 `catalog:register` action 时，会在数据库中创建一个 Location 实体指向 GitHub repo 中的 `catalog-info.yaml`
3. **重启后数据丢失**：由于使用内存数据库，当 Backstage 重启时，所有数据（包括 Location 实体）都会丢失

## 解决方案

已将数据库配置从内存存储改为文件存储：

**修改前：**
```yaml
database:
  client: better-sqlite3
  connection: ':memory:'
```

**修改后：**
```yaml
database:
  client: better-sqlite3
  connection: './backstage.db'
```

## 效果

- ✅ Location 实体会持久化到 `backstage.db` 文件中
- ✅ 重启 Backstage 后，之前注册的 portal 实体仍然存在
- ✅ Catalog 会定期刷新 GitHub locations，保持实体同步

## 注意事项

1. **数据库文件位置**：数据库文件 `backstage.db` 会创建在 Backstage 后端的工作目录中
2. **首次启动**：如果之前使用内存数据库，需要重新注册 portal（因为之前的 Location 已丢失）
3. **备份建议**：定期备份 `backstage.db` 文件，特别是在生产环境中
4. **Git 忽略**：`.gitignore` 已配置忽略 `*.db` 文件，避免将数据库文件提交到代码仓库

## 如何重新注册已存在的 Portal

如果之前创建的 portal 已经丢失，可以通过以下方式重新注册：

1. **通过 API 注册**：
   ```bash
   curl -X POST http://localhost:7008/api/catalog/locations \
     -H "Content-Type: application/json" \
     -d '{
       "type": "url",
       "target": "https://github.com/<owner>/<repo>/blob/main/catalog-info.yaml"
     }'
   ```

2. **通过 Catalog Import 页面**：
   - 访问 `/catalog-import`
   - 输入 GitHub repo URL
   - 选择 `catalog-info.yaml` 文件路径

3. **添加到配置文件**（不推荐，因为需要手动维护）：
   ```yaml
   catalog:
     locations:
       - type: url
         target: https://github.com/<owner>/<repo>/blob/main/catalog-info.yaml
   ```

## 生产环境建议

在生产环境中，建议使用 PostgreSQL 等更强大的数据库：

```yaml
database:
  client: pg
  connection:
    host: ${POSTGRES_HOST}
    port: ${POSTGRES_PORT}
    user: ${POSTGRES_USER}
    password: ${POSTGRES_PASSWORD}
    database: ${POSTGRES_DATABASE}
```

