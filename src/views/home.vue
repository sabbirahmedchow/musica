<template>
  <div id="page-wrapper">
    <div class="inner-content">
      <div class="music-left">
        <!--banner-section-->
        <div class="banner-section">
          <div class="banner">
            <div class="callbacks_container">
              <ul class="rslides callbacks callbacks1">
                <li>
                  <div class="banner-img">
                    <img src="images/11.jpg" class="img-responsive" alt="" style="background-attachment: fixed; background-position: center;" />
                    <div class="banner-info">
                     <h1 style="font-size:4vw;">Your best online musical platform</h1> 
                     <h3 style="font-size:2vw;">Save your favorite youtube songs as mp3s </h3>
                      
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div class="clearfix"></div>
          </div>
        </div>
        <!--//End-banner-->
        <!--albums-->

        <div class="albums">
          <div class="tittle-head">
            <h3 class="tittle">
              New Releases
              <span class="new">New</span>
            </h3>

            <div class="clearfix"></div>
          </div>
          <div v-for="(sng, index) in songs" :key="index" class="col-md-3 content-grid last-grid">
            <a class="play-icon popup-with-zoom-anim" style="cursor:pointer;" @click="playAudio(sng.song);">
              <img :src="sng.thumbnail" :title="sng.artist +' - '+ sng.title" />
            </a>
            <a class="button play-icon" style="cursor:pointer; border:2px solid #ea57a3; padding:5px;  width:40px; margin: 10px auto" @click="playAudio(sng.song); return false;"><i class="glyphicon glyphicon-play playBtn"></i></a>
          </div>
          
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      songs: [],
      };
  },
  methods: {
    playAudio(song) {
      this.$eventBus.$emit("playAudio", song);
    },
  },

  mounted(){
   try { 
    this.$axios.post("/getPartialSongsHome").then(response => {
      this.songs = response.data;
    })
   }catch(err)
   {
     console.log(err);
   }

  }
};
</script>
