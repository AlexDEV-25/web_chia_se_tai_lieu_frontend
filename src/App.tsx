import './App.css';
import { BrowserRouter } from 'react-router-dom';

import { useContext } from 'react';


import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';

import { pdfjs } from 'react-pdf';
import { AppContext } from './contexts/AppContext';
import Header from './layouts/common/header/Header';
import AppRoutes from './routes/AppRoutes';
import ChatGemini from './layouts/common/chatbot/ChatGemini';
import ChatMessage from './layouts/common/chat_message/ChatMessage';
import Footer from './layouts/common/footer/Footer';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function App() {
  useAuth();
  useWebSocket();
  const context = useContext(AppContext) as any;

  return (
    <BrowserRouter>
      <Header />
      <AppRoutes />
      <ChatGemini />
      {context.conversationId != null && <ChatMessage />}
      <Footer />
    </BrowserRouter>
  );
}

export default App;