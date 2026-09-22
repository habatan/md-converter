import React, { useCallback } from 'react';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';

/**
 * 【Props（プロップス）を使った関数（コールバック）の受け取り】
 * UI（ドラッグ＆ドロップ領域やボタン）と、機能（通信）を切り離します。
 * ファイルが選ばれた時やボタンが押された時の「具体的な通信などの処理」は親（App.jsx）に任せ、
 * このコンポーネントは「アクションが起きたこと」だけを親に伝えます（イベントハンドラのバケツリレー）。
 *
 * @param {Object} props
 * @param {File|null} props.selectedFile - 選択されているファイル
 * @param {function} props.onFileSelect - ファイルが選択された時に呼ばれる関数
 * @param {function} props.onConvert - 「変換する」ボタンが押された時に呼ばれる関数
 * @param {boolean} props.isConverting - 通信中かどうかのフラグ
 */
function FileUploader({ selectedFile, onFileSelect, onConvert, isConverting }) {
  // useCallback は、関数をメモリに保存（メモ化）して、親が再描画されても無駄な関数の再生成を防ぐためのReactフックです
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      // 親コンポーネントから渡された関数を実行し、選択されたファイルを親に渡します
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>ファイルアップロード</Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
          '&:hover': { backgroundColor: '#f0f8ff' }
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>ここにドロップしてください...</Typography>
        ) : (
          <Typography>Word (.docx) または PDF ファイルをここにドラッグ＆ドロップ、またはクリック</Typography>
        )}
      </Box>
      
      {/* 【条件付きレンダリング】 selectedFile が存在するとき(truthy)だけ、以下のBoxを描画します */}
      {selectedFile && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
          <Typography fontWeight="bold">選択中: {selectedFile.name}</Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }} 
            fullWidth
            onClick={onConvert} // 親から渡された関数を実行
            disabled={isConverting}
          >
            {isConverting ? <CircularProgress size={24} color="inherit" /> : "Markdownに変換する"}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default FileUploader;
