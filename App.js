import React, { useState } from 'react';
import LoginScreen from './src/Login';
import NewsScreen from './src/News'; // Importamos a nova tela

export default function App() {
  // Estado para controlar se o usuário está logado
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função para ser chamada quando o login for bem-sucedido
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Função para ser chamada quando o usuário fizer logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Renderização condicional
  // Se estiver logado, mostra a tela de notícias.
  // Se não, mostra a tela de login.
  return (
    <>
      {isLoggedIn ? (
        <NewsScreen onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}