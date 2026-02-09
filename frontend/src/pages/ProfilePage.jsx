import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
    LogOut, Gamepad2, Dice5, Camera, 
    LayoutDashboard, Monitor, Trophy, Plus, Check, X, Trash2
} from 'lucide-react';
import ImageCropperModal from '../components/ImageCropperModal';
import './ProfilePage.css';

function ProfilePage() {
    const { username } = useParams(); 
    const fileInputRef = useRef(null);
    const myUsername = localStorage.getItem('username');
    
    const isMyProfile = !username || username === myUsername;
    const currentProfileUser = isMyProfile ? myUsername : username;

    const [profileData, setProfileData] = useState({ 
        username: '', avatar: null, bio: '', profile_views: 0 
    });
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [tempBio, setTempBio] = useState("");

    const [achievements, setAchievements] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addType, setAddType] = useState('game'); 
    const [newData, setNewData] = useState({ 
        title: '', 
        status: 'JOGUEI', 
        rating: 5.0, 
        release_year: '',
        genre: '',      
        platform: '',   
        team_sprites: [null, null, null, null, null, null],
        image: null 
    });
    const [addPreview, setAddPreview] = useState(null);

    const [portfolio, setPortfolio] = useState({ videoGames: [], boardGames: [], consoles: [] });
    const [myGames, setMyGames] = useState([]); 
    const [platforms, setPlatforms] = useState([]); 
    const [activeTab, setActiveTab] = useState('overview'); 
    const [loading, setLoading] = useState(true);

    const [myCapturedIds, setMyCapturedIds] = useState(new Set()); 
    const [myShinyIds, setMyShinyIds] = useState(new Set());     

    const [tempImageSrc, setTempImageSrc] = useState(null); 
    const [isCropperOpen, setIsCropperOpen] = useState(false); 

    const getImageUrl = (path) => { 
        if (!path) return "https://via.placeholder.com/300x400?text=Sem+Imagem"; 
        if (path.startsWith('http')) return path; 
        return `http://127.0.0.1:8000${path}`; 
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const queryParam = isMyProfile ? '' : `?username=${currentProfileUser}`;
                const [profileRes, gamesRes, boardRes, consoleRes, userPokeRes, achRes, platRes] = await Promise.all([
                    api.get(`profiles/${currentProfileUser}/`).catch(() => ({ data: { username: currentProfileUser } })),
                    api.get(`library/${queryParam}`),
                    api.get(`boardgames/${queryParam}`),
                    api.get(`consoles/${queryParam}`),
                    api.get(`user-pokemon/${queryParam}`),
                    api.get(`achievements/${queryParam}`),
                    api.get('platforms/') 
                ]);

                setProfileData(profileRes.data);
                setTempBio(profileRes.data.bio || "");
                setAchievements(Array.isArray(achRes.data) ? achRes.data : []);
                setPlatforms(Array.isArray(platRes.data) ? platRes.data : (platRes.data.results || []));

                const extract = (res) => Array.isArray(res.data) ? res.data : (res.data.results || []);
                const allGames = extract(gamesRes);
                
                setPortfolio({ 
                    videoGames: allGames, 
                    boardGames: extract(boardRes), 
                    consoles: extract(consoleRes) 
                });
                setMyGames(allGames);

                const userPokemons = extract(userPokeRes);
                const captured = new Set();
                const shiny = new Set();
                userPokemons.forEach(u => {
                    const dexId = u.pokemon?.pokedex_id || u.pokemon; 
                    if (dexId) { u.is_shiny ? shiny.add(Number(dexId)) : captured.add(Number(dexId)); }
                });
                setMyCapturedIds(captured);
                setMyShinyIds(shiny);
            } catch (error) { console.error("Erro:", error); } finally { setLoading(false); }
        };
        if (currentProfileUser) fetchAllData();
    }, [currentProfileUser, isMyProfile]);

    const handleSaveNewItem = async () => {
        if (!newData.title) { alert("Preencha o título ou selecione um jogo!"); return; }
        
        const formData = new FormData();
        let endpoint = '';

        try {
            setLoading(true);

            if (addType === 'pokemon') {
                endpoint = 'hall-of-fame/';
                formData.append('game_title', newData.title);
                // Apenas anexa os sprites que não forem nulos
                newData.team_sprites.forEach((file, i) => {
                    if (file && file instanceof File) {
                        formData.append(`sprite_${i + 1}`, file);
                    }
                });
            } else if (addType === 'game') {
                endpoint = 'library/';
                formData.append('game_title', newData.title); 
                formData.append('status', newData.status);
                formData.append('rating', newData.rating);
                if (newData.genre) formData.append('genre', newData.genre.toUpperCase());
                if (newData.release_year) formData.append('release_year', newData.release_year);
                if (newData.image) formData.append('cover_image', newData.image);
                
                const selectedPlat = platforms.find(p => p.id == newData.platform);
                if (selectedPlat) formData.append('platform_name', selectedPlat.name);
            } else if (addType === 'console') {
                endpoint = 'consoles/';
                formData.append('name', newData.title);
                if (newData.image) formData.append('photo', newData.image);
            } else if (addType === 'boardgame') {
                endpoint = 'boardgames/';
                formData.append('name', newData.title);
                if (newData.image) formData.append('cover_image', newData.image);
                if (newData.release_year) formData.append('year', newData.release_year);
            }

            const response = await api.post(endpoint, formData);
            console.log("Sucesso:", response.data);
            window.location.reload();

        } catch (error) { 
            console.error("Erro detalhado do servidor:", error.response?.data);
            alert(`Erro ao salvar: ${JSON.stringify(error.response?.data || "Erro de conexão")}`); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleLogout = () => { localStorage.clear(); window.location.href = '/login'; };

    if (loading) return <div className="profile-container"><h2>Carregando...</h2></div>;

    return (
        <div className="profile-container">
            <Navbar />
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-avatar-container" onClick={() => isMyProfile && fileInputRef.current.click()}>
                        <img src={getImageUrl(profileData.avatar)} alt="Avatar" className="profile-avatar" />
                        {isMyProfile && <div className="avatar-hover-overlay"><Camera size={24} /></div>}
                    </div>
                    <div className="profile-info-main">
                        <div className="profile-top-row">
                            <h1>{profileData.username?.toUpperCase()}</h1>
                            {isMyProfile && <button className="edit-profile-btn" onClick={() => setIsEditingBio(!isEditingBio)}>{isEditingBio ? "Cancelar" : "Editar Perfil"}</button>}
                        </div>
                        <div className="bio-section">
                            {isEditingBio ? (
                                <div className="bio-edit-box">
                                    <textarea value={tempBio} onChange={(e) => setTempBio(e.target.value)} maxLength="150" />
                                    <button onClick={async () => {
                                        await api.patch(`profiles/${currentProfileUser}/`, { bio: tempBio });
                                        setProfileData(prev => ({ ...prev, bio: tempBio }));
                                        setIsEditingBio(false);
                                    }} className="save-bio-btn"><Check size={16}/> Salvar Bio</button>
                                </div>
                            ) : (<p className="bio-text">{profileData.bio || "Nenhuma bio adicionada."}</p>)}
                        </div>
                        <div className="stats-badges">
                            <span><strong>{portfolio.videoGames.length}</strong> Zerados</span>
                            <span><strong>{myCapturedIds.size}</strong> Pokémon</span>
                            <span><strong>{profileData.profile_views}</strong> Visitas</span>
                        </div>
                    </div>
                    {isMyProfile && <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /> Sair</button>}
                </div>

                <div className="portfolio-tabs">
                    <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={18} /> FEED</button>
                    <button className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`} onClick={() => setActiveTab('games')}><Gamepad2 size={18} /> JOGOS</button>
                    <button className={`tab-btn ${activeTab === 'boardgames' ? 'active' : ''}`} onClick={() => setActiveTab('boardgames')}><Dice5 size={18} /> TABULEIRO</button>
                    <button className={`tab-btn ${activeTab === 'pokedex' ? 'active' : ''}`} onClick={() => setActiveTab('pokedex')}><Trophy size={18} /> POKÉDEX</button>
                    <button className={`tab-btn ${activeTab === 'consoles' ? 'active' : ''}`} onClick={() => setActiveTab('consoles')}><Monitor size={18} /> SETUP</button>
                </div>

                <div className="portfolio-grid">
                    {isMyProfile && (
                        <div className="game-grid-card add-new-item" onClick={() => { 
                            if(activeTab === 'pokedex') setAddType('pokemon');
                            else if(activeTab === 'games') setAddType('game');
                            else if(activeTab === 'boardgames') setAddType('boardgame');
                            else if(activeTab === 'consoles') setAddType('console');
                            setIsAddModalOpen(true); 
                        }}>
                            {activeTab === 'pokedex' ? <Trophy size={40} /> : <Plus size={40} />}
                            <span>{activeTab === 'pokedex' ? 'Hall of Fame' : `Novo ${activeTab === 'games' ? 'Jogo' : activeTab === 'boardgames' ? 'Tabuleiro' : 'Item'}`}</span>
                        </div>
                    )}
                    {activeTab === 'games' && portfolio.videoGames.map(entry => (
                        <div key={entry.id} className="game-grid-card">
                            <img src={getImageUrl(entry.game_catalog?.cover_image)} alt={entry.game_catalog?.title} />
                            <span className="score-badge">{entry.rating > 0 ? entry.rating : '-'}</span>
                            <div className="card-overlay"><h4>{entry.game_catalog?.title}</h4></div>
                        </div>
                    ))}
                    {activeTab === 'boardgames' && portfolio.boardGames.map(board => (
                        <div key={board.id} className="game-grid-card">
                            <img src={getImageUrl(board.cover_image)} alt={board.name} />
                            <div className="card-overlay"><h4>{board.name}</h4></div>
                        </div>
                    ))}
                    {activeTab === 'consoles' && portfolio.consoles.map(c => (
                        <div key={c.id} className="game-grid-card">
                            <img src={getImageUrl(c.photo)} alt={c.name}/><div className="card-overlay"><h4>{c.name}</h4></div>
                        </div>
                    ))}
                </div>

                {isAddModalOpen && (
                    <div className="ach-modal-overlay">
                        <div className="ach-modal-content">
                            <div className="ach-modal-header">
                                <h3>{addType === 'pokemon' ? 'POKÉMON HALL OF FAME' : `NOVO ${addType.toUpperCase()}`}</h3>
                                <button onClick={() => setIsAddModalOpen(false)}><X /></button>
                            </div>
                            <div className="ach-modal-body">
                                {addType !== 'pokemon' ? (
                                    <>
                                        <div className="ach-image-upload" onClick={() => document.getElementById('item-file').click()}>{addPreview ? <img src={addPreview} alt="Preview" /> : <Plus size={32} />}</div>
                                        <input type="file" id="item-file" style={{display: 'none'}} onChange={(e) => { const file = e.target.files[0]; if(file){ setNewData({...newData, image: file}); setAddPreview(URL.createObjectURL(file)); }}} />
                                        <input type="text" placeholder="Título" value={newData.title} onChange={(e) => setNewData({...newData, title: e.target.value})} />
                                        {addType === 'game' && (
                                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '100%'}}>
                                                <select value={newData.platform} onChange={(e) => setNewData({...newData, platform: e.target.value})} className="modal-select"><option value="">Plataforma</option>{platforms.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                                                <input type="text" placeholder="Gênero" value={newData.genre} onChange={(e) => setNewData({...newData, genre: e.target.value})} />
                                                <div style={{display: 'flex', gap: '10px'}}><input type="number" placeholder="Ano" style={{flex: 1}} value={newData.release_year} onChange={(e) => setNewData({...newData, release_year: e.target.value})} /><input type="number" step="0.1" placeholder="Nota" style={{width: '80px'}} value={newData.rating} onChange={(e) => setNewData({...newData, rating: e.target.value})} /></div>
                                                <select value={newData.status} onChange={(e) => setNewData({...newData, status: e.target.value})} className="modal-select"><option value="JOGUEI">Joguei</option><option value="ZEREI">Zerei</option><option value="PLATINEI">Platinei</option></select>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '100%'}}>
                                        <label style={{fontSize: '12px', color: '#bc13fe', marginLeft: '5px'}}>Escolha o jogo de Pokémon da sua lista:</label>
                                        <select 
                                            value={newData.title} 
                                            onChange={(e) => setNewData({...newData, title: e.target.value})} 
                                            className="modal-select"
                                        >
                                            <option value="">-- Selecione o Jogo --</option>
                                            {myGames.filter(entry => 
                                                entry.game_catalog?.title.toLowerCase().includes('pokémon') || 
                                                entry.game_catalog?.title.toLowerCase().includes('pokemon')
                                            ).map(entry => (
                                                <option key={entry.id} value={entry.game_catalog?.title}>
                                                    {entry.game_catalog?.title}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="hof-grid">
                                            {[0,1,2,3,4,5].map(i => (
                                                <div key={i} onClick={() => document.getElementById(`sprite-${i}`).click()}>
                                                    {newData.team_sprites[i] ? <img src={URL.createObjectURL(newData.team_sprites[i])} alt="sprite" /> : <Plus size={14}/>}
                                                    <input type="file" id={`sprite-${i}`} style={{display: 'none'}} onChange={(e) => {
                                                        const newSprites = [...newData.team_sprites];
                                                        newSprites[i] = e.target.files[0];
                                                        setNewData({...newData, team_sprites: newSprites});
                                                    }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button className="confirm-ach-btn" onClick={handleSaveNewItem} style={{marginTop: '20px'}}>SALVAR NO BANCO</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ProfilePage;