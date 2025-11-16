import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function GameCard({ game }) {
  return (
    <div className="game-card">
      {}
      {game.cover_image && (
        <img src={game.cover_image} alt={game.title} width="200" />
      )}
      <h3>{game.title}</h3>
      <p>{game.genre}</p>
      {}
    </div>
  );
}

function GameList() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    
    const apiUrl = 'http://127.0.0.1:8000/api/games/';

    axios.get(apiUrl)
      .then(response => {
        
        const completedGames = response.data.filter(game => game.status === 'ZEREI');
        setGames(completedGames);
      })
      .catch(error => {
        console.error("Erro ao buscar os jogos:", error);
      });
  }, []);

  return (
    <section className="game-list-section">
      <h2>Jogos Zerados</h2>
      
      {}
      <div className="game-gallery">
        {games.length === 0 ? (
          <p>Carregando jogos zerados...</p>
        ) : (
        games.map(game => (
          
          <Link to={`/games/${game.id}`} key={game.id}>
            <GameCard game={game} />
          </Link>
        ))
        )}
      </div>
    </section>
  );
}

export default GameList;