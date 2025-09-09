import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// 修改导入路径以使用新的 app 目录中的文件
import { backgroundBase64 } from '../../app/bg-base64';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: NextRequest) {
    try {
        // 从 public 目录读取精简后的字体文件
        const fontData = await fetch(new URL('../../public/SmileySans-Oblique.min.ttf', import.meta.url)).then((res) => res.arrayBuffer());

        // 使用预先生成的 base64 数据
        const backgroundImage = backgroundBase64;

        const { searchParams } = new URL(request.url);

        const originalTitle = searchParams.get('title');

        let title = originalTitle;

        if (!title) {
            title = '机会总是垂青于有准备的人！';
        } else {
            title = title.slice(0, 100);
        }

        // 根据标题长度动态调整字体大小（按英文字符计算，中文字算 2 个字符）
        let fontSize = 96;
        // 计算标题的英文字符长度，中文字算 2 个字符
        const titleLength = title.split('').reduce((count, char) => {
            // 判断是否为中文字符
            if (/[\u4e00-\u9fa5]/.test(char)) {
                return count + 2;  // 中文字算 2 个字符
            } else {
                return count + 1;  // 英文字符算 1 个字符
            }
        }, 0);
        
        if (titleLength <= 24) {
            fontSize = 96;  // 短标题使用较大字体（相当于12个中文字或24个英文字符）
        } else if (titleLength > 36) {
            fontSize = 56;  // 长标题使用较小字体（相当于 18 个中文字或 36 个英文字符）
        } else {
            fontSize = 72;  // 中等长度标题使用中等字体
        }
        // 11-20 个字符的标题使用默认字体大小 64

        const imageResponse = new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        flexWrap: 'nowrap',
                        backgroundImage: `url('https://og.eallion.com/featured.jpg')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%'
                    }}
                >
                        <div
                            style={{
                                display: 'flex',
                                fontSize: fontSize,
                                fontStyle: 'normal',
                                color: 'white',
                                marginTop: 30,
                                lineHeight: 1.8,
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            <b>《{title}》</b>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                fontSize: 56,
                                fontStyle: 'normal',
                                color: '#ddd',
                                marginTop: 0,
                                lineHeight: 1.8,
                            }}
                        >
                            <b>大大的小蜗牛</b>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center', 
                                }}
                            >
                                <img
                                    alt="eallion"
                                    height={32}
                                    width={32}
                                    src="https://og.eallion.com/eallion.png"
                                    style={{
                                        borderRadius: '50%',
                                        marginTop: 0,
                                    }}
                                />
                                </div>
                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: 32,
                                    color: '#ccc',
                                    marginLeft: 10,
                                    flexGrow: 1,
                                    alignItems: 'center',
                                }}
                            >@eallion</div>
                            </div>
                        </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'SmileySans',
                        data: fontData,
                        style: 'normal',
                    },
                ],
            },
        );

        // 添加缓存控制头部
        const headers = new Headers(imageResponse.headers);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // 1 年缓存
        headers.set('Content-Type', 'image/png');

        return new Response(imageResponse.body, {
            status: 200,
            headers,
        });
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}