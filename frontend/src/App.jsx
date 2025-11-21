import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/HomePage.jsx";
import BoardGamePage from "./pages/BoardGamePage";
import BoardGameDetailsPage from "./pages/BoardGameDetailPage.jsx";
import ConsolesPage from "./pages/ConsolesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PokemonPage from "./pages/PokemonPage.jsx";
import SuggestionsPage from "./pages/SuggestionsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/boardgames" element={<BoardGamePage />} />
      <Route path="/boardgames/:id" element={<BoardGameDetailsPage />} />
      <Route path="/consoles" element={<ConsolesPage />} />
      <Route path="/pokemon" element={<PokemonPage />} />
      <Route path="/sugestoes" element={<SuggestionsPage />} />
    </Routes>
  );
}

export default App;