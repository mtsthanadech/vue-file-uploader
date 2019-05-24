<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-primary text-uppercase">{{ title }}</h6>
    <button @click="generatePDF()" class="btn btn-1 btn-primary btn-pdf">
      <i class="fa fa-download"></i>
    </button>
    <!-- - {{graph_data_y}} - {{graph_label_y}} -->
    <div class="row">
      <div class="col-9">
        <!-- <card> -->
        <input
          type="text"
          v-model="queryword"
          v-on:keyup="onBtnPredictClicked"
          @keypress.enter="sendMessage(queryword)"
          placeholder="Query your data"
          class="form-control input-group-alternative"
          aria-describedby="addon-right addon-left"
        />
        <ul v-if="wordsuggest.length > 0" class="ul-suggest">
          <li v-for="(word, index) in wordsuggest" :key="index">
            <div v-if="index < 5" class="btn-suggest-parent">
              <a
                @click="replaceWord(word, index)"
                class="btn btn-suggest"
              >
                #{{ index }} - {{ word }}
              </a>
            </div>
          </li>
        </ul>


        <!--{{ getDB()}}-->
        <!--<card>{{ data }}</card> <card>{{ data.type }}</card>-->
        <!--<card>{{ deepword }}</card>-->
        <!--<card>{{ wordsuggest }}</card>-->
      </div>
      <div class="col-3">
        <button type="submit" @click="sendMessage(queryword)" class="btn btn-1 btn-primary">
          <i class="fa fa-send"></i> Search
        </button>
      </div>
    </div>
    <div class="row no-gutters masonry">
      <div class="graphfullwidth" v-for="(graph, index) in graphs" :key="index">
        <div class="col-md-12 box" v-if="graph && !agg_data[index]">
          <card ref="oop">
            <button type="button" class="close" @click="delGraph(index)">
              <span>×</span>
            </button>
            <h6>{{ graph }}</h6>
            <bar-chart
              :data_x="data_x"
              :data_y="data_y"
              :label_x="label_x"
              :label_y="label_y"
              :graph_label="graph_label"
            >
            </bar-chart>
          </card>
        </div>
        <div class="col-md-12 box" v-else-if="graph">
          <!--&& agg_data[index].length === 1-->
          <card>
            <button type="button" class="close" @click="delGraph(index)">
              <span>×</span>
            </button>
            <h6>{{ graph }}</h6>
            <div class="agg">{{ agg_data[index] }}</div>
            <div class="agg_compare">
              {{ agg_label }} {{ compare_agg[index] }}
            </div>
            <div class="agg_compare_1">
              {{ agg_label_1 }} {{ compare_agg_1[index] }}
            </div>
          </card>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import axios from "axios";
import firebase from "firebase";
import LineChart from "@/components/ChartLine.vue";
import BarChart from "@/components/ChartBar.vue";
import * as jsPDF from "jspdf";

