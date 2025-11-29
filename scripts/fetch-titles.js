const fs = require('fs');
const path = require('path');
const https = require('https');

// 加载环境变量
function loadEnv() {
  // 首先尝试从 .env.local 加载
  if (fs.existsSync('.env.local')) {
    require('dotenv').config({ path: '.env.local' });
    console.log('Loaded environment variables from .env.local');
    return;
  }
  
  // 然后尝试从 .env 加载
  if (fs.existsSync('.env')) {
    require('dotenv').config({ path: '.env' });
    console.log('Loaded environment variables from .env');
    return;
  }
  
  // 如果都没有，dotenv 会自动从环境变量中加载
  require('dotenv').config();
  console.log('Using existing environment variables');
}

// 加载环境变量
loadEnv();

// 获取环境变量中的 token 和 url
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const DIRECTUS_URL = (process.env.DIRECTUS_URL || '').replace(/\/$/, '');

// 输出文件路径
const TITLES_OUTPUT_PATH = path.join(__dirname, '../src/titles.json');

/**
 * 通用获取标题函数
 * @param {string} collection - 集合名称 (Article 或 Page)
 */
async function fetchTitlesFromCollection(collection) {
  // 检查 token 是否存在
  if (!DIRECTUS_TOKEN) {
    return Promise.reject(new Error('DIRECTUS_TOKEN is not set. Please check your .env.local file or environment variables.'));
  }
  
  let allTitles = [];
  let offset = 0;
  const limit = 100; // 每页获取 100 条数据
  let hasMore = true;
  
  const baseUrl = `${DIRECTUS_URL}/items/${collection}?fields=title`;

  console.log(`Starting to fetch titles from collection: ${collection}`);

  while (hasMore) {
    const apiUrl = `${baseUrl}&limit=${limit}&offset=${offset}`;
    console.log(`Fetching data from: ${apiUrl}`);
    // console.log(`Using token: ${DIRECTUS_TOKEN.substring(0, 10)}...`); // 只显示前 10 个字符以保护隐私
    
    try {
      const titles = await fetchPageTitles(apiUrl);
      allTitles = allTitles.concat(titles);
      
      // 如果返回的数据少于 limit，说明已经到最后一页
      if (titles.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
      
      console.log(`Fetched ${titles.length} items from ${collection} in this page. Total for ${collection}: ${allTitles.length}`);
    } catch (error) {
      console.error(`Error fetching data from ${collection} at offset ${offset}:`, error);
      throw error;
    }
  }
  
  return allTitles;
}

/**
 * 获取单页文章标题数据
 */
function fetchPageTitles(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
        'Accept-Charset': 'utf-8'
      }
    };

    https.get(url, options, (res) => {
      // console.log(`API Status Code: ${res.statusCode}`);
      
      // 确保响应使用 UTF-8 编码
      res.setEncoding('utf8');
      
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          
          // 检查是否有错误
          if (jsonData.errors) {
            reject(new Error(`API Error: ${JSON.stringify(jsonData.errors)}`));
            return;
          }
          
          // 处理不同的响应结构
          let items = [];
          if (jsonData.data && Array.isArray(jsonData.data)) {
            // 标准 Directus 响应格式
            items = jsonData.data;
          } else if (Array.isArray(jsonData)) {
            // 直接返回数组的格式
            items = jsonData;
          } else {
            // 某些情况下可能返回空或者其他结构，视为空数组处理或报错
             console.warn(`Unexpected API response structure keys: ${JSON.stringify(Object.keys(jsonData))}`);
             items = [];
          }
          
          resolve(items);
        } catch (error) {
          console.error('Response data:', data);
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log(`Using Directus URL: ${DIRECTUS_URL}`);

    // 并行获取 Article 和 Page 的标题
    const [articleTitles, pageTitles] = await Promise.all([
      fetchTitlesFromCollection('Article'),
      fetchTitlesFromCollection('Page')
    ]);

    console.log(`Fetched ${articleTitles.length} articles.`);
    console.log(`Fetched ${pageTitles.length} pages.`);

    // 合并结果
    const allFetchedTitles = articleTitles.concat(pageTitles);
    
    // 定义需要额外添加的 4 个特定 title
    const additionalTitles = [
      { title: '机会总是垂青于有准备的人！' },
      { title: '大大的小蜗牛' },
      { title: '@eallion' },
      { title: '默认标题' },
      { title: 'CharlesChin' }
    ];
    
    // 将额外的 title 添加到文章数组中
    const combinedArticles = allFetchedTitles.concat(additionalTitles);
    
    // 保存到文件，明确指定 UTF-8 编码
    const outputData = {
      fetchedAt: new Date().toISOString(),
      count: combinedArticles.length,
      articles: combinedArticles
    };
    
    fs.writeFileSync(TITLES_OUTPUT_PATH, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`成功保存 ${combinedArticles.length} 个标题 (Articles: ${articleTitles.length}, Pages: ${pageTitles.length}, Additional: ${additionalTitles.length}) 到 ${TITLES_OUTPUT_PATH}`);
  } catch (error) {
    console.error('处理过程中出现错误：', error);
    process.exit(1);
  }
}

// 执行主函数
main();