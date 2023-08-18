import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./assets/css/app.css";
//import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { useContext, useState } from "react";
//import { Messenger } from "./pages/Messenger";
import { ChatApp } from "./pages/ChatApp";
import { Context } from "./context/Context";

function App() {
  const { user } = useContext(Context);

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
