const Fontmin = require('fontmin');
const fs = require('fs');
const path = require('path');

// 字体文件路径
const FONT_SOURCE_PATH = path.join(__dirname, '../src/SmileySans-Oblique.ttf');
const FONT_OUTPUT_DIR = path.join(__dirname, '../public');
const FONT_OUTPUT_NAME = 'SmileySans-Oblique.min.ttf';
const TITLES_INPUT_PATH = path.join(__dirname, '../src/titles.json');

// 是否使用测试模式（当 titles.json 不可用时）
const USE_TEST_MODE = process.env.USE_TEST_MODE === 'true' || !fs.existsSync(TITLES_INPUT_PATH);

/**
 * 从 titles.json 读取文章标题数据
 */
async function loadArticleTitles() {
  return new Promise((resolve, reject) => {
    fs.readFile(TITLES_INPUT_PATH, 'utf8', (err, data) => {
      if (err) {
        reject(new Error(`无法读取文件 ${TITLES_INPUT_PATH}: ${err.message}`));
        return;
      }
      
      try {
        const jsonData = JSON.parse(data);
        const titles = jsonData.articles.map(item => item.title || '').join('');
        resolve(titles);
      } catch (parseError) {
        reject(new Error(`解析 JSON 文件失败：${parseError.message}`));
      }
    });
  });
}

/**
 * 使用 fontmin 精简字体文件
 * @param {string} text 需要保留字符的文本
 */
function minifyFont(text) {
  return new Promise((resolve, reject) => {
    const fontmin = new Fontmin()
      .src(FONT_SOURCE_PATH)
      .use(Fontmin.glyph({
        text: text
      }))
      // 注意：我们不使用任何格式转换插件，因为源文件已经是 TTF 格式
      .dest(FONT_OUTPUT_DIR);

    fontmin.run((err, files) => {
      if (err) {
        reject(err);
      } else {
        // 清理不需要的文件，只保留最终的 TTF 文件
        const outputPath = path.join(FONT_OUTPUT_DIR, 'SmileySans-Oblique.ttf');
        const finalPath = path.join(FONT_OUTPUT_DIR, FONT_OUTPUT_NAME);
        
        // 重命名输出文件为最终文件名
        if (fs.existsSync(outputPath)) {
          // 如果最终文件已存在，先删除它
          if (fs.existsSync(finalPath)) {
            fs.unlinkSync(finalPath);
          }
          fs.renameSync(outputPath, finalPath);
        }
        
        resolve(files);
      }
    });
  });
}

/**
 * 主函数
 */
async function main() {
  try {
    let titles = '';
    
    if (USE_TEST_MODE) {
      console.log('使用测试模式，生成测试数据...');
      // 使用一些常用中文字符作为测试数据
      titles = '机会总是垂青于有准备的人！大大的小蜗牛这是一个测试标题用于字体优化 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    } else {
      console.log('正在从 titles.json 读取文章标题...');
      titles = await loadArticleTitles();
    }
    
    // 去重字符
    const uniqueChars = [...new Set(titles)].join('');
    console.log(`读取到 ${titles.length} 个字符的标题数据`);
    console.log(`去重后共有 ${uniqueChars.length} 个唯一字符`);
    console.log(`字符内容：${uniqueChars}`);
    
    console.log('正在精简字体文件...');
    await minifyFont(uniqueChars);
    console.log('字体文件精简完成！');
    
    // 显示文件大小对比
    const originalSize = fs.statSync(FONT_SOURCE_PATH).size;
    const minifiedPath = path.join(FONT_OUTPUT_DIR, FONT_OUTPUT_NAME);
    if (fs.existsSync(minifiedPath)) {
      const minifiedSize = fs.statSync(minifiedPath).size;
      console.log(`原始字体大小：${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`精简后字体大小：${(minifiedSize / 1024).toFixed(2)} KB`);
      console.log(`节省了：${((originalSize - minifiedSize) / 1024).toFixed(2)} KB (${((1 - minifiedSize / originalSize) * 100).toFixed(2)}%)`);
    }
  } catch (error) {
    console.error('处理过程中出现错误：', error);
    process.exit(1);
  }
}

// 执行主函数
main();