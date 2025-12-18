import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Trophy, Star, Gamepad2, Dice5 } from 'lucide-react'; 
import './HomePage.css';

function HomePage() {

  const [videoGames, setVideoGames] = useState([]);
  const [boardGames, setBoardGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x400?text=Sem+Capa";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("--- INICIANDO BUSCA ---"); // ESPIÃO 1

        const gamesResponse = await api.get('my-games/'); 
        const boardGamesResponse = await api.get('boardgames/');

        // ESPIÃO 2: Mostra exatamente o que chegou do Backend
        console.log("DADOS CHEGARAM:", gamesResponse.data); 

        const formattedGames = gamesResponse.data.map(entry => {
            // Garante que pega os dados do jogo onde quer que eles estejam
            const gameData = entry.game || entry.game_catalog || {}; 
            return {
                ...entry,       
                ...gameData,    
                score: entry.rating || entry.score || 0 
            };
        });

        console.log("DADOS FORMATADOS:", formattedGames); // ESPIÃO 3

        setVideoGames(formattedGames);
        setBoardGames(boardGamesResponse.data);

      } catch (error) {
        console.error("ERRO FATAL:", error); // ESPIÃO DE ERRO
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- RESTO DO CÓDIGO IGUAL ---
  const pokemonGame = videoGames.find(game => 
    (game.title || game.name)?.toLowerCase().includes("pokemon")
  );

  let sortedGames = [...videoGames].sort((a, b) => 
    (b.rating || b.score) - (a.rating || a.score)
  );

  if (pokemonGame) {
    sortedGames = sortedGames.filter(game => game.id !== pokemonGame.id);
    sortedGames.unshift(pokemonGame);
  }

  const top3Games = sortedGames.slice(0, 3);
  const finishedGamesList = sortedGames.slice(3);

  const scrollCarousel = (direction) => {
    const carousel = document.getElementById('board-games-carousel');
    if (carousel) {
      const scrollAmount = direction === 'right' ? 300 : -300;
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="home-container" style={{justifyContent: 'center', alignItems: 'center'}}>
        <h2 style={{color: '#e100ff'}}>Carregando sua jornada...</h2>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Navbar />

      <section className="hero-section">
        <div className="hero-content">
          <h1>Bem-vindo à Minha Jornada Geek!</h1>
          <p>
            Este é o meu QG digital. Aqui registro minhas conquistas épicas nos games, 
            minha coleção de tabuleiros estratégicos e minha jornada Pokémon. 
            Sinta-se em casa e explore meu acervo!
          </p>
        </div>
      </section>

      {top3Games.length >= 3 ? (
        <section className="podium-section">
          <h2><Trophy color="#FFD700" className="section-icon" /> Hall da Fama: Top 3 Zerados</h2>
          <div className="podium-container">
            
            <div className="podium-item silver">
              <div className="podium-rank">2º</div>
              <div className="podium-image-container">
                  <img src={getImageUrl(top3Games[1].cover_image || top3Games[1].image)} alt={top3Games[1].title} />
              </div>
              <h3>{top3Games[1].title || top3Games[1].name}</h3>
              <span className="score"><Star size={14} fill="#C0C0C0" color="#C0C0C0"/> {top3Games[1].score || 0}</span>
            </div>

            <div className="podium-item gold">
              <div className="podium-rank">1º</div>
              <div className="podium-image-container">
                  <img src={getImageUrl(top3Games[0].cover_image || top3Games[0].image)} alt={top3Games[0].title} />
              </div>
              <h3>{top3Games[0].title || top3Games[0].name}</h3>
              <span className="score"><Star size={14} fill="#FFD700" color="#FFD700"/> {top3Games[0].score || 0}</span>
            </div>

            <div className="podium-item bronze">
              <div className="podium-rank">3º</div>
              <div className="podium-image-container">
                  <img src={getImageUrl(top3Games[2].cover_image || top3Games[2].image)} alt={top3Games[2].title} />
              </div>
              <h3>{top3Games[2].title || top3Games[2].name}</h3>
              <span className="score"><Star size={14} fill="#CD7F32" color="#CD7F32"/> {top3Games[2].score || 0}</span>
            </div>

          </div>
        </section>
      ) : (
        <div style={{textAlign: 'center', padding: '20px', color: '#888'}}>
            <p>Cadastre pelo menos 3 jogos na sua coleção para ver o Hall da Fama!</p>
            {/* Dica visual para saber quantos jogos tem carregados */}
            <p style={{fontSize: '12px'}}>Jogos carregados: {videoGames.length}</p>
        </div>
      )}

      {/* SEÇÃO TABULEIRO E LISTA GERAL (IGUAIS AO SEU CÓDIGO) */}
      {boardGames.length > 0 && (
        <section className="carousel-section">
          <h2><Dice5 className="section-icon" color="#E100FF" /> Minha Coleção de Tabuleiro</h2>
          <div className="carousel-nav-container">
            <div className="carousel-wrapper" id="board-games-carousel">
                <div className="carousel-container">
                {boardGames.map(game => (
                    <div key={game.id} className="carousel-card">
                    <img src={getImageUrl(game.cover_image || game.image)} alt={game.name} />
                    <div className="carousel-info">
                      <h4>{game.name || game.title}</h4>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            <button className="carousel-nav-btn left" onClick={() => scrollCarousel('left')}>&lt;</button>
            <button className="carousel-nav-btn right" onClick={() => scrollCarousel('right')}>&gt;</button>
          </div>
        </section>
      )}

      {finishedGamesList.length > 0 && (
        <section className="finished-games-section">
          <h2><Gamepad2 className="section-icon" color="#00BFFF" /> Biblioteca de Zerados</h2>
          <div className="games-grid">
            {finishedGamesList.map(game => (
              <div key={game.id} className="game-grid-card">
                <img src={getImageUrl(game.cover_image || game.image)} alt={game.title} />
                <div className="card-overlay">
                  <h4>{game.title || game.name}</h4>
                  <span className="score-badge">{game.score || 0}</span>
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