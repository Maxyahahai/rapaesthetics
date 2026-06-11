import React from "react";
import './styles/theme.css'
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";  // 👈 Add this

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>  {/* 👈 Wrap your App */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);