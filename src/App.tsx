import './App.css'
import Home from './layouts/common/home/Home'
import Header from './layouts/common/header_footer/Header';
import Footer from './layouts/common/header_footer/Footer';
import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from './AppContext';
import CategoryList from './layouts/admin/categories/CategoryList';
import CategoryAdd from './layouts/admin/categories/CategoryAdd';
import CategoryEdit from './layouts/admin/categories/CategotyEdit';
import UploadDocument from './layouts/common/uploads/UploadDocument';
import DocumentDetail from './layouts/common/document_detail/DocumentDetail';
import Register from './layouts/common/auth/Register';
import Login from './layouts/common/auth/Login';
import Activate from './layouts/common/auth/Activate';
import ForgotPassword from './layouts/common/auth/ForgotPassword';
import ChangePassword from './layouts/common/auth/ChangePassword';
import MyProfile from './layouts/user/MyProfile/MyProfile';
import Favorites from './layouts/user/favorites/Favorites';
import LessonDetail from './layouts/common/lesson_detail/LessonDetail';
import Lesson from './layouts/common/lesson/Lesson';
import ChatGemini from './layouts/common/chatbot/ChatGemini';
import { pdfjs } from 'react-pdf';
import { introspect, refreshToken } from './apis/AuthApi';
import UploadLesson from './layouts/common/uploads/UploadLesson';
import DocumentList from './layouts/admin/contents/documents/DocumentList';
import LessonList from './layouts/admin/contents/lessons/LessonList';
import UserList from './layouts/admin/users/UserList';
import DocumentEdit from './layouts/admin/contents/documents/DocumentEdit';
import LessonEdit from './layouts/admin/contents/lessons/LessonEdit';
import UserAdd from './layouts/admin/users/UserAdd';
import Dashboard from './layouts/admin/dashboard/Dashboard';
import CommentList from './layouts/admin/interactions/comments/CommentList';
import Profile from './layouts/user/profile/Profile';
import RatingList from './layouts/admin/interactions/ratings/RatingList';
import ReportList from './layouts/admin/interactions/reports/ReportList';
import ReportDetail from './layouts/admin/interactions/reports/ReportDetail';
import ChatMessage from './layouts/common/chat_message/ChatMessage';
import WebSocketService from './apis/WebSocketService';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
function App() {
  const context = useContext(AppContext) as any;
  const [keyWords, setKeyWords] = useState("");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [roles, setRoles] = useState<string[]>(JSON.parse(localStorage.getItem("roles") || "[]"));
  const [avatar, setAvatar] = useState<string | null>(localStorage.getItem("avatar"));

  // Ensure WebSocket is connected (important for page refresh)
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      return;
    }

    if (!WebSocketService.getIsConnected() && !WebSocketService.getIsConnecting()) {
      console.log("[ChatMessage] Reconnecting WebSocket after page refresh...");
      WebSocketService.connect().catch(err => {
        console.error("[ChatMessage] Failed to reconnect WebSocket:", err);
      });
    }
  }, []);


  useEffect(() => {
    if (!token) return;
    const check = async () => {
      await introspect().catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
        localStorage.removeItem("avatar");
        setToken(null);
        setRoles([]);
        setAvatar(null);
      });
    }
    check()
  }, [token]);


  useEffect(() => {
    if (!token) return;
    const interval = setInterval(async () => {
      const data = await refreshToken();
      if (data != null) {
        localStorage.setItem("token", data.result?.token ?? "");
        setToken(data.result?.token ?? null);
      }
    }, 15 * 60 * 1000); // 15 phút
    return () => clearInterval(interval);
  }, [token]);

  return (
    <>
      <BrowserRouter>

        <Header token={token} setToken={setToken} setKeyWords={setKeyWords} roles={roles} setRoles={setRoles} avatar={avatar} setAvatar={setAvatar} />
        <Routes>
          <Route path="/" element={<Home keyWords={keyWords} />} />
          <Route path="/lesson" element={<Lesson keyWords={keyWords} />} />

          {/* {auth} */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} setRoles={setRoles} setAvatar={setAvatar} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password/:email/:forgotPasswordCode" element={<ChangePassword />} />
          <Route path="/activate/:email/:activationCode" element={<Activate />} />
          {/* common */}
          <Route path="/uploadDocument" element={<UploadDocument />} />
          <Route path="/uploadLesson" element={<UploadLesson />} />
          <Route path="/document/:id" element={<DocumentDetail />} />
          <Route path="/lesson/:id" element={<LessonDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/profile/:id" element={<Profile />} />
          {/* {admin} */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/add" element={<CategoryAdd />} />
          <Route path="/categories/edit/:id" element={<CategoryEdit />} />
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/documents/edit/:id" element={<DocumentEdit />} />
          <Route path="/lessons" element={<LessonList />} />
          <Route path="/lessons/edit/:id" element={<LessonEdit />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/add" element={<UserAdd />} />
          <Route path="/comments" element={<CommentList />} />
          <Route path="/ratings" element={<RatingList />} />
          <Route path="/reports" element={<ReportList />} />
          <Route path="/reports/:type/:id" element={<ReportDetail />} />
        </Routes>
        <ChatGemini />
        {context.conversationId != null && <ChatMessage />}
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
