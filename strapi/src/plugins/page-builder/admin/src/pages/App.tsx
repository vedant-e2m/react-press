import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './HomePage';
import { EditorPage } from './EditorPage';

/**
 * Page Builder plugin routes hosted under /plugins/page-builder.
 */
function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="pages/:documentId" element={<EditorPage />} />
    </Routes>
  );
}

export default App;
