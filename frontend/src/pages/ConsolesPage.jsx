import React, { useState, useEffect } from 'react';
import api from '../services/api'; // <--- MUDANÇA 1: Usamos nosso serviço configurado
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Gamepad } from 'lucide-react';
import './ConsolesPage.css';

function ConsolesPage() {
  const [consoles, setConsoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Função para corrigir o link das imagens ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=Sem+Imagem";
    // Se já tiver http, usa direto. Se não, coloca o endereço do Django antes.
    if (imagePath.startsWith('http')) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  useEffect(() => {
    const fetchConsoles = async () => {
      try {
        console.log("Buscando consoles..."); 
        
        // --- MUDANÇA 2: Rota curta e autenticada ---
        const response = await api.get('consoles/');
        
        console.log("Consoles recebidos:", response.data);

        // Garante que pegamos a lista certa (seja paginada ou direta)
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
        <h2>As máquinas por trás de cada aventura.</h2>
      </div>

      <div className="consoles-grid">
        {loading ? (
          <p style={{textAlign:'center', gridColumn:'1/-1', color: '#ccc'}}>Carregando hardware...</p>
        ) : consoles.length > 0 ? (
          consoles.map(consoleItem => (
            <div key={consoleItem.id} className="console-card">
              <img 
                src={getImageUrl(consoleItem.photo || consoleItem.image)} 
                alt={consoleItem.name} 
              />
              <div className="console-info">
                <h3>{consoleItem.name}</h3>
              </div>
            </div>
          ))
        ) : (
          <p style={{textAlign:'center', gridColumn:'1/-1', color: '#ccc'}}>
            Nenhum console encontrado. <br/>
            (Vá no Admin e cadastre seus consoles!)
          </p>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default ConsolesPage;