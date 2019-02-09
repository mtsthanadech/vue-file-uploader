<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-success text-uppercase">Match Column</h6>
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <li
          v-for="(column, indexs) in visible"
          v-bind:visible="visible"
          v-bind:currentPage="currentPage"
          v-bind:column="column"
          :key="indexs"
          style="list-style-type:none; margin-top: 10px;"
        >
          <strong>{{ column }}</strong>
          <input
            v-model="matchColumns[indexs+(currentPage*pageSize)]"
            placeholder="Enter Thai name"
            class="form-control input-group-alternative"
            aria-describedby="addon-right addon-left"
          >
        </li>

        <br>
        <div
          v-if="totalPages() > 0"
          v-bind:columns="columns"
          v-on:page:update="updatePage"
          v-bind:currentPage="currentPage"
          v-bind:pageSize="pageSize"
        >
          <ul class="pagination center">
            <li class="page-item disabled" v-if="currentPage === 0">
              <a class="page-link" v-on:click="updatePage(currentPage - 1)">
                <i class="fa fa-angle-left"></i>
                <span class="sr-only">Previous</span>
              </a>
            </li>
            <li class="page-item" v-else>
              <a class="page-link" v-on:click="updatePage(currentPage - 1)">
                <i class="fa fa-angle-left"></i>
                <span class="sr-only">Previous</span>
              </a>
            </li>

            <div v-if="currentPage===0">
              <li class="page-item active">
                <a class="page-link" v-on:click="updatePage(0)">1</a>
              </li>
            </div>
            <div v-else>
              <li class="page-item">
                <a class="page-link" v-on:click="updatePage(0)">1</a>
              </li>
            </div>
            

            <div v-for="(pageNumber, index) in theTotalPages" :key="index">
              
                <div v-if="currentPage==pageNumber">
                  <li class="page-item active" v-if="pageNumber < theTotalPages">
                    <a class="page-link" v-on:click="updatePage(pageNumber)">{{pageNumber+1}}</a>
                  </li>
                </div>
                <div v-else>
                  <li class="page-item" v-if="pageNumber < theTotalPages">
                    <a class="page-link" v-on:click="updatePage(pageNumber)">{{pageNumber+1}}</a>
                  </li>
                </div>
            </div>

            <li class="page-item disabled" v-if="currentPage === totalPages()-1">
              <a class="page-link" v-on:click="updatePage(currentPage + 1)">
                <i class="fa fa-angle-right"></i>
                <span class="sr-only">Next</span>
              </a>
            </li>

            <li class="page-item" v-else>
              <a class="page-link" v-on:click="updatePage(currentPage + 1)">
                <i class="fa fa-angle-right"></i>
                <span class="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </div>
        <button v-on:click="editColumns" v-if="fromDatabase" class="btn btn-1 btn-success">Edit</button>
        <button v-on:click="saveColumn" v-if="!fromDatabase" class="btn btn-1 btn-success">Save</button>
        <!-- <button v-on:click="updatePage(0)" class="btn btn-1 btn-success">00000</button> -->
      </div>
    </div>
  </card>
</template>

<script>
import { ElasticIndex } from "./ElasticIndex.js";
import axios from "axios";
import firebase, { database } from "firebase";

export default {
  name: "MatchColumn",
  props: ["column_thai", "column_eng"],
  data() {
    return {
      columns: [],
      length: 0,
      matchColumns: [],
      matched: "",
      index: "",
      errors: [],
      theUserUid: firebase.auth().currentUser.uid,
      currentPage: 1,
      pageSize: 4,
      visible: [],
      theTotalPages: "",
      gotPageFirst: true,
      i: 0
    };
  },
  computed: {
    fromDatabase() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.matched = snapshot.child("Matched").val();
          this.index = snapshot.child("Index").val();
          ElasticIndex.$emit("ElasticIndex", this.index);
        });
      this.columns = this.ColumnsFromDB();

      if (this.gotPageFirst == true) {
        this.matchColumns = this.MatchColumnsFromDB();
      }
      this.theTotalPages = this.totalPages();
      this.updatePage(this.currentPage)

      this.gotPageFirst = false;
      return this.matched;
    }
  },
  beforeMount: function() {
    this.updateVisible();
  },
  methods: {
    ColumnsFromDB() {
      if (this.gotPageFirst || this.matched == true) {
        firebase
          .database()
          .ref("users/" + this.theUserUid)
          .on("value", snapshot => {
            this.columns = snapshot.child("MatchColumns_eng").val();
            ElasticIndex.$emit("ColumnEng", this.columns);
          });
      }
      return this.columns;
    },
    MatchColumnsFromDB() {
      if (this.gotPageFirst || this.matched == true) {
        firebase
          .database()
          .ref("users/" + this.theUserUid)
          .on("value", snapshot => {
            this.matchColumns = snapshot.child("MatchColumns_thai").val();
            ElasticIndex.$emit("ColumnThai", this.matchColumns);
          });
      }
      return this.matchColumns;
    },
    updatePage(pageNumber) {
      this.currentPage = pageNumber;
      this.updateVisible();
    },
    totalPages() {
      return Math.ceil(this.columns.length / this.pageSize);
    },
    updateVisible() {
      this.visible = this.columns.slice(
        this.currentPage * this.pageSize,
        this.currentPage * this.pageSize + this.pageSize
      );

      if (this.visible.length == 0 && this.currentPage > 0) {
        this.updatePage(this.currentPage - 1);
      }
    },
    saveColumn() {
      this.column_thai = this.matchColumns;
      this.column_eng = this.columns;
      ElasticIndex.$emit("ColumnThai", this.column_thai);
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .child("MatchColumns_thai")
        .update(this.column_thai);
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .child("MatchColumns_eng")
        .update(this.column_eng);
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .update({
          Matched: true
        });
    },
    editColumns() {
      this.column_thai = this.matchColumns;
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .child("MatchColumns_thai")
        .update(this.column_thai);
        ElasticIndex.$emit("ColumnThai", this.column_thai);
    },
    // async sendToggle() {
    //   const url = "https://35.198.215.67/getcol";
    //   await axios
    //     .get(url, {
    //       params: {
    //         index: this.index
    //       }
    //     })
    //     .then(response => {
    //       this.columns = response.data["index_name"];
    //       this.length = response.data["index_name"].length;
    //       this.column_eng = this.columns;
    //       ElasticIndex.$emit("ColumnEng", this.column_eng);
    //     })
    //     .catch(e => {
    //       this.errors.push(e);
    //       console.log(this.errors);
    //     });
    // }
  }
};
</script>
