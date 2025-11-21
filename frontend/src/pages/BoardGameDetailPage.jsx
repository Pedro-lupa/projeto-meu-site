import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './BoardGameDetailPage.css';

function BoardGameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/boardgames/${id}/`)
      .then(response => setGame(response.data))
      .catch(error => console.error("Erro ao buscar detalhes do jogo:", error));
  }, [id]);

  if (!game) {
    return <p className="bd-loading">Carregando informações...</p>;
  }

  return (
    <div className="bd-container">

      <header className="bd-header">
        <Link to="/boardgames" className="bd-back">⟵ Voltar</Link>
        <h1>{game.name}</h1>
      </header>

      <div className="bd-content">
        <img src={game.cover_image} alt={game.name} className="bd-image" />

        <div className="bd-info">
          <h2>Descrição</h2>
          <p>{game.description}</p>

          <h3>Informações do Jogo</h3>
          <ul>
            <li><strong>Jogadores:</strong> {game.players}</li>
            <li><strong>Duração:</strong> {game.duration} minutos</li>
            <li><strong>Idade mínima:</strong> {game.min_age} anos</li>
          </ul>

          <h3>Regras</h3>
          <div className="bd-rules">
            <p>{game.rules}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default BoardGameDetailPage;
