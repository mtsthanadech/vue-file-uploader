<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-warning text-uppercase">Query The Database</h6>
    
  </card>
</template>

<script>
import axios from "axios";
import firebase, { database } from "firebase";
import Chart from "vue-chartjs"
import { generateChart } from "vue-chartjs"
import { Bar } from "vue-chartjs"

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
