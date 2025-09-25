#!/bin/bash
echo "Testing fixed conversion of first 3 slides..."

cd youtube_images/test_fixed

for i in 01 02 03; do
    echo "Converting fixed slide $i..."
    wkhtmltoimage \
        --width 1920 \
        --height 1080 \
        --format png \
        --quality 100 \
        --enable-local-file-access \
        --disable-javascript \
        slide_$i.html \
        slide_$i.png

    if [ -f "slide_$i.png" ]; then
        echo "✅ slide_$i.png created"
    else
        echo "❌ Failed to create slide_$i.png"
    fi
done

echo ""
echo "📊 Checksum comparison:"
md5sum slide_*.png

echo ""
echo "📄 Files created:"
ls -la slide_*.png
