<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-warning text-uppercase">Query The Database</h6>
     <!-- - {{graph_data_y}} - {{graph_label_y}} -->
    <div class="row">
      <div class="col-12">
        <!-- <card> -->
          <input
            v-model = "queryword"
            placeholder="Query your data"
            class="form-control input-group-alternative"
            aria-describedby="addon-right addon-left"
          />
          <br>
           
          <button v-on:click="sendMessage" class="btn btn-1 btn-warning">Query</button>{{ getDB() }}
          <!-- {{ graphs }}<br>{{ showData }}<br>{{ agg_data }}<br>{{ compare_agg }}<br>{{ compare_agg_1 }} -->
          <!-- {{graph_data}} -->

      </div>

    </div>
    <div class="row no-gutters masonry">
      <div v-for="(graph,index) in graphs" :key="index">
        <div class="col-md-12 box"  v-if="graph && !agg_data[index]">
          <card>
            <button type="button" class="close" @click="delGraph(index)">
              <span>×</span>
            </button>
            <h6>{{ graph }}</h6>
            <bar-chart
                  :graph_data = "graph_data"
                  :graph_label = "graph_label"
                  :graph_name = "queryword"
                >
            </bar-chart>
          </card>
        </div>
        <div class="col-md-12 box" v-else-if="graph && agg_data[index] != null"> <!--&& agg_data[index].length === 1-->
          <card>
            <button type="button" class="close" @click="delGraph(index)">
              <span>×</span>
            </button>
            <h6>{{ agg_label[index] }}</h6>
            <div class="agg">{{ agg_data[index] }}</div>
            <div class="agg_compare">{{ comAgg_label }} - {{ compare_agg[index] }}</div>
            <div class="agg_compare_1">{{ comAgg_label_1 }} - {{ compare_agg_1[index] }}</div>
          </card>
        </div>
      </div>
    </div>
