import { useState, useEffect } from "react";
import ExhibitionApp from "./ExhibitionApp";

// ✅ استيراد ملف الخطوط أولاً
import "./styles/fonts.css";
import "./style.css";

function App() {
  const [lang, setLang] = useState("en");

  // كل ما اللغة تتغير → نغيّر الـ data-lang على الـ <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang]);

  return (
    <ExhibitionApp
      lang={lang}
      onSelectLanguage={(newLang) => setLang(newLang)}
    />
  );
}

export default App;
