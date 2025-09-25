const fs = require('fs');

// 元HTMLファイルを読み込み
const htmlContent = fs.readFileSync('./Ch01_vol01.html', 'utf8');

// HTMLからhead部分（スタイル）を抽出
function extractHeadSection() {
    const headMatch = htmlContent.match(/<head[\s\S]*?<\/head>/i);
    return headMatch ? headMatch[0] : '';
}

// 個別スライドのコンテンツを抽出
function extractSlideContents() {
    const slidePattern = /<div class="slide[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
    const slides = [];
    let match;

    while ((match = slidePattern.exec(htmlContent)) !== null) {
        // スライドのclass属性も取得
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

    return slides;
}

// YouTube用最適化HTMLテンプレート作成
function createYouTubeSlideHTML(slideData, slideIndex) {
    const headSection = extractHeadSection();

    // JavaScriptを除去し、特定スライドのみ表示するCSSを追加
    const modifiedHead = headSection
        .replace(/<script[\s\S]*?<\/script>/gi, '') // JavaScript除去
        .replace('</head>', `
        <style>
        /* YouTube用最適化 - 特定スライドのみ表示 */
        .slide { display: none !important; }
        .slide.youtube-active { display: flex !important; }

        /* 16:9最適化 */
        .aspect-container {
            width: 1920px !important;
            height: 1080px !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            position: relative !important;
        }

        .slide-deck {
            width: 1920px !important;
            height: 1080px !important;
        }

        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 1920px !important;
            height: 1080px !important;
            overflow: hidden !important;
        }

        .container {
            margin: 0 !important;
            padding: 0 !important;
        }
        </style>
        </head>`);

    // スライドコンテンツにyoutube-activeクラスを追加
    const activeSlideContent = slideData.attributes.replace(
        'class="slide',
        'class="slide youtube-active'
    ) + slideData.content + '</div>';

    return `<!DOCTYPE html>
<html lang="ja">
${modifiedHead}
<body class="bg-gray-100">
    <div class="container mx-auto p-4">
        <div class="aspect-container">
            <div id="slide-deck" class="slide-deck">
                ${activeSlideContent}
            </div>
        </div>
    </div>
</body>
</html>`;
}

// メイン処理
function createYouTubeSlides() {
    console.log('🎬 YouTube用スライド作成開始...');

    const slides = extractSlideContents();
    console.log(`📄 検出されたスライド数: ${slides.length}`);

    // 出力ディレクトリ作成
    const outputDir = './youtube_images/redesigned';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // まず最初の3つをテスト用に作成
    const testCount = Math.min(3, slides.length);
    console.log(`📝 テスト用に最初の${testCount}スライドを作成中...`);

    for (let i = 0; i < testCount; i++) {
        const slideHTML = createYouTubeSlideHTML(slides[i], i);
        const filename = `${outputDir}/slide_${String(i + 1).padStart(2, '0')}.html`;
        fs.writeFileSync(filename, slideHTML);
        console.log(`✅ 作成完了: ${filename}`);
    }

    return { totalSlides: slides.length, testSlides: testCount };
}

// 実行
const result = createYouTubeSlides();

// テスト用変換スクリプト作成
const convertScript = `#!/bin/bash
echo "🎬 YouTube用スライド変換テスト開始..."

cd youtube_images/redesigned

for i in 01 02 03; do
    echo "📸 スライド \$i を変換中..."
    wkhtmltoimage \\
        --width 1920 \\
        --height 1080 \\
        --format png \\
        --quality 100 \\
        --enable-local-file-access \\
        --disable-javascript \\
        --disable-smart-width \\
        slide_\$i.html \\
        slide_\$i.png

    if [ -f "slide_\$i.png" ]; then
        echo "✅ slide_\$i.png 作成完了"
        file slide_\$i.png | grep "1920 x 1080" && echo "   📏 サイズ確認OK" || echo "   ⚠️  サイズ要確認"
    else
        echo "❌ slide_\$i.png 作成失敗"
    fi
done

echo ""
echo "🔍 結果比較:"
md5sum slide_*.png 2>/dev/null || echo "PNG無し"

echo ""
echo "📊 作成されたファイル:"
ls -la slide_* 2>/dev/null || echo "ファイル無し"
`;

fs.writeFileSync('./test_youtube_convert.sh', convertScript);
fs.chmodSync('./test_youtube_convert.sh', '755');

console.log(`\n🎯 YouTube用最適化完了!`);
console.log(`📊 総スライド数: ${result.totalSlides}`);
console.log(`🧪 テスト作成: ${result.testSlides}スライド`);
console.log(`📄 実行コマンド: ./test_youtube_convert.sh`);