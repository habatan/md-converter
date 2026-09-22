import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

/**
 * 【Presentational Component（見た目だけのコンポーネント）】
 * 状態(State)や複雑なロジックを持たず、UIを表示するだけの役割を持ちます。
 * 今回のように「ただヘッダーを表示するだけ」のパーツは、切り出しておくことで
 * どこでも使い回しやすく、テストや変更もしやすいのが特徴です。
 */
function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Doc2Markdown Converter</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