export default {
  name: "QueryGraph",
  props: ["title"],
  created: function() {
    this.getDB();
  },
  data() {
    return {
      queryword: "",
      deepword: "",
      wordsuggest: [],
      treedata: [],
      suggestdata: [],
      suggeststage: 0,

      selectWord: [],
      options: {},

      data: "",
      graphs: [],
      graph_label: "",
      label_x: "",
      label_y: "",
      data_x: [],
      data_y: [],

      compare_agg: [],
      compare_agg_1: [],
      agg_data: [],
      agg_label: [],
      agg_label_1: [],

      errors: [],
      index: "",
      column_thai: [],
      column_eng: [],
      matched: "",
      theUserUid: firebase.auth().currentUser.uid
    };
  },
  components: {
    "line-chart": LineChart,
    "bar-chart": BarChart
  },
  methods: {
    onBtnPredictClicked() {
      var text = this.queryword;
      var input = this.gen_input(text);
      (async () => {
        var predictions = [];
        for (var i = 0; i < text.length; i++) {
          var input_1 = new Float32Array(input["input_1"][i]);
          var input_2 = new Float32Array(input["input_2"][i]);
          var inputData = { input_1: input_1, input_2: input_2 };
          var output = await model.predict(inputData);
          predictions.push(output.dense_2[0]);
        }
        this.selectWord = this.parse_prediction(text, predictions);
        this.deepword = this.selectWord[this.selectWord.length - 1];
        var deepword = this.deepword;
        var batch = [];

        console.log(this.queryword.length);
        console.log(this.suggeststage);

        if(this.queryword.length < 8 && this.suggeststage !== 1) {
            this.suggeststage = 0;
            this.suggestdata = this.treedata;
        } else if(this.suggeststage === 0 && this.queryword.length >= 8) {
            this.suggeststage = 1;
            this.suggestdata = this.column_thai;
        } else if(this.queryword.length > 20){
            this.suggeststage = 2;
            this.suggestdata = [];
            this.wordsuggest = [];
        }
        this.showSuggestions(deepword,batch);
      })();
    },
    gen_input(text) {
      text_pad = "          " + text + "          ";
      var text_pad = text_pad.split("");
      var n = text.length;
      var n_pad = 21;
      var n_pad_2 = 10;

      var character_list = Array();
      for (var i = n_pad_2; i < n_pad_2 + n; i++) {
        var a = text_pad.slice(i + 1, i + n_pad_2 + 1);
        var b = text_pad.slice(i - n_pad_2, i).reverse();
        var c = text_pad.slice(i, i + 1);
        var char_list = a.concat(b).concat(c);
        character_list[i - n_pad_2] = char_list;
      }

      var X_char = Array();
      var X_type = Array();
      for (var i = 0; i < character_list.length; i++) {
        var characters = character_list[i];
        var x_char = Array();
        var x_type = Array();
        for (var j = 0; j < characters.length; j++) {
          var char_map = CHARS_MAP[characters[j]];
          if (typeof char_map == "undefined") {
            char_map = 80;
          }

          var type = CHAR_TYPE_FLATTEN[characters[j]];
          if (typeof type == "undefined") {
            type = "o";
          }

          x_char[j] = char_map;
          x_type[j] = CHAR_TYPES_MAP[type];
        }
        X_char[i] = x_char;
        X_type[i] = x_type;
      }

      return { input_1: X_char, input_2: X_type };
    },
    parse_prediction(text, prediction) {
      var predictions = prediction.slice(1).concat(1);
      var tokenized_text = Array();
      var count = 0;
      var word = "";
      for (var i = 0; i < text.length; i++) {
        word = word + text[i];
        if (predictions[i] > 0.5) {
          tokenized_text[count] = word;
          count = count + 1;
          word = "";
        }
      }
      return tokenized_text;
    },
    replaceWord(word, index) {
      var combind = "";
      console.log("#" + index + " " + word + " " + this.selectWord);
      this.selectWord[this.selectWord.length - 1] = word;
      for (let i = 0; i < this.selectWord.length; i++) {
        combind += this.selectWord[i];
        console.log("in loop " + combind);
        if (i === this.selectWord.length - 1) {
          this.queryword = combind;
          this.deepword = this.selectWord[this.selectWord.length - 1];
          console.log(this.queryword);
          this.deepword = "";
          this.wordsuggest = [];
        }
      }
      console.log("out loop " + combind);
    },
    addGraph(queryword) {
      this.graphs.push(queryword);
      console.log("addGraph"+queryword);
      console.log("add");
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .update({
          Graphs_label: this.graphs,
          Query: queryword
        });
    },
    delGraph(index) {
      this.graphs.splice(index, 1, null);
      this.agg_data.splice(index, 1, null);
      this.compare_agg.splice(index, 1, null);
      this.compare_agg_1.splice(index, 1, null);
    },
    condition_graph(data ,queryword) {
      //  Clear Data
      this.graph_label = "";
      this.label_x = "";
      this.label_y = "";
      this.data_x = [];
      this.data_y = [];

      var type = data.type;
      if (type === 1) {
        for (let i = 0; i < 100; i++) {
          this.data_y.push(data.data_y[i]);
          this.data_x.push(data.data_x[i]);
        }
        this.graph_label = queryword;
        this.label_x = data.label_x;
        this.label_y = data.label_y;
        this.addGraph(queryword);
      } else if (type === 2 || type === 3 || type === 4 || type === 5) {
        // 2 - Avg
        // 3 - Count
        // 4 - Min
        // 5 - Max
        var index = this.graphs.length
        this.agg_data[index] = data.data.toFixed(2);
        this.compare_agg[index] = data.compare_agg.toFixed(2);
        this.compare_agg_1[index] = data.compare_agg_1.toFixed(2);
        if (type === 2) {
          this.agg_label = "Min :";
          this.agg_label_1 = "Max :";
          this.addGraph(queryword);
        } else if (type === 3) {
          this.agg_label = "No Agg :";
          this.agg_label_1 = "No Agg :";
            this.addGraph(queryword);
        } else if (type === 4) {
          this.agg_label = "Avg :";
          this.agg_label_1 = "Max :";
            this.addGraph(queryword);
        } else if (type === 5) {
          this.agg_label = "Min :";
          this.agg_label_1 = "Avg :";
            this.addGraph(queryword);
        }
      } else if (type === 6) {
        //SD
      } else if (type === 7) {
        //Population Variance
      } else if (type === 8) {
        //percentile
        var sorttable = [];
        for(let key in data.data_y) {
            sorttable.push([key,data.data_y[key]]);
        }
        sorttable.sort(function (a, b) {
            return a[1] - b[1];
        });

        for (let index in sorttable){
          this.data_x.push("Percentile : " + sorttable[index][0]);
          this.data_y.push(sorttable[index][1]);
        }

        this.label_x = "Percentile";
        this.label_y = data.label_y;
        this.graph_label = this.queryword;
        this.addGraph();
      } else if (type === 0) {
        console.log("no column");
      } else {
        console.log("Don't have data");
      }
    },
    showSuggestions(deepword, batch){
        this.suggestdata.forEach(function(column) {
            if (column.includes(deepword)) {
                batch.push(column);
            }
        });
        this.wordsuggest = batch;
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
      const tree_url = "https://35.198.215.67:1064/getallword.php";
      axios
        .get(tree_url)
        .then(response => {
          this.treedata = response.data;
          // this.suggestdata = this.treedata.concat(this.column_thai);
        })
        .catch(error => {
          // this.suggestdata = this.column_thai;
          console.log("can't get the tree data because => " + error);
        });
    },
    sendMessage(queryword) {
      const url = "https://35.198.215.67/query";
      this.getDB();
      axios
        .post(url, {
          index: this.index,
          query: queryword,
          colthai: this.column_thai,
          coleng: this.column_eng
        })
        .then(response => {
          this.data = response.data;
          this.condition_graph(response.data, queryword);
        })
        .catch(e => {
          this.errors.push(e);
          console.log(this.errors);
        });
      this.queryword = "";
      //show result here
    },
    generatePDF() {
      // jsPDF
      var x = 5;
      var y = 5;
      var width = 143.5;
      var height = 66.67;

      var doc = new jsPDF();
      for (let i = 0 ; i < this.$refs.oop.length ; i++) {
          var imgData = this.$refs.oop[i].$children[0].$refs.canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', x, y, width, height);
          y = y + height + 10;
      }

      doc.save('sample-file.pdf');
    }
  }
};
</script>

