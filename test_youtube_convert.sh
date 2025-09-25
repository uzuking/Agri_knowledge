#!/bin/bash
echo "🎬 YouTube用スライド変換テスト開始..."

cd youtube_images/redesigned

for i in 01 02 03; do
    echo "📸 スライド $i を変換中..."
    wkhtmltoimage \
        --width 1920 \
        --height 1080 \
        --format png \
        --quality 100 \
        --enable-local-file-access \
        --disable-javascript \
        --disable-smart-width \
        slide_$i.html \
        slide_$i.png

    if [ -f "slide_$i.png" ]; then
        echo "✅ slide_$i.png 作成完了"
        file slide_$i.png | grep "1920 x 1080" && echo "   📏 サイズ確認OK" || echo "   ⚠️  サイズ要確認"
    else
        echo "❌ slide_$i.png 作成失敗"
    fi
done

echo ""
echo "🔍 結果比較:"
md5sum slide_*.png 2>/dev/null || echo "PNG無し"

echo ""
echo "📊 作成されたファイル:"
ls -la slide_* 2>/dev/null || echo "ファイル無し"
