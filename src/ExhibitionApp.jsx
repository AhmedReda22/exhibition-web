import React, { useState } from "react";
import HoldingPage from "./pages/HoldingPage";
import OriginPage from "./pages/OriginPage";
import UnlockPage from "./pages/UnlockPage";
import HistoryPage from "./pages/HistoryPage";
import RoomsPage from "./pages/RoomsPage";

export default function ExhibitionApp() {
  const [language, setLanguage] = useState(null);
  const [page, setPage] = useState("holding");

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    setPage("origin");
  };

  return (
    <>
      {page === "holding" && (
        <HoldingPage onSelectLanguage={handleSelectLanguage} />
      )}
      {page === "origin" && (
        <OriginPage language={language} onNext={() => setPage("unlock")} />
      )}
      {page === "unlock" && (
        <UnlockPage language={language} onUnlock={() => setPage("history")} />
      )}
      {page === "history" && (
        <HistoryPage language={language} onNext={() => setPage("rooms")} />
      )}
      {page === "rooms" && (
        <RoomsPage language={language} onFinish={() => setPage("holding")} />
      )}
    </>
  );
}
