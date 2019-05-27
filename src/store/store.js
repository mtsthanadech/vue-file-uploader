import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        Usaged: ["eeeee"],
    },
    // getters: {
    //     getUid: state => {
    //         const userUid = firebase.
    //                                 auth()
    //                                 .currentUser
    //                                 .uid;
    //         state.theUserUid = userUid
    //         return state.theUserUid;
    //     },
    //     getEmail: state => {
    //         const userEmail = firebase
    //                                 .auth()
    //                                 .currentUser
    //                                 .email;
    //         state.theUserEmail = userEmail
    //         return state.theUserEmail;
    //     },
    //     getVerified: state => {
    //         const userVerified = firebase
    //                                 .auth()
    //                                 .currentUser
    //                                 .emailVerified;
    //         state.theUserVerified = userVerified
    //         return state.theUserVerified;
    //     }
    // }
});
