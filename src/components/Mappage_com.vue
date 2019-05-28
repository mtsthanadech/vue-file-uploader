<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-success text-uppercase">ตั้งชื่อ Fields และตั้ง Datatype</h6>
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div v-for="(column, index) in db.MatchColumns_eng" :key="index">
          <div v-if="index < length_col/2">
            <strong>{{ column }}</strong>
            <div class="row no-gutters">
              <div class="col-6">
                <input
                        v-model="thai_columns[index]"
                        :keyup="compare_text(thai_columns[index], index)"
                        placeholder="ใส่ชื่อ Field ภาษาไทย"
                        class="form-control input-group-alternative"
                        aria-describedby="addon-right addon-left"
                >
              </div>
              <div class="col-6">
                <select v-model="datatype_col[index]" class="form-control input-group-alternative">
                  <option v-for="type in datatypes" :disabled="savetype" :value="type">{{ type }}</option>
                </select>
              </div>
            </div>
            <p class="text-danger">{{ remind[index] }}</p>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div v-for="(column, index) in db.MatchColumns_eng" :key="index">
          <div v-if="index >= length_col/2">
            <strong>{{ column }}</strong>
            <div class="row no-gutters">
              <div class="col-6">
                <input
                        v-model="thai_columns[index]"
                        :keyup="compare_text(thai_columns[index], index)"
                        placeholder="ใส่ชื่อ Field ภาษาไทย"
                        class="form-control input-group-alternative"
                        aria-describedby="addon-right addon-left"
                >
              </div>
              <div class="col-6">
                <select v-model="datatype_col[index]" class="form-control input-group-alternative">
                  <option v-for="type in datatypes" :disabled="savetype" :value="type">{{ type }}</option>
                </select>
              </div>
            </div>
            <p class="text-danger">{{ remind[index] }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <button class="btn btn-1 btn-primary" @click="savedata()">Save Fields</button>
    </div>

    <modal :show.sync="modals">
      <template slot="header">
        <h5 class="modal-title">Are you sure?</h5>
      </template>
      <div v-if="fillcompleted === 0">
        Datatype ในแต่ละ Fields จะไม่สามารถเปลี่ยนได้ คุณแน่ใจที่จะบันทึก ?
      </div>
      <div v-else-if="fillcompleted > 0 && fillcompleted < 100">
        ใส่ชื่อ Fields เป็นภาษาไทยให้ครบทุก Fields
      </div>
      <div v-else-if="fillcompleted > 100 && fillcompleted < 200">
        ใส่ชื่อ Fields เป็นภาษาไทยให้ครบ ก่อนที่จะกด Save Fields
      </div>
      <div v-else-if="fillcompleted > 200">
        มีบาง Fields ที่มีชื่อซ้ำกัน
      </div>
      <template slot="footer">
        <div v-if="fillcompleted === 0">
          <base-button type="primary" @click="writeDB()">Save</base-button>
        </div>
        <div v-if="fillcompleted > 0">
          <base-button type="primary" @click="modals=false">Close</base-button>
        </div>
      </template>
    </modal>
  </card>
</template>

<script>
import { ElasticIndex } from "./ElasticIndex.js";
import axios from "axios";
import Modal from "../components/Modal";
import firebase, { database } from "firebase";

export default {
  name: "MatchColumn",
  props: ["length_col"],
  data() {
    return {
      theUserUid: firebase.auth().currentUser.uid,
      thai_columns: [],
      remind: [],
      logstash: false,
      db: [],
      initialtype: false,
      modals: false,
      savetype: false,
      fillcompleted: 0,
      datatype_col: [],
      datatypes: [
          "text",
          "boolean",
          "integer",
          "float"
      ]
    };
  },
  created() {
      firebase
          .database()
          .ref("users/" + this.theUserUid)
          .on("value", snapshot => {
              this.db = snapshot.val();
              this.thai_columns = snapshot.child("MatchColumns_thai").val();
              this.logstash = snapshot.child("Logstash").val();
              if(snapshot.child("Datatype").val()) {
                this.savetype = true;
                this.initialtype = true;
                this.datatype_col = snapshot.child("Datatype").val();
              }
          });
  },
  methods: {
    compare_text(text,index) {
        var count = 1;
        for (let i = 0; i < this.thai_columns.length; i++) {
            if (this.thai_columns[i] === text && i !== index && count === 1 && text !== "" && this.thai_columns[i] !== undefined) {
                this.remind[index] = "มีชื่อ Fields ซ้ำกัน, เปลี่ยนชื่อ Fields";
                count++;
            } else if (count > 1 && this.thai_columns[i] !== undefined) {
                this.remind[index] = "มีชื่อ Fields ซ้ำกัน, เปลี่ยนชื่อ Fields";
            } else {
                this.remind[index] = null;
            }
        }
        if (this.initialtype === false) {
            this.initialtype = true;
            this.initail_datatype();
        }
    },
    initail_datatype() {
        for (let index = 0; index < this.length_col; index++) {
            this.datatype_col[index] = "text";
        }
    },
    savedata() {
        this.fillcompleted = 0;
        if (this.thai_columns.length === 0 || this.thai_columns.length !== this.length_col ) {
            this.fillcompleted = 111;
        } else {
            for (let i = 0; i < this.thai_columns.length; i++) {
                if (this.thai_columns[i] === "" || this.thai_columns[i] === null || this.thai_columns[i] === undefined) {
                    this.fillcompleted+=1
                }
            }
            for (let i = 0; i < this.remind.length; i++) {
                if (this.remind[i] !== null) {
                    this.fillcompleted = 222;
                }
            }
        }
        this.modals = true;
    },
    writeDB() {
        firebase
            .database()
            .ref("users/" + this.theUserUid )
            .child("MatchColumns_thai")
            .update(this.thai_columns)
            .then(res => {
                console.log("Thai columns updated")
            })
            .catch(error => {
                console.log(error)
            });
        if (this.savetype !== true) {
            firebase
                .database()
                .ref("users/" + this.theUserUid)
                .update({
                    Matched: true
                })
                .then(res => {
                    console.log("Columns are matched")
                })
                .catch(error => {
                    console.log(error)
                });
            firebase
                .database()
                .ref("users/" + this.theUserUid)
                .child("Datatype")
                .update(this.datatype_col)
                .then(res => {
                    console.log("Datatype are set")
                })
                .catch(error => {
                    console.log(error)
                });
        }

        this.modals = false;
        // console.log(this.db);

        if (this.logstash === false){
            const url_log = "https://35.198.215.67/logstash";
            const url_prog = "https://35.198.215.67/progress/"+this.db.Index;
            axios
                .post(url_log,{
                    column_eng: this.db.MatchColumns_eng,
                    column_type: this.db.Datatype,
                    index: this.db.Index,
                })
                .then(response => {
                    if(response.percent === 100.0 || response.percent === "100.0"){
                      this.logstash = true;
                      firebase
                          .database()
                          .ref("users/" + this.theUserUid)
                          .update({
                              Logstash: this.logstash
                          })
                    }
                })
                .catch(error => {
                    this.logstash = false;
                    console.log(error);
                });

            setTimeout(function(){
                axios
                    .get(url_prog)
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }, 10000);
        }
    }
  },
    components: {
      Modal,
    }
}
</script>
<style>
  input.form-control.input-group-alternative ,select.form-control.input-group-alternative {
    font-size: 1rem;
  }
  div.row div.row {
    justify-content: center;
  }
  div.row div.row button.btn.btn-1.btn-primary{
    margin-top: 20px;
  }
</style>
