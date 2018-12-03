<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 bg-gradient-default">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="container pt-lg-md">
            <div class="row justify-content-center">
                <div class="col-lg-5">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0">
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
                        </template> -->
                        <template>
                            <div class="text-center text-muted mb-4">
                                <h6>Sing in / <router-link to="/Register" >Register</router-link></h6>
                            </div>
                            <form role="form">
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
                                        addon-left-icon="ni ni-hat-3"/>
                                <!-- <base-checkbox>
                                    Remember me
                                </base-checkbox> -->
                                
                                <div class="text-center">
                                    <a href="#" class="text-light">
                                        <small>Forgot password?</small>
                                    </a>
                                    <br>
                                    <button v-on:click="login" class="btn btn-large btn-extended grey lighten-4 black-text">Log in</button>
                                </div>
                            </form>
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import firebase from 'firebase';
export default {
    name: "Login",
    data: function() {
    return {
      email: "",
      pass: ""
    };
  },
  methods: {
    login: function(e) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.pass)
        .then(
          user => {
            alert(`You are logged in`);
            // alert(`You are logged in as ${user.email}`);
            // this.$router.go({ path: this.$router.path });
            this.$router.push('./login');
          },
          err => {
            console.log(err);
            alert(err.message);
          }
        );
      e.preventDefault();
    }
  }
};
</script>