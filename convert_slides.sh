#!/bin/bash
echo "Converting 60 slides to PNG images..."

for i in $(seq -f "%02g" 1 60); do
    echo "Converting slide $i..."
    wkhtmltoimage --width 1920 --height 1080 --format png \
        --quality 100 --enable-local-file-access \
        ./youtube_images/slide_$i.html \
        ./youtube_images/slide_$i.png

    # HTMLファイルを削除（不要になったため）
    rm ./youtube_images/slide_$i.html
done

echo "✅ All slides converted successfully!"
echo "📁 Images saved in: ./youtube_images/"
