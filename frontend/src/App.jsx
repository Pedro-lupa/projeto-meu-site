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

function App() {
  return (
    <Routes>
      {/* 1. A Raiz do site: Redireciona para /home (ou pode renderizar a Home direto) */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* 2. A rota principal pública */}
      <Route path="/home" element={<Home />} />

      {/* 3. A rota de Login (Importante ser /login para bater com o resto da lógica) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 4. Rotas de Cadastro (deixei as duas opções que você colocou) */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      {/* 5. Área Privada (Perfil) */}
      <Route path="/profile" element={<ProfilePage />} />

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