import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/register/", form);
      alert("Cadastro realizado com sucesso!");
      window.location.href = "/";
    } catch (err) {
      alert("Erro ao cadastrar.");
    }
  };

  return (

    <div className="register-page"> 
        {}
        <Navbar />

        {}
        <div className="register-container">
          <h2>Crie sua conta</h2>

          <form onSubmit={handleSubmit} className="register-form">
            <input name="username" placeholder="Usuário" onChange={handleChange}/>
            <input name="email" placeholder="Email" onChange={handleChange}/>
            <input name="password" type="password" placeholder="Senha" onChange={handleChange}/>
            <button type="submit">Cadastrar</button>
          </form>
        </div>

        {}
        <Footer />
    </div>
  );
}

export default RegisterPage;