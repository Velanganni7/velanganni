const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const moodSchema = new Schema(
  {
    moodName: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    availableSongs:[
       {
          type: Schema.Types.ObjectId,
          ref: "Song"
        }
    ]
  },
  { timestamps: true }
);

module.exports = model("Mood", moodSchema);
