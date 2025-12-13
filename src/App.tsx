import './App.css'
import Home from './layouts/common/home/home'
import Header from './layouts/common/header_footer/header';
import Footer from './layouts/common/header_footer/footer';
import { useState, useEffect } from 'react';
import type { AppContextType } from './AppContext';
import { AppContext } from './AppContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CategoryList from './layouts/admin/categories/CategoryList';
import CategoryAdd from './layouts/admin/categories/CategoryAdd';
import CategoryEdit from './layouts/admin/categories/CategotyEdit';
import UploadDocument from './layouts/common/uploadDocument/UploadDocument';
import DocumentDetail from './layouts/common/document_detail/DocumentDetail';
import Register from './layouts/common/Auth/Register';
import Login from './layouts/common/Auth/Login';
import Activate from './layouts/common/Auth/Activate';
import MyProfile from './layouts/admin/users/profile/MyProfile';
import { pdfjs } from 'react-pdf';
import { introspect, refreshToken } from './apis/AuthApi';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
function App() {
  const [keyWords, setKeyWords] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const ctxValue: AppContextType = {
    keyWords, setKeyWords,
  };

  useEffect(() => {
    if (!token) return;
    const check = async () => {
      await introspect().catch(() => {
        localStorage.removeItem("token");
      });
    }
    check()
  }, []);


  useEffect(() => {
    if (!token) return;
    const interval = setInterval(async () => {
      const data = await refreshToken();
      if (data != null) {
        localStorage.setItem("token", data.result?.token ?? "");
        console.log("refresh token");
        setToken(data.result?.token ?? null);
      }
    }, 15 * 60 * 1000); // 15 phút
    return () => clearInterval(interval);
  }, []);


  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={ctxValue}>
          <Header token={token} setToken={setToken} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/categories/add" element={<CategoryAdd />} />
            <Route path="/categories/edit/:id" element={<CategoryEdit />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/register" element={<Register />} />
            <Route path="/document/:id" element={<DocumentDetail />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
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
