#!/bin/bash
echo "Testing conversion of first 3 slides..."

cd youtube_images/test

for i in 01 02 03; do
    echo "Converting slide $i..."
    wkhtmltoimage \
        --width 1920 \
        --height 1080 \
        --format png \
        --quality 100 \
        --enable-local-file-access \
        --javascript-delay 2000 \
        slide_$i.html \
        slide_$i.png

    if [ -f "slide_$i.png" ]; then
        echo "✅ slide_$i.png created successfully"
        file slide_$i.png
    else
        echo "❌ Failed to create slide_$i.png"
    fi
done

echo ""
echo "📊 Test Results:"
ls -la slide_*.png 2>/dev/null || echo "No PNG files created"
