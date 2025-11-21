import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './PokemonPage.css';

function PokemonPage() {

  const [activeTab, setActiveTab] = useState('games');
  const [activeGeneration, setActiveGeneration] = useState(1);
  const [pokemonGames, setPokemonGames] = useState([]);
  const [pokedex, setPokedex] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const generationLimits = {
    1: { name: 'Kanto', start: 1, end: 151 },
    2: { name: 'Johto', start: 152, end: 251 },
    3: { name: 'Hoenn', start: 252, end: 386 },
    4: { name: 'Sinnoh', start: 387, end: 493 },
    5: { name: 'Unova', start: 494, end: 649 },
    6: { name: 'Kalos', start: 650, end: 721 },
    7: { name: 'Alola', start: 722, end: 809 },
    8: { name: 'Galar', start: 810, end: 905 },
    9: { name: 'Paldea', start: 906, end: 1025 },
  };
  
  const totalGenerations = Object.keys(generationLimits).map(Number);


  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/api/games/';

    axios.get(apiUrl)
      .then(response => {
        const games = response.data.filter(game => 
          game.title.toLowerCase().includes('pokemon') || 
          game.title.toLowerCase().includes('pokémon')
        );
        setPokemonGames(games);
      })
      .catch(error => {
        console.error("Erro ao buscar jogos de Pokémon:", error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/pokedex/')
      .then(res => setPokedex(res.data))
      .catch(err => console.error("Erro ao buscar Pokédex:", err));
  }, []);

  const toggleCapture = (id, isShiny) => {
    const pokemon = pokedex.find(p => p.pokedex_id === id);
    const field = isShiny ? 'is_shiny_captured' : 'is_captured';
    
    const newStatus = !pokemon[field];
    
    setPokedex(pokedex.map(p => 
      p.pokedex_id === id ? { ...p, [field]: newStatus } : p
    ));

    axios.patch(`http://127.0.0.1:8000/api/pokedex/${id}/`, {
      [field]: newStatus
    });
  };

  const filteredDex = pokedex.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentGenInfo = generationLimits[activeGeneration];
  const genStart = currentGenInfo.start;
  const genEnd = currentGenInfo.end;

  const currentGenerationContent = filteredDex.filter(poke => 
    poke.pokedex_id >= genStart && poke.pokedex_id <= genEnd
  );

  const pokedexGridContent = currentGenerationContent;


  return (
    <div className="pokemon-page">
      
      <Navbar />

      <header className="pokemon-header">
        <h1>CENTRO POKÉMON</h1>

        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            Meus Jogos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pokedex' ? 'active' : ''}`}
            onClick={() => setActiveTab('pokedex')}
          >
            National Dex
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shiny' ? 'active' : ''}`}
            onClick={() => setActiveTab('shiny')}
            >
            Shiny Dex
          </button>
        </div>
      </header>

      {activeTab === 'games' && (
        <div className="pokemon-grid">
          {pokemonGames.length === 0 ? (
            <p>Nenhum jogo de Pokémon encontrado...</p>
          ) : (
            pokemonGames.map(game => (
              <Link to={`/games/${game.id}`} key={game.id} className="pokemon-card">
                
                <div className="card-image-container">
                  <img src={game.cover_image} alt={game.title} className="game-cover" />
                </div>

                <div className="card-info">
                  <h3>{game.title}</h3>
                  <span className="platform-tag">{game.platform ? game.platform.name : 'Console'}</span>
                  
                  {game.hall_of_fame_entry ? (
                    <div className="hall-of-fame-preview">
                      <h4>Hall da Fama</h4>
                      <div className="team-sprites">
                        {game.hall_of_fame_entry.sprite_1 && <img src={game.hall_of_fame_entry.sprite_1} alt="P1" />}
                        {game.hall_of_fame_entry.sprite_2 && <img src={game.hall_of_fame_entry.sprite_2} alt="P2" />}
                        {game.hall_of_fame_entry.sprite_3 && <img src={game.hall_of_fame_entry.sprite_3} alt="P3" />}
                        {game.hall_of_fame_entry.sprite_4 && <img src={game.hall_of_fame_entry.sprite_4} alt="P4" />}
                        {game.hall_of_fame_entry.sprite_5 && <img src={game.hall_of_fame_entry.sprite_5} alt="P5" />}
                        {game.hall_of_fame_entry.sprite_6 && <img src={game.hall_of_fame_entry.sprite_6} alt="P6" />}
                      </div>
                    </div>
                  ) : (
                    <div className="no-team">
                      <p>Sem registro</p>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {(activeTab === 'pokedex' || activeTab === 'shiny') && (
        <div className="dex-container">
          <input 
            type="text" 
            placeholder="Buscar Pokémon..." 
            className="dex-search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="gen-selector">
              {totalGenerations.map(genNum => (
                  <button
                      key={genNum}
                      className={`gen-btn ${activeGeneration === genNum ? 'active-gen' : ''}`}
                      onClick={() => setActiveGeneration(genNum)}
                  >
                      Gen {genNum} ({generationLimits[genNum].name})
                  </button>
              ))}
          </div>

          <p className="box-title">
            {currentGenInfo.name} - 
            {activeTab === 'shiny' ? ' SHINY DEX' : ' POKÉDEX '}
          </p>
          
          <div className="dex-grid">
            {pokedexGridContent.map((poke) => {
              
              const isShinyMode = activeTab === 'shiny';
              const isCaught = isShinyMode ? poke.is_shiny_captured : poke.is_captured;
              const sprite = isShinyMode ? poke.shiny_sprite_url : poke.sprite_url;

              return (
                <div 
                  key={poke.pokedex_id} 
                  className={`dex-card ${isCaught ? 'caught' : ''}`}
                  onClick={() => toggleCapture(poke.pokedex_id, isShinyMode)}
                >
                  <span className="dex-num">#{String(poke.pokedex_id).padStart(3, '0')}</span>
                  <img src={sprite} alt={poke.name} loading="lazy" />
                  <span className="dex-name">{poke.name}</span>
                  {isCaught && <span className="check-icon">✔</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}

export default PokemonPage;