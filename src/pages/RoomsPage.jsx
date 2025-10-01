import React, { useState, useEffect, useRef } from "react";
import "../style.css";
import robotImage from "../assets/robot.png";
import videoSrc from "../assets/robot.mp4";
import bgImage from "../assets/bg.jpeg";
import boxImage from "../assets/box.png";

export default function RoomsPage({ language, onFinish }) {
  const [bubbleText, setBubbleText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const videoRef = useRef(null);
  const starsContainerRef = useRef(null);
  const robotRef = useRef(null);
  const effectsContainerRef = useRef(null);

  // دالة محسنة لتحديد حجم النص بناءً على طوله ودقة الشاشة
  const getTextSizeClass = (text) => {
    if (!text) return '';
    const length = text.length;
    const width = window.innerWidth;
    
    if (width >= 3840) { // 4K وأكبر
      if (length > 150) return 'very-long-text';
      if (length > 80) return 'long-text';
      if (length > 40) return 'medium-text';
    } else if (width >= 2560) { // 2K
      if (length > 120) return 'very-long-text';
      if (length > 70) return 'long-text';
      if (length > 35) return 'medium-text';
    } else { // شاشات عادية
      if (length > 100) return 'very-long-text';
      if (length > 60) return 'long-text';
      if (length > 30) return 'medium-text';
    }
    return '';
  };

  const texts = {
    en: {
      hakimHello: "🌟 To explore more amazing stories and meet legendary characters, you can visit our magical rooms! Each room holds unique adventures waiting for you! 🏰✨",
      button: "Begin Your Magical Journey 🚀",
      roomsTitle: "🎪 Choose Your Adventure Room!",
      rooms: [
        {
          id: 1,
          name: "Ancient Legends Room",
          emoji: "🏛️",
          description: "Discover myths and legends from thousands of years ago!",
          color: "linear-gradient(145deg, #FF6B6B, #FF8E53)"
        },
        {
          id: 2,
          name: "Heroes Gallery",
          emoji: "🦸‍♂️",
          description: "Meet the great heroes who shaped our history!",
          color: "linear-gradient(145deg, #4ECDC4, #44A08D)"
        },
        {
          id: 3,
          name: "Treasure Chamber",
          emoji: "💎",
          description: "Explore ancient artifacts and hidden treasures!",
          color: "linear-gradient(145deg, #FFD93D, #FF9C3D)"
        }
      ]
    },
    uz: {
      hakimHello: "🌟 Ko'proq ajoyib hikoyalarni kashf etish va afsonaviy qahramonlar bilan uchrashish uchun bizning sehrli xonalarimizga tashrif buyuring! Har bir xona sizni kutayotgan noyob sarguzashtlarga ega! 🏰✨",
      button: "Sehrli Safaringizni Boshlang 🚀",
      roomsTitle: "🎪 O'zingizning Sarguzasht Xonangizni Tanlang!",
      rooms: [
        {
          id: 1,
          name: "Qadimiy Afsonalar Xonasi",
          emoji: "🏛️",
          description: "Ming yillar avvalgi miflar va afsonalarni kashf eting!",
          color: "linear-gradient(145deg, #FF6B6B, #FF8E53)"
        },
        {
          id: 2,
          name: "Qahramonlar Galereyasi",
          emoji: "🦸‍♂️",
          description: "Tariximizni shakllantirgan buyuk qahramonlar bilan uchrashing!",
          color: "linear-gradient(145deg, #4ECDC4, #44A08D)"
        },
        {
          id: 3,
          name: "Xazina Xonasi",
          emoji: "💎",
          description: "Qadimiy artefaktlar va yashirin xazinalarni kashf eting!",
          color: "linear-gradient(145deg, #FFD93D, #FF9C3D)"
        },
        {
          id: 4,
          name: "Vaqt Sayohati Portali",
          emoji: "⏰",
          description: "Turli tarixiy davrlar bo'ylab sayohat qiling!",
          color: "linear-gradient(145deg, #6A11CB, #2575FC)"
        }
      ]
    },
    ru: {
      hakimHello: "🌟 Чтобы исследовать больше удивительных историй и встретить легендарных персонажей, вы можете посетить наши волшебные залы! Каждый зал хранит уникальные приключения, ожидающие вас! 🏰✨",
      button: "Начните Своё Волшебное Путешествие 🚀",
      roomsTitle: "🎪 Выберите Свою Комнату Приключений!",
      rooms: [
        {
          id: 1,
          name: "Зал Древних Легенд",
          emoji: "🏛️",
          description: "Откройте мифы и легенды тысячелетней давности!",
          color: "linear-gradient(145deg, #FF6B6B, #FF8E53)"
        },
        {
          id: 2,
          name: "Галерея Героев",
          emoji: "🦸‍♂️",
          description: "Встретьтесь с великими героями, сформировавшими нашу историю!",
          color: "linear-gradient(145deg, #4ECDC4, #44A08D)"
        },
        {
          id: 3,
          name: "Сокровищница",
          emoji: "💎",
          description: "Исследуйте древние артефакты и скрытые сокровища!",
          color: "linear-gradient(145deg, #FFD93D, #FF9C3D)"
        },
        {
          id: 4,
          name: "Портал Путешествий во Времени",
          emoji: "⏰",
          description: "Путешествуйте через разные исторические эпохи!",
          color: "linear-gradient(145deg, #6A11CB, #2575FC)"
        }
      ]
    },
  };

  const t = texts[language] || texts.en;

  // ✅ دالة تشغيل الصوت المحسنة
  const speakText = (text, lang, callback) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      if (lang === "uz") {
        utterance.lang = "tr-TR";
        utterance.rate = 0.85;
      } else if (lang === "ru") {
        utterance.lang = "ru-RU";
        utterance.rate = 0.9;
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

  // 🌌 نجوم الخلفية المتحركة المحسنة
  useEffect(() => {
    const createStars = () => {
      const container = starsContainerRef.current;
      if (!container) return;

      container.innerHTML = "";
      const starCount = window.innerWidth >= 2560 ? 80 : 40;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "star";

        const size = window.innerWidth >= 2560 ? 
          Math.random() * 4 + 2 : Math.random() * 3 + 2;
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
    const handleResize = () => {
      createStars();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // إنشاء تأثيرات النقر المحسنة
  const createClickEffects = (room, event) => {
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
      const distance = window.innerWidth >= 2560 ? 80 : 60;
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

  // عند تحميل الصفحة: قول جملة Hakim الأولى
  useEffect(() => {
    setBubbleText(t.hakimHello);
    speakText(t.hakimHello, language, () => {
      setTimeout(() => {
        setShowRooms(true);
      }, 1000);
    });
  }, [language, t.hakimHello]);

  // تأثير عند النقر على الغرفة
  const handleRoomClick = (room, event) => {
    setActiveRoom(room);
    createClickEffects(room, event);
    speakText(`${room.name}. ${room.description}`, language);
  };

  // تأثير تفاعلي للروبوت
  const handleRobotClick = () => {
    if (robotRef.current) {
      robotRef.current.style.transform = "scale(1.1) rotate(5deg)";
      setTimeout(() => {
        if (robotRef.current) {
          robotRef.current.style.transform = "scale(1) rotate(0deg)";
        }
      }, 300);
    }
  };

  return (
    <div className="page-container rooms-page">
      {/* 🌌 خلفية النجوم */}
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

      {/* 🎙️ مؤشر الصوت */}
      {isSpeaking && (
        <div className="speaking-indicator">
          <div className="pulse-animation"></div>
          🔊 {language === 'en' ? 'Hakim is speaking...' : language === 'uz' ? 'Hakim gapiramiz...' : 'Хаким говорит...'}
        </div>
      )}

      {/* 🤖 الروبوت + البالون */}
      <div className="robot-container top-left rooms-robot-container">
        <img 
          ref={robotRef}
          src={robotImage} 
          alt="Hakim Robot" 
          className="robot-image rooms-robot-image"
          onClick={handleRobotClick}
        />

        <div className={`speech-bubble rooms-speech-bubble ${getTextSizeClass(bubbleText)}`}>
          <p 
            className={language === "ru" ? "font-ru" : "font-uz-en"} 
            style={{ margin: 0, lineHeight: '1.4' }}
          >
            {bubbleText}
            {isSpeaking && <span style={{ animation: 'blink 1s infinite' }}>...</span>}
          </p>
        </div>
      </div>

      {/* 🎥 محتوى الصفحة الرئيسي */}
      <div className="main-content rooms-content">
        <div className="rooms-header">
          <h2 className={`rooms-page-title ${language === "ru" ? "font-ru" : "font-uz-en"}`}>
            {language === 'en' ? 'Magical Adventure Rooms' : 
             language === 'uz' ? 'Sehrli Sarguzasht Xonalari' : 
             'Волшебные Комнаты Приключений'}
          </h2>
          <p className={`rooms-page-subtitle ${language === "ru" ? "font-ru" : "font-uz-en"}`}>
            {language === 'en' ? '✨ Choose your path to amazing discoveries! ✨' : 
             language === 'uz' ? '✨ Ajoyib kashfiyotlar yo\'lini tanlang! ✨' : 
             '✨ Выберите свой путь к удивительным открытиям! ✨'}
          </p>
        </div>

        {/* 🎥 الفيديو */}
        <div className="rooms-video-container">
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            loop
            className="rooms-video-player"
          />
          <div className="video-overlay">
            <p className="video-hint">
              {language === 'en' ? '🎬 Preparing your magical journey...' : 
               language === 'uz' ? '🎬 Sizning sehrli safaringiz tayyorlanmoqda...' : 
               '🎬 Подготовка вашего волшебного путешествия...'}
            </p>
          </div>
        </div>

        {/* 🏰 عرض الغرف */}
        {showRooms && (
          <div className="rooms-container">
            <h2 className={`rooms-title ${language === "ru" ? "font-ru" : "font-uz-en"}`}>
              {t.roomsTitle}
            </h2>
            
            <div className="rooms-grid">
              {t.rooms.map((room) => (
                <div
                  key={room.id}
                  className={`room-card ${activeRoom?.id === room.id ? 'active' : ''}`}
                  style={{ background: room.color }}
                  onClick={(e) => handleRoomClick(room, e)}
                >
                  <div className="room-emoji">{room.emoji}</div>
                  <h3 className="room-name">{room.name}</h3>
                  <p className="room-description">{room.description}</p>
                  <div className="room-glow"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ⏭️ زرار البداية */}
      {showRooms && (
        <div className="rooms-next-container">
          <button 
            className={`rooms-start-button ${language === "ru" ? "font-ru" : "font-uz-en"}`} 
            onClick={onFinish}
          >
            {t.button}
          </button>
        </div>
      )}

      {/* 🏰 Popup معلومات الغرفة */}
      {activeRoom && (
        <div className="rooms-room-popup">
          <div className={`rooms-room-popup-inner ${getTextSizeClass(activeRoom.description)}`}>
            <h3 className={language === "ru" ? "font-ru" : "font-uz-en"}>
              {activeRoom.name}
            </h3>
            <p className={language === "ru" ? "font-ru" : "font-uz-en"}>
              {activeRoom.description}
            </p>
            <button 
              className={language === "ru" ? "font-ru" : "font-uz-en"}
              onClick={() => setActiveRoom(null)}
            >
              {language === 'en' ? 'Close' : 
               language === 'uz' ? 'Yopish' : 
               'Закрыть'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}