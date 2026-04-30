import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { I18nProvider } from "./i18n"; 
import RequireAuth from "./components/RequireAuth";
import useLocalStorage from "./hooks/useLocalStorage";
import LoginPage from "./pages/LoginPage";
import MangaEditor from "./pages/MangaEditor";

export default function App() {
const [lang, setLang] = useLocalStorage('kriative_lang', 'pt-BR');
  const [isDark] = useLocalStorage('k_theme_mode', true);

  useEffect(() => {
    const root = document.documentElement;
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
  }, [isDark]);

  return (
    <AuthProvider>
      <I18nProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rota Direta: Sem intermediários, sem ProtectedLayout */}
          <Route 
            path="/" 
            element={
              <RequireAuth>
                <MangaEditor lang={lang} setLang={setLang} />
              </RequireAuth>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </I18nProvider>
    </AuthProvider>
  );
}