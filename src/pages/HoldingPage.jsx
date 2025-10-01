// HoldingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import "../style.css";
import robotVideo from "../assets/robot.webm";
import bookImage from "../assets/book.png";
import startUzImage from "../assets/start-auz.png";
import startRuImage from "../assets/start-ru.png";
import startEnImage from "../assets/start-en.png";
import bgImage from "../assets/bg.jpeg";
import logoImage from "../assets/logo2.png";

export default function HoldingPage({ onSelectLanguage }) {
  const [cycleLang, setCycleLang] = useState("en");
  const [visibleLine, setVisibleLine] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const robotRef = useRef(null);
  const speechBubbleRef = useRef(null);

  const texts = {
    en: ["Welcome to the Children's Exhibition Hall!"],
    uz: ["Bolalar ko'rgazma zaliga xush kelibsiz!"],
    ru: ["Добро пожаловать в Детский выставочный зал!"],
  };

  const langs = ["en", "uz", "ru"];

  // 🗣️ دالة تشغيل الصوت المحسنة
  const speakText = (text, lang, callback) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      if (lang === "ru") {
        utterance.lang = "ru-RU";
        utterance.rate = 0.9;
      } else if (lang === "uz") {
        // متصفحات كثيرة ماعندهاش Uzbek voices → نستخدم روسي كبديل صوتياً
        utterance.lang = "ru-RU";
        utterance.rate = 0.85;
      } else {
        utterance.lang = "en-US";
        utterance.rate = 0.9;
      }

      utterance.pitch = 1.2;
      utterance.volume = 1;

      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        if (callback) setTimeout(callback, 800);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        if (callback) setTimeout(callback, 1000);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      if (callback) setTimeout(callback, 2500);
    }
  };

  // عند التحميل: تأكد من وجود data-lang افتراضي
  useEffect(() => {
    const initial = document.documentElement.getAttribute("data-lang") || "en";
    document.documentElement.setAttribute("data-lang", initial);
  }, []);

  // دورة عرض النصوص واللغات (تبديل تلقائي)
  useEffect(() => {
    let langIndex = 0;
    let lineIndex = 0;
    let isRunning = true;

    const playNextLine = () => {
      if (!isRunning) return;

      const currentLang = langs[langIndex];
      const line = texts[currentLang][lineIndex];

      // ✨ مهم: نغيّر data-lang عشان الخط يتبدل على مستوى الصفحة كلها
      document.documentElement.setAttribute("data-lang", currentLang);
      setCycleLang(currentLang);
      setVisibleLine(line);
      setCurrentTextIndex(lineIndex);

      speakText(line, currentLang, () => {
        if (!isRunning) return;

        lineIndex++;
        if (lineIndex >= texts[currentLang].length) {
          lineIndex = 0;
          langIndex = (langIndex + 1) % langs.length;
        }

        setTimeout(playNextLine, 1000);
      });
    };

    playNextLine();

    return () => {
      isRunning = false;
      window.speechSynthesis.cancel();
    };
  }, []); // تشتغل مرة عند mount

  // تأثير الكتابة حرف بحرف + تزامن مع الصوت
  useEffect(() => {
    if (!visibleLine) return;

    setIsTyping(true);

    const estimatedSpeechDuration = visibleLine.length * 60; // ms
    const typingSpeed = Math.max(40, estimatedSpeechDuration / visibleLine.length);

    let i = 0;
    let currentText = "";

    const typeChar = () => {
      currentText += visibleLine.charAt(i);
      setDisplayedText(currentText);
      i++;
      if (i >= visibleLine.length) {
        setIsTyping(false);
      }
    };

    const interval = setInterval(() => {
      if (i < visibleLine.length) {
        typeChar();
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [visibleLine]);

  const buttons = [
    { lang: "uz", image: startUzImage, label: "O'zbekiston" },
    { lang: "ru", image: startRuImage, label: "Россия" },
    { lang: "en", image: startEnImage, label: "English" },
  ];

  const handleLanguageSelect = (lang) => {
    // أوقف أي نطق مفتوح
    window.speechSynthesis.cancel();

    // نغيّر data-lang فوراً علشان الخط يتغير في كل الصفحات
    document.documentElement.setAttribute("data-lang", lang);

    // تأثير بصري بسيط ثم نبلّغ الـ parent
    document.body.style.opacity = "0.9";
    setTimeout(() => {
      document.body.style.opacity = "1";
      if (onSelectLanguage) onSelectLanguage(lang);
    }, 300);
  };

  return (
    <div className="page-container">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      <div className="stars">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {isSpeaking && (
  <div className={`speaking-indicator ${cycleLang === "ru" ? "font-ru" : "font-uz-en"}`}>
    <div className="pulse-animation"></div>
    🔊{" "}
    {cycleLang === "en"
      ? "Speaking..."
      : cycleLang === "uz"
      ? "Gapiramiz..."
      : "Говорим..."}
  </div>
)}


      <div className="main-content">
        <div className="robot-container top-left">
          <video 
  src={robotVideo} 
  autoPlay 
  loop 
  muted 
  playsInline 
  className="robot-video"
/>

          <div ref={speechBubbleRef} className="speech-bubble">
            <p key={visibleLine} className={`fade-in-line ${cycleLang === "ru" ? "font-ru" : "font-uz-en"}`}>
              {displayedText}
              {isTyping && <span className="cursor">|</span>}
            </p>
          </div>
        </div>

        <div className="book-container">
          <img src={bookImage} alt="Magic Book" className="book-image-new" />
        </div>

        <div className="vertical-buttons">
          {buttons.map((btn) => (
            <button
              key={btn.lang}
              onClick={() => {
                window.speechSynthesis.cancel();
                handleLanguageSelect(btn.lang);
              }}
              className="language-button"
            >
              <img src={btn.image} alt={btn.label} className="button-image" />
            </button>
          ))}
        </div>

        <div className="logo-container">
          <div className="produced-by">Produced by</div>
          <img src={logoImage} alt="Event Logo" className="event-logo" />
        </div>
      </div>
    </div>
  );
}
