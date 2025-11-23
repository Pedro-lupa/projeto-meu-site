import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "./BoardGameDetailPage.css";

function BoardGameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/boardgames/${id}/`)
      .then(response => setGame(response.data))
      .catch(error => console.error("Erro ao buscar detalhes do jogo:", error));
  }, [id]);

  if (!game) {
    return (
      <>
        <Navbar />
        <p className="loading">Carregando informações...</p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bgPage">

        <header className="header">
          <Link to="/boardgames" className="backLink">⟵ Voltar</Link>
          <h1>{game.name}</h1>
        </header>

        <section className="contentWrapper">

          <div className="coverBox">
            <img src={game.cover_image} alt={game.name} className="coverImage" />
          </div>

          <div className="infoBox">
            <h2>Descrição</h2>
            <p>{game.description || "Sem descrição cadastrada."}</p>

            <h3>Informações do Jogo</h3>
            <ul>
              <li><strong>Mín. Jogadores:</strong> {game.min_players ?? "?"}</li>
              <li><strong>Máx. Jogadores:</strong> {game.max_players ?? "?"}</li>
              <li><strong>Duração:</strong> {game.play_time || "Não informado"}</li>
              <li><strong>Idade mínima:</strong> {game.age || "Não informado"}</li>
              <li><strong>Editora:</strong> {game.publisher || "Não informado"}</li>
              <li><strong>Ano:</strong> {game.year ?? "Não informado"}</li>
            </ul>

            <h3>Regras</h3>
            <div className="rulesBox">
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {game.rules || "Nenhuma regra cadastrada."}
              </pre>
            </div>
          </div>

        </section>
      </div>

      <Footer />
    </>
  );
}

export default BoardGameDetailPage;