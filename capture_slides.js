const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureAllSlides() {
    // youtube_images ディレクトリが存在することを確認
    const outputDir = './youtube_images';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 1920x1080 のビューポートを設定
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
    });

    // HTMLファイルを読み込み
    const htmlPath = path.resolve('./Ch01_vol01.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

    // ページが完全に読み込まれるまで待機
    await page.waitForTimeout(3000);

    // スライド数を取得
    const slideCount = await page.evaluate(() => {
        return document.querySelectorAll('.slide').length;
    });

    console.log(`Found ${slideCount} slides. Starting capture...`);

    // 各スライドをキャプチャ
    for (let i = 0; i < slideCount; i++) {
        console.log(`Capturing slide ${i + 1}/${slideCount}...`);

        // スライドを表示
        await page.evaluate((slideIndex) => {
            const slides = document.querySelectorAll('.slide');
            // 全スライドを非表示
            slides.forEach(slide => {
                slide.style.display = 'none';
                slide.classList.remove('active');
            });
            // 指定したスライドを表示
            if (slides[slideIndex]) {
                slides[slideIndex].style.display = 'flex';
                slides[slideIndex].classList.add('active');
            }
        }, i);

        // レンダリング待機
        await page.waitForTimeout(1000);

        // スクリーンショット撮影
        const filename = `${outputDir}/slide_${String(i + 1).padStart(2, '0')}.png`;
        await page.screenshot({
            path: filename,
            fullPage: false,
            clip: {
                x: 0,
                y: 0,
                width: 1920,
                height: 1080
            }
        });

        console.log(`Saved: ${filename}`);
    }

    await browser.close();
    console.log(`\n✅ All ${slideCount} slides captured successfully!`);
    console.log(`📁 Images saved in: ${outputDir}/`);
}

// エラーハンドリング付きで実行
captureAllSlides().catch(console.error);