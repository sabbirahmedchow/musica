<template>
  <div class="left-side sticky-left-side">
    <!--logo and iconic logo start-->
    <div class="logo" style="border-bottom:1px solid #5F45BB;">
      <h1>
        <router-link to="/">
          Music
          <span>A</span>
        </router-link>
      </h1>
    </div>
    <div class="logo sidebar" style="position: absolute; background: #111111; top:45px; z-index: 1;">
      <div style="background: #555; padding: 5px 0px; margin-top:0px;">
        <h1 style="font-size: 24px; color:#ffffff; ">
          <b>Genres</b>
        </h1>
      </div>
      
      <router-link v-for="(genre, i) in genres" :key="i" :to="genre.genre">{{ genre.genre }}</router-link>
    </div>
    <div class="logo-icon text-center">
      <router-link to="/">M</router-link>
    </div>

    <!-- /w3l-agile -->
    <!--logo and iconic logo end-->
  </div>
</template>

<script>
export default {
  name: "Drawer",
  data() {
    return {
      genres: [],
    };
  },

  mounted(){
    this.$axios.post("/getGenre").then((response) => {
       
     this.genres = response.data;
    
   });
  } 
};
</script>
