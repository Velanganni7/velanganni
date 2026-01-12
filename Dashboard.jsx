import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [moods, setMoods] = useState([]);
    const [songs, setSongs] = useState([]);
    const [moodSongs, setMoodSongs] = useState([]);
    const [preferenceSongs, setPreferenceSongs] = useState([]);
    const [selectedMood, setSelectedMood] = useState(null);
    const [loadingPref, setLoadingPref] = useState(false);

   
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    
    useEffect(() => {
        axios
            .get("http://localhost:5000/Mood/getAllMood")
            .then((res) => setMoods(res.data))
            .catch(console.error);
    }, []);

  
    useEffect(() => {
        axios
            .get("http://localhost:5000/Song/getAllSongs")
            .then((res) => setSongs(res.data))
            .catch(console.error);
    }, []);

   
    const fetchPreferenceSongs = async (userId) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/auth/getPerference/${userId}`
            );
            setPreferenceSongs(res.data.songs || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchPreferenceSongs(user._id);
        }
    }, [user?._id]);

   
    const handleMoodClick = async (id) => {
        const res = await axios.get(
            `http://localhost:5000/Mood/getOneMood/${id}`
        );
        setSelectedMood(res.data);
        setMoodSongs(res.data.availableSongs || []);
    };

   
    const hasMood = (favMoods = [], moodId) =>
        favMoods.some((m) =>
            typeof m === "string" ? m === moodId : m._id === moodId
        );

    
    const toggleMood = (mood) => {
        setUser((prev) => {
            if (!prev?.preferences) return prev;

            const exists = hasMood(
                prev.preferences.favoriteMoods,
                mood._id
            );

            const updated = exists
                ? prev.preferences.favoriteMoods.filter(
                    (m) =>
                        (typeof m === "string" ? m : m._id) !== mood._id
                )
                : [...prev.preferences.favoriteMoods, mood];

            return {
                ...prev,
                preferences: {
                    ...prev.preferences,
                    favoriteMoods: updated
                }
            };
        });
    };

   
    const updatePreferences = async () => {
        try {
            setLoadingPref(true);

            const moodIds = user.preferences.favoriteMoods.map((m) =>
                typeof m === "string" ? m : m._id
            );

            const res = await axios.post(
                `http://localhost:5000/auth/updateUser/${user._id}`,
                {
                    preferences: {
                        favoriteMoods: moodIds
                    }
                }
            );

           
            const updatedUser = {
                ...user,
                preferences: {
                    ...user.preferences,
                    favoriteMoods: moodIds
                }
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            fetchPreferenceSongs(user._id);

            alert("Preferences updated successfully ✅");
        } catch (err) {
            alert("Update failed ❌");
            console.error(err);
        } finally {
            setLoadingPref(false);
        }
    };

   
    const playSong = (song) => {
        navigate("/player", { state: song });
    };

    return (
        <div className="dashboard">
           
            <aside className="sidebar">
                <div className="logo">🎧 Pulse Music</div>

                {user && (
                    <div className="user-box vertical">
                        <div className="avatar">👤</div>
                        <p className="username">{user.name}</p>
                        <small>{user.email}</small>
                    </div>
                )}

                <div className="sidebar-moods">
                    <h4>Your Moods</h4>

                    {moods.map((mood) => {
                        const checked = hasMood(
                            user?.preferences?.favoriteMoods,
                            mood._id
                        );

                        return (
                            <label
                                key={mood._id}
                                className={`mood-item ${checked ? "selected" : ""}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleMood(mood)}
                                />
                                {mood.moodName}
                            </label>
                        );
                    })}

                    <button
                        className="update-btn"
                        onClick={updatePreferences}
                        disabled={loadingPref}
                    >
                        {loadingPref ? "Updating..." : "Update Preferences"}
                    </button>
                </div>
            </aside>

           
            <main className="content">
                <h1>Recommended For You</h1>

               
                <div className="song-grid">
                    {preferenceSongs.map((song) => (
                        <div
                            key={song._id}
                            className="song-card"
                            onClick={() => playSong(song)}
                        >
                            <div className="song-image">
                                <img
                                    src={`http://localhost:5000${song.imageUrl}`}
                                    alt={song.title}
                                    loading="lazy"
                                />
                            </div>
                            <h4 title={song.title}>{song.title}</h4>
                            <p>{song.artist}</p>
                        </div>
                    ))}
                </div>

            
                <h2 className="section-title">Browse by Mood</h2>
                <button
                    className="manage-moods-btn"
                    onClick={() => navigate("/moods")}
                >
                    🎭 Manage Moods
                </button>

                <div className="mood-grid">
                    {moods.map((mood) => (
                        <div
                            key={mood._id}
                            className={`mood-card ${selectedMood?._id === mood._id ? "selected" : ""
                                }`}
                            onClick={() => handleMoodClick(mood._id)}
                        >
                            <h3>{mood.moodName}</h3>
                            <p>{mood.description}</p>
                        </div>
                    ))}
                </div>

             
                {selectedMood && (
                    <>
                        <h2 className="section-title">
                            {selectedMood.moodName} Songs
                        </h2>

                        <div className="song-grid">
                            {moodSongs.map((song) => (
                                <div
                                    key={song._id}
                                    className="song-card"
                                    onClick={() => playSong(song)}
                                >
                                    <div className="song-image">
                                        <img
                                            src={`http://localhost:5000${song.imageUrl}`}
                                            alt={song.title}
                                            loading="lazy"
                                        />
                                    </div>
                                    <h4 title={song.title}>{song.title}</h4>
                                    <p>{song.artist}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                
                <h2 className="section-title">All Songs</h2>
                <div className="song-grid">
                    {songs.map((song) => (
                        <div
                            key={song._id}
                            className="song-card"
                            onClick={() => playSong(song)}
                        >
                            <div className="song-image">
                                <img
                                    src={`http://localhost:5000${song.imageUrl}`}
                                    alt={song.title}
                                    loading="lazy"
                                />
                            </div>
                            <h4 title={song.title}>{song.title}</h4>
                            <p>{song.artist}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
