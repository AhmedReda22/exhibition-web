import React, { useState, useEffect, useRef } from "react";
import "../style.css";
import robotImage from "../assets/robot.png";
import bgImage from "../assets/bg.jpeg"; // نفس خلفية HoldingPage

export default function OriginPage({ language = "en", onNext }) {
  const [selectedCity, setSelectedCity] = useState(null);
  const [bubbleText, setBubbleText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [clickedCity, setClickedCity] = useState(null);
  const starsContainerRef = useRef(null);
  const effectsContainerRef = useRef(null);
// دالة لتحديد حجم النص بناءً على طوله
const getTextSizeClass = (text) => {
  if (!text) return '';
  const length = text.length;
  if (length > 100) return 'very-long-text';
  if (length > 60) return 'long-text';
  if (length > 30) return 'medium-text';
  return '';
};

  const cities = [
    { id: "tashkent", label: { en: "Tashkent", uz: "Toshkent", ru: "Ташкент" }, x: 520, y: 140 },
    { id: "samarkand", label: { en: "Samarkand", uz: "Samarqand", ru: "Самарканд" }, x: 420, y: 230 },
    { id: "bukhara", label: { en: "Bukhara", uz: "Buxoro", ru: "Бухара" }, x: 300, y: 260 },
    { id: "khiva", label: { en: "Khiva", uz: "Xiva", ru: "Хива" }, x: 170, y: 200 },
    { id: "nukus", label: { en: "Nukus", uz: "Nukus", ru: "Нукус" }, x: 80, y: 90 },
    { id: "fergana", label: { en: "Fergana", uz: "Fargʻona", ru: "Фергана" }, x: 610, y: 200 },
    { id: "namangan", label: { en: "Namangan", uz: "Namangan", ru: "Наманган" }, x: 650, y: 160 },
    { id: "qarshi", label: { en: "Qarshi", uz: "Qarshi", ru: "Карши" }, x: 360, y: 320 },
  ];

  const localized = {
    en: {
      where: "Where Are You Visiting From?",
      welcome: (city) => `🎉 Welcome from ${city}! 🎉`,
      next: "Let's Explore! 🚀",
      hint: "✨ Tap on a magical city to begin your adventure! ✨",
      hakimHello: "Hello little explorers! I'm Hakim, your friendly robot guide! Let's discover where you're from!",
    },
    uz: {
      where: "Сиз Қаердан Келдингиз?",
      welcome: (city) => `🎉 ${city}дан Хуш Келибсиз! 🎉`,
      next: "Келгингиз, Тадкик Қиламиз! 🚀",
      hint: "✨ Сафарни бошлаш учун сеҳрли шаҳарга босинг! ✨",
      hakimHello: "Салом, кичкина саёҳатчилар! Мен Ҳаким, сизнинг дўстона робот йўлбошчингизман! Келинг, сиз қаердан эканлигингизни билайлик!",
    },
    ru: {
      where: "Откуда Вы Приехали?",
      welcome: (city) => `🎉 Добро Пожаловать из ${city}! 🎉`,
      next: "Вперёд к Приключениям! 🚀",
      hint: "✨ Нажмите на волшебный город, чтобы начать путешествие! ✨",
      hakimHello: "Привет, маленькие исследователи! Я Хаким, ваш дружелюбный робот-гид! Давайте узнаем, откуда вы!",
    },
  };

  const texts = localized[language] || localized.en;

  // 🌌 إنشاء النجوم المتحركة - نفس HoldingPage
  useEffect(() => {
    const createStars = () => {
      const container = starsContainerRef.current;
      if (!container) return;

      container.innerHTML = "";

      for (let i = 0; i < 40; i++) {
        const star = document.createElement("div");
        star.className = "star";

        const size = Math.random() * 3 + 2;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;

        container.appendChild(star);
      }
    };

    createStars();
    window.addEventListener("resize", createStars);
    return () => window.removeEventListener("resize", createStars);
  }, []);

  // 🗣️ دالة تشغيل الصوت المحسنة - نفس HoldingPage
const speakText = (text, lang, callback) => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // إصلاح إعدادات اللغة
    if (lang === "ru") {
      utterance.lang = "ru-RU";
      utterance.rate = 0.9;
    } else if (lang === "uz") {
      // استخدام اللغة الروسية كبديل للأوزباكية (لأن معظم المتصفحات تدعمها)
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

  // عند تحميل الصفحة: قول جملة Hakim الأولى
  useEffect(() => {
    setBubbleText(texts.hakimHello);
    speakText(texts.hakimHello, language);
  }, [language]);

  // إنشاء تأثيرات النقر المحسنة
  const createClickEffects = (city, event) => {
    const container = effectsContainerRef.current;
    if (!container) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // تأثير الدائرة المتوسعة
    const ring = document.createElement("div");
    ring.className = "city-ring";
    ring.style.left = `${centerX}px`;
    ring.style.top = `${centerY}px`;
    container.appendChild(ring);

    // تأثير الضوء الساطع
    const light = document.createElement("div");
    light.className = "city-light-flash";
    light.style.left = `${centerX}px`;
    light.style.top = `${centerY}px`;
    container.appendChild(light);

    // تأثير النجوم
    const stars = document.createElement("div");
    stars.className = "city-stars";
    stars.style.left = `${centerX}px`;
    stars.style.top = `${centerY}px`;
    
    for (let i = 0; i < 8; i++) {
      const star = document.createElement("div");
      star.className = "city-star";
      star.innerHTML = "⭐";
      
      const angle = (Math.PI * 2 * i) / 8;
      const distance = 60;
      const starX = Math.cos(angle) * distance;
      const starY = Math.sin(angle) * distance;
      
      star.style.setProperty('--star-x', `${starX}px`);
      star.style.setProperty('--star-y', `${starY}px`);
      star.style.animationDelay = `${i * 0.1}s`;
      
      stars.appendChild(star);
    }
    
    container.appendChild(stars);

    // تنظيف العناصر بعد انتهاء التحريك
    setTimeout(() => {
      if (ring.parentNode) ring.parentNode.removeChild(ring);
      if (light.parentNode) light.parentNode.removeChild(light);
      if (stars.parentNode) stars.parentNode.removeChild(stars);
    }, 1000);
  };

  // 🗺️ لما يضغط على مدينة
  const handleCityClick = (city, event) => {
    const msg = texts.welcome(city.label[language]);
    setSelectedCity(city);
    setBubbleText(msg);
    
    // تأثيرات النقر
    setClickedCity(city.id);
    createClickEffects(city, event);
    
    // إزالة تأثير النقر بعد انتهاء التحريك
    setTimeout(() => setClickedCity(null), 800);
    
    speakText(msg, language);
  };

  return (
    <div className="page-container origin-page">
      {/* 🌌 خلفية النجوم - نفس HoldingPage */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* 🌌 طبقة النجوم */}
      <div ref={starsContainerRef} className="stars"></div>

      {/* حاوية تأثيرات النقر */}
      <div ref={effectsContainerRef} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 100
      }}></div>

      {/* 🎙️ مؤشر الصوت - نفس HoldingPage */}
      {isSpeaking && (
  <div className={`speaking-indicator ${language === "ru" ? "font-ru" : "font-uz-en"}`}>
    <div className="pulse-animation"></div>
    🔊 {language === "en"
      ? "Hakim is speaking..."
      : language === "uz"
      ? "Hakim gapiramiz..."
      : "Хаким говорит..."}
  </div>
)}


      {/* 🤖 الروبوت + البالون - نفس HoldingPage */}
      <div className="robot-container top-left origin-robot-container">
        <img 
          src={robotImage} 
          alt="Hakim Robot" 
          className="robot-image origin-robot-image"
        />

        <div className={`speech-bubble origin-speech-bubble ${getTextSizeClass(bubbleText)}`}>
  <p 
  style={{ margin: 0, lineHeight: '1.4' }}
  className={language === "ru" ? "font-ru" : "font-uz-en"}
>
  {bubbleText}
  {isSpeaking && <span style={{ animation: 'blink 1s infinite' }}>...</span>}
</p>

</div>
      </div>

      {/* 🗺️ محتوى الصفحة الرئيسي */}
      <div className="main-content origin-content">
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 className={`origin-page-title ${language === "ru" ? "font-ru" : "font-uz-en"}`}>
  {texts.where}
</h2>

          <p 
  className={`origin-page-subtitle gold-text shimmer-text ${language === "ru" ? "font-ru" : "font-uz-en"}`}
>
  {texts.hint}
</p>
                                                           
        </div>

        <div className="origin-map-container">
          <div className="origin-city-map">
            <svg
              viewBox="0 0 800 500"
              style={{ width: "100%", maxWidth: "1000px", height: "auto" }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="originMapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="50%" stopColor="#A0522D" />
                  <stop offset="100%" stopColor="#CD853F" />
                </linearGradient>
                <radialGradient id="cityGradient">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#CD853F" />
                </radialGradient>
                
                {/* تأثير توهج للمدن المحددة */}
                <filter id="glowEffect">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <rect x="0" y="0" width="800" height="500" fill="url(#originMapGradient)" rx="20" ry="20" />

              <g opacity="0.2">
                <path
                  d="M0,250 C120,200 240,280 360,240 C480,200 600,260 800,230 L800,500 L0,500 Z"
                  fill="#ffffff"
                />
                <path
                  d="M0,300 C150,250 300,350 450,300 C600,250 700,320 800,280 L800,500 L0,500 Z"
                  fill="#F5F5DC"
                  opacity="0.15"
                />
              </g>

              {cities.map((c) => {
                const isSelected = selectedCity?.id === c.id;
                const isClicked = clickedCity === c.id;
                
                return (
                  <g
                    key={c.id}
                    transform={`translate(${c.x}, ${c.y})`}
                    className={`origin-city-point ${isClicked ? 'city-click-effect city-vibrate city-color-change' : ''} ${isSelected ? 'city-selected-permanent' : ''}`}
                    onClick={(e) => handleCityClick(c, e)}
                    role="button"
                    tabIndex="0"
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      fill={isSelected ? "url(#cityGradient)" : "#FFD700"}
                      stroke={isSelected ? "#8B4513" : "#5D4037"}
                      strokeWidth={isSelected ? "3" : "2"}
                      filter={isSelected ? "url(#glowEffect)" : "none"}
                    />
                    <text
  x="35"
  y="8"
  fontSize="18"
  fill={isSelected ? "#8B4513" : "#FFFFFF"}
  className={language === "ru" ? "font-ru" : "font-uz-en"}
  fontWeight="bold"
>
  {c.label[language]}
</text>

                    
                    {/* تأثير إضافي مرئي */}
                    {isClicked && (
                      <circle
                        cx="0"
                        cy="0"
                        r="25"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.8"
                      >
                        <animate
                          attributeName="r"
                          from="25"
                          to="40"
                          dur="0.8s"
                          fill="freeze"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.8"
                          to="0"
                          dur="0.8s"
                          fill="freeze"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* 📌 Popup للمدينة */}
      {selectedCity && (
        <div className="origin-city-popup" role="dialog" aria-modal="true">
          <div className="origin-city-popup-inner">
            <h3 className={`origin-city-popup-title ${language === "ru" ? "font-ru" : "font-uz-en"}`}>
  {texts.welcome(selectedCity.label[language])}
</h3>
            <p
  className={`origin-city-popup-text ${language === "ru" ? "font-ru" : "font-uz-en"}`}
  style={{
    fontSize: "22px",
    color: "#F5F5DC",
    marginBottom: "25px",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
  }}
>
  {language === "en"
    ? "Ready for an amazing adventure? 🌟"
    : language === "uz"
    ? "Ажойиб сафарга тайёрмисиз? 🌟"
    : "Готовы к удивительному приключению? 🌟"}
</p>

            <button
  onClick={() => {
    setSelectedCity(null);
    onNext();
  }}
  className={language === "ru" ? "font-ru" : "font-uz-en"}
>
  {texts.next}
</button>

          </div>
        </div>
      )}
    </div>
  );
}