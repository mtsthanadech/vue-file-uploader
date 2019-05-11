<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-warning text-uppercase">Query The Database</h6>
    <!-- - {{graph_data_y}} - {{graph_label_y}} -->
    <div class="row">
      <div class="col-12">
        <!-- <card> -->
        <input
          v-model="queryword"
          v-on:keyup="onBtnPredictClicked"
          placeholder="Query your data"
          class="form-control input-group-alternative"
          aria-describedby="addon-right addon-left"
        />
        <div v-if="wordsuggest.length > 0">
          <div v-for="(word, index) in wordsuggest" :key="index">
            <div>
              <button @click="replaceWord(word, index)" class="btn btn-1 btn-neutral btn-suggest">#{{ index }} - {{ word }}</button>
            </div>
          </div>
        </div>

        <button @click="sendMessage" class="btn btn-1 btn-warning">Query</button>

        <!--{{ getDB()}}-->
        <card>{{ deepword }}</card>
        <card>{{ wordsuggest }}</card>

      </div>
    </div>
    <div class="row no-gutters masonry">
      <div v-for="(graph, index) in graphs" :key="index">
        <div class="col-md-12 box" v-if="graph && !agg_data[index]">
          <card>
            <button type="button" class="close" @click="delGraph(index)">
              <span>×</span>
            </button>
            <h6>{{ graph }}</h6>
            <bar-chart
              :graph_data="graph_data"
              :graph_label="graph_label"
              :graph_name="queryword"
            >
            </bar-chart>
          </card>
        </div>
        <div class="col-md-12 box" v-else-if="graph && agg_data[index] != null">
          <!--&& agg_data[index].length === 1-->
          <card>
            <button type="button" class="close" @click="delGraph(index)">
              <span>×</span>
            </button>
            <h6>{{ agg_label[index] }}</h6>
            <div class="agg">{{ agg_data[index] }}</div>
            <div class="agg_compare">
              {{ comAgg_label }} - {{ compare_agg[index] }}
            </div>
            <div class="agg_compare_1">
              {{ comAgg_label_1 }} - {{ compare_agg_1[index] }}
            </div>
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
import firebase from "firebase";
import LineChart from "@/components/ChartLine.vue";
import BarChart from "@/components/ChartBar.vue";

