import React, { useState } from "react";
import axios from "axios";
import "./AddSong.css";

const AddSong = () => {
  const [form, setForm] = useState({
    title: "",
    artist: ""
  });

  const [songImage, setSongImage] = useState(null);
  const [songFile, setSongFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!songImage || !songFile) {
      alert("Please select image and song file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("artist", form.artist);
      formData.append("songImage", songImage);
      formData.append("song", songFile);

      await axios.post(
        "http://localhost:5000/Song/AddSongWithImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Song added successfully 🎵");

      setForm({ title: "", artist: "" });
      setSongImage(null);
      setSongFile(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to upload song ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-song-page">
      <h1>🎵 Add New Song</h1>

      <form className="add-song-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Song Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Artist Name"
          value={form.artist}
          onChange={(e) =>
            setForm({ ...form, artist: e.target.value })
          }
          required
        />

        <label>
          Song Image (jpg/png)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSongImage(e.target.files[0])}
            required
          />
        </label>

        <label>
          Song File (mp3)
          <input
            type="file"
            accept="audio/mpeg"
            onChange={(e) => setSongFile(e.target.files[0])}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Song"}
        </button>
      </form>
    </div>
  );
};

export default AddSong;
