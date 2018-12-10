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
            <!-- {{indexs+((currentPage)*5)}}/{{length-1}} -  -->
          <strong>{{ column }}</strong>
          <input
            v-model="matchColumns[indexs+(currentPage*5)]"
            placeholder="Enter Thai name"
            class="form-control input-group-alternative"
            aria-describedby="addon-right addon-left"
          >
        </li>
      </div>
      <div class="col-lg-4"></div>
      <div class="col-lg-4 text-center center">
        <!-- <li
          v-for="(column, indexs) in visible"
          v-bind:visible="visible"
          v-bind:currentPage="currentPage"
          v-bind:column="column"
          :key="indexs"
          style="list-style-type:none; margin-top: 10px;"
        >
          <strong>{{indexs+((currentPage)*5)}}/{{length-1}} - {{ column }}</strong>
          <input
            v-model="matchColumns[indexs+(currentPage*5)]"
            placeholder="Enter Thai name"
            class="form-control input-group-alternative"
            aria-describedby="addon-right addon-left"
          >
        </li> -->
        <br>
        <div
            v-if="totalPages() > 0"
            v-bind:columns="columns"
            v-on:page:update="updatePage"
            v-bind:currentPage="currentPage"
            v-bind:pageSize="pageSize"
            >
                <ul class="pagination center">
                    <li class="page-item disabled" v-if="currentPage === 1">
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
                    
                    <li class="page-item">
                            <a class="page-link" v-on:click="updatePage(0)">1</a>
                    </li>
                        
                    <div v-for="(pageNumber, index) in theTotalPages" :key="index">
                        <li class="page-item" v-if="pageNumber < theTotalPages">
                            <a class="page-link" v-on:click="updatePage(pageNumber)">{{pageNumber+1}}</a>
                        </li>
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
                <button v-on:click="saveColumn" v-if="fromDatabase" class="btn btn-1 btn-success">Edit</button>
                <button v-on:click="saveColumn" v-if="!fromDatabase" class="btn btn-1 btn-success">Save</button>
        </div>
        <div class="col-lg-4"></div>

        <!-- <span v-if="showPreviousLink()" class="pagination-btn" v-on:click="updatePage(currentPage - 1)"> < </span>
                {{ currentPage + 1 }} of {{ totalPages() }}
              <span v-if="showNextLink()" class="pagination-btn" v-on:click="updatePage(currentPage + 1)"> > </span> -->
    </div>

  </card>
</template>

<script>
import { ElasticIndex } from "./ElasticIndex.js";
import axios from "axios";
import firebase from "firebase";

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
      pageSize: 5,
      visible: [],
      theTotalPages: "",
      gotcolumn: 0
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
        });
        
        if(this.gotcolumn == 0){
            this.sendToggle();
            this.gotcolumn = 1
        }
      this.theTotalPages = this.totalPages();
      return this.matched;
    }
  },
  created() {
    ElasticIndex.$on("ElasticIndex", index => {
      this.index = index;
    });
  },
  beforeMount: function(){
      this.updateVisible()
  },
  methods: {
    updatePage(pageNumber){
        this.currentPage = pageNumber
        this.updateVisible()
    },
    totalPages() {
      return Math.ceil(this.columns.length / this.pageSize);
    },
    updateVisible(){
        this.visible = this.columns.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize)

        if (this.visible.length == 0 && this.currentPage >0) {
            this.updatePage(this.currentPage - 1)
        }
    },
    saveColumn() {
      this.column_thai = this.matchColumns;
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
    },
    async sendToggle() {
      const url = "https://35.198.215.67/getcol";
      await axios
        .get(url, {
          params: {
            index: this.index
            // index: "Da0tyraVUMMzynInrnFOvrPkacg1_helloworld"
          }
        })
        .then(response => {
          this.columns = response.data["index_name"];
          this.length = response.data["index_name"].length;
        })
        .catch(e => {
          this.errors.push(e);
          console.log(this.errors);
        });
      this.column_eng = this.columns;
      ElasticIndex.$emit("ColumnEng", this.column_eng);
      this.updatePage(0)
    }
  }
};
</script>
