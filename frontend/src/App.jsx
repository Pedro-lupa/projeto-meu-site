import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import GameList from './components/GameList';
import { Link } from 'react-router-dom';

function App() {

  const [consoles, setConsoles] = useState([]);
  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/api/consoles/';

    console.log("Buscando dados da API...");

    axios.get(apiUrl)
      .then(response => {
        console.log("Dados recebidos:", response.data);
        setConsoles(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os dados:", error);
      });

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meu Acervo Geek by Lupa</h1>

        <nav>
          <Link to="/">Jogos Zerados</Link> | 
          <Link to="/boardgames">Jogos de Tabuleiro</Link> | 
          {}
        </nav>
        
        <h2>Meus Consoles</h2>
        
        {}
        {consoles.length === 0 ? (
          <p>Carregando consoles... (Verifique o terminal do backend e o admin!)</p>
        ) : (
          <ul>
            {consoles.map(console => (
              <li key={console.id}>
                {console.name}
                {}
                {console.photo && (
                  <img 
                    src={console.photo} 
                    alt={console.name} 
                    width="100" 
                  />
                )}
              </li>
            ))}
          </ul>
        )}

        {}
        
        <hr /> {}

        <GameList /> {}

      </header>
    </div>
  );
}

export default App;