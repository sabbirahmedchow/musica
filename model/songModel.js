const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var songSchema = new Schema({
  user: String,  
  title: String,
  artist: String,
  thumbnail: String,
  song: String,
  genre: String,
});

var genreSchema = new Schema ({
  genre: String,
});

var song = mongoose.model("songs", songSchema);

var genre = mongoose.model("genres", genreSchema);

module.exports = {Song: song, Genre: genre};
