const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: String,

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    profileImage: String,

    preferences: {
      favoriteMoods: [
        {
          type: Schema.Types.ObjectId,
          ref: "Mood"
        }
      ]
    }
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
