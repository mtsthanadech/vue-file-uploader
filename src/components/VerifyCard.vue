<template>
  <card
    type="secondary"
    shadow
    header-classes="bg-white pb-5"
    body-classes="px-lg-5 py-lg-5"
    class="border-0"
  >
    <template>
      <div class="text-center text-muted mb-4">
        <h6>Please Verify your e-mail</h6>
      </div>
      <div class="text-center">
        <button class="btn btn-1 btn-primary" v-on:click="sendEmailVerify">Send Verification Email</button>
      </div>
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
      theUserUid: "",
      email: firebase.auth().currentUser.email
      // verified: firebase.auth().currentUser.emailVerified,
    };
  },
  methods: {
    sendEmailVerify() {
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(verifyEmail => {
          this.theUserUid = firebase.auth().currentUser.uid
          firebase
            .database()
            .ref("users/" + this.theUserUid)
            .update({
                Verified: false
            });
          alert("Email Verification sent " + this.email);
        })
        .catch(err => {
          alert(err.message);
        });
    }
  }
};
</script>
