const Song = require("../Model/songModel");
const Mood = require("../Model/moodModel");
const fs = require("fs");
const path = require("path");


exports.createSong = async (req, res) => {
  try {
    const { title, artist } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ message: "Title & artist required" });
    }

    const songImage = req.files?.songImage?.[0];
    const songFile = req.files?.song?.[0];

    const newSong = await Song.create({
      title,
      artist,
      imageUrl: songImage
        ? `/Media/Data/Image/${songImage.filename}`
        : null,
      songUrl: songFile
        ? `/Media/Data/Song/${songFile.filename}`
        : null,
    });

    res.status(201).json({
      message: "Song uploaded successfully",
      data: newSong,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getSongsByMood = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.moodId)
      .populate("availableSongs");

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    res.json(mood.availableSongs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    const songImage = req.files?.songImage?.[0];
    const songFile = req.files?.song?.[0];

    if (songImage) {
      song.imageUrl = `/Media/Data/Image/${songImage.filename}`;
    }

    if (songFile) {
      song.songUrl = `/Media/Data/Song/${songFile.filename}`;
    }

    song.title = req.body.title || song.title;
    song.artist = req.body.artist || song.artist;

    await song.save();
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found" });

    
    if (song.imageUrl) {
      fs.unlink(
        path.join(process.cwd(), song.imageUrl),
        () => {}
      );
    }

    
    if (song.songUrl) {
      fs.unlink(
        path.join(process.cwd(), song.songUrl),
        () => {}
      );
    }

    await song.deleteOne();
    res.json({ message: "Song deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
