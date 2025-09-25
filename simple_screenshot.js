// シンプルなPlaywright自動スクリーンショット
const { chromium } = require('playwright');

async function captureSlides() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // 1920x1080に設定
    await page.setViewportSize({ width: 1920, height: 1080 });

    // HTMLファイルを開く
    const htmlPath = require('path').resolve('./Ch01_vol01.html');
    await page.goto(`file://${htmlPath}`);

    // 3秒待機
    await page.waitForTimeout(3000);

    // 最初の3スライドをキャプチャ
    for (let i = 0; i < 3; i++) {
        console.log(`📸 スライド ${i + 1} をキャプチャ中...`);

        // 矢印キーでスライド移動
        if (i > 0) {
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(1000);
        }

        // スクリーンショット
        await page.screenshot({
            path: `youtube_images/simple/slide_${String(i + 1).padStart(2, '0')}.png`,
            fullPage: false,
        });

        console.log(`✅ slide_${String(i + 1).padStart(2, '0')}.png 完了`);
    }

    await browser.close();
    console.log('\n🎉 シンプル方法完了！');
}

captureSlides().catch(console.error);