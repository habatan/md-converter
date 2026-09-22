import React, { useState } from 'react';
import { Box, Button, Tabs, Tab, TextField } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * 【Local State（局所的な状態管理）】
 * 以前 App.jsx にあった tabIndex（現在どちらのタブが開いているか）は、
 * このプレビュー表示エリア内だけで必要な情報です。
 * 親（App.jsx）が知る必要のない情報は、子コンポーネント内に State を持たせるのがベストプラクティスです。
 * これにより、親コンポーネントが不要に再描画されるのを防げます。
 * 
 * @param {Object} props
 * @param {string} props.markdown - 親から渡されたMarkdownのテキスト
 */
function PreviewArea({ markdown }) {
  // タブの切り替え状態を管理（0: プレビュー, 1: Markdownソース）
  const [tabIndex, setTabIndex] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
      .then(() => alert("コピーしました！"))
      .catch((err) => console.error("コピーに失敗しました", err));
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", display:"flex", justifyContent: "space-between", alignItems:"center" }}>
        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
          <Tab label="プレビュー" />
          <Tab label="Markdownソース" />
        </Tabs>
        {/* コピーボタン */}
        {tabIndex === 1 && (
          <Button variant="outlined" size="small" onClick={handleCopy} sx={{ mr:1 }}>
            コピー
          </Button>
        )}
      </Box>

      {/* タブの中身エリア */}
      <Box sx={{ p:2, minHeight: '400px', backgroundColor: "#fff", border: "1px solid #ccc", borderTop:"none" }}>
        {/* 条件付きレンダリング: tabIndexが0なら左側を、1なら右側をレンダリングします */}
        {tabIndex === 0 && (
          <Box  
            className="markdown-preview"
            sx={{ 
              textAlign: 'left',
              overflowX: 'auto',
              '& h1, & h2, & h3': { 
                marginTop: 1,
                lineHeight: 1.5,
                whiteSpace: 'nowrap'
              },
              '& table': { borderCollapse: 'collapse', width: '100%', marginBottom: '1rem' },
              '& th': { border: '1px solid #ccc', padding: '8px', backgroundColor: '#f5f5f5' },
              '& td': { border: '1px solid #ccc', padding: '8px' }
            }}  
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </Box>
        )}

        {/* 生のMarkdownテキスト表示（コピー用） */}
        {tabIndex === 1 && (
          <TextField
            multiline
            fullWidth
            minRows={15}
            value={markdown}
            InputProps={{ readOnly:true }}
            variant="outlined"
            sx={{ fontFamily: "monospace" }}
          />
        )}
      </Box>
    </Box>
  );
}

export default PreviewArea;
