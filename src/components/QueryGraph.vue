<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-warning text-uppercase">Query The Database</h6>
     <!-- - {{graph_data_y}} - {{graph_label_y}} -->
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
          {{ graphs }}
        </card>
      </div>
      <!-- <div class="col-6" v-for="(graph, index) in graphsname">
        <card><h6>{{ graph }} - {{ index }}</h6><line-chart
                v-bind:chartdata="graphdataline"
                v-bind:options="graphoptionsline"
              >
              </line-chart></card>
      </div> -->
      
      <div class="col-6" v-if="graph" v-for="(graph,index) in graphs" @key="index">
        <card>
          <button type="button" @click="delGraph(index)">
            <span>×</span>
          </button>
          <h6>{{ index }} - {{ graph }}</h6>
          <bar-chart
                v-bind:graph_data_y="graph_data_y"
                v-bind:graph_label_y="graph_label_y"
              >
          </bar-chart>
          <!-- <line-chart
                v-bind:graph_data_y="graph_data_y"
                v-bind:graph_label_y="graph_label_y"
              >
          </line-chart> -->
        </card>
      </div>
      <div class="col-6" v-if="graph" v-for="(graph,index) in graphs" @key="index">
        <card>
          <button type="button" @click="delGraph(index)">
            <span>×</span>
          </button>
          <h6>{{ index }} - {{ graph }}</h6>
          <line-chart
                v-bind:graph_data_y="graph_data_y"
                v-bind:graph_label_y="graph_label_y"
              >
          </line-chart>
        </card>
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
import CircularJSON from "circular-json"

export default {
  name: "QueryGraph",
  data() {
    return {
      queryword: "",

      data: "",
      graphs: [],
      graph_data_x: "",
      graph_data_y: "",
      graph_label_x: "",
      graph_label_y: "",

      errors: [],
      index: "",
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
    };
  },
  computed: {
    fromDatabase() {
      this.getDB();
    }
  },
  components:{
    "line-chart" : LineChart,
    "bar-chart" : BarChart
  },
  methods: {
    addGraph() {
      this.graphs.push(this.queryword);
      firebase
            .database()
            .ref("users/" + this.theUserUid + "Graphs")
            .update({
              Graphs: this.graphs,
              Email: this.email,
              Uploaded: false
            });
    },
    delGraph(index) {
      this.graphs.splice(index,1,null);
    },
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
      this.addGraph();
    }
  }
};
</script>
