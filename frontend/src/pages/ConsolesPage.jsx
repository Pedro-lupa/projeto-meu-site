import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Gamepad } from 'lucide-react';
import './ConsolesPage.css';

function ConsolesPage() {
  const [consoles, setConsoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsoles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/consoles/');
        const data = response.data.results ? response.data.results : response.data;
        setConsoles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar consoles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsoles();
  }, []);

  return (
    <div className="consoles-container">
      <Navbar />
      
      <div className="consoles-header">
        <h1><Gamepad size={40} style={{verticalAlign:'middle', marginRight:'10px'}}/> Meus Consoles</h1>
        <h2>As máquina por trás de cada aventura.</h2>
      </div>

      <div className="consoles-grid">
        {loading ? (
          <p style={{textAlign:'center', gridColumn:'1/-1'}}>Carregando hardware...</p>
        ) : consoles.length > 0 ? (
          consoles.map(console => (
            <div key={console.id} className="console-card">
              {}
              <img src={console.photo || console.image || "https://via.placeholder.com/300x200?text=Console"} alt={console.name} />
              <div className="console-info">
                <h3>{console.name}</h3>
              </div>
            </div>
          ))
        ) : (
          <p style={{textAlign:'center', gridColumn:'1/-1'}}>Nenhum console encontrado no banco de dados.</p>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default ConsolesPage;