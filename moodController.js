const Mood = require("../Model/moodModel");


exports.createMood = async (req, res) => {
  try {
    const { moodName, description } = req.body;

    if (!moodName) {
      return res.status(400).json({ message: "Mood name is required" });
    }

    const existingMood = await Mood.findOne({ moodName });
    if (existingMood) {
      return res.status(409).json({ message: "Mood already exists" });
    }

    const mood = await Mood.create({ moodName, description });
    res.status(201).json(mood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllMoods = async (req, res) => {
  try {
    const moods = await Mood.find().populate("availableSongs");
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMoodById = async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id).populate("availableSongs");

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    res.json(mood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateMood = async (req, res) => {
  try {
    const mood = await Mood.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    res.json(mood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSongToMood = async (req, res) => {
  try {
    const { moodId, songId } = req.body;

    if (!moodId || !songId) {
      return res.status(400).json({ message: "moodId and songId required" });
    }

    const mood = await Mood.findByIdAndUpdate(
      moodId,
      { $addToSet: { availableSongs: songId } }, 
      { new: true }
    ).populate("availableSongs");

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    res.json(mood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.removeSongFromMood = async (req, res) => {
  try {
    const { moodId, songId } = req.body;

    const mood = await Mood.findByIdAndUpdate(
      moodId,
      { $pull: { availableSongs: songId } },
      { new: true }
    ).populate("availableSongs");

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    res.json(mood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findByIdAndDelete(req.params.id);

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    res.json({ message: "Mood deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
