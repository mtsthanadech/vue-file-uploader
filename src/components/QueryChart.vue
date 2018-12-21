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
    <button v-on:click="queryData" class="btn btn-1 btn-warning">Query</button>
    <card>
      <div v-if="data">{{ data }}</div>
    </card>
    <card></card>
    <card>index is {{index}}</card>
    <card>payload is {{payload}}</card>
    <card>column_thai are {{column_thai}}</card>
    <card>column_eng are {{column_eng}}</card>
  </card>
</template>

<script>
import axios from "axios";
import firebase, { database } from "firebase";
import Chart from "vue-chartjs"
import { generateChart } from "vue-chartjs"

export default {
  name: "QueryChart",
  extends: Bar,
  mounted () {
    this.renderChart(data, options)
  },
  data() {
    return {
      payload: "",
      data: [],
      errors: [],
      index: "",
      column_thai: [],
      column_eng: [],
      matched: "",
      theUserUid: firebase.auth().currentUser.uid
    };
  },
  computed: {
    fromDatabase() {
      this.getDB();
    }
  },
  methods: {
    getDB() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.index = snapshot.child("Index").val();
          this.column_thai = snapshot.child("MatchColumns_thai").val();
          this.column_eng = snapshot.child("MatchColumns_eng").val();
          this.matched = snapshot.child("Matched").val();
        });
    },
    queryData() {
      const url = "https://35.198.215.67/query";

      this.getDB();

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
  }
};
</script>
