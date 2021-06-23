import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/home";
import Account from "@/views/my_account";
import Songs from "@/views/songs";
import Newsong from "@/views/new_song";
import Playlist from "@/views/my_playlist";
import Unauth from "@/views/403";
import Search from "@/views/search";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/my_account",
      name: "my-account",
      component: Account,
    },
    {
      path: "/add_song",
      name: "NewSong",
      component: Newsong,
    },
    {
      path: "/my_playlist",
      name: "My Playlist",
      component: Playlist,
    },
    {
      path: "/:genre",
      name: "Songs",
      component: Songs,
      
    },
    {
      path: "/unauth",
      name: "Unauth",
      component: Unauth,
    },

    {
      path: "/search",
      name: "Search",
      component: Search,
    },
  ],

  mode: "history",
});
