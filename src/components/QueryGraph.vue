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
      <!-- {{ getDB() }} -->
      <div v-if="data">data is {{ data }}</div>
    </card>
    <!-- <card>index is {{index}}</card>
    <card>payload is {{payload}}</card>
    <card>column_thai are {{column_thai}}</card>
    <card>column_eng are {{column_eng}}</card> -->
    <card><line-chart
                v-bind:chartdata="graphdata"
                v-bind:options="graphoptions"
              >
              </line-chart></card>
  </card>
</template>

<script>
import axios from "axios";
import firebase, { database } from "firebase";
import { ElasticIndex } from "./ElasticIndex.js";
import LineChart from "@/components/ChartLine.vue";
export default {
  name: "InputAndReview",
  data() {
    return {
      payload: "",
      data: [],
      errors: [],
      index: "",
      column_thai: [],
      column_eng: [],
      matched: "",
      theUserUid: firebase.auth().currentUser.uid,
      graphdata: {
        labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        datasets: [
          { // one line graph
            label: 'Number of Moons',
            data: [0, 0, 1, 2, 67, 62, 27, 14],
            backgroundColor: [
              'rgba(54,73,93,.5)', // Blue
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)',
              'rgba(54,73,93,.5)'
            ],
            borderColor: [
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
              '#36495d',
            ],
            borderWidth: 3
          },
          { // another line graph
            label: 'Planet Mass (x1,000 km)',
            data: [4.8, 12.1, 12.7, 6.7, 139.8, 116.4, 50.7, 49.2],
            backgroundColor: [
              'rgba(71, 183,132,.5)', // Green
            ],
            borderColor: [
              '#47b784',
            ],
            borderWidth: 3
          }
        ]
      },
      graphoptions: {
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25,
            }
          }]
        }
      }
    };
  },
  computed: {
    fromDatabase() {
      this.getDB();
    //   firebase
    //     .database()
    //     .ref("users/" + this.theUserUid)
    //     .on("value", snapshot => {
    //       this.index = snapshot.child("Index").val();
    //       this.column_thai = snapshot.child("MatchColumns_thai").val();
    //       this.column_eng = snapshot.child("MatchColumns_eng").val();
    //       this.matched = snapshot.child("Matched").val();
    //     });
    //   return this.index;
    }
  },
  created() {
    //  ElasticIndex.$on("ElasticIndex", index => {
    //    this.index = index;
    //  });
    //  ElasticIndex.$on("ColumnThai", column_thai => {
    //    this.column_thai = column_thai;
    //  });
    //  ElasticIndex.$on("ColumnEng", column_eng => {
    //    this.column_eng = column_eng;
    //  });
  },
  components:{
    "line-chart" : LineChart
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
    sendMessage() {
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

      //show result here
      //this.data = "get data"
    }
  }
};
</script>
