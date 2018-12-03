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
                                <h6><router-link to="/Login" >Sign in</router-link> / Register</h6>
                            </div>
                            <form role="form">
                                <input
                                        v-model="name"
                                        placeholder="Name"
                                        type="name"
                                        class="mb-3 form-control input-group-alternative"
                                        aria-describedby="addon-right addon-left"
                                        addon-left-icon="ni ni-hat-3"/>
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
                                
                                <!-- <div class="text-muted font-italic">
                                    <small>password strength:
                                        <span class="text-success font-weight-700">strong</span>
                                    </small>
                                </div>
                                <base-checkbox>
                                    <span>I agree with the
                                        <a href="#">Privacy Policy</a>
                                    </span>
                                </base-checkbox> -->
                                <div class="text-center">
                                    <!-- <base-button type="primary" class="my-4">Create account</base-button> -->
                                    <button v-on:click="register" class="btn btn-1 btn-Primary">Create account</button>
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
import * as firebaseui from 'firebaseui'

export default {
    name: 'register',
    data: function() {
        return {
            name: "",
            email: "",
            pass: "",
        }
    },
    methods: {
        register: function(e) {
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.email, this.pass)
                .then(
                    user => {
                    alert('Account created');
                    // alert(`Account created for ${user.email}`);
                    // this.router.push('/');
                    // this.$router.go({ path: this.$router. });
                    this.$router.push('./login');
                })
                .catch((err) => {
                    console.log(err);
                    alert(err.message);
                });
            // console.log('register');
            e.preventDefault();
            
        }
    }
};
</script>