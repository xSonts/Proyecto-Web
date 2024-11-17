import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './assets/Componentes/Home';
import MainContent from './assets/Componentes/MainContent';
import ImageSection from './assets/Componentes/ImageSection';
import LogIn from './assets/Componentes/LogIn';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* Si el usuario está autenticado, redirige a Home */}
        {isAuthenticated ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route
            path="/"
            element={
              <div className="contenedor">
                {showLogin ? (
                  <LogIn
                    onLoginSuccess={handleLoginSuccess}
                    switchToRegister={() => setShowLogin(false)}
                  />
                ) : (
                  <MainContent
                    switchToLogin={() => setShowLogin(true)}
                  />
                )}
                <ImageSection /> {/* Imagen se muestra en registro e inicio de sesión */}
              </div>
            }
          />
        )}

        {/* Redirigir automáticamente a Home si ya está autenticado */}
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
