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
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="playborder">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="left">
                      <div class="section-title">
                        <h3 class="tittle">My Playlist Library</h3>
                      </div>
                    </td>
                    
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <div class="row" id="content" ref="contents">
            <div class="col-lg-6">
             <div v-if="this.msg != ''" >{{msg}}</div>
             <div v-if="songs.length === 0" class="loading">Loading...</div>
              <table width="1100px">
                    <tbody>
                      <tr v-for="(sng, index) in paginatedData" :key="index" :class="index">
                        <td>
                        <table class="chart-table" style="width:1100px;">
                          <tr>
                          
                          <td>{{countNum(index)}}</td>
                          <td><img :src="sng.thumbnail" :title="sng.artist +' - '+ sng.title"></td>
                          <td><h4>{{sng.title}}</h4>
                            <p>{{sng.artist}} </p></td>
                          <td style="width:200px">
                           <table cellspacing="4" cellpadding="3" style="width:100%; border-collapse:separate;" >
                            <tr>
                             <td><a style="cursor:pointer; float:left;" @click="playAudio(sng.song); return false;" title="Play"><i class="glyphicon glyphicon-play-circle mon"></i></a>
                             <a style="cursor:pointer; margin-left:10px;" title="Delete" @click="delSong(sng.song, index);"><i class="glyphicon glyphicon-remove-circle mon"></i></a>
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
                  <div class="btn">
                    <button :disabled="pageNumber === 0" @click="prevPage">Previous</button>
                    <button :disabled="pageNumber >= pageCount -1" @click="nextPage">Next</button>
                  </div>
            </div>
            
          </div>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  
  name: "Playlist",
  
  data() {
    return {
      pageNumber: 0,  // default to page 0
      songs: [],
      token: localStorage.getItem("token"),
      msg: "",
      cnt: 0
    };
  },

  props:{
    
    size:{
      type:Number,
      required:false,
      default: 10
    }
},

  mounted(){
   this.goto('contents');
   try {
          this.$axios.post("/getSongs").then(response => {
          
          if(this.token == null)
          {
            this.$router.push({ name: "Unauth"} );
          }
          if(response.data == "")
          {
            this.msg = "You do not have any songs." 
          }
          else
          {
            this.songs = response.data;
            this.songs.reverse();
          }
          })
       } 
      catch (err) {
        alert(err);
      }
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
    },

    countNum()
    {
      if(this.pageNumber > 0)
       return par => par+(this.pageNumber*10)+1
      else
       return par => par+1 

    }
  },

  methods:{
    goto(refName) {
        var element = this.$refs[refName];
        var top = element.offsetTop;
        window.scrollTo(0, top);
    },

      nextPage(){
         this.pageNumber++;
      },
      prevPage(){
        this.pageNumber--;
      },

      playAudio(song) {
        this.$eventBus.$emit("playAudio", song);
      },

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

      delSong(song,index)
      {
        try{
          const del = confirm("Are you sure you want to delete this song?");
          if(del == true)
          { 
              this.$axios.post("/delSong", {song:song}).then(response => {
              if(response.data != '')
              {
               this.songs.splice(index, 1); 
               this.paginatedData;
              }
            })
          }
          else{
            return false;
          }  

        }catch(err)
        {
          console.log(err);
        }
      }
    
  },
  

}
</script>

<style scoped>
.btn{
  width:1000px;
  height:40px;
  margin-top: 20px;
  
}
</style>