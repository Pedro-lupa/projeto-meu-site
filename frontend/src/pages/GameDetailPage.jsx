import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function GameDetailPage() {
  const { gameId } = useParams();

  const [game, setGame] = useState(null);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const apiUrl = `http://127.0.0.1:8000/api/games/${gameId}/`;
    axios.get(apiUrl)
      .then(response => {
        setGame(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar detalhes do jogo:", error);
      });
  }, [gameId]);

  useEffect(() => {
  
    if (game && game.hall_of_fame_entry) {
      const teamApiUrl = `http://127.0.0.1:8000/api/halloffame/${game.hall_of_fame_entry}/`;
      
      axios.get(teamApiUrl)
        .then(response => {
          setTeam(response.data);
        })
        .catch(error => {
          console.error("Erro ao buscar equipa Pokémon:", error);
        });
    }
  }, [game]);

  if (!game) {
    return <div>Carregando detalhes do jogo...</div>;
  }

  return (
    <div className="game-detail-page">
      <header>
        {}
        <Link to="/">Voltar à Galeria</Link>
        <h1>{game.title}</h1>
      </header>

      <div className="detail-content">
        <img src={game.cover_image} alt={game.title} width="300" className="detail-cover" />
        
        <div className="game-specs">
          <h2>Informações</h2>
          <ul>
            <li><strong>Plataforma:</strong> {game.platform ? game.platform.name : 'N/A'}</li>
            <li><strong>Gênero:</strong> {game.genre}</li>
            <li><strong>Ano de Lançamento:</strong> {game.release_year}</li>
            <li><strong>Status:</strong> {game.status}</li>
            <li><strong>Minha Nota:</strong> {game.rating}</li>
            <li><strong>Tempo de Jogo:</strong> {game.play_time}</li>
            <li><strong>Observações:</strong> {game.observations}</li>
          </ul>
        </div>  
        {}
        {}
        {team && (
          <div className="pokemon-team">
            <h2>Equipa Vencedora (Hall da Fama)</h2>
            <p>{team.game_name}</p>
            {}
            <div className="team-grid">
              {team.sprite_1 && <img src={team.sprite_1} alt="Sprite 1" />}
              {team.sprite_2 && <img src={team.sprite_2} alt="Sprite 2" />}
              {team.sprite_3 && <img src={team.sprite_3} alt="Sprite 3" />}
              {team.sprite_4 && <img src={team.sprite_4} alt="Sprite 4" />}
              {team.sprite_5 && <img src={team.sprite_5} alt="Sprite 5" />}
              {team.sprite_6 && <img src={team.sprite_6} alt="Sprite 6" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameDetailPage;