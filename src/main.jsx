import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/css/global.css";
import { ContactProvider } from "./context/ContactProvider.jsx";
import { ConversationProvider } from "./context/ConversationProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContactProvider>
      <ConversationProvider>
        <App />
      </ConversationProvider>
    </ContactProvider>
  </React.StrictMode>
);
