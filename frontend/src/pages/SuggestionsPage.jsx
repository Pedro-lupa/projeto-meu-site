import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./SuggestionsPage.css";

function SuggestionsPage() {
  const [category, setCategory] = useState("zerar");
  const [message, setMessage] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/feedback/", {
        category,
        message,
      });
      setFeedbackSent(true);
      setMessage("");
    } catch (error) {
      console.error("Erro ao enviar sugestão:", error);
    }
  };

  return (
    <div className="suggestions-page">
      <Navbar />

      <div className="suggestions-container">
        <h1>💡 Sugestões</h1>
        <p className="sub">
          Aqui você pode recomendar jogos para eu zerar, sugerir board games,
          dar opiniões sobre o site ou qualquer outra ideia!
        </p>

        <form className="suggestions-form" onSubmit={handleSubmit}>
          <label>Categoria da sugestão</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="zerar">Jogos para eu zerar</option>
            <option value="boardgames">Jogos de tabuleiro para comprar</option>
            <option value="site">Opinião sobre o site</option>
            <option value="outro">Outro tipo de sugestão</option>
          </select>

          <label>Sua sugestão</label>
          <textarea
            placeholder="Escreva aqui..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="submit">Enviar</button>
        </form>

        {feedbackSent && (
          <p className="success-msg">✔ Sugestão enviada com sucesso!</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SuggestionsPage;