import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trophy, Star, Gamepad2, Dice5, Search, Users, Eye } from 'lucide-react'; 
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const [videoGames, setVideoGames] = useState([]);
  const [boardGames, setBoardGames] = useState([]);
  const [popularProfiles, setPopularProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- CORREÇÃO DE IMAGENS ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x400?text=Sem+Capa";
    if (imagePath.startsWith('http')) return imagePath;
    // Remove barra duplicada se existir
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `http://127.0.0.1:8000/${cleanPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesResponse, boardGamesResponse, profilesResponse] = await Promise.all([
            api.get('library/'),        
            api.get('boardgames/'),   
            api.get('profiles/?ordering=-profile_views') 
        ]);

        const rawGames = Array.isArray(gamesResponse.data) ? gamesResponse.data : (gamesResponse.data.results || []);
        const rawBoard = Array.isArray(boardGamesResponse.data) ? boardGamesResponse.data : (boardGamesResponse.data.results || []);
        const rawProfiles = Array.isArray(profilesResponse.data) ? profilesResponse.data : (profilesResponse.data.results || []);

        const formattedGames = rawGames.map(entry => {
            // Tenta pegar dados do game_catalog ou game direto
            const gameData = entry.game_catalog || entry.game || {}; 
            return {
                id: entry.id,
                title: gameData.title || "Jogo Sem Título",
                // Tenta pegar cover_image, se não tiver, tenta cover_url
                image: gameData.cover_image || gameData.cover_url,
                score: entry.rating || 0, // Se for null, vira 0
                status: entry.status
            };
        });

        setVideoGames(formattedGames);
        setBoardGames(rawBoard);
        setPopularProfiles(rawProfiles.slice(0, 5)); 

      } catch (error) {
        console.error("Erro ao carregar Home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          navigate(`/profile/${searchQuery.trim()}`);
      }
  };

  // --- HALL DA FAMA: FILTRA ZEROS ---
  // Só mostra no podium jogos que tenham nota maior que 0
  const sortedGames = [...videoGames]
    .filter(g => g.score > 0) 
    .sort((a, b) => b.score - a.score);
    
  const top3Games = sortedGames.slice(0, 3);
  
  // O restante dos jogos (incluindo os sem nota) vai pra lista geral
  // Filtramos para não repetir os que já estão no Top 3
  const top3Ids = new Set(top3Games.map(g => g.id));
  const otherGames = videoGames.filter(g => !top3Ids.has(g.id));

  if (loading) return <div className="home-container loading-screen"><h2>Carregando...</h2></div>;

  return (
    <div className="home-container">
      <Navbar />

      <section className="hero-section">
        <div className="hero-content">
          <h1>Bem-vindo à Minha Jornada Geek!</h1>
          <p>Meu QG digital de jogos e coleções.</p>
          
          <form onSubmit={handleSearch} className="hero-search-form">
              <input 
                  type="text" 
                  placeholder="Pesquisar Perfil (ex: lupa)..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit"><Search size={20} /></button>
          </form>
        </div>
      </section>

      {/* COMUNIDADE */}
      {popularProfiles.length > 0 && (
          <section className="community-section">
              <h2><Users className="section-icon" color="#00f7ff" /> Comunidade</h2>
              <div className="profiles-grid">
                  {popularProfiles.map(profile => (
                      <Link to={`/profile/${profile.username}`} key={profile.username} className="profile-card-link">
                          <div className="profile-card-home">
                              <img 
                                  src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                                  alt={profile.username}
                                  // Adiciona fallback se a imagem quebrar
                                  onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`; }}
                              />
                              <div className="profile-info-home">
                                  <h4>{profile.username}</h4>
                                  <span className="views-badge"><Eye size={12}/> {profile.profile_views || 0}</span>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          </section>
      )}

      {/* HALL DA FAMA (SÓ APARECE SE TIVER JOGO COM NOTA) */}
      {top3Games.length > 0 ? (
        <section className="podium-section">
          <h2><Trophy color="#FFD700" className="section-icon" /> Hall da Fama</h2>
          <div className="podium-container">
            
            {/* 2º Lugar */}
            {top3Games[1] && (
                <div className="podium-item silver">
                    <div className="podium-rank">2º</div>
                    <div className="podium-image-container">
                        <img src={getImageUrl(top3Games[1].image)} alt={top3Games[1].title} />
                    </div>
                    <h3>{top3Games[1].title}</h3>
                    <span className="score"><Star size={14} fill="#C0C0C0" color="#C0C0C0"/> {top3Games[1].score}</span>
                </div>
            )}

            {/* 1º Lugar */}
            {top3Games[0] && (
                <div className="podium-item gold">
                    <div className="podium-rank">1º</div>
                    <div className="podium-image-container">
                        <img src={getImageUrl(top3Games[0].image)} alt={top3Games[0].title} />
                    </div>
                    <h3>{top3Games[0].title}</h3>
                    <span className="score"><Star size={14} fill="#FFD700" color="#FFD700"/> {top3Games[0].score}</span>
                </div>
            )}

            {/* 3º Lugar */}
            {top3Games[2] && (
                <div className="podium-item bronze">
                    <div className="podium-rank">3º</div>
                    <div className="podium-image-container">
                        <img src={getImageUrl(top3Games[2].image)} alt={top3Games[2].title} />
                    </div>
                    <h3>{top3Games[2].title}</h3>
                    <span className="score"><Star size={14} fill="#CD7F32" color="#CD7F32"/> {top3Games[2].score}</span>
                </div>
            )}
          </div>
        </section>
      ) : (
          /* MENSAGEM SE NÃO TIVER JOGOS AVALIADOS */
          <div style={{textAlign: 'center', padding: 40}}>
              <h3>Dê notas aos seus jogos para vê-los no Hall da Fama!</h3>
          </div>
      )}

      {/* LISTA GERAL DE JOGOS */}
      {otherGames.length > 0 && (
        <section className="finished-games-section">
          <h2><Gamepad2 className="section-icon" color="#00BFFF" /> Minha Biblioteca</h2>
          <div className="games-grid">
            {otherGames.map(game => (
              <div key={game.id} className="game-grid-card">
                <img 
                    src={getImageUrl(game.image)} 
                    alt={game.title}
                    onError={(e) => { e.target.style.display = 'none'; }} // Esconde se quebrar
                />
                <span className="score-badge">{game.score > 0 ? game.score : '-'}</span>
                
                <div className="card-overlay">
                  <h4>{game.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default HomePage;