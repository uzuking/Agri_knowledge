const fs = require('fs');

// HTMLファイルを読み込み
const htmlContent = fs.readFileSync('./Ch01_vol01.html', 'utf8');

function testFirst3Slides() {
    console.log('Testing first 3 slides...');

    // youtube_images/test ディレクトリを作成
    const testDir = './youtube_images/test';
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }

    // 最初の3枚だけ作成
    for (let i = 0; i < 3; i++) {
        let modifiedHtml = htmlContent;

        // 最初のスライドの"active"クラスを削除
        modifiedHtml = modifiedHtml.replace(
            /<div class="slide active"/g,
            '<div class="slide"'
        );

        // 指定したインデックスのスライドに"active"クラスを追加
        let slideIndex = 0;
        modifiedHtml = modifiedHtml.replace(
            /<div class="slide([^"]*)"([^>]*)>/g,
            (match, existingClass, attributes) => {
                if (slideIndex === i) {
                    slideIndex++;
                    return `<div class="slide${existingClass} active"${attributes}>`;
                } else {
                    slideIndex++;
                    return match;
                }
            }
        );

        // 個別HTMLファイルとして保存
        const filename = `${testDir}/slide_${String(i + 1).padStart(2, '0')}.html`;
        fs.writeFileSync(filename, modifiedHtml);
        console.log(`Created: ${filename}`);
    }

    return 3;
}

// 実行
testFirst3Slides();

// テスト用変換スクリプト
const testShellScript = `#!/bin/bash
echo "Testing conversion of first 3 slides..."

cd youtube_images/test

for i in 01 02 03; do
    echo "Converting slide \$i..."
    wkhtmltoimage \\
        --width 1920 \\
        --height 1080 \\
        --format png \\
        --quality 100 \\
        --enable-local-file-access \\
        --javascript-delay 2000 \\
        slide_\$i.html \\
        slide_\$i.png

    if [ -f "slide_\$i.png" ]; then
        echo "✅ slide_\$i.png created successfully"
        file slide_\$i.png
    else
        echo "❌ Failed to create slide_\$i.png"
    fi
done

echo ""
echo "📊 Test Results:"
ls -la slide_*.png 2>/dev/null || echo "No PNG files created"
`;

fs.writeFileSync('./test_convert.sh', testShellScript);
fs.chmodSync('./test_convert.sh', '755');

console.log('\n✅ Test files created!');
console.log('📄 Run: ./test_convert.sh to test conversion');