const fs = require('fs');

// HTMLファイルを読み込み
const htmlContent = fs.readFileSync('./Ch01_vol01.html', 'utf8');

function testFirst3SlidesFixed() {
    console.log('Creating fixed test slides...');

    const testDir = './youtube_images/test_fixed';
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }

    for (let i = 0; i < 3; i++) {
        let modifiedHtml = htmlContent;

        // JavaScriptを完全に削除
        modifiedHtml = modifiedHtml.replace(
            /<script[\s\S]*?<\/script>/gi,
            ''
        );

        // 全スライドを非表示にし、指定したスライドのみ表示するCSSを追加
        const slideDisplayCSS = `
        <style>
        /* Force hide all slides first */
        .slide { display: none !important; }

        /* Show only the ${i + 1}th slide */
        .slide:nth-child(${i + 1}) {
            display: flex !important;
            visibility: visible !important;
        }
        </style>`;

        // </head>の直前にCSSを挿入
        modifiedHtml = modifiedHtml.replace('</head>', slideDisplayCSS + '\n</head>');

        // ファイル保存
        const filename = `${testDir}/slide_${String(i + 1).padStart(2, '0')}.html`;
        fs.writeFileSync(filename, modifiedHtml);
        console.log(`Fixed: ${filename}`);
    }

    return 3;
}

// 実行
testFirst3SlidesFixed();

// 修正版テストスクリプト
const testShellScript = `#!/bin/bash
echo "Testing fixed conversion of first 3 slides..."

cd youtube_images/test_fixed

for i in 01 02 03; do
    echo "Converting fixed slide \$i..."
    wkhtmltoimage \\
        --width 1920 \\
        --height 1080 \\
        --format png \\
        --quality 100 \\
        --enable-local-file-access \\
        --disable-javascript \\
        slide_\$i.html \\
        slide_\$i.png

    if [ -f "slide_\$i.png" ]; then
        echo "✅ slide_\$i.png created"
    else
        echo "❌ Failed to create slide_\$i.png"
    fi
done

echo ""
echo "📊 Checksum comparison:"
md5sum slide_*.png

echo ""
echo "📄 Files created:"
ls -la slide_*.png
`;

fs.writeFileSync('./test_fixed_convert.sh', testShellScript);
fs.chmodSync('./test_fixed_convert.sh', '755');

console.log('\n✅ Fixed test files created!');
console.log('📄 Run: ./test_fixed_convert.sh to test fixed conversion');