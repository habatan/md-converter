import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';

// --- 新しく作成したコンポーネントを読み込みます ---
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import PreviewArea from './components/PreviewArea';

/**
 * 【Container Component（状態とロジックを持つ親コンポーネント）】
 * 画面全体のレイアウトと、アプリ全体の「状態（State）」、
 * バックエンドとの通信などの「機能（ロジック）」を統括します。
 * 個別のUI構築は各子コンポーネントに任せることで、コードの見通しが劇的に良くなります。
 */
function App() {
  // 【Lifting State Up（状態の引き上げ）】
  // selectedFile や markdown は、FileUploader と PreviewArea の両方に影響を与えます。
  // そのため、共通の親である App.jsx に State として「引き上げ」て配置します。
  const [selectedFile, setSelectedFile] = useState(null);
  const [markdown, setMarkdown] = useState("# プレビュー\n\nここに変換されたMarkdownが表示されます。");
  const [isConverting, setIsConverting] = useState(false);

  // メインの処理：バックエンドにファイルを送信する
  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setMarkdown("変換中...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("サーバーエラーが発生しました");
      }

      const data = await response.json();
      setMarkdown(data.markdown);
      
    } catch (error) {
      console.error(error);
      setMarkdown("# エラー\n\n変換に失敗しました。バックエンドが起動しているか確認してください。");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <>
      <Header />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          
          {/* 左側：ファイルアップロード領域 */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Props（プロップス）として、子コンポーネントにStateや関数を渡します */}
            <FileUploader 
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onConvert={handleConvert}
              isConverting={isConverting}
            />
          </Grid>

          {/* 右側：プレビュー領域 */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* markdownの内容だけを渡します */}
            <PreviewArea markdown={markdown} />
          </Grid>
          
        </Grid>
      </Container>
    </>
  );
}

export default App;