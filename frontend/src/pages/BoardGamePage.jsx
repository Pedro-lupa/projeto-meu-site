import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import styles from './BoardGames.module.css';

function BoardGamePage() {
  const [boardGames, setBoardGames] = useState([]);

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/api/boardgames/';
    axios.get(apiUrl)
      .then(response => setBoardGames(response.data))
      .catch(error => console.error("Erro ao buscar jogos:", error));
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.bgPage}>

        <header className={styles.galleryHeader}>
          <Link to="/home" className={styles.backLink}>◀ Voltar</Link>
          <h1>Cantinho do Tabuleiro</h1>
          <p>Minha coleção Atual dos Jogos.</p>
        </header>

        <div className={styles.shelfDisplay}>
          <div className={styles.shelfRow3d}>
            {boardGames.map(game => (
              <Link to={`/boardgames/${game.id}`} key={game.id} className={styles.boardgameCard3d}>
                <div className={styles.cardContent3d}>
                  <img src={game.cover_image} alt={game.name} />
                </div>
                <span className={styles.gameTitle3d}>{game.name}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}

export default BoardGamePage;
