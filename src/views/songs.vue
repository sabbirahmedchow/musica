<template>
  <div id="page-wrapper">
    <div class="inner-content">
      <div class="music-left" style="width: 100%">
        <div class="banner-section">
          <div class="banner">
            <div class="callbacks_container">
              <ul class="rslides callbacks callbacks1">
                <li>
                  <div class="banner-img">
                    <img src="images/22.jpg" class="img-responsive" alt />
                  </div>
                </li>
              </ul>
            </div>

            <div class="clearfix"></div>
          </div>
        </div>
        <div class="container chart-section">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="playborder">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="left">
                      <div class="section-title">
                        <h3 class="tittle">Our {{this.$route.params.genre}} List </h3>
                      </div>
                    </td>
                    
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div v-if="loading"><img src="images/ajax-loader.gif" width="25" /></div>
          <div class="rock_list" ref="songsGenre" v-if="this.msg == ''">
            <div v-for="(song, i) in paginatedData" :key = i class="col-md-3 content-grid last-grid">
              <a class="play-icon popup-with-zoom-anim" style="cursor:pointer;" @click="playAudio(song.song);">
                <img :src="song.thumbnail" :title="song.artist +' - '+ song.title" />
              </a>
              <a class="button play-icon popup-with-zoom-anim" style="cursor:pointer; border:2px solid #ea57a3; padding:5px;  width:40px; margin: 10px auto" @click="playAudio(song.song);"><i class="glyphicon glyphicon-play playBtn"></i></a>
              
            </div>
            <div class="btn">
            <button :disabled="pageNumber === 0" @click="prevPage">Previous</button>
            <button :disabled="pageNumber >= pageCount -1" @click="nextPage">Next</button>
          </div>
            
          </div>
          <div v-else>{{this.msg}}</div>
          
        </div>
        <!--Playlist End-->
        
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Songs",

  data(){
    return{
      pageNumber: 0,  // default to page 0
      songs: [],
      msg: "",
      genre: this.$route.params,
      loading: false,
    };
  },
  beforeRouteUpdate(to, from, next) {
    next()
    this.genre = this.$route.params
    this.msg = "";
    this.songs = [];
    this.getSongByGenre(this.genre);
  },

  props:{
    
    size:{
      type:Number,
      required:false,
      default: 16
    }
  },
 
 mounted(){
    this.goto('songsGenre');
    this.getSongByGenre(this.genre);
  },

  computed: {
    pageCount(){
        let l = this.songs.length,
            s = this.size;
        return Math.ceil(l/s);
    },

    paginatedData(){
      const start = this.pageNumber * this.size,
            end = start + this.size;
      return this.songs.slice(start, end);
    }

     
  },

  methods:{
    getSongByGenre(gnr){
    this.genre = gnr;  
    this.loading=true;
   try {
          this.$axios.post("/getSongsByGenre", this.genre).then(response => {
          this.loading=false;  
          
          if(response.data != "")
          {
           this.songs = response.data;
           
           //make the songs array uniqe
           let tempArray = [];
            for (let item of this.songs) {
              (tempItem => {
                if (!(tempItem.length > 0 && tempItem.find(x => x.title === item.title))) tempArray.push(item);
              })(tempArray.filter(x => x.artist === item.artist))
            }
            this.songs = tempArray;
           
          }
          else
           this.msg = "Sorry, this genre still has no songs in it.";  
          })
       } 
      catch (err) {
        alert(err);
      }
    },
    
    goto(refName) {
        var element = this.$refs[refName];
        var top = element.offsetTop;
        window.scrollTo(0, top);
    },

    playAudio(song) {
        this.$eventBus.$emit("playAudio", song);
      },

    nextPage(){
      this.pageNumber++;
      },
    prevPage(){
      this.pageNumber--;
      },  
  }
};
</script>

<style scoped>
.btn{
  width:1000px;
  
}
</style>
