const fs = require('fs');

// HTMLファイルを読み込み
const htmlContent = fs.readFileSync('./Ch01_vol01.html', 'utf8');

// 各スライドを個別のHTMLファイルに分割
function extractSlides() {
    // スライド数を計算
    const slideMatches = htmlContent.match(/<div class="slide[^>]*>/g);
    const slideCount = slideMatches ? slideMatches.length : 0;

    console.log(`Found ${slideCount} slides`);

    // youtube_images ディレクトリを作成
    if (!fs.existsSync('./youtube_images')) {
        fs.mkdirSync('./youtube_images');
    }

    for (let i = 0; i < slideCount; i++) {
        // HTMLのslideのCSSを修正して、指定したスライドのみ表示
        const modifiedHtml = htmlContent.replace(
            /\.slide\s*{[^}]*}/g,
            `.slide { display: none !important; }`
        ).replace(
            /\.slide:nth-child\(\d+\)\s*{[^}]*}/g,
            ''
        ).replace(
            '</style>',
            `.slide:nth-child(${i + 1}) { display: flex !important; }\n</style>`
        );

        // 個別HTMLファイルとして保存
        const filename = `./youtube_images/slide_${String(i + 1).padStart(2, '0')}.html`;
        fs.writeFileSync(filename, modifiedHtml);
        console.log(`Created: ${filename}`);
    }

    return slideCount;
}

// 実行
const slideCount = extractSlides();

// 変換用のシェルスクリプトも作成
const shellScript = `#!/bin/bash
echo "Converting ${slideCount} slides to PNG images..."

for i in $(seq -f "%02g" 1 ${slideCount}); do
    echo "Converting slide \$i..."
    wkhtmltoimage --width 1920 --height 1080 --format png \\
        --quality 100 --enable-local-file-access \\
        ./youtube_images/slide_\$i.html \\
        ./youtube_images/slide_\$i.png

    # HTMLファイルを削除（不要になったため）
    rm ./youtube_images/slide_\$i.html
done

echo "✅ All slides converted successfully!"
echo "📁 Images saved in: ./youtube_images/"
`;

fs.writeFileSync('./convert_slides.sh', shellScript);
fs.chmodSync('./convert_slides.sh', '755');

console.log(`\n✅ Created ${slideCount} HTML files`);
console.log(`📄 Run: ./convert_slides.sh to convert all slides to PNG`);