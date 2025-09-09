const fs = require('fs');
const path = require('path');

// 读取图片文件并转换为 base64 (使用正确的文件扩展名)
const imagePath = path.resolve('./src/featured.png');
const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

// 生成 JavaScript 模块文件
const outputContent = `// 自动生成的背景图片 base64 数据
export const backgroundBase64 = 'data:image/png;base64,${imageBase64}';
`;

// 写入文件到新的 app 目录位置
const outputPath = path.resolve('./app/bg-base64.ts');
fs.writeFileSync(outputPath, outputContent);

console.log(`Background image base64 data generated and saved to ${outputPath}`);