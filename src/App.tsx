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
          </Routes>
        </AppContext.Provider>
        <Footer />

      </BrowserRouter>
    </>
  )
}

export default App
