from reportlab.pdfgen import canvas
import os
import sys

def html_to_pdf(input_html, output_pdf):
    width, height = 1920, 1080  # 16:9
    c = canvas.Canvas(output_pdf, pagesize=(width, height))
    # ここで画像貼付や必要に応じてHTML内容描画
    # 本格的なHTMLレンダリングならば呼び出し元で画像化して貼付推奨
    c.drawString(50, height-100, f"Source: {input_html}")
    c.showPage()
    c.save()

if __name__ == "__main__":
    input_html = sys.argv[1]
    output_pdf = sys.argv[2]
    html_to_pdf(input_html, output_pdf)
