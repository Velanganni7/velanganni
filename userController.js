const User = require("../Model/userModel");


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, profileImage, preferences } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password, 
      profileImage,
      preferences: {
        favoriteMoods: preferences?.favoriteMoods || []
      }
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("preferences.favoriteMoods");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("preferences.favoriteMoods");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ message: "User not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updatePreference = async (req, res) => {
  try {
    const { favoriteMoods } = req.body;

    if (!Array.isArray(favoriteMoods))
      return res.status(400).json({
        message: "favoriteMoods must be an array"
      });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "preferences.favoriteMoods": favoriteMoods
        }
      },
      { new: true }
    ).populate("preferences.favoriteMoods");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Preferences updated successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email })
      .populate("preferences.favoriteMoods");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    
    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    res.json({
      message: "Login successful",
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.getSongsByUserPreference = async (req, res) => {
  try {
    const { id } = req.params;

   
    const user = await User.findById(id)
      .populate({
        path: "preferences.favoriteMoods",
        populate: {
          path: "availableSongs",
          model: "Song"
        }
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

   
    let songs = [];

    user.preferences.favoriteMoods.forEach((mood) => {
      if (mood.availableSongs?.length) {
        songs.push(...mood.availableSongs);
      }
    });

    
    const uniqueSongs = [
      ...new Map(
        songs.map((song) => [song._id.toString(), song])
      ).values()
    ];

    res.json({
      message: "Songs fetched based on user preferences",
      count: uniqueSongs.length,
      songs: uniqueSongs
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
