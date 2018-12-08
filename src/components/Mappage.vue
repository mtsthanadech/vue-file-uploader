<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-success text-uppercase">Match Column</h6>
    <div class="row justify-content-center">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">

        


        <li
          v-for="(column, indexs) in columns"
          v-bind:visible="visible"
          v-bind:currentPage="currentPage"
          v-bind:column="column"
          :key="indexs"
          style="list-style-type:none; margin-top: 10px;"
        >
          <strong>{{ column }}</strong>
          <input
            v-model="matchColumns[indexs]"
            placeholder="Enter Thai name"
            class="form-control input-group-alternative"
            aria-describedby="addon-right addon-left"
          >
        </li>
        
        <!-- <nav aria-label="...">
          <ul class="pagination">
            <li class="page-item disabled">
              <a class="page-link" href="#" tabindex="-1">
                <i class="fa fa-angle-left"></i>
                <span class="sr-only">Previous</span>
              </a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item active">
              <a class="page-link" href="#">2 <span class="sr-only">(current)</span></a>
            </li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item">
              <a class="page-link" href="#">
                <i class="fa fa-angle-right"></i>
                <span class="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav> -->
        
      </div>
      <div class="col-lg-4"></div>
    </div>
    <!-- <button v-on:click="sendToggle" class="btn btn-1 btn-success">Get Column</button> -->
    
    <button v-on:click="saveColumn" v-if="fromDatabase" class="btn btn-1 btn-success">Edit</button>
    <button v-on:click="saveColumn" v-if="!fromDatabase" class="btn btn-1 btn-success">Save</button>
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
      nextId: 8,
      currentPage: 0,
      pageSize: 4,
      visible: [],
      todos:[
          {id: 0, text: "aaaaaaaaaaa"},
          {id: 1, text: "bbbbbbbbbbb"},
          {id: 2, text: "ccccccccccc"},
          {id: 3, text: "ddddddddddd"},
          {id: 4, text: "eeeeeeeeeee"},
          {id: 5, text: "fffffffffff"},
          {id: 6, text: "ggggggggggg"},
          {id: 7, text: "hhhhhhhhhhh"},
      ]
    };
  },
  computed: {
    fromDatabase() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.matched = snapshot.child("Matched").val();
        });
      this.sendToggle();
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
    addTodo(text) {
        this.todos.push({id: this.nextId, text: text});
        this.nextId++
        this.updateVisible()
    },
    removeTodos(id){
        const todos = this.todos
        this.todos = todos.filter((todo) => todo.id != id)
        this.updateVisible()
    },
    updatePage(pageNumber){
        this.currentPage = pageNumber
        this.updateVisible()
    },
    updateVisible(){
        this.visible = this.todos.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize)

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
            // index: this.index
            index: "Da0tyraVUMMzynInrnFOvrPkacg1_helloworld"
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
    }
  }
};
</script>
