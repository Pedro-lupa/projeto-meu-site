import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ProfilePage.css";

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token'); 

    useEffect(() => {
        if (!token) {
            setError("Você precisa estar logado para ver o perfil.");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/profile/",
                    {
                        headers: {
                            Authorization: `Token ${token}` 
                        }
                    }
                );
                setProfile(response.data);
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
                setError("Falha ao carregar os dados do perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    if (loading) {
        return <p className="loading-state">Carregando perfil...</p>;
    }

    if (error) {
        return (
            <div className="profile-page">
                <Navbar />
                <div className="error-message">
                    <h1>Acesso Negado</h1>
                    <p>{error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!profile) return null; 

    return (
        <div className="profile-page">
            <Navbar />
            
            <div className="profile-container">
                <h1 className="profile-title">Seu Perfil</h1>
                <div className="profile-info-grid">
                    <p><strong>Usuário:</strong></p>
                    <p>{profile.username}</p> {}
                    
                    <p><strong>Email:</strong></p>
                    <p>{profile.email}</p> {}
                    
                    {}
                    {profile.favorite_console && (
                        <>
                            <p><strong>Console Favorito:</strong></p>
                            <p>{profile.favorite_console}</p>
                        </>
                    )}
                </div>
                
                {}
                <button className="edit-btn">Editar Informações</button>
            </div>

            <Footer />
        </div>
    );
}

export default ProfilePage;