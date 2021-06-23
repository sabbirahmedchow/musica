<template>
  <div id="page-wrapper">
    <div class="inner-content">
      <div class="music-left" style="width: 100%">
        <!--banner-section-->
        <div class="banner-section">
          <div class="banner">
            <div class="callbacks_container">
              <ul class="rslides callbacks callbacks1">
                <li>
                  <div class="banner-img">
                    <img src="images/33.jpg" class="img-responsive" alt />
                  </div>
                </li>
              </ul>
            </div>

            <div class="clearfix"></div>
          </div>
        </div>
        <!--//End-banner-->
        <div class="container chart-section">
          <form action method="post" @submit = "getYoutubeMp3">
            <div class="form-group">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="pad_50">
                <tr>
                  <td class="playborder">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" ref="newsong">
                      <tr>
                        <td align="left">
                          <div class="section-title" style="margin-bottom: 0px; margin-top: 20px;">
                            <h3 class="tittle">Add New Song</h3>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
            <div class="form-group">
              <label for="caption">
                YOUTUBE URL
                <span>* This URL Should be Youtube URL</span>
              </label>
              <input type="text" name="url" id="url" v-model="newSong.url" class="form-controll" />
            </div>
            <div class="form-group">
              <button type="submit" v-show="shwButton">Download</button> <span v-show="isLoaded" style="font-weight:bold; color:#EA57A3; margin-left:5px;">Downloading...Please Wait!!</span>
            </div>
          </form>
          
          <div v-show="showAfterDownload">
           <table  style="width: 40%; margin: 0px auto; padding:8px; margin-bottom: 10px; left:6px;">
            <tr>
            <td width="170" style="vertical-align: top;"><img :src=songDetail.thumb alt="songDetail.artist" border="0" style="vertical-align:top; top:0;" /></td>
            <td>
              <table style="width: 90%; margin-left:30px">
                <tr><td><h4><strong>Artist:</strong> {{songDetail.artist}}</h4></td></tr>
                  <tr><td><h4><strong>Title:</strong> {{songDetail.title}}</h4></td></tr>
                    <tr><td><strong>Select Genre:</strong>
                      <span class="custom-select">
                          <select class="form-controll" v-model="songDetail.genre">
                            <option value="" selected>Select Genres</option>
                            <option v-for="(gnr, i) in genres" :key="i" :value="gnr.genre">{{gnr.genre}}</option>
                            
                          </select>
                        </span> <br/>
                      </td>
                  </tr>
                
                 <tr><td><button @click="saveSong()">Save to Library</button></td></tr>
              </table> <br/>
            </td></tr>
            </table>  
             
          </div>
        </div>
        <div class="clearfix"></div>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Newsong",
  data: () =>({
    newSong:{
      url: ""
     },
    songDetail:
    {
      thumb: "",
      artist: "",
      title: "",
      song: "",
      genre: ""
    },

     token: localStorage.getItem("token"),
     imgsrc: "",
     isLoaded: false,
     shwButton: true,
     showAfterDownload: false,
     genres: [],
     songExist: false,
  }),

  mounted(){
    this.goto('newsong');

    this.$axios.post("/new_song").then((response) => {
      
     if(response.data == "" || this.token == null)
     {
       this.$router.push({ name: "Unauth"} );
     }
     
   });

   this.$axios.post("/getGenre").then((response) => {
       
     this.genres = response.data;
     
   });
  },

  methods:{

      getYoutubeMp3(e){
      e.preventDefault(); // stop refreshing after submit

      //check if the form url field is empty
      if(this.newSong.url == "")
      {
        alert("Please enter a url first.");
        return false;
      }
      

      this.isLoaded = true;
      this.shwButton = false;
      
      //get the video id from url
      var video_id = this.newSong.url.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&');
      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
     
      try {
          this.$axios.post("/getYoutubeMp3", {video: video_id}).then(response => {
          if(response.data != "")
          {
            const obj = JSON.parse(response.data);
            this.checkIfSongExist(obj);
          }
          window.stop();
        
        })
      } 
      catch (err) {
        alert(err);
      }
      },

      async saveSong()
      {
       //console.log(this.songDetail); 
      if(this.songDetail.genre == "")
      {
        alert("Please select a genre for this song.");
        return false;
      }

      try {
        await this.$axios.post("/saveSong", this.songDetail).then(response => {
          if(response.data.msgError != null)
          {
            this.$iziToast.error({
                position: "topCenter",
                title: "Error",
                message: response.data.msgError,
              });
          return false;
          }
          else
          {
            this.$iziToast.success({
              position: "topCenter",
              title: "Success",
              message: response.data.msgSuccess,
            });
           
           this.isLoaded = false;
           this.shwButton = true;
           this.showAfterDownload = false;
           this.newSong.url = "";
          }
          
          })
      } 
      catch (err) {
        alert(err);
      }

      },

      checkIfSongExist(obj)
      { 
        const songTitle = obj.title.replace(/ *\([^)]*\) */g, "");
        const songFile = obj.file.replace("./public/", "");
        
        this.$axios.post("/checkIfSongExist", {artist : obj.artist, title : songTitle}).then(response => {
        const result = JSON.parse(response.data);
              
        if(result == 0) //song does not exist
        {
         this.isLoaded = false;
         this.shwButton = false;
         this.showAfterDownload = true;
                
              
         //console.log(obj);
         
         this.songDetail.thumb = obj.thumbnail;
         this.songDetail.artist = obj.artist;
         this.songDetail.title = obj.title.replace(/ *\([^)]*\) */g, "");
         this.songDetail.song = songFile;
        }
        else
        {
         
         const conf = confirm("This song is already there in our library. Do you want to get a copy of this song?")

         if(conf == true)
         {
            this.$axios.post("/findSongandSave", {artist : obj.artist, title : songTitle}).then(response => {
               if(response.data.msgError != null)
                {
                  this.$iziToast.error({
                      position: "topCenter",
                      title: "Error",
                      message: response.data.msgError,
                    });
                
                }
                else
                {
                  this.$iziToast.success({
                    position: "topCenter",
                    title: "Success",
                    message: response.data.msgSuccess,
                  });
                }
                this.$axios.post("/delSong", {song:songFile});
                this.isLoaded = false;
                this.shwButton = true;
                this.showAfterDownload = false;
                this.newSong.url = "";
                
            })   
         }
         else{
           this.$axios.post("/delSong", {song:songFile});

         }
        }
              
              
      })
    },

      goto(refName) {
        var element = this.$refs[refName];
        var top = element.offsetTop;
        window.scrollTo(0, top);
    }
  
    },

};
</script>
