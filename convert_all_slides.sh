#!/bin/bash
echo "🎬 全60スライドのYouTube用画像変換開始..."
echo "📅 開始時刻: $(date)"

cd youtube_images/all_slides

# 進行状況表示関数
show_progress() {
    local current=$1
    local total=$2
    local percent=$((current * 100 / total))
    local progress=$((current * 50 / total))
    local bar=""

    for i in $(seq 1 $progress); do bar="█$bar"; done
    for i in $(seq $((progress + 1)) 50); do bar=" $bar"; done

    printf "\r[$bar] $percent%% ($current/$total)"
}

success_count=0
failed_count=0

for i in $(seq -f "%02g" 1 60); do
    current=$((10#$i))
    show_progress $current 60

    wkhtmltoimage \
        --width 1920 \
        --height 1080 \
        --format png \
        --quality 100 \
        --enable-local-file-access \
        --disable-javascript \
        slide_$i.html \
        slide_$i.png >/dev/null 2>&1

    if [ -f "slide_$i.png" ]; then
        ((success_count++))
        rm slide_$i.html  # HTMLファイル削除
    else
        ((failed_count++))
        echo "\n❌ slide_$i.png 作成失敗"
    fi
done

echo ""
echo "🎯 変換完了!"
echo "📅 終了時刻: $(date)"
echo "✅ 成功: $success_count スライド"
[ $failed_count -gt 0 ] && echo "❌ 失敗: $failed_count スライド"

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
