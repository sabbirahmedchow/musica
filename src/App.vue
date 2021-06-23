<template>
  <div id="app">
    <section>
      <Drawer />
      <Register />
      <div class="main-content">
        <Header />

        <router-view></router-view>
        <Footer />
      </div>
      
    </section>
  </div>
</template>

<script>
import Drawer from "./components/leftdrawer.vue";
import Header from "./components/header.vue";
import Footer from "./components/footer.vue";
import Register from "./components/modalregister.vue";

export default {
  
  name: "App",
  components: {
    Drawer,
    Header,
    Footer,
    Register,
  },
//  deactivated(){
//    this.$axios.post("/getRandomSongs").then(() => {
    
//     })
//  }
      
};
</script>

