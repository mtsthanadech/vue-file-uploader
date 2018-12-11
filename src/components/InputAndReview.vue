<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-warning text-uppercase">Query The Database</h6>
    <input
      v-model="payload"
      placeholder="Query your data"
      class="form-control input-group-alternative"
      aria-describedby="addon-right addon-left"
    >
    <br>
    <button v-on:click="sendMessage" class="btn btn-1 btn-warning">Query</button>
    <card>
      <div v-if="data">{{ data }}</div>
      <!-- <div>{{de}} - {{fromDatabase()}}</div> -->
    </card>
  </card>
</template>

<script>
import axios from "axios";
import firebase, { database } from "firebase";
import { ElasticIndex } from "./ElasticIndex.js";
export default {
  name: "InputAndReview",
  data() {
    return {
      payload: "",
      data: "",
      errors: [],
      index: "",
      column_thai: [],
      column_eng: [],
      matched: "",
      de: []
    };
  },
  computed: {
    fromDatabase() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.index = snapshot.child("Index").val();
          this.column_thai = snapshot.child("MatchColumns_thai").val();
          this.column_eng = snapshot.child("MatchColumns_eng").val();
        });
      return this.index;
    }
  },
  created() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.index = snapshot.child("Index").val();
          this.column_thai = snapshot.child("MatchColumns_thai").val();
          this.column_eng = snapshot.child("MatchColumns_eng").val();
        });
    //  ElasticIndex.$on("ElasticIndex", index => {
    //    this.index = index;
    //  });
     ElasticIndex.$on("ColumnThai", column_thai => {
       this.column_thai = column_thai;
     });
     ElasticIndex.$on("ColumnEng", column_eng => {
       this.column_eng = column_eng;
     });
  },
  methods: {
    sendMessage() {
      const url = "https://35.198.215.67/query";

      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.matched = snapshot.child("Matched").val();
        });

      if (this.matched == false) {
        this.data = "You don't map the column in Thai language";
      } else {
        axios
          .post(url, {
            index: this.index,
            query: this.payload,
            colthai: this.column_thai,
            coleng: this.column_eng
          })
          .then(response => {
            this.data = response.data;
          })
          .catch(e => {
            this.errors.push(e);
            console.log(this.errors);
          });
      }

      //show result here
      //this.data = "get data"
    }
  }
};
</script>
