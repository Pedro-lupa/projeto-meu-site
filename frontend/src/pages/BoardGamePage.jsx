import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BoardGamePage.css';

function BoardGamePage() {
  const [boardGames, setBoardGames] = useState([]);

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/api/boardgames/';
    axios.get(apiUrl)
      .then(response => {
        setBoardGames(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar jogos de tabuleiro:", error);
      });
  }, []);

  return (
    <div className="boardgame-page">
      {}
      <header>
        <Link to="/">Voltar à Home</Link>
        <h1>Cantinho do Tabuleiro</h1>
        <p>Minha coleção de jogos de mesa.</p>
      </header>
      
      <div className="boardgame-gallery">
        {boardGames.length === 0 ? (
          <p className="loading-message">Carregando jogos...</p>
        ) : (
          boardGames.map(game => (
            <Link to={`/boardgames/${game.id}`} key={game.id} className="boardgame-card">
              <img src={game.cover_image} alt={game.name} />
              <h3>{game.name}</h3>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default BoardGamePage;