<!--     
        <div class="col-12"  v-if="graph">
          <card>
            <button type="button" class="close" @click="delGraph(index)">
              <span>×</span>
            </button>
            <h6>{{ graph }}</h6>
            <div class="agg">{{graph_data}}</div>
          </card>
        </div>
      </div>
     -->
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
      graphs: [],

      showData: [],
      compare_agg: [],
      compare_agg_1: [],
      comAgg_label: "",
      comAgg_label_1: "",
      agg_data: [],
      agg_label: [],

      graph_data_x: "",
      graph_data_y: "",
      graph_label_x: "",
      graph_label_y: "",

      graph_data_x_max: "",
      graph_data_x_min: "",
      graph_range_x: "",
      graph_data_x_count: [0,0,0,0,0,0,0,0,0,0],

      graph_data_y_max: "",
      graph_data_y_min: "",
      graph_range_y: "",
      graph_data_y_count: [0,0,0,0,0,0,0,0,0,0],

      graph_data: "",
      graph_label: "",
      graph_datamax: "",
      graph_datamin: "",
      graph_range: "",
      graph_datacount: [0,0,0,0,0,0,0,0,0,0],

      graph_count: 10,
      graph_check_range: [],

      errors: [],
      index: "",
      column_thai: [],
      column_eng: [],
      matched: "",
      theUserUid: firebase.auth().currentUser.uid,
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
            .ref("users/" + this.theUserUid)
            .update({
              Graphs_label: this.graphs,
              Query: this.queryword
            });
    },
    addOneData() {
      // this.graphs.push(this.queryword);
      this.showData.push(this.queryword);
      // firebase
      //       .database()
      //       .ref("users/" + this.theUserUid)
      //       .update({
      //         Graphs_label: this.graphs,
      //         Query: this.queryword
      //       });
    },
    delGraph(index) {
      this.graphs.splice(index,1,null);
      this.agg_data.splice(index,1,null);
      this.compare_agg.splice(index,1,null);
      this.compare_agg_1.splice(index,1,null);
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
            this.createGraphVariable(response.data);
          })
          .catch(e => {
            this.errors.push(e);
            console.log(this.errors);
          });
      //show result here
    },

    createGraphVariable(data) {
      if (Object.keys(data.graph_data_y).length == 0){
        if (data.graph == 2) { //avg
          // compare_agg -> Min
          // compare_agg_! -> Max
          this.graphGenOneData(data.graph_data_y, data.graph_label_y, data.compare_agg, data.compare_agg_1, 'Min', 'Max');
        } else if (data.graph == 4) { //min
          // compare_agg -> Avg
          // compare_agg_! -> Max
          this.graphGenOneData(data.graph_data_y, data.graph_label_y, data.compare_agg, data.compare_agg_1, 'Avg', 'Max');
        } else if (data.graph == 5) { //max
          // compare_agg -> Min
          // compare_agg_! -> Avg
          this.graphGenOneData(data.graph_data_y, data.graph_label_y, data.compare_agg, data.compare_agg_1, 'Min', 'Avg');
        }
      } else {
        this.graphGenConditions(Object.values(data.graph_data_y), Object.values(data.graph_label_y), Object.values(data.graph_data_x), Object.values(data.graph_label_x));
      } 
    },
    graphGenConditions(dataY, labelY, dataX, labelX) {

      this.graph_data = dataY;

      if (this.graph_data[0] > -1 && this.graph_data.length > 1){
        this.graph_datamin = Math.min.apply(null,this.graph_data);
        this.graph_datamax = Math.max.apply(null,this.graph_data);
        this.graph_range = (this.graph_datamin + this.graph_datamax) / this.graph_count;

        for(let i=0; i < this.graph_count; i++){
          this.graph_check_range.push(Math.ceil(this.graph_datamin + (this.graph_range * (i+1))));
        }

        for(let j=0 ; j < this.graph_data.length; j++){

          if (this.graph_data[j] <= this.graph_check_range[0]) {
            this.graph_datacount[0] = (this.graph_datacount[0] + 1)
          } else if (this.graph_data[j] <= this.graph_check_range[1]) {
            this.graph_datacount[1] = (this.graph_datacount[1] + 1)
          } else if (this.graph_data[j] <= this.graph_check_range[2]) {
            this.graph_datacount[2] = (this.graph_datacount[2] + 1)
          } else if (this.graph_data[j] <= this.graph_check_range[3]) {
            this.graph_datacount[3] = (this.graph_datacount[3] + 1)
          } else if (this.graph_data[j] <= this.graph_check_range[4]) {
            this.graph_datacount[4] = (this.graph_datacount[4] + 1)
          } else if (this.graph_data[j] <= this.graph_check_range[5]) {
            this.graph_datacount[5] = (this.graph_datacount[5] + 1)
          } else if (this.graph_data[j] <= this.graph_check_range[6]) {
            this.graph_datacount[6] = (this.graph_datacount[6] + 1)
          } else if (this.graph_data[j] <= this.graph_check_range[7]) {
            this.graph_datacount[7] = (this.graph_datacount[7] + 1)
          } else if (this.graph_data[j] <= this.graph_check_range[8]) {
            this.graph_datacount[8] = (this.graph_datacount[8] + 1)
          } else if (this.graph_data[j] <= this.graph_check_range[9]) {
            this.graph_datacount[9] = (this.graph_datacount[9] + 1)
          } 
        }
        this.graph_data = this.graph_datacount;
        this.graph_label = this.graph_check_range;
        this.addGraph();
        this.graph_datacount = [0,0,0,0,0,0,0,0,0,0];
        this.graph_check_range = [];
      }
    },
    graphGenOneData(aggData, label, comAgg, comAgg1, comAgg_label, comAgg_label_1) {    
      var index = this.graphs.length  
      this.agg_data[index] = aggData.toFixed(2);
      this.compare_agg[index] = comAgg.toFixed(2);
      this.compare_agg_1[index] = comAgg1.toFixed(2);
      this.comAgg_label = comAgg_label;
      this.comAgg_label_1 = comAgg_label_1;
      this.agg_label[index] = label;
      this.addGraph();
      // this.addOneData();
    }
  }
};
</script>
<style>
  .agg {
    width: 100%;
    font-size: 2em;
  }
  .agg_compare{
    width: 100%;
    font-size: 1em;
    float: left;
  }
  .agg_compare_1{
    width: 100%;
    font-size: 1em;
    float: right;
  }
  .box {
    width: 100vw;
  }
</style>
