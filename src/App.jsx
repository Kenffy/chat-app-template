import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatApp from "./pages/ChatApp";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const user = true;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <ChatApp /> : <Login />} />
        <Route path="login" element={user ? <ChatApp /> : <Login />} />
        <Route path="register" element={user ? <ChatApp /> : <Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
