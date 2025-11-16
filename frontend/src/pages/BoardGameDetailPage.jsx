import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function BoardGameDetailPage() {

  const { gameId } = useParams();

  const [game, setGame] = useState(null);

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:8000/api/boardgames/${gameId}/`;

    axios.get(apiUrl)
      .then(response => {
        setGame(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar detalhes do jogo:", error);
      });
  }, [gameId]);

  if (!game) {
    return <div>Carregando regras...</div>;
  }

  return (
    <div className="boardgame-detail-page">
      <header>
        {}
        <Link to="/boardgames">Voltar para a lista</Link>
        <h1>{game.name}</h1>
      </header>

      <div className="detail-content">
        <img src={game.cover_image} alt={game.name} width="300" className="detail-cover" />
        
        <div className="rules-section">
          <h2>Regras</h2>
          {}
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {game.rules || 'Regras não cadastradas.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BoardGameDetailPage;