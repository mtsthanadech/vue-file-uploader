<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-warning text-uppercase">Query The Database</h6> - {{createdata}}
    <div class="row">
      <div class="col-12">
        <card>
          <input
            v-model="queryword"
            placeholder="Query your data"
            class="form-control input-group-alternative"
            aria-describedby="addon-right addon-left"
          />
          <br>
           
          <button v-on:click="sendMessage" class="btn btn-1 btn-warning">Query</button>{{ getDB() }}
        </card>
      </div>
      <!-- <div class="col-6" v-for="(graph, index) in graphsname">
        <card><h6>{{ graph }} - {{ index }}</h6><line-chart
                v-bind:chartdata="graphdataline"
                v-bind:options="graphoptionsline"
              >
              </line-chart></card>
      </div> -->
      <div class="col-6" v-if="data">
        <card><bar-chart
                v-bind:graphdatabar="createdata"
              >
              </bar-chart></card>
      </div>
    </div>
  </card>
</template>

<script>
import axios from "axios";
import firebase, { database } from "firebase";
import { ElasticIndex } from "./ElasticIndex.js";
import LineChart from "@/components/ChartLine.vue";
import BarChart from "@/components/ChartBar.vue";
export default {
  name: "QueryGraph",
  data() {
    return {
      queryword: "",

      data: "",
      data_size: [],
      graph: "",
      graph_data_x: "",
      graph_data_y: "",
      graph_label_x: "",
      graph_label_y: "",

      errors: [],
      index: "",
      showw: "",
      column_thai: [],
      column_eng: [],
      matched: "",
      theUserUid: firebase.auth().currentUser.uid,
      createdata: {
        labels:[],
        datasets: [
          {
            label: '',
            backgroundColor: 'rgba(248, 121, 121, .5)',
            data: []
          }
        ]
      },

      graphdatabar: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: '',
            backgroundColor: 'rgba(248, 121, 121, .5)',
            data: [],
          }
        ]
      },
      graphdataline: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: 'rgba(248, 121, 121, .5)',
            data: [40, 39, 10, 40, 39, 80, 40],
            borderWidth: 1
          },
          {
            label: 'Data Two',
            backgroundColor: 'rgba(119, 255, 0, .5)',
            data: [50, 29, 15, 44, 29, 70, 20],
            borderWidth: 1
          }
        ]
      },
      // graphdataline: {
      //   labels: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      //   datasets: [
      //     { // one line graph
      //       label: 'Number of Moons',
      //       data: [0, 0, 1, 2, 67, 62, 27, 14],
      //       backgroundColor: [
      //         'rgba(54,73,93,.5)', // Blue
      //       ],
      //       borderColor: [
      //         '#36495d'
      //       ],
      //       borderWidth: 3
      //     },
      //     { // another line graph
      //       label: 'Planet Mass (x1,000 km)',
      //       data: [4.8, 12.1, 12.7, 6.7, 139.8, 116.4, 50.7, 49.2],
      //       backgroundColor: [
      //         'rgba(71, 183,132,.5)', // Green
      //       ],
      //       borderColor: [
      //         '#47b784',
      //       ],
      //       borderWidth: 3
      //     }
      //   ]
      // },
      graphoptionsline: {
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
    "line-chart" : LineChart,
    "bar-chart" : BarChart
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
            query: this.queryword,
            colthai: this.column_thai,
            coleng: this.column_eng
          })
          .then(response => {
            this.data = response.data;
            this.creategraph(response.data);
          })
          .catch(e => {
            this.errors.push(e);
            console.log(this.errors);
          });
      //show result here
    },
    creategraph(data) {
      if (Object.keys(data.graph_data_y).length == 0){
        // console.log(Object.keys(data.graph_data_y).length + "eiei1")
        this.graph_data_y = [data.graph_data_y];
        this.graph_label_y = [data.graph_label_y];
        // console.log("<1")
      } else {
        // console.log(Object.keys(data.graph_data_y).length + "eiei2")
        this.graph_data_y = Object.values(data.graph_data_y);
        this.graph_label_y = Object.values(data.data);
        // console.log(">=1")
      }  

      var dataforgraph;

      // for(let idd of Object.keys(data.graph_data_y).length){
      //   dataforgraph = {
      //     label: this.graph_label_y,
      //     backgroundColor:'rgba(248, 121, 121, .5)',
      //     data: this.graph_data_y,
      //   }
      //   this.createdata.labels.push(this.graph_label_y);
      //   this.createdata.datasets.push(dataforgraph)
      // }

      this.createdata = {
        labels: this.graph_label_y,
        datasets: [
          {
            label: this.graph_label_y,
            backgroundColor: 'rgba(248, 121, 121, .5)',
            data: this.graph_data_y
          }
        ]
      }

      // this.createdata = {
      //   labels:[],
      //   datasets: [
      //     {
      //       label: '',
      //       backgroundColor: 'rgba(248, 121, 121, .5)',
      //       data: []
      //     }
      //   ]
      // }

    }
  }
};
</script>
