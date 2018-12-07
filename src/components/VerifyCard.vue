<template>
  <card
    type="secondary"
    shadow
    header-classes="bg-white pb-5"
    body-classes="px-lg-5 py-lg-5"
    class="border-0"
  >
    <!-- <template>
                            <div class="text-muted text-center mb-3">
                                <small>Sign in with</small>
                            </div>
                            <div class="btn-wrapper text-center">
                                <base-button type="neutral">
                                    <img slot="icon" src="img/icons/common/github.svg">
                                    Github
                                </base-button>

                                <base-button type="neutral">
                                    <img slot="icon" src="img/icons/common/google.svg">
                                    Google
                                </base-button>
                            </div>
    </template>-->
    <template>
      <div class="text-center text-muted mb-4">
        <h6>Please Verify your e-mail</h6>
      </div>
      <div class="text-center">
        <!-- <div v-if="!verified"></div> -->
        <button class="btn btn-1 btn-primary" v-on:click="sendEmailVerify">Send Verification Email</button>
        <!-- <div v-if="verified"></div> -->
      </div>

      <!-- <form role="form">
                                <input
                                        v-model="email"
                                        placeholder="E-mail"
                                        type="email"
                                        class="mb-3 form-control input-group-alternative"
                                        aria-describedby="addon-right addon-left"
                                        addon-left-icon="ni ni-hat-3"/>
                                <input
                                        v-model="pass"
                                        placeholder="Password"
                                        type="password"
                                        class="mb-3 form-control input-group-alternative"
                                        aria-describedby="addon-right addon-left"
      addon-left-icon="ni ni-hat-3"/>-->
      <!-- <base-checkbox>
                                    Remember me
      </base-checkbox>-->
      <!-- <div class="text-center">
                                    <a href="#" class="text-light">
                                        <small>Forgot password?</small>
                                    </a>
                                    <br>
                                    <button v-on:click="login" class="btn btn-large btn-extended grey lighten-4 black-text">Log in</button>
                                </div>
      </form>-->
    </template>
  </card>
</template>
<script>
import firebase from "firebase";

export default {
  name: "VerifyCard",
  data() {
    return {
      user: "",
      //   sentemail: firebase.auth().currentUser.sendEmailVerification(),
      email: firebase.auth().currentUser.email,
      verified: firebase.auth().currentUser.emailVerified,
      goToPath: this.$router.push({ path: "/app" })
    };
  },
  computed: {
    theUserUid() {
      return this.$store.getters.getUid;
    }
  },
  methods: {
    sendEmailVerify() {
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(verifyEmail => {
          alert("Email Verification sent " + verifyEmail);
        })
        .catch(err => {
          alert(err.message);
        });
    }
  }
};
</script>
