import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: NextRequest) {
    try {
        const fontData = await fetch(
            new URL('../../public/NotoSerifCJKsc-Regular.ttf', import.meta.url),
        ).then((res) => res.arrayBuffer());

        const { searchParams } = new URL(request.url);

        const originalTitle = searchParams.get('title');

        let title = originalTitle;

        if (!title) {
            title = '机会总是垂青于有准备的人！';
        } else {
            title = title.slice(0, 100);
        }

        return new ImageResponse(
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
                        backgroundImage: `url('https://og.eallion.com/featured.png')`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%'
                    }}
                >
                        <div
                            style={{
                                display: 'flex',
                                fontSize: 64,
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
                                color: '#a3a3a3',
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
                                    src="https://avatars.githubusercontent.com/u/1698841?s=32&v=4"
                                    style={{
                                        borderRadius: '50%',
                                        marginTop: 12,
                                    }}
                                />
                                </div>
                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: 32,
                                    color: '#a3a3a3',
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
                        name: 'Noto Serif',
                        data: fontData,
                        style: 'normal',
                    },
                ],
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}