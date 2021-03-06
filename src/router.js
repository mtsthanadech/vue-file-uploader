import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
// import Components from "./views/Components.vue";
// import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
// import Profile from "./views/Profile.vue";
import Fields from "./views/Fields.vue";
import Verify from "./views/Verify.vue";
import firebase from "firebase";
import "firebase/auth";
import Search from "./views/Search.vue";
import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);

Vue.use(Router);
const router = new Router({
  linkExactActiveClass: "active",
  routes: [
    // {
    //   path: "/components",
    //   name: "components",
    //   components: {
    //     header: AppHeader,
    //     default: Components,
    //     footer: AppFooter
    //   },
      // meta: {
      //   requiresAuth: false,
      //   requiresVerify: true
      // }
    // },
    // {
    //   path: "/landing",
    //   name: "landing",
    //   components: {
    //     header: AppHeader,
    //     default: Landing,
    //     footer: AppFooter
    //   },
    //   meta: {
    //     requiresAuth: false
    //     // requiresVerify: true
    //   }
    // },
    {
      path: "/",
      name: "login",
      components: {
        header: AppHeader,
        default: Login,
        footer: AppFooter
      },
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: AppHeader,
        default: Register,
        footer: AppFooter
      },
      meta: {
        requiresGuest: true
      }
    },
    // {
    //   path: "/profile",
    //   name: "profile",
    //   components: {
    //     header: AppHeader,
    //     default: Profile,
    //     footer: AppFooter
    //   }
    // },
    {
      path: "/fields",
      name: "fields",
      components: {
        header: AppHeader,
        default: Fields,
        footer: AppFooter
      },
      meta: {
        requiresAuth: false
        // requiresVerify: true
      }
    },
    {
      path: "/verify",
      name: "verify",
      components: {
        header: AppHeader,
        default: Verify,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path : "/search",
      name : "search",
      components: {
        header: AppHeader,
        default: Search,
        footer: AppFooter
      },
      meta: {
        requiresAuth: false
      }
    },
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  const loggedIn = firebase.auth().currentUser;
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!loggedIn) {
      // Go to login
      next({
        path: "/"
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if logged user
    if (loggedIn) {
      // Go to login
      next({
        path: "/fields"
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresVerify)) {
    if (!loggedIn) {
      next({
        path: "/"
      });
    } else {
      if (loggedIn.emailVerified) {
        to({
          path: "/fields"
        });
      } else {
        next({
          // path: "/verify"
        });
      }
    }
  } else if (to.matched.some(record => !record.meta.requiresAuth)) {
    if (!loggedIn.emailVerified) {
      to({
        path: "/fields"
      });
    } else {
      next();
    }
  } else {
    // Proceed to route
    to({
      path: "/fields"
    });
  }
});

export default router;
