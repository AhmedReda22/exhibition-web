import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


// **استيراد ملف الخطوط أولاً**
import './styles/fonts.css';
import './style.css'; // ملف الـ global الحالي عندك



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
