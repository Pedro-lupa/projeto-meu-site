import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/HomePage.jsx";
import BoardGamePage from "./pages/BoardGamePage";
import BoardGameDetailsPage from "./pages/BoardGameDetailPage.jsx";
import ConsolesPage from "./pages/ConsolesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PokemonPage from "./pages/PokemonPage.jsx";
import SuggestionsPage from "./pages/SuggestionsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/register" />;
};

function App() {
  return (
    <Routes>
      {/* 1. A Raiz do site: Redireciona para /home */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* 2. A rota principal pública */}
      <Route path="/home" element={<Home />} />

      {/* 3. A rota de Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* 4. Rotas de Cadastro */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      {/* 5. Área de Perfil (COM SUPORTE A VISITANTE) */}
      {/* O ":username?" permite acessar /profile (meu) ou /profile/pedrinho (visitante) */}
      <Route path="/profile/:username?" element={<ProfilePage />} />

      {/* 6. As outras páginas */}
      <Route path="/boardgames" element={<BoardGamePage />} />
      <Route path="/boardgames/:id" element={<BoardGameDetailsPage />} />
      <Route path="/consoles" element={<ConsolesPage />} />
      <Route path="/pokemon" element={<PokemonPage />} />
      <Route path="/sugestoes" element={<SuggestionsPage />} />

    </Routes>
  );
}

export default App;