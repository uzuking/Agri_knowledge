# トマトの光強度と収量の関係グラフ
# ggplot2を使用したオレンジ系の美しい可視化

# 必要なライブラリの読み込み
library(ggplot2)
library(dplyr)
library(scales)

# データの作成
tomato_data <- data.frame(
  light_intensity = c(6.0, 7.1, 7.5, 8.1, 8.8, 9.6, 10.2, 10.8),
  yield = c(7100, 8000, 8800, 9400, 10800, 11200, 11900, 12500)
)

# 収量を t/10a に変換（見やすくするため）
tomato_data$yield_tons <- tomato_data$yield / 1000

# オレンジ系カラーパレットの定義
orange_colors <- c("#ff7518", "#ff5722", "#ff9800", "#ffb74d")

# グラフの作成
p <- ggplot(tomato_data, aes(x = light_intensity, y = yield_tons)) +
  # 背景のグラデーション効果
  theme_minimal() +
  theme(
    plot.background = element_rect(fill = "#fff5f0", color = NA),
    panel.background = element_rect(fill = "#ffffff", color = NA),
    panel.grid.major = element_line(color = "#ffe0cc", size = 0.3, linetype = "dashed"),
    panel.grid.minor = element_line(color = "#fff3e6", size = 0.2, linetype = "dotted"),
    plot.title = element_text(
      size = 27,
      face = "bold",
      color = "#d84315",
      hjust = 0.5,
      margin = margin(b = 20)
    ),
    plot.subtitle = element_text(
      size = 18,
      color = "#ff5722",
      hjust = 0.5,
      margin = margin(b = 30)
    ),
    axis.title = element_text(size = 18, face = "bold", color = "#e64a19"),
    axis.text = element_text(size = 15, color = "#bf360c"),
    axis.line = element_line(color = "#ff7518", size = 1),
    plot.caption = element_text(
      size = 14,
      color = "#666666",
      hjust = 0,
      margin = margin(t = 20)
    ),
    plot.margin = margin(20, 20, 20, 20)
  ) +
  
  # 回帰直線の追加（信頼区間付き）
  geom_smooth(
    method = "lm", 
    se = TRUE,
    color = "#ff5722", 
    fill = "#ffccbc",
    alpha = 0.3,
    size = 1.2,
    linetype = "solid"
  ) +
  
  # データポイントの追加（大きめで目立つように）
  geom_point(
    size = 4, 
    color = "#ffffff",
    fill = "#ff7518",
    shape = 21,
    stroke = 2,
    alpha = 0.9
  ) +
  
  # データラベルの追加
  geom_text(
    aes(label = paste0(yield_tons, "t")),
    vjust = -1.5,
    hjust = 0.5,
    size = 5.25,
    color = "#d84315",
    fontface = "bold"
  ) +
  
  # 軸ラベルとタイトル
  labs(
    title = "🍅 トマト栽培における光強度と収量の関係",
    subtitle = "日射量の増加に伴う収量向上のパターン",
    x = "平均日射量 (MJ/m²/day)",
    y = "収量 (t/10a)",
    caption = "出典: 矢野 喬 (1993). トマトの秋冬どり栽培における群落内光環境と乾物生産に関する研究. \n 四国農業試験場報告, 56, p.1-15. (図-2に基づき作成)"
  ) +
  
  # 軸の範囲とスケールの調整
  scale_x_continuous(
    breaks = seq(6, 11, 1),
    limits = c(5.5, 11.5),
    expand = c(0.02, 0)
  ) +
  scale_y_continuous(
    breaks = seq(7, 13, 1),
    limits = c(6.5, 13.5),
    expand = c(0.02, 0),
    labels = function(x) paste0(x, "t")
  )

# グラフの表示
print(p)

# 統計情報の表示
cat("\n=== データ統計 ===\n")
cat("サンプル数:", nrow(tomato_data), "\n")
cat("日射量範囲:", min(tomato_data$light_intensity), "-", max(tomato_data$light_intensity), "MJ/m²/day\n")
cat("収量範囲:", min(tomato_data$yield_tons), "-", max(tomato_data$yield_tons), "t/10a\n")
cat("収量増加率:", round((max(tomato_data$yield_tons) - min(tomato_data$yield_tons)) / min(tomato_data$yield_tons) * 100, 1), "%\n")

# 相関係数の計算
correlation <- cor(tomato_data$light_intensity, tomato_data$yield_tons)
cat("相関係数:", round(correlation, 3), "\n")

# 線形回帰モデルの作成と表示
model <- lm(yield_tons ~ light_intensity, data = tomato_data)
cat("\n=== 回帰分析結果 ===\n")
print(summary(model))

# 回帰式の表示
intercept <- round(model$coefficients[1], 2)
slope <- round(model$coefficients[2], 2)
cat("\n回帰式: 収量(t/10a) =", slope, "× 日射量 +", intercept, "\n")

# R²値の表示
r_squared <- summary(model)$r.squared
cat("決定係数(R²):", round(r_squared, 3), "\n")

# 日本語フォントの設定（文字化け防止）
# Windowsの場合
if (Sys.info()["sysname"] == "Windows") {
  windowsFonts(japanese = windowsFont("Meiryo"))
  theme_set(theme_minimal(base_family = "japanese"))
} else if (Sys.info()["sysname"] == "Darwin") {  # macOSの場合
  theme_set(theme_minimal(base_family = "HiraginoSans-W3"))
} else {  # Linuxの場合
  # 日本語フォントがインストールされている場合
  theme_set(theme_minimal(base_family = "IPAexGothic"))
}

# フォント設定を適用したグラフの再作成
p_final <- p + theme(
  text = element_text(family = if (Sys.info()["sysname"] == "Windows") "japanese" 
                      else if (Sys.info()["sysname"] == "Darwin") "HiraginoSans-W3"
                      else "IPAexGothic")
)

# グラフをPNGファイルとして保存
ggsave("tomato_yield_analysis.png", 
       plot = p_final, 
       width = 12, 
       height = 8, 
       dpi = 300, 
       bg = "white",
       device = "png")

cat("\nグラフを 'tomato_yield_analysis.png' として保存しました。\n")
cat("ファイルサイズ: 12×8インチ, 300dpi\n")