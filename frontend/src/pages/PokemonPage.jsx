import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PokemonPage.css';

function PokemonPage() {
  const [activeTab, setActiveTab] = useState('games'); // Começa mostrando seus Jogos
  const [activeGeneration, setActiveGeneration] = useState(1);
  
  // Dados
  const [pokemonGames, setPokemonGames] = useState([]);
  const [pokedex, setPokedex] = useState([]);
  
  // Controle visual (Cinza vs Colorido)
  const [myCapturedIds, setMyCapturedIds] = useState(new Set());
  const [myShinyIds, setMyShinyIds] = useState(new Set());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
    async function fetchData() {
      try {
        setLoading(true);
        
        // Busca TUDO de uma vez
        const [gamesRes, dexRes, userRes] = await Promise.all([
            api.get('library/'),      // Seus jogos
            api.get('pokedex/'),      // Pokédex Global
            api.get('user-pokemon/')  // O que você já marcou
        ]);

        // 1. Processa Jogos (Filtra só Pokémon)
        const gamesData = Array.isArray(gamesRes.data) ? gamesRes.data : (gamesRes.data.results || []);
        const pkmGames = gamesData.filter(entry => {
           const title = entry.game_catalog?.title || entry.game?.title || "";
           return title.toLowerCase().includes('pokemon') || title.toLowerCase().includes('pokémon');
        });
        setPokemonGames(pkmGames);

        // 2. Processa Pokédex
        const rawDex = Array.isArray(dexRes.data) ? dexRes.data : (dexRes.data.results || []);
        setPokedex(rawDex);

        // 3. Processa Capturas (Quem é Normal e quem é Shiny)
        const rawUser = Array.isArray(userRes.data) ? userRes.data : (userRes.data.results || []);
        const captured = new Set();
        const shiny = new Set();

        rawUser.forEach(u => {
            const pid = u.pokemon.pokedex_id || u.pokemon;
            if (u.is_shiny) shiny.add(pid);
            else captured.add(pid);
        });

        setMyCapturedIds(captured);
        setMyShinyIds(shiny);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const toggleCapture = async (id, isShinyMode) => {
    const targetSet = isShinyMode ? myShinyIds : myCapturedIds;
    
    // Se já tiver, não faz nada (apenas visualiza)
    if (targetSet.has(id)) return;

    try {
        await api.post('user-pokemon/', {
            pokemon: id,
            is_shiny: isShinyMode
        });

        // Atualiza visualmente na hora
        if (isShinyMode) {
            setMyShinyIds(prev => new Set(prev).add(id));
        } else {
            setMyCapturedIds(prev => new Set(prev).add(id));
        }
    } catch (error) {
        console.error("Erro ao salvar:", error);
    }
  };

  // Lógica de Filtros
  const currentGenInfo = generationLimits[activeGeneration];
  const genStart = currentGenInfo.start;
  const genEnd = currentGenInfo.end;

  const filteredDex = pokedex.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(p.pokedex_id).includes(searchTerm);
    const matchesGen = p.pokedex_id >= genStart && p.pokedex_id <= genEnd;
    return matchesSearch && matchesGen;
  });

  if (loading) return <div className="pokemon-page"><h2 style={{color:'#fff', textAlign:'center', paddingTop: 50}}>Carregando Portfólio Pokémon...</h2></div>;

  return (
    <div className="pokemon-page">
      <Navbar />

      <header className="pokemon-header">
        <h1>CENTRO POKÉMON</h1>
        <p>Meu Portfólio Completo: Jogos e Capturas.</p>

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
            Pokédex Nacional
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shiny' ? 'active' : ''}`}
            onClick={() => setActiveTab('shiny')}
            >
            Shiny Dex
          </button>
        </div>
      </header>

      {/* --- ABA 1: MEUS JOGOS --- */}
      {activeTab === 'games' && (
        <div className="pokemon-grid">
          {pokemonGames.length === 0 ? (
            <div className="empty-state-games">
                <p>Nenhum jogo de Pokémon encontrado na sua biblioteca.</p>
                <Link to="/consoles" style={{color: '#e100ff'}}>Adicionar jogo na biblioteca</Link>
            </div>
          ) : (
            pokemonGames.map(entry => {
              const game = entry.game_catalog || entry.game;
              // Assumindo que os dados do Hall da Fama vêm no objeto do jogo
              const hallOfFame = game.hall_of_fame_entry; 

              return (
                <Link to={`/boardgames/${entry.id}`} key={entry.id} className="pokemon-card-game">
                    <div className="card-image-container">
                        <img src={game.cover_image || game.cover_url} alt={game.title} className="game-cover" />
                    </div>
                    <div className="card-info">
                        <h3>{game.title}</h3>
                        <span className="platform-tag">{game.platform?.name || 'Console'}</span>
                        
                        {/* --- SEÇÃO HALL DA FAMA --- */}
                        <div className="hall-of-fame-section">
                          {hallOfFame ? (
                            <>
                              <h4>HALL DA FAMA</h4>
                              <div className="team-sprites">
                                {hallOfFame.sprite_1 && <img src={hallOfFame.sprite_1} alt="Pokémon 1" />}
                                {hallOfFame.sprite_2 && <img src={hallOfFame.sprite_2} alt="Pokémon 2" />}
                                {hallOfFame.sprite_3 && <img src={hallOfFame.sprite_3} alt="Pokémon 3" />}
                                {hallOfFame.sprite_4 && <img src={hallOfFame.sprite_4} alt="Pokémon 4" />}
                                {hallOfFame.sprite_5 && <img src={hallOfFame.sprite_5} alt="Pokémon 5" />}
                                {hallOfFame.sprite_6 && <img src={hallOfFame.sprite_6} alt="Pokémon 6" />}
                              </div>
                            </>
                          ) : (
                            <p className="no-hof">Ainda não zerei / Sem registro</p>
                          )}
                        </div>

                    </div>
                </Link>
              )
            })
          )}
        </div>
      )}

      {/* --- ABA 2 e 3: POKÉDEX & SHINY DEX --- */}
      {(activeTab === 'pokedex' || activeTab === 'shiny') && (
        <div className="dex-container">
          
          <input 
            type="text" 
            placeholder="Buscar Pokémon (nome ou número)..." 
            className="dex-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="gen-selector">
              {totalGenerations.map(genNum => (
                  <button
                      key={genNum}
                      className={`gen-btn ${activeGeneration === genNum ? 'active-gen' : ''}`}
                      onClick={() => setActiveGeneration(genNum)}
                  >
                      Gen {genNum}
                  </button>
              ))}
          </div>

          <h3 className="box-title">
            {currentGenInfo.name} - 
            {activeTab === 'shiny' ? <span style={{color: '#FFD700'}}> SHINY DEX</span> : <span style={{color: '#00f7ff'}}> POKÉDEX</span>}
          </h3>
          
          <div className="dex-grid">
            {filteredDex.map((poke) => {
              const isShinyMode = activeTab === 'shiny';
              // Verifica se eu tenho
              const isCaught = isShinyMode ? myShinyIds.has(poke.pokedex_id) : myCapturedIds.has(poke.pokedex_id);
              const sprite = isShinyMode ? poke.shiny_sprite_url : poke.sprite_url;

              return (
                <div 
                  key={poke.pokedex_id} 
                  // Controla a cor (Cinza ou Colorido) via classe CSS
                  className={`dex-card ${isCaught ? 'caught' : 'uncaptured'} ${isShinyMode ? 'shiny-mode' : ''}`}
                  onClick={() => toggleCapture(poke.pokedex_id, isShinyMode)}
                  title={isCaught ? "Capturado!" : "Clique para marcar"}
                >
                  <span className="dex-num">#{String(poke.pokedex_id).padStart(3, '0')}</span>
                  
                  <div className="sprite-container">
                    <img src={sprite} alt={poke.name} loading="lazy" />
                  </div>
                  
                  <span className="dex-name">{poke.name}</span>
                  
                  {isCaught && <div className="check-badge">✔</div>}
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