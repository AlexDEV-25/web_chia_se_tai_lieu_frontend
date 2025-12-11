import './App.css'
import Home from './layouts/common/home/home'
import Header from './layouts/common/header_footer/header';
import Footer from './layouts/common/header_footer/footer';
import { useState } from 'react';
import type { AppContextType } from './AppContext';
import { AppContext } from './AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CategoryList from './layouts/admin/categories/CategoryList';
import CategoryAdd from './layouts/admin/categories/CategoryAdd';
import CategoryEdit from './layouts/admin/categories/CategotyEdit';
import UploadDocument from './layouts/common/uploadDocument/UploadDocument';
import Register from './layouts/common/Auth/Register';
import DocumentDetail from './layouts/common/document_detail/DocumentDetail';
import Login from './layouts/common/Auth/Login';
import Activate from './layouts/common/Auth/Activate';
import MyProfile from './layouts/admin/users/profile/MyProfile';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
function App() {
  const [keyWords, setKeyWords] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [productId, setProductId] = useState(0);

  const ctxValue: AppContextType = {
    keyWords,
    setKeyWords,
    categoryId,
    setCategoryId,
    productId,
    setProductId
  };
  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={ctxValue}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/add" element={<CategoryAdd />} />
            <Route path="/categories/edit/:id" element={<CategoryEdit />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/register" element={<Register />} />
            <Route path="/document/:id" element={<DocumentDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/activate/:email/:activationCode" element={<Activate />} />
          </Routes>
        </AppContext.Provider>
        <Footer />

      </BrowserRouter>
    </>
  )
}

export default App
