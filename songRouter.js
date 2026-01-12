const express = require("express");
const router = express.Router();

const {
    createSong,
    getAllSongs,
    getSongsByMood,
    updateSong,
    deleteSong,
} = require("../Controller/songController");

const { uploadSongWithImage } = require("../Middleware/Uploads");


router.post("/AddSongWithImage", uploadSongWithImage, createSong);
router.get("/getAllSongs", getAllSongs);
router.get("/getSongByMood/:moodId", getSongsByMood);
router.post("/updateSong/:id", uploadSongWithImage, updateSong);
router.post("/deleteSong/:id", deleteSong);

module.exports = router;
