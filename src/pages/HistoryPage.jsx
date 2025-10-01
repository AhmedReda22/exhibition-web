import React, { useState, useEffect, useRef } from "react";
import "../style.css";
import robotImage from "../assets/robot.png";
import videoSrc from "../assets/robot.mp4";
import mapImage from "../assets/map.png";
import bgImage from "../assets/bg.jpeg"; // نفس خلفية OriginPage
import boxImage from "../assets/box.png"; // نفس صندوق OriginPage

export default function HistoryPage({ language = "en", onNext }) {
  const [bubbleText, setBubbleText] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [activeCity, setActiveCity] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const videoRef = useRef(null);
  const starsContainerRef = useRef(null);
  const robotRef = useRef(null);
  const effectsContainerRef = useRef(null);


  // دالة لتحديد حجم النص بناءً على طوله
const getTextSizeClass = (text) => {
  if (!text) return '';

  if (text.length > 220) return 'very-long-text'; // نص طويل جدًا
  if (text.length > 150) return 'long-text';      // نص طويل
  if (text.length > 80) return 'medium-text';     // نص متوسط
  return 'short-text';                            // نص قصير
};



  const texts = {
    en: {
      hakimHello: "🌍 Our story begins thousands of years ago, in a land where myths were born! Legends whispered through the winds, shaping the destiny of generations. Click on the cities to discover their amazing stories! 🏛️",
      next: "Continue Journey 🚀",
      mapHint: "🗺️ Click on the glowing cities to learn their ancient secrets!",
      cities: [
        { id: 1, name: "Tashkent", info: "🌟 The vibrant capital city with 2000+ years of history!", x: "65%", y: "20%" },
        { id: 2, name: "Samarkand", info: "🏛️ Ancient jewel of the Silk Road - over 2750 years old!", x: "55%", y: "40%" },
        { id: 3, name: "Bukhara", info: "🕌 City of mosques & madrasas - a living museum!", x: "45%", y: "50%" },
        { id: 4, name: "Khiva", info: "🏰 Historic fortress with magical Itchan Kala!", x: "30%", y: "45%" },
        { id: 5, name: "Nukus", info: "🎨 Capital of Karakalpakstan - land of art!", x: "15%", y: "25%" },
        { id: 6, name: "Fergana", info: "🌄 Beautiful valley city with rich culture!", x: "75%", y: "35%" },
        { id: 7, name: "Namangan", info: "🏔️ City in the stunning Fergana Valley!", x: "78%", y: "28%" },
        { id: 8, name: "Qarshi", info: "🌅 Southern city with ancient roots!", x: "48%", y: "65%" },
        { id: 9, name: "Andijan", info: "📜 Historic city in Fergana region!", x: "82%", y: "30%" },
        { id: 10, name: "Jizzakh", info: "🚪 Gateway between beautiful valleys!", x: "58%", y: "30%" },
        { id: 11, name: "Termez", info: "🪷 Ancient Buddhist center - 2500+ years!", x: "52%", y: "85%" },
        { id: 12, name: "Navoi", info: "🏭 Industrial hub with golden history!", x: "50%", y: "55%" },
        { id: 13, name: "Kokand", info: "👑 Historic khanate city of rulers!", x: "72%", y: "32%" },
        { id: 14, name: "Urgench", info: "🏺 Ancient town near magical Khiva!", x: "25%", y: "42%" },
      ]
    },
    uz: {
      hakimHello: "🌍 Bizning hikoyamiz ming yillar avval, afsonalar tug'ilgan diyorda boshlanadi! Shamollarda pichirlab aytilgan rivoyatlar avlodlar taqdirini shakllantirgan. Shaharlarga bosing va ularning ajoyib hikoyalarini kashf eting! 🏛️",
      next: "Safarni Davom Ettirish 🚀",
      mapHint: "🗺️ Yorqin shaharlarga bosing va ularning qadimiy sirlarini biling!",
      cities: [
        { id: 1, name: "Toshkent", info: "🌟 2000+ yillik tarixga ega jonli poytaxt!", x: "65%", y: "20%" },
        { id: 2, name: "Samarqand", info: "🏛️ Buyuk Ipak Yo'lining qadimiy duri - 2750+ yil!", x: "55%", y: "40%" },
        { id: 3, name: "Buxoro", info: "🕌 Masjidlar va madrasalar shahri - tirik muzey!", x: "45%", y: "50%" },
        { id: 4, name: "Xiva", info: "🏰 Sehrli Itchan Qal'asi bilan tarixiy qal'a!", x: "30%", y: "45%" },
        { id: 5, name: "Nukus", info: "🎨 Qoraqalpog'iston poytaxti - san'at diyori!", x: "15%", y: "25%" },
        { id: 6, name: "Farg'ona", info: "🌄 Boy madaniyatga ega go'zal vodiyshahar!", x: "75%", y: "35%" },
        { id: 7, name: "Namangan", info: "🏔️ Ajoyib Farg'ona vodiysidagi shahar!", x: "78%", y: "28%" },
        { id: 8, name: "Qarshi", info: "🌅 Qadimiy ildizlarga ega janubiy shahar!", x: "48%", y: "65%" },
        { id: 9, name: "Andijon", info: "📜 Farg'ona viloyatining tarixiy shahri!", x: "82%", y: "30%" },
        { id: 10, name: "Jizzax", info: "🚪 Go'zal vodiylar orasidagi darvoza!", x: "58%", y: "30%" },
        { id: 11, name: "Termiz", info: "🪷 Qadimiy Buddist markazi - 2500+ yil!", x: "52%", y: "85%" },
        { id: 12, name: "Navoiy", info: "🏭 Oltin tarixga ega sanoat markazi!", x: "50%", y: "55%" },
        { id: 13, name: "Qo'qon", info: "👑 Hukmdorlarning tarixiy xonlik shahri!", x: "72%", y: "32%" },
        { id: 14, name: "Urganch", info: "🏺 Sehrli Xiva yaqinidagi qadimiy shahar!", x: "25%", y: "42%" },
      ]
    },
    ru: {
      hakimHello: "🌍 Наша история начинается тысячи лет назад, в земле, где рождались мифы! Легенды шептали на ветру, формируя судьбу поколений. Нажмите на города, чтобы открыть их удивительные истории! 🏛️",
      next: "Продолжить Путешествие 🚀",
      mapHint: "🗺️ Нажмите на светящиеся города, чтобы узнать их древние секреты!",
      cities: [
        { id: 1, name: "Ташкент", info: "🌟 Яркая столица с 2000+ летней историей!", x: "65%", y: "20%" },
        { id: 2, name: "Самарканд", info: "🏛️ Древняя жемчужина Шелкового пути - 2750+ лет!", x: "55%", y: "40%" },
        { id: 3, name: "Бухара", info: "🕌 Город мечетей и медресе - живой музей!", x: "45%", y: "50%" },
        { id: 4, name: "Хива", info: "🏰 Историческая крепость с волшебной Ичан-Калой!", x: "30%", y: "45%" },
        { id: 5, name: "Нукус", info: "🎨 Столица Каракалпакстана - земля искусства!", x: "15%", y: "25%" },
        { id: 6, name: "Фергана", info: "🌄 Красивый город долины с богатой культурой!", x: "75%", y: "35%" },
        { id: 7, name: "Наманган", info: "🏔️ Город в потрясающей Ферганской долине!", x: "78%", y: "28%" },
        { id: 8, name: "Карши", info: "🌅 Южный город с древними корнями!", x: "48%", y: "65%" },
        { id: 9, name: "Андижан", info: "📜 Исторический город Ферганской области!", x: "82%", y: "30%" },
        { id: 10, name: "Джизак", info: "🚪 Врата между прекрасными долинами!", x: "58%", y: "30%" },
        { id: 11, name: "Термез", info: "🪷 Древний буддийский центр - 2500+ лет!", x: "52%", y: "85%" },
        { id: 12, name: "Навои", info: "🏭 Промышленный центр с золотой историей!", x: "50%", y: "55%" },
        { id: 13, name: "Коканд", info: "👑 Исторический город ханов и правителей!", x: "72%", y: "32%" },
        { id: 14, name: "Ургенч", info: "🏺 Древний город рядом с волшебной Хивой!", x: "25%", y: "42%" },
      ]
    },
  };

  const t = texts[language] || texts.en;

  // ✅ دالة تشغيل الصوت المحسنة - نفس OriginPage
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

  // 🌌 نجوم الخلفية المتحركة - نفس OriginPage
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

  // إنشاء تأثيرات النقر المحسنة - نفس OriginPage
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

  // عند تحميل الصفحة: قول جملة Hakim الأولى - نفس OriginPage
  useEffect(() => {
    setBubbleText(t.hakimHello);
    speakText(t.hakimHello, language);
  }, [language, t.hakimHello]);

  // تأثير عند النقر على المدينة
  const handleCityClick = (city, event) => {
    setActiveCity(city);
    createClickEffects(city, event);
    
    // إزالة التأثير بعد 5 ثواني
    setTimeout(() => {
      setActiveCity(null);
    }, 5000);
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
    <div className="page-container history-page">
      {/* 🌌 خلفية النجوم - نفس OriginPage */}
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

      {/* 🎙️ مؤشر الصوت - نفس OriginPage */}
      {isSpeaking && (
        <div className="speaking-indicator">
          <div className="pulse-animation"></div>
          🔊 {language === 'en' ? 'Hakim is speaking...' : language === 'uz' ? 'Hakim gapiramiz...' : 'Хаким говорит...'}
        </div>
      )}

      {/* 🤖 الروبوت + البالون - نفس OriginPage */}
      <div className="robot-container top-left history-robot-container">
        <img 
          ref={robotRef}
          src={robotImage} 
          alt="Hakim Robot" 
          className="robot-image history-robot-image"
          onClick={handleRobotClick}
        />

        <div className={`speech-bubble history-speech-bubble ${getTextSizeClass(bubbleText)}`}>
          <p 
  className={`font-${language}`} 
  style={{ margin: 0, lineHeight: '1.4' }}
>
  {bubbleText}
  {isSpeaking && <span style={{ animation: 'blink 1s infinite' }}>...</span>}
</p>

        </div>
      </div>

      {/* 🗺️ محتوى الصفحة الرئيسي */}
      <div className="main-content history-content">
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2 className={`history-page-title font-${language}`}>
  {language === 'en' ? 'Discover Ancient History' : 
   language === 'uz' ? 'Qadimiy Tarixni Kashf Etish' : 
   'Откройте Древнюю Историю'}
</h2>

          <p className={`history-page-subtitle font-${language}`}>{t.mapHint}</p>
        </div>

        <div className="history-media-container">
          {!showMap ? (
            <div className="video-container">
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                onEnded={() => setShowMap(true)}
                className="history-video-player"
              />
              <div className="video-overlay">
                <p className="video-hint">
                  {language === 'en' ? '🎬 Playing the amazing history...' : 
                   language === 'uz' ? '🎬 Ajoyib tarix ijro etilmoqda...' : 
                   '🎬 Воспроизведение удивительной истории...'}
                </p>
              </div>
            </div>
          ) : (
            <div className="history-map-container">
              <div className="history-map-wrapper">
                <img src={mapImage} alt="Silk Road Map" className="history-map-image" />
                {t.cities.map((city) => (
                  <div
                    key={city.id}
                    className={`history-city-dot ${activeCity?.id === city.id ? 'active' : ''}`}
                    style={{ left: city.x, top: city.y }}
                    onClick={(e) => handleCityClick(city, e)}
                  >
                    <div className="city-pulse"></div>
                    <span className="city-name-label">{city.name}</span>
                  </div>
                ))}
              </div>
              
              {/* معلومات المدينة - مع خلفية box.png */}
              {activeCity && (
                <div className="history-city-popup">
                  <div className={`history-city-popup-inner ${getTextSizeClass(activeCity.info)}`}>
                    <h3 className={`font-${language}`}>{activeCity.name}</h3>
<p className={`font-${language}`}>{activeCity.info}</p>

                    <button 
  onClick={() => setActiveCity(null)} 
  className={`font-${language}`}
>
  {language === 'en' ? 'Close' : language === 'uz' ? 'Yopish' : 'Закрыть'}
</button>

                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ⏭️ زرار Next يظهر بعد الخريطة */}
      {showMap && (
        <div className="history-next-container">
          <button className={`history-next-button font-${language}`} onClick={onNext}>
  {t.next}
</button>

        </div>
      )}
    </div>
  );
}