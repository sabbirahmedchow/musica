<template>
  <div class="header-section">
    <a class="toggle-btn menu-collapsed" @click="toggleBodyClass('left-side-collapsed')">
      <i class="fa fa-bars"></i>
    </a>
    <div class="menu-right" >
      <div class="profile_details">
        <div class="col-md-4 player">
          <div class="audio-player">
            <audio id="mejs" type="audio/mp3" controls="controls">
              
              <source v-for="(sng,i) in songs" :key="i" :src="sng.src" type="audio/mp3"  />
             
            </audio>

          
          </div>

        </div>
        <div class="col-md-4 serch-part">
          <div id="sb-search" class="sb-search">
            <form method="post" @submit = "searchSong">
              <input
                class="sb-search-input"
                placeholder="Search Artist"
                type="search"
                name="search"
                id="search"
                v-model="srch"
              />
              <input class="sb-search-submit" type="submit" value="" />
              <span class="sb-icon-search"></span>
            </form>
          </div>
        </div>

        <div class="col-md-4 login-pop">
          <div id="loginpop" v-if="authentication">
            <div class="btnTop">
              <router-link to="/my_account">
                <span>My Account</span>
              </router-link>
            </div>
            <div class="btnTop">
              <router-link to="/add_song">
                <span>Add Song</span>
              </router-link>
            </div>
            <div class="btnTop">
              <router-link to="/my_playlist">
                <span>My Playlist</span>
              </router-link>
            </div>
            <div class="btnTop">
              <a href="#" @click="logout">
                <span>Logout</span>
              </a>
            </div>
            
           
          </div>
          <div class="btnTop" v-else>
              <a href="#" data-toggle="modal" data-target="#myModal5">
                <span>
                  Get Started
                </span>
              </a>
            </div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="clearfix"></div>
  </div>
</template>
<script src="../../public/js/jquery-2.1.4.js"></script>
<script>
 //import songlist from '../../songs.txt';
export default {
  name: "Header",
  
  data() {
    return {
      drawer: true,
      authentication: false,
      verifytoken:{token: localStorage.getItem("token")},
      verifyRefreshtoken: {token: localStorage.getItem("refreshtoken")},
      songlist:"",  
      songs: require("../../songs.json").map(url => ({ src: url })),
      srch: "",
      srchSongs: [],
    };
  },


  methods: {
    toggleBodyClass(className) {
      const el = document.body;
      el.classList.toggle(className);
    },

    logout(){
      localStorage.clear();
      this.authentication = false;
      this.$router.push({ name: "home" });
    },

    setTokenfromRefreshToken()
    {
      this.$axios.post("/verifyRefreshToken", this.verifyRefreshtoken).then((response) => {
        //console.log("sdsd "+response.data.user.user);
         this.$axios.post("/generateAccessToken", {user: response.data.user.user}).then((response) => {
            localStorage.setItem("token", response.data.token);
           
            this.$axios.defaults.headers.common['Authorization'] ="Bearer " + localStorage.getItem("token");
         });
          this.authentication = true;
        //  this.$axios.post("/generateRefreshToken", {user: response.data.user.user}).then((response) => {
        //     localStorage.setItem("refreshtoken", response.data.refreshToken);
           
        //  });
      });
    },

    fin(e)
    {
      e.preventDefault(); 
    },

    searchSong(e)
    {
      e.preventDefault();
      if(this.srch == "")
      {
        alert("Your search field is empty.");
        return false;
      }
      try{
         
          this.$axios.post("/searchSong", {srch:this.srch}).then((response) => {
          this.srchSongs = response.data;
          
          //make the songs array unique
          let tempArray = [];
            for (let item of this.srchSongs) {
              (tempItem => {
                if (!(tempItem.length > 0 && tempItem.find(x => x.title === item.title))) tempArray.push(item);
              })(tempArray.filter(x => x.artist === item.artist))
            }
           this.srchSongs = tempArray;

          if (this.$route.name !== 'Search') //when the url is anything but not in search component
          {  
            this.$router.push({ name: "Search", params: {data: this.srchSongs }}).catch(()=>{});
          }
          else{
            this.$eventBus.$emit("searchSong", this.srchSongs); // pass the search result to the search component from header.
          }
        });
        
        
      }
      catch(err){console.log(err);}
    }
   
  },
  

   

  created() {
    
    this.$eventBus.$on("playAudio", (payload) => {
      var player = new MediaElementPlayer("#mejs");
      player.setSrc(payload);
      player.play();
    });

    this.$eventBus.$on("changeLogin", (payload) => {
      this.authentication = payload;
      if (this.authentication == false) {
        localStorage.clear();
        //this.$router.push({ name: "login" });
      }
    });

    
  },
 
  mounted() {
    //this.songs = songlist;
    //console.log(this.songs[0]);
    //
    // this.$axios.post("/getRandomSongs").then((response) => {
    //    console.log(response.data);
    //  })

   this.$axios.post("/verifyAccessToken", this.verifytoken).then((response) => {
     //alert(response.data.error);
      //console.log('Okay');
      if (response.data.error != "") {
        this.authentication = false;
        this.setTokenfromRefreshToken();
       
     } else {
       this.authentication = true;
       //this.$router.push({ name: "my-account" });
    }
   });
   
    
    
  },
  
  };
</script>

