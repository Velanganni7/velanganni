import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Player.css";

const Player = () => {
  const { state } = useLocation(); 
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!state) navigate("/Dashboard");
  }, [state, navigate]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    const current = audioRef.current.currentTime;
    setProgress(current);
  };

  const setAudioDuration = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="player-page">
      <audio
        ref={audioRef}
        src={`http://localhost:5000${state?.songUrl}`}
        autoPlay
        onTimeUpdate={updateProgress}
        onLoadedMetadata={setAudioDuration}
      />

      <div className="player-card">
        <img
          src={`http://localhost:5000${state?.imageUrl}`}
          alt={state?.title}
          className="album-art"
        />

        <h1>{state?.title}</h1>
        <p className="artist">{state?.artist}</p>

        <div className="tags">
          <span>Energetic</span>
          <span>Late Night</span>
          <span>Electronic</span>
        </div>

        <div className="progress-container">
          <span>{formatTime(progress)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={progress}
            onChange={(e) => {
              audioRef.current.currentTime = e.target.value;
              setProgress(e.target.value);
            }}
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="controls">
          <button>⏮</button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button>⏭</button>
        </div>
      </div>
    </div>
  );
};

export default Player;
