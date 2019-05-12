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