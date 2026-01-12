const multer = require("multer");
const path = require("path");
const fs = require("fs");


const imagePath = path.join(process.cwd(), "Media", "Data", "Image");
const songPath = path.join(process.cwd(), "Media", "Data", "Song");


[imagePath, songPath].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "songImage") {
      cb(null, imagePath);
    } else if (file.fieldname === "song") {
      cb(null, songPath);
    } else {
      cb(new Error("Invalid field name"), false);
    }
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${name}_${Date.now()}${ext}`);
  },
});


const fileFilter = (req, file, cb) => {
 
  if (
    file.fieldname === "songImage" &&
    file.mimetype.startsWith("image/")
  ) {
    return cb(null, true);
  }

  if (
    file.fieldname === "song" &&
    file.mimetype.startsWith("audio/")
  ) {
    return cb(null, true);
  }

  cb(new Error("Invalid file type"), false);
};


const upload = multer({
  storage,
  fileFilter,
});


exports.uploadSongWithImage = upload.fields([
  { name: "song", maxCount: 1 },
  { name: "songImage", maxCount: 1 },
]);
