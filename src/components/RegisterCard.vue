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
        <h6><router-link to="/">Sign in</router-link>/ Register</h6>
      </div>
      <form role="form">
        <input
          v-model="name"
          placeholder="Name"
          type="name"
          class="mb-3 form-control input-group-alternative"
          aria-describedby="addon-right addon-left"
          addon-left-icon="ni ni-hat-3"
        />
        <input
          v-model="email"
          placeholder="E-mail"
          type="email"
          class="mb-3 form-control input-group-alternative"
          aria-describedby="addon-right addon-left"
          addon-left-icon="ni ni-hat-3"
        />
        <input
          v-model="pass"
          placeholder="Password"
          type="password"
          class="mb-3 form-control input-group-alternative"
          aria-describedby="addon-right addon-left"
          addon-left-icon="ni ni-hat-3"
        />

        <!-- <div class="text-muted font-italic">
                                    <small>password strength:
                                        <span class="text-success font-weight-700">strong</span>
                                    </small>
                                </div>
                                <base-checkbox>
                                    <span>I agree with the
                                        <a href="#">Privacy Policy</a>
                                    </span>
        </base-checkbox>-->
        <div class="text-center">
          <!-- <base-button type="primary" class="my-4">Create account</base-button> -->
          <button v-on:click="register" class="btn btn-1 btn-primary">
            Create account
          </button>
        </div>
      </form>
    </template>
  </card>
</template>
<script>
import firebase from "firebase";
export default {
  name: "RegisterCard",
  data: function() {
    return {
      name: "",
      email: "",
      pass: "",
      theUserUid: "",
      theUser: ""
    };
  },
  methods: {
    register: function(e) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.pass)
        .then(user => {
          this.theUser = user;
          this.theUserUid = firebase.auth().currentUser.uid;
          firebase
            .database()
            .ref("users/" + this.theUserUid)
            .set({
              Name: this.name,
              Email: this.email,
              Uploaded: false,
              ShowIntroduction: true,
              Usagetab: [{Tabname: "Instruction Tab"}],
              Logstash: false,
              Tabs: ["Instruction Tab"],
            });
          alert("Account created for " + this.email);
          // alert(`Account created for ${user.email}`);
          // this.router.push('/');
          // this.$router.go({ path: this.$router. });
          this.$router.push("./verify");
        })
        .catch(err => {
          console.log(err);
          alert(err.message);
        });
      // console.log('register');

      e.preventDefault();
    }
  }
};
</script>
