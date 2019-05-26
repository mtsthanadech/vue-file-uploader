<template>
  <header class="header-global">
    <base-nav class="navbar-main" transparent type effect="light" expand>
      <a
        slot="brand"
        class="navbar-brand mr-lg-5"
        href="/"
      >
        <img src="img/brand/white.png">
      </a>

      <div class="row" slot="content-header" slot-scope="{closeMenu}">
        <div class="col-6 collapse-brand">
          <a href="/">
            <img src="img/brand/blue.png">
          </a>
        </div>
        <div class="col-6 collapse-close">
          <close-button @click="closeMenu"></close-button>
        </div>
      </div>

      <ul class="navbar-nav align-items-lg-center ml-lg-auto">
        <li class="nav-item">
          <a
            class="nav-link nav-link-icon"
            href="https://github.com/mtsthanadech/vue-file-uploader"
            target="_blank"
            data-toggle="tooltip"
            title="Star us on Github"
          >
            <i class="fa fa-github"></i>
            <span class="nav-link-inner--text d-lg-none">Github</span>
          </a>
        </li>
        <base-dropdown tag="li" class="nav-item">
          <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button">
            <i class="ni ni-collection d-lg-none"></i>
            <span v-if="!currentUser" class="nav-link-inner--text">Register / Login</span>
            <span v-if="currentUser" class="nav-link-inner--text">{{ currentUser }}</span>
          </a>
          <!-- <router-link v-if="isLoggedIn" to="/landing" class="dropdown-item">Landing</router-link> -->
          <router-link v-if="isLoggedIn" to="/app" class="dropdown-item">App</router-link>
          <!-- <router-link v-if="isLoggedIn" to="/profile" class="dropdown-item">Profile</router-link> -->
          <router-link v-if="isLoggedIn" to="/query" class="dropdown-item">Search</router-link>
          <router-link v-if="!isLoggedIn" to="/" class="dropdown-item">Login</router-link>
          <router-link v-if="!isLoggedIn" to="/register" class="dropdown-item">Register</router-link>
          <a v-if="isLoggedIn" v-on:click="logout" class="dropdown-item">Logout</a>
        </base-dropdown>
      </ul>
    </base-nav>
  </header>  
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import firebase from "firebase";

export default {
  name: "Appheader",
  data() {
    return {
      isLoggedIn: false,
      currentUser: false
    };
  },
  created() {
    if (firebase.auth().currentUser) {
      (this.isLoggedIn = true),
        (this.currentUser = firebase.auth().currentUser.email);
    }
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/");
        });
    }
  },
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown
  }
};
</script>

<style>
</style>
