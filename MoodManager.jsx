import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MoodManager.css";
import { useNavigate } from "react-router-dom";

const MoodManager = () => {


        const navigate = useNavigate();

  const [moods, setMoods] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);

  const [form, setForm] = useState({
    moodName: "",
    description: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [selectedSongId, setSelectedSongId] = useState("");



  const fetchMoods = async () => {
    const res = await axios.get("http://localhost:5000/Mood/getAllMood");
    setMoods(res.data);
  };

  const fetchSongs = async () => {
    const res = await axios.get("http://localhost:5000/Song/getAllSongs");
    setSongs(res.data);
  };

  useEffect(() => {
    fetchMoods();
    fetchSongs();
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.post(
        `http://localhost:5000/Mood/updateMood/${editingId}`,
        form
      );
    } else {
      await axios.post(
        "http://localhost:5000/Mood/createMood",
        form
      );
    }

    setForm({ moodName: "", description: "" });
    setEditingId(null);
    fetchMoods();
  };



  const handleEdit = (mood) => {
    setEditingId(mood._id);
    setForm({
      moodName: mood.moodName,
      description: mood.description
    });
  };



  const handleDelete = async (id) => {
    if (!window.confirm("Delete this mood?")) return;

    await axios.post(
      `http://localhost:5000/Mood/deleteMood/${id}`
    );
    fetchMoods();
  };

 

  const addSongToMood = async () => {
    if (!selectedMood || !selectedSongId) return;

    await axios.post("http://localhost:5000/Mood/add-song", {
      moodId: selectedMood._id,
      songId: selectedSongId
    });

    setSelectedSongId("");
    fetchMoods();
  };


  const removeSongFromMood = async (songId) => {
    await axios.post("http://localhost:5000/Mood/remove-song", {
      moodId: selectedMood._id,
      songId
    });

    fetchMoods();
  };

  return (
    <div className="mood-manager">
      <h1>🎭 Mood Manager</h1>
 <button
                    className="manage-moods-btn"
                    onClick={() => navigate("/songs")}
                >
                    🎭 Manage Songs
                </button>
   
      <form onSubmit={handleSubmit} className="mood-form">
        <input
          placeholder="Mood Name"
          value={form.moodName}
          onChange={(e) =>
            setForm({ ...form, moodName: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          required
        />

        <button type="submit">
          {editingId ? "Update Mood" : "Create Mood"}
        </button>
      </form>

     
      <div className="mood-list">
        {moods.map((mood) => (
          <div key={mood._id} className="mood-card">
            <h3>{mood.moodName}</h3>
            <p>{mood.description}</p>

            <div className="actions">
              <button onClick={() => handleEdit(mood)}>Edit</button>
              <button onClick={() => handleDelete(mood._id)}>
                Delete
              </button>
              <button onClick={() => setSelectedMood(mood)}>
                Manage Songs
              </button>
            </div>
          </div>
        ))}
      </div>

    
      {selectedMood && (
        <div className="song-manager">
          <h2>🎵 {selectedMood.moodName} Songs</h2>

          <select
            value={selectedSongId}
            onChange={(e) => setSelectedSongId(e.target.value)}
          >
            <option value="">Select Song</option>
            {songs.map((song) => (
              <option key={song._id} value={song._id}>
                {song.title} – {song.artist}
              </option>
            ))}
          </select>

          <button onClick={addSongToMood}>Add Song</button>

          <ul>
            {selectedMood.availableSongs.map((song) => (
              <li key={song._id}>
                {song.title}
                <button
                  onClick={() => removeSongFromMood(song._id)}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <button onClick={() => setSelectedMood(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodManager;
