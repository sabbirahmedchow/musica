var YoutubeMp3Downloader = require("youtube-mp3-downloader");
var fs = require('fs');
var path = require('path');
const {Song, Genre} = require("../model/songModel");
//const { exit } = require("process");

module.exports.newSong = (req, res) =>{
 res.send(true);
};

//Configure YoutubeMp3Downloader with your settings
module.exports.getYoutubeMp3 = (req, res) => {

 //check if there is an existing folder with user id, if not then create one and save song in the folder.
 const usr = req.user;
 var dir = './public/media/'+usr;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

console.log("/app/vendor/ffmpeg/bin");
  
var YD = new YoutubeMp3Downloader({
      
    "ffmpegPath": "/app/vendor/ffmpeg/bin",        // FFmpeg binary location
    "outputPath": "./public/media/"+usr,    // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 2,                  // Download parallelism (default: 1)
    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});

//Download video and save as MP3 file
var timestamp = Date.now();
YD.download(req.body.video, timestamp+".mp3");

YD.on("finished", function(err, data) {
    
    res.json(JSON.stringify(data));
    res.end();
});

YD.on("error", function(error) {
    console.log(error);
});


};

module.exports.saveSong = (req,res) =>{

    const newSong = new Song({
        user: req.user,
        title: req.body.title,
        artist: req.body.artist,
        thumbnail: req.body.thumb,
        song: req.body.song,
        genre: req.body.genre,
      });

      newSong.save((err, savedSong) => {
        if (err)
        {
          return res.send({
            msgError: "Can not save this song now. Please try again later.",
          });
        }
        else
        {  
            return res.status(200).json({
                
                msgSuccess: "This song has been added to your library.",
              });
        }
    });
        
};

module.exports.getSongs = (req,res) =>{
  Song.find({ user: req.user }, function(err, songs) {
    if(err){console.log(err);}
    res.send(songs);
  });
};  

module.exports.getPartialSongsHome = (req,res) =>{
  Song.find({}).sort({'_id': -1}).limit(12).exec(function(err, songs) {
    if(err){console.log(err);}
    res.send(songs);
  });
};

module.exports.getGenre = (req,res) =>{
  Genre.find({}, function(err, genre) {
    if(err){console.log(err);}
    res.send(genre);
  });
};

module.exports.getSongsByGenre = (req,res) =>
{ 
  Song.find({ genre: req.body.genre}, function(err, songs){
    if(err){console.log(err);}
    res.send(songs);
  }); 
};

module.exports.getRandomSongs = (req, res) =>
{
  //console.log("dsdsds"+req.body.dir);
  Song.countDocuments().exec(function (err, count) {
    // Get a random entry
    var random = Math.floor(Math.random() * count)
  
    // Again query all users but only fetch one offset by our random #
    Song.aggregate([{ $sample: { size: 5 }} ]).exec(
      function (err, result) {
        // Tada! random user
        let songs = [
          result[0].song,
          result[1].song,
          result[2].song,
          result[3].song,
          result[4].song
        ]; 
        fs.writeFileSync("./songs.json", JSON.stringify(songs), (err)=>{
          if(err) console.log(error);
          res.send("success");
        })
        
      })
    })
 
 // return files;
};

module.exports.checkIfSongExist = (req, res) => {
 Song.countDocuments({ title: req.body.title, artist: req.body.artist}, function(err, result){
  if(err){console.log(err);}
  res.json(JSON.stringify(result));
}); 
};

module.exports.findSongandSave = (req, res) =>{
  Song.countDocuments({user: req.user, title: req.body.title, artist: req.body.artist}, function(err, result){
   if(err) console.log(err);
   else
   {
     if(result == 1)
     {
      return res.send({
        msgError: "You already have this song in your library.",
      });
     }
     else
     {
      Song.findOne({title: req.body.title, artist: req.body.artist}, function(err, song){
          
          const copySong = new Song({
            user: req.user,
            title: req.body.title,
            artist: req.body.artist,
            thumbnail: song.thumbnail,
            song: song.song,
            genre: song.genre,
          });
    
          copySong.save((err, savedSong) => {
            if (err)
            {
              fs.unlinkSync(process.cwd()+"/public/"+req.body.song); 

              return res.send({
                msgError: "Can not save this song now. Please try again later.",
              });
            }
            else
            {  
                return res.status(200).json({
                    
                    msgSuccess: "This song has been added to your library.",
                  });
            }
         });

      });
     }
   }
  });
};

module.exports.searchSong = (req,res) =>
{ 
  const qry = req.body.srch;
  //console.log(qry);
  Song.find({ artist : { '$regex': '.*'+qry+'.*', '$options' : 'si' } }, function(err, songs){
    if(err){console.log(err);}
    res.send(songs);
  }); 
};

module.exports.delSong = (req, res) =>{
  Song.deleteOne({ song: req.body.song}, function(err){
    if(err){console.log(err);}
    else
    {
      fs.unlinkSync(process.cwd()+"/public/"+req.body.song); 
      res.send("Song has been deleted.");
    } 
  }); 
};