<style>
.col-md-12 {
  margin: 0 !important;
  padding: 0 !important;
}
.agg {
  width: 100%;
  font-size: 2em;
}

.agg_compare {
  width: 100%;
  font-size: 1em;
  float: left;
}

.agg_compare_1 {
  width: 100%;
  font-size: 1em;
  float: right;
}

.box {
  width: 100vw;
}

.btn-suggest ,.graphfullwidth {
  text-align: justify !important;
  width: 100%;
}
.btn-suggest-parent {
  /*position: relative !important;*/
  color: #5e72e4;
}
  div ul li {
    list-style: none;
    background-image: none;
    /*background-repeat: none;*/
    background-position: 0;
    /*margin-bottom: 5px;*/

  }
  div ul {
    list-style-type: none;
    padding: 0;
    margin-bottom: 5px;
    /*z-index: 111;*/
  }

  .ul-suggest {
    position: absolute;
    width: 100%;
    z-index: 1;
    text-transform: uppercase;
    -webkit-transition: all 0.15s ease;
    transition: all 0.15s ease;
    will-change: transform;
    letter-spacing: 0.025em;
    font-size: 0.875rem;
    user-select: none;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    -webkit-box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    -webkit-transform: translateY(-1px);
    transform: translateY(-1px);
    background-color: white;
  }
  div.col-4 button.btn:not(:last-child) {
    /*margin-right: 0;*/
  }
  /*button.btn.btn-1.btn-primary.btn-pdf {*/
   /*position: absolute;*/
   /*left: 87%;*/
   /*top: 12%;*/
   /*background-color: #cccccc;*/
   /*border-color: #cccccc;*/
    /*color: #000000;*/
 /*}*/
</style>
