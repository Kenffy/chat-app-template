import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./assets/css/app.css";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ChatApp } from "./pages/ChatApp";
import { useContacts } from "./context/ContactProvider";

function App() {
  const { user } = useContacts();

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

export default App;
