import os
import tempfile
import pypandoc
import pymupdf4llm
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 環境変数からフロントエンドのURLを取得（未設定の場合はローカル環境をデフォルトに）
# 末尾の/がCORSエラーの原因になるため、rstrip("/")で自動的に削除します
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
# フロントエンドからの通信を許可する設定（CORS）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "API is runnning!"}

# ファイルを受け取って変換するAPIのモック
@app.post("/api/convert")
async def convert_file(file: UploadFile = File(...)):
    # 1. 拡張子の確認
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".pdf", ".docx"]:
        raise HTTPException(status_code=400, detail="サポートされていないファイル形式です。")

    # 2.受信したファイルを一時ファイルとしてサーバー（コンテナ）内に保存
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_path = temp_file.name

    try:
        markdown_content = ""

        # 3.拡張子に応じて変換ライブラリを使い分ける
        if ext == ".docx":
            # Word -> Markdown(Pandocを使用)
            # pypandocが裏側でシステムのPandocを呼び出して見出しや表をきれいに変換
            markdown_content = pypandoc.convert_file(temp_path, "gfm")

        elif ext == ".pdf":
             # PDF -> Markdown(PyMuPDF4LLMを使用)
             # LLM向けにPDF内のテキストや表をMarkdown化してくれる強力なツールです
             markdown_content = pymupdf4llm.to_markdown(temp_path)

        return {
            "filename": filename,
            "markdown": markdown_content
        }

    except Exception as e:
        print(f"変換エラー： {e}")
        raise HTTPException(status_code=500, detail="変換中にエラーが発生しました。")

    finally:
        # 4.変換が終わったら、ストレージを圧迫しないよう一時ファイルを確実に削除
        if os.path.exists(temp_path):
            os.remove(temp_path)


