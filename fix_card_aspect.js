const fs = require('fs');

// 元HTMLファイルを読み込み
const htmlContent = fs.readFileSync('./Ch01_vol01.html', 'utf8');

function createFixedAspectSlides() {
    console.log('🔧 カード部分を正確に16:9に調整したスライド作成中...');

    // スライドコンテンツを抽出
    const slidePattern = /<div class="slide[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
    const slides = [];
    let match;

    while ((match = slidePattern.exec(htmlContent)) !== null) {
        const fullSlideMatch = htmlContent.match(new RegExp(
            `<div class="slide[^"]*"[^>]*>` +
            match[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            `<\/div>`
        ));

        if (fullSlideMatch) {
            slides.push({
                fullTag: fullSlideMatch[0],
                content: match[1],
                attributes: fullSlideMatch[0].match(/<div[^>]*>/)[0]
            });
        }
    }

    const outputDir = './youtube_images/fixed_aspect';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 最初の3つをテスト作成
    for (let i = 0; i < Math.min(3, slides.length); i++) {
        const slideHTML = createPerfectAspectHTML(slides[i], i);
        const filename = `${outputDir}/slide_${String(i + 1).padStart(2, '0')}.html`;
        fs.writeFileSync(filename, slideHTML);
        console.log(`✅ 修正版作成: ${filename}`);
    }

    return slides.length;
}

function createPerfectAspectHTML(slideData, slideIndex) {
    // 元のheadからスタイルを取得（ScriptとTailwindを除去）
    const headMatch = htmlContent.match(/<head[\s\S]*?<\/head>/i);
    let headContent = headMatch ? headMatch[0] : '';

    // JavaScriptとTailwind CDNを削除
    headContent = headContent
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<script[^>]*src[^>]*tailwindcss[^>]*><\/script>/gi, '');

    // スライドにyoutube-activeクラスを追加
    const activeSlideContent = slideData.attributes.replace(
        'class="slide',
        'class="slide youtube-active'
    ) + slideData.content + '</div>';

    return `<!DOCTYPE html>
<html lang="ja">
${headContent.replace('</head>', `
<script src="https://cdn.tailwindcss.com"></script>
<style>
/* YouTube用完璧16:9最適化 */
body {
    margin: 0 !important;
    padding: 0 !important;
    width: 1920px !important;
    height: 1080px !important;
    overflow: hidden !important;
    background-color: #f0f4f8 !important;
}

.container {
    margin: 0 !important;
    padding: 0 !important;
    width: 1920px !important;
    height: 1080px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* カード部分を画面いっぱいの16:9に調整 */
.aspect-container {
    position: relative !important;
    width: 1920px !important;
    height: 1080px !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    overflow: hidden !important;
}

.slide-deck {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 1920px !important;
    height: 1080px !important;
}

/* スライドの表示制御 */
.slide {
    display: none !important;
}

.slide.youtube-active {
    display: flex !important;
    width: 100% !important;
    height: 100% !important;
    padding: 60px !important;
    box-sizing: border-box !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: flex-start !important;
    text-align: left !important;
}

/* フォントサイズ調整（16:9最適化） */
.slide h1, .slide .big-number {
    font-size: clamp(3rem, 6vw, 8rem) !important;
}

.slide .message {
    font-size: clamp(2rem, 4vw, 4rem) !important;
}

.slide .sub-message {
    font-size: clamp(1.5rem, 3vw, 3rem) !important;
}

.layout-icon-keyword .icon {
    width: clamp(80px, 8vw, 120px) !important;
    height: clamp(80px, 8vw, 120px) !important;
}

.layout-big-number .big-number {
    font-size: clamp(8rem, 20vw, 20rem) !important;
}
</style>
</head>`)}
<body>
    <div class="container">
        <div class="aspect-container">
            <div id="slide-deck" class="slide-deck">
                ${activeSlideContent}
            </div>
        </div>
    </div>
</body>
</html>`;
}

// 実行
const totalSlides = createFixedAspectSlides();

console.log(`\n✅ 修正版作成完了! (テスト: 3枚)`);
console.log('📄 テスト変換: cd youtube_images/fixed_aspect && wkhtmltoimage --width 1920 --height 1080 --format png --disable-javascript slide_01.html slide_01.png');