const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const songSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        artist: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        songUrl: {
            type: String
        },
    },
    { timestamps: true }
);

module.exports = model("Song", songSchema);
