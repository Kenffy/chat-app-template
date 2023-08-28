import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatApp from "./pages/ChatApp";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";

export default function App() {
  const [user, setUser] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <ChatApp setUser={setUser} /> : <Login setUser={setUser} />
          }
        />
        <Route
          path="login"
          element={
            user ? <ChatApp setUser={setUser} /> : <Login setUser={setUser} />
          }
        />
        <Route
          path="register"
          element={user ? <ChatApp setUser={setUser} /> : <Register />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
