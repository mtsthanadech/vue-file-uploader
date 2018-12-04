import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        theUserUid: ""
    },
    getters: {
        getUid: state => {
            const userUid = firebase.auth().currentUser.uid;
            state.theUserUid = userUid
            return state.theUserUid;
        }
    }
})