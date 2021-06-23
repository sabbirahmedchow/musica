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
                        <h3 class="tittle">Search Result </h3>
                      </div>
                    </td>
                    
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div v-if="loading"><img src="images/ajax-loader.gif" width="25" /></div>
          <div class="row" id="content" ref="contents" v-if="this.msg == ''">
            <div class="col-lg-6">
             
             <div v-if="songs.length === 0" class="loading">Loading...</div>
              <table width="1100px">
                    <tbody>
                      <tr v-for="(sng, index) in songs" :key="index" :class="index">
                        <td>
                        <table class="chart-table" style="width:1100px;">
                          <tr>
                          
                          <td>{{index+1}}</td>
                          <td><img :src="sng.thumbnail" :title="sng.artist +' - '+ sng.title"></td>
                          <td><h4>{{sng.title}}</h4>
                            <p>{{sng.artist}} </p></td>
                          <td style="width:200px">
                           <table style="width:100%; border-collapse:separate;" border="0" >
                            <tr>
                             <td><a style="cursor:pointer; float:left;" @click="playAudio(sng.song); return false;" title="Play"><i class="glyphicon glyphicon-play-circle mon"></i></a>
                             <a style="cursor:pointer;" title="Download" @click="downloadSong(sng.song);"><i class="glyphicon glyphicon-download-alt mon"></i></a></td>
                            </tr>
                            </table>
                           </td>  
                            </tr>
                        </table>
                        </td>
                        
                      </tr>
                      

                    </tbody>
                  </table>
                  
            </div>
        </div>
         <div v-if="this.msg != ''" >{{msg}}</div>
        <!--Playlist End-->
        </div>
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
      songs: [],
      msg: "",
      loading: false,
    };
  },
  
  mounted(){
   this.goto('contents');
  },

  created(){
   // this event bus will on when there is data coming from header component. 
   
   this.$eventBus.$on("searchSong", (payload) => {
         
   if(payload.length == 0) this.msg = "No artist found.";
   else this.songs = payload;
    });
   //this will execute when the search is called from other components rather than the search component.  
   if(this.$route.params.data.length == 0) this.msg = "No artist found.";
   else
   this.songs = this.$route.params.data;
  },

  methods:{

   downloadSong(song)
      {
        try{
          
          var fileLink = document.createElement('a');

          fileLink.href = song;
          fileLink.setAttribute('download', song);
          document.body.appendChild(fileLink);

          fileLink.click();
               
        }catch(err)
        {
          console.log(err);
        }
      },
      
   playAudio(song) {
        this.$eventBus.$emit("playAudio", song);
      },
   
   goto(refName) {
        var element = this.$refs[refName];
        var top = element.offsetTop;
        window.scrollTo(0, top);
    },
 
  }
};
</script>

<style scoped>
.btn{
  width:1000px;
  
}
</style>
