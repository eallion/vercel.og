This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Usage

输入`title` 标题即可，其他参数固化了。

> CORS 仅  eallion.com 可引用。

```url
https://api.eallion.com/og?title=
```

## Font Spider 压缩字体文件

- https://github.com/eallion/font-spider-smiley-opengraph

```bash
mkdir font-spider && cd font-spider
# 安装 Font Spider
npm install font-spider -g

# 生成 import.html 模板内容
vim import.html

# 从 Summary.json 文件中提取 Title 放入到 index.html 中
cat summary.json | jq -r '.summaries[] | "<h1>\(.title)</h1>"' | sed -e '/<body>/r /dev/stdin' import.html > index.html

# 生成 Title 用到的字体
font-spider index.html --no-backup --debug
```

`SmileySans.ttf` 字体文件放到当前目录，把生成后的字体复制到本项目 `Public` 中。  
`import.html` 内容：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        @font-face {
            font-family: 'SmileySans';
            src: url('SmileySans.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        h1,
        p {
            font-family: 'SmileySans',sans-serif;
        }
    </style>
</head>
<body>
</body>
</html>
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
