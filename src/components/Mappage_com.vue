<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-success text-uppercase">Match Column and Set data type</h6>
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
                        placeholder="Enter Thai name"
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
                        placeholder="Enter Thai name"
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
    <button class="btn btn-1 btn-primary" @click="savedata()">Save Data</button>
    <modal :show.sync="modals">
      <template slot="header">
        <h5 class="modal-title">Are you sure?</h5>
      </template>
      <div v-if="fillcompleted === 0">
        The datatype of database can't change, are you sure to save it ?.
      </div>
      <div v-else-if="fillcompleted > 0 && fillcompleted < 100">
        Please insert the thai column name every field.
      </div>
      <div v-else-if="fillcompleted > 100 && fillcompleted < 200">
        Please insert the thai column name before click save data.
      </div>
      <div v-else-if="fillcompleted > 200">
        Some columns name as same as another column.
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
  props: ["db", "length_col"],
  data() {
    return {
      theUserUid: firebase.auth().currentUser.uid,
      thai_columns: [],
      remind: [],
      initialtype: false,
      modals: false,
      savetype: false,
      fillcompleted: 0,
      datatype_col: [],
      datatypes: [
          "text",
          "boolean",
          "integer",
          "double",
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
                this.remind[index] = "Column name is matched another column, Please change this column name";
                count++;
            } else if (count > 1 && this.thai_columns[i] !== undefined) {
                this.remind[index] = "Column name is matched another column, Please change this column name";
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
            .ref("users/" + this.theUserUid)
            .child("MatchColumns_thai")
            .update(this.thai_columns);
        firebase
            .database()
            .ref("users/" + this.theUserUid)
            .update({
                Matched: true
            });
        firebase
            .database()
            .ref("users/" + this.theUserUid)
            .child("Datatype")
            .update(this.datatype_col);

        this.modals = false;
    }
  },
    components: {
      Modal,
    }
}
</script>
<style>

</style>
