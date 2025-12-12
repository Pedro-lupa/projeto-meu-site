import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // <--- IMPORTANTE: Importamos o serviço da API
import './LoginPage.css';

// --- ÍCONES (Mantive seus ícones originais) ---
const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const IconGithub = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61 c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0 C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77 a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7 A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const IconLinkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const IconGamepad = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="10" y2="12"></line>
    <line x1="8" y1="10" x2="8" y2="14"></line>
    <line x1="15" y1="13" x2="15.01" y2="13"></line>
    <line x1="18" y1="11" x2="18.01" y2="11"></line>
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
  </svg>
);

const IconTrophy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21 C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21 C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const IconDice = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 8h.01"></path>
    <path d="M8 8h.01"></path>
    <path d="M8 16h.01"></path>
    <path d="M16 16h.01"></path>
    <path d="M12 12h.01"></path>
  </svg>
);

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para guardar mensagens de erro
  const navigate = useNavigate();

  // --- LÓGICA DE LOGIN CONECTADA AO BACKEND ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpa erros antigos

    try {
      // 1. Envia E-mail e Senha para o Django
      const response = await api.post('token-auth/', { email, password });
      
      // 2. Recebe o Token e o Username
      const { token, username } = response.data;

      // 3. Salva no navegador
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      console.log("Login Sucesso:", username);

      // 4. Redireciona e recarrega para atualizar a Navbar
      navigate('/home');
      window.location.reload(); 

    } catch (err) {
      console.error("Erro no login:", err);
      setError('E-mail ou senha incorretos! Tente novamente.');
    }
  };

  return (
    <div className="login-page">

      {/*NAVBAR*/}
      <nav className="login-nav">
        <div className="nav-left">
          <Link to="/">Home</Link>
          <Link to="/sobre">Sobre Mim</Link>
          <Link to="/contato">Contato</Link>
        </div>

        <div className="nav-right">
          <a href="https://www.instagram.com/pedro_jpln/?hl=pt-br" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
            <IconInstagram />
          </a>
          <a href="https://github.com/Pedro-lupa" target="_blank" rel="noopener noreferrer" className="social-icon" title="GitHub">
            <IconGithub />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="social-icon" title="LinkedIn">
            <IconLinkedin />
          </a>
        </div>
      </nav>

      {/*LOGIN BOX*/}
      <div className="login-container">
        <div className="login-box">
          <h1>GEEK’S JOURNEY</h1>
          <h2>Explorando Mundos Virtuais & Reais</h2>

          <p className="login-subtitle">
            Seu portal para minha biblioteca de jogos,<br />
            conquistas e aventuras de tabuleiro.
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Seu E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Sua Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* MENSAGEM DE ERRO (Só aparece se der erro) */}
            {error && <p style={{ color: '#ff4444', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</p>}

            <button type="submit" className="btn-login">
              ENTRAR NA JORNADA
            </button>
          </form>

          <div className="signup-link">
            <p>
              Ainda não tem uma conta?
              <Link to="/cadastro"> Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- BOTÕES NEON*/}
      <div className="neon-buttons-container">
        <button className="neon-btn purple">
          <span style={{ display: 'flex', marginRight: 8 }}><IconGamepad /></span>
          Biblioteca
        </button>

        <button className="neon-btn blue">
          <span style={{ display: 'flex', marginRight: 8 }}><IconTrophy /></span>
          Hall da Fama
        </button>

        <button className="neon-btn purple-outline">
          <span style={{ display: 'flex', marginRight: 8 }}><IconDice /></span>
          Tabuleiro
        </button>
      </div>

    </div>
  );
}

export default LoginPage;