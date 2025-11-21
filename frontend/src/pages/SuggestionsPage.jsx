import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './SuggestionsPage.css';

function SuggestionsPage() {
  const [formData, setFormData] = useState({ nome: '', tipo: 'jogo', sugestao: '' });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  const handleSubmit = (e) => { e.preventDefault(); alert("Sugestão enviada!"); setFormData({ nome: '', tipo: 'jogo', sugestao: '' }); };

  return (
    <div className="suggestions-container">
      <Navbar />
      <div className="form-wrapper">
        <div className="suggestion-box">
          <h1>Caixa de Sugestões</h1>
          <p>Mande sua dica!</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Seu Nome:</label><input type="text" name="nome" value={formData.nome} onChange={handleChange} required /></div>
            <div className="form-group"><label>Tipo:</label><select name="tipo" value={formData.tipo} onChange={handleChange}><option value="jogo">Video Game</option><option value="tabuleiro">Tabuleiro</option></select></div>
            <div className="form-group"><label>Mensagem:</label><textarea name="sugestao" rows="5" value={formData.sugestao} onChange={handleChange} required></textarea></div>
            <button type="submit" className="btn-submit">ENVIAR</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default SuggestionsPage;