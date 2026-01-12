const express = require("express");
const router = express.Router();

const {
  createMood,
  getAllMoods,
  getMoodById,
  updateMood,
  deleteMood,
  addSongToMood,
  removeSongFromMood
} = require("../Controller/moodController");


router.post("/createMood", createMood);
router.get("/getAllMood", getAllMoods);
router.get("/getOneMood/:id", getMoodById);
router.post("/updateMood/:id", updateMood);
router.post("/deleteMood/:id", deleteMood);


router.post("/add-song", addSongToMood);
router.post("/remove-song", removeSongFromMood);

module.exports = router;
