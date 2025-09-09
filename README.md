# Open Graph 图像生成服务

这是一个基于 Next.js 构建的 Open Graph（OG）图像生成服务，用于动态生成带有标题的图片卡片，常用于社交媒体分享时的预览图。

## 使用方法

输入 `title` 标题参数即可，其他参数已固化。

> CORS 限制：仅 eallion.com 可引用。

```url
https://api.eallion.com/og?title=你的标题
```

## 自动字体优化

本项目支持使用 Fontmin 自动优化字体文件，只保留文章标题中实际使用的字符，大大减小字体文件大小。

### 本地开发

1. 在 `.env.local` 文件中设置 Directus API token：

```env
DIRECTUS_TOKEN=your_directus_api_token_here
```

2. 运行开发服务器：

```bash
npm run dev
```

### 生产构建

在生产构建过程中，系统会自动执行以下步骤：

```bash
npm run build
```

该命令会依次执行：

1. 从 Directus API 获取文章标题数据
2. 使用 Fontmin 精简字体文件
3. 生成背景图片的 base64 数据
4. 构建 Next.js 应用

### 手动运行字体优化

您也可以手动运行字体优化脚本：

```bash
npm run fetch-titles  # 从 Directus API 获取文章标题数据
npm run optimize-font # 使用 Fontmin 精简字体文件
```

如果遇到 API 权限问题，可以使用测试模式：

```bash
USE_TEST_MODE=true npm run optimize-font
```

### 环境变量配置

项目支持从多个来源加载环境变量：

- `.env.local`（优先级最高）
- `.env`
- Vercel 环境变量
- Cloudflare 环境变量

## 部署

### Vercel 部署

1. 在 Vercel 项目设置中添加 `DIRECTUS_TOKEN` 环境变量
2. 推送代码到 GitHub，Vercel 会自动部署

### Cloudflare Pages 部署

1. 在 Cloudflare Pages 项目设置中添加 `DIRECTUS_TOKEN` 环境变量
2. 推送代码到 GitHub，Cloudflare Pages 会自动部署