export default {
  name: "QueryGraph",
  created: function() {
    this.getDB();
    console.log(this.column_thai);
    console.log(this.column_eng);
  },
  data() {
    return {
      queryword: "",
      deepword: "",
      wordsuggest: [],
      treedata: [],
      suggestdata: [],

      // selectedCountry: null,
      selectWord: [],
      options: {},

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
      graph_data_x_count: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      graph_data_y_max: "",
      graph_data_y_min: "",
      graph_range_y: "",
      graph_data_y_count: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      graph_data: "",
      graph_label: "",
      graph_datamax: "",
      graph_datamin: "",
      graph_range: "",
      graph_datacount: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

      graph_count: 10,
      graph_check_range: [],

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
    "bar-chart": BarChart,
  },
  methods: {
    // getword() {
    //     var CHAR_TYPE = {
    //         'กขฃคฆงจชซญฎฏฐฑฒณดตถทธนบปพฟภมยรลวศษสฬอ': 'c',
    //         'ฅฉผฟฌหฮ': 'n',
    //         'ะาำิีืึุู': 'v',  // า ะ ำ ิ ี ึ ื ั ู ุ
    //         'เแโใไ': 'w',
    //         '่้๊๋': 't', // วรรณยุกต์ ่ ้ ๊ ๋
    //         '์ๆฯ.': 's', // ์  ๆ ฯ .
    //         '0123456789๑๒๓๔๕๖๗๘๙': 'd',
    //         '"': 'q',
    //         "‘": 'q',
    //         "’": 'q',
    //         "'": 'q',
    //         ' ': 'p',
    //         'abcdefghijklmnopqrstuvwxyz': 's_e',
    //         'ABCDEFGHIJKLMNOPQRSTUVWXYZ': 'b_e'
    //     };
    //     var CHAR_TYPE_FLATTEN = {};
    //     for (var key in CHAR_TYPE) {
    //         var value = CHAR_TYPE[key];
    //         for (var i = 0; i < key.length; i++) {
    //             CHAR_TYPE_FLATTEN[key[i]] = value;
    //         }
    //     }
    //
    //     CHARS = [
    //         '\n', ' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+',
    //         ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8',
    //         '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E',
    //         'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    //         'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
    //         'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    //         'n', 'o', 'other', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
    //         'z', '}', '~', 'ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง', 'จ', 'ฉ', 'ช',
    //         'ซ', 'ฌ', 'ญ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ', 'ด', 'ต', 'ถ', 'ท',
    //         'ธ', 'น', 'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม', 'ย', 'ร', 'ฤ',
    //         'ล', 'ว', 'ศ', 'ษ', 'ส', 'ห', 'ฬ', 'อ', 'ฮ', 'ฯ', 'ะ', 'ั', 'า',
    //         'ำ', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'ฺ', 'เ', 'แ', 'โ', 'ใ', 'ไ',
    //         'ๅ', 'ๆ', '็', '่', '้', '๊', '๋', '์', 'ํ', '๐', '๑', '๒', '๓',
    //         '๔', '๕', '๖', '๗', '๘', '๙', '‘', '’', '\ufeff'
    //     ];
    //
    //     CHARS_MAP = {};
    //     for (var i = 0; i < CHARS.length; i++) {
    //         CHARS_MAP[CHARS[i]] = i;
    //     }
    //
    //     CHAR_TYPES = [
    //         'b_e', 'c', 'd', 'n', 'o',
    //         'p', 'q', 's', 's_e', 't',
    //         'v', 'w'
    //     ];
    //
    //     CHAR_TYPES_MAP = {};
    //     for (var i = 0; i < CHAR_TYPES.length; i++) {
    //         CHAR_TYPES_MAP[CHAR_TYPES[i]] = i;
    //     }
    //
    //
    //     const model = new KerasJS.Model({
    //         filepath: './model_lite.bin',
    //         gpu: false
    //     });
    //
    //     model.ready()
    //         .then(() => {
    //             $('#loading').hide();
    //
    //             // predict from GET parameter
    //             var text = new URL(window.location.href).searchParams.get("text");
    //             if (text != null) {
    //                 $('#message').val(text).trigger('keyup');
    //                 $('label[for="message"]').addClass('active')
    //             }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //
    //             $('#loading').text('โหลด Model ไม่สำเร็จ');
    //         });
    //
    //     // $(document).ready(initPage);
    //     // this.initPage()
    // },
    onBtnPredictClicked() {
      // var text = $("#message").val();
      var text = this.queryword;
      var input = this.gen_input(text);
      var batch = [];
      (async () => {
        var predictions = [];
        for (var i = 0; i < text.length; i++) {
          //https://github.com/transcranial/keras-js/issues/27#issuecomment-260856925
          var input_1 = new Float32Array(input["input_1"][i]);
          var input_2 = new Float32Array(input["input_2"][i]);
          var inputData = { input_1: input_1, input_2: input_2 };
          var output = await model.predict(inputData);

          predictions.push(output.dense_2[0]);
        }
        this.selectWord = this.parse_prediction(text, predictions);
        console.log("completed");
        console.log(this.selectWord);
        this.deepword = this.selectWord[this.selectWord.length - 1];
        var deepword = this.deepword;
        this.suggestdata.forEach(function (column) {
          if (column.includes(deepword)) {
            console.log(column);
            batch.push(column);
            console.log('wwww')
          }
        });
        this.wordsuggest = batch;
        console.log(this.deepword);
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
      var prediction = prediction.slice(1).concat(1);
      var tokenized_text = Array();
      var count = 0;
      var word = "";
      for (var i = 0; i < text.length; i++) {
        word = word + text[i];
        if (prediction[i] > 0.5) {
          tokenized_text[count] = word;
          count = count + 1;
          word = "";
        }
      }
      return tokenized_text;
    },
    replaceWord(word, index) {
      var combind = '';
      console.log('#'+index+' '+word+' '+this.selectWord);
      this.selectWord[this.selectWord.length-1] = word;
      for(let i=0; i<this.selectWord.length; i++){
          combind += this.selectWord[i];
          console.log('in loop '+combind);
          if (i==this.selectWord.length-1) {
            this.queryword = combind;
            this.deepword = this.selectWord[this.selectWord.length-1];
            console.log(this.queryword);
            // this.deepword = '';
            this.wordsuggest = [];
          }
      }
      console.log('out loop '+combind);
    },

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
      this.graphs.splice(index, 1, null);
      this.agg_data.splice(index, 1, null);
      this.compare_agg.splice(index, 1, null);
      this.compare_agg_1.splice(index, 1, null);
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
      const tree_url = 'https://35.198.215.67:1064/getallword.php';
      axios.get(tree_url).then(response => {
      //     // this.treedata = JSON.parse(response.data);
          this.treedata = response.data;
          console.log(response.data);
          console.log(this.treedata);
          this.suggestdata = this.treedata.concat(this.column_thai);
          console.log(this.suggestdata);
      }).catch(error => {
          this.suggestdata = this.column_thai;
          console.log('can\'t get the tree data because => '+error);
      })
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
      if (Object.keys(data.graph_data_y).length === 0) {
        if (data.graph === 2) {
          //avg
          // compare_agg -> Min
          // compare_agg_! -> Max
          this.graphGenOneData(data.graph_data_y, data.graph_label_y, data.compare_agg, data.compare_agg_1, "Min", "Max");
        } else if (data.graph === 4) {
          //min
          // compare_agg -> Avg
          // compare_agg_! -> Max
          this.graphGenOneData(data.graph_data_y, data.graph_label_y, data.compare_agg, data.compare_agg_1, "Avg", "Max");
        } else if (data.graph === 5) {
          //max
          // compare_agg -> Min
          // compare_agg_! -> Avg
          this.graphGenOneData(data.graph_data_y, data.graph_label_y, data.compare_agg, data.compare_agg_1, "Min", "Avg");}
      } else {
        this.graphGenConditions(Object.values(data.graph_data_y), Object.values(data.graph_label_y), Object.values(data.graph_data_x), Object.values(data.graph_label_x));
      }
    },
    graphGenConditions(dataY, labelY, dataX, labelX) {
      this.graph_data = dataY;
      if (this.graph_data[0] > -1 && this.graph_data.length > 1) {
        this.graph_datamin = Math.min.apply(null, this.graph_data);
        this.graph_datamax = Math.max.apply(null, this.graph_data);
        this.graph_range = (this.graph_datamin + this.graph_datamax) / this.graph_count;
        for (let i = 0; i < this.graph_count; i++) {
          this.graph_check_range.push(
            Math.ceil(this.graph_datamin + this.graph_range * (i + 1))
          );
        }
        for (let j = 0; j < this.graph_data.length; j++) {
          if (this.graph_data[j] <= this.graph_check_range[0]) {
            this.graph_datacount[0] = this.graph_datacount[0] + 1;
          } else if (this.graph_data[j] <= this.graph_check_range[1]) {
            this.graph_datacount[1] = this.graph_datacount[1] + 1;
          } else if (this.graph_data[j] <= this.graph_check_range[2]) {
            this.graph_datacount[2] = this.graph_datacount[2] + 1;
          } else if (this.graph_data[j] <= this.graph_check_range[3]) {
            this.graph_datacount[3] = this.graph_datacount[3] + 1;
          } else if (this.graph_data[j] <= this.graph_check_range[4]) {
            this.graph_datacount[4] = this.graph_datacount[4] + 1;
          } else if (this.graph_data[j] <= this.graph_check_range[5]) {
            this.graph_datacount[5] = this.graph_datacount[5] + 1;
          } else if (this.graph_data[j] <= this.graph_check_range[6]) {
            this.graph_datacount[6] = this.graph_datacount[6] + 1;
          } else if (this.graph_data[j] <= this.graph_check_range[7]) {
            this.graph_datacount[7] = this.graph_datacount[7] + 1;
          } else if (this.graph_data[j] <= this.graph_check_range[8]) {
            this.graph_datacount[8] = this.graph_datacount[8] + 1;
          } else if (this.graph_data[j] <= this.graph_check_range[9]) {
            this.graph_datacount[9] = this.graph_datacount[9] + 1;
          }
        }
        this.graph_data = this.graph_datacount;
        this.graph_label = this.graph_check_range;
        this.addGraph();
        this.graph_datacount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.graph_check_range = [];
      }
    },
    graphGenOneData(aggData, label, comAgg, comAgg1, comAgg_label, comAgg_label_1) {
      var index = this.graphs.length;
      this.agg_data[index] = aggData.toFixed(2);
      this.compare_agg[index] = comAgg.toFixed(2);
      this.compare_agg_1[index] = comAgg1.toFixed(2);
      this.comAgg_label = comAgg_label;
      this.comAgg_label_1 = comAgg_label_1;
      this.agg_label[index] = label;
      this.addGraph();
      // this.addOneData();
    },
  }
};
</script>

<style>
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

.btn-suggest {
  text-align: justify !important;
  width: 100%;
}
</style>
