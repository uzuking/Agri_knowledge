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

    const modifiedHead = headSection
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace('</head>', `
        <style>
        /* YouTube用最適化 */
        .slide { display: none !important; }
        .slide.youtube-active { display: flex !important; }

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

// 全スライド作成
function createAllYouTubeSlides() {
    console.log('🎬 全60スライドのYouTube用最適化開始...');

    const slides = extractSlideContents();
    console.log(`📄 総スライド数: ${slides.length}`);

    const outputDir = './youtube_images/all_slides';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 全スライドを作成
    for (let i = 0; i < slides.length; i++) {
        const slideHTML = createYouTubeSlideHTML(slides[i], i);
        const filename = `${outputDir}/slide_${String(i + 1).padStart(2, '0')}.html`;
        fs.writeFileSync(filename, slideHTML);

        if ((i + 1) % 10 === 0 || i === slides.length - 1) {
            console.log(`✅ ${i + 1}/${slides.length} スライド作成完了`);
        }
    }

    return slides.length;
}

// 全スライド変換スクリプト作成
function createConversionScript(totalSlides) {
    const script = `#!/bin/bash
echo "🎬 全${totalSlides}スライドのYouTube用画像変換開始..."
echo "📅 開始時刻: $(date)"

cd youtube_images/all_slides

# 進行状況表示関数
show_progress() {
    local current=\$1
    local total=\$2
    local percent=\$((current * 100 / total))
    local progress=\$((current * 50 / total))
    local bar=""

    for i in \$(seq 1 \$progress); do bar="█\$bar"; done
    for i in \$(seq \$((progress + 1)) 50); do bar=" \$bar"; done

    printf "\\r[\$bar] \$percent%% (\$current/\$total)"
}

success_count=0
failed_count=0

for i in \$(seq -f "%02g" 1 ${totalSlides}); do
    current=\$((10#\$i))
    show_progress \$current ${totalSlides}

    wkhtmltoimage \\
        --width 1920 \\
        --height 1080 \\
        --format png \\
        --quality 100 \\
        --enable-local-file-access \\
        --disable-javascript \\
        slide_\$i.html \\
        slide_\$i.png >/dev/null 2>&1

    if [ -f "slide_\$i.png" ]; then
        ((success_count++))
        rm slide_\$i.html  # HTMLファイル削除
    else
        ((failed_count++))
        echo "\\n❌ slide_\$i.png 作成失敗"
    fi
done

echo ""
echo "🎯 変換完了!"
echo "📅 終了時刻: $(date)"
echo "✅ 成功: \$success_count スライド"
[ \$failed_count -gt 0 ] && echo "❌ 失敗: \$failed_count スライド"

echo ""
echo "📊 作成された画像:"
ls -la slide_*.png | head -5
echo "..."
ls -la slide_*.png | tail -5

echo ""
echo "💾 総容量:"
du -h slide_*.png | tail -1

echo ""
echo "🎬 YouTube動画制作用画像セット完成!"
echo "📁 保存場所: youtube_images/all_slides/"
`;

    fs.writeFileSync('./convert_all_slides.sh', script);
    fs.chmodSync('./convert_all_slides.sh', '755');
}

// 実行
const totalSlides = createAllYouTubeSlides();
createConversionScript(totalSlides);

console.log(`\n🎯 全${totalSlides}スライドの準備完了!`);
console.log('📄 実行コマンド: ./convert_all_slides.sh');
console.log('⏱️  予想時間: 約5-10分');
console.log('💾 予想容量: 約500MB');