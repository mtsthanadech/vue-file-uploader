<template>
  <card class="border-0" hover shadow body-classes="py-5">
    <h6 class="text-primary text-uppercase">Upload Database</h6>

    <form @submit.prevent="sendFile" enctype="multipart/form-data">
      <div class="form-group">
        <input
          v-model="dbname"
          placeholder="Enter database name"
          class="form-control input-group-alternative"
          aria-describedby="addon-right addon-left"
        >
        
        <label id="file_upload" class="file btn btn-1 btn-neutral" style="margin-top: 10px">
          {{filename}}
          <input ref="file" type="file" @change="selectFile" hidden>
        </label>
        <br>
        <!-- <div v-if="uid">
                     {{ uid }}
        </div>-->
        <div v-if="message">{{ message }}</div>
      </div>
      <button class="btn btn-1 btn-primary">Send</button>
    </form>
  </card>
</template>


<script>
import { ElasticIndex } from "./ElasticIndex.js";
import firebase from "firebase";
import axios from "axios";
export default {
  name: "upload",
  props: ["index"],
  data() {
    return {
      file: "",
      filename: "Choose file...",
      message: "",
      dbname: "",
      errors: [],
      complete: "False",
      theUserUid: firebase.auth().currentUser.uid
    };
  },
  methods: {
    database() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .update({
          Verified: true,
          Uploaded: true,
          Matched: false,
          Index: this.index,
          columns: [],
          MatchColumns_thai: ["","",""],
          length: ""
        });
    },
    selectFile() {
      const file = this.$refs.file.files[0];
      const allowedTypes = ["application/json"];
      const MAX_SIZE = 50000000;
      const tooLarge = file.size > MAX_SIZE;

      if (allowedTypes.includes(file.type) && !tooLarge) {
        this.file = file;
        this.filename = this.file.name;
        this.message = "";
      } else {
        this.message = tooLarge
          ? `Too large, Max size is ${MAX_SIZE / 1000}kb`
          : "Only JSON file are allowed";
      }
    },
    async sendFile() {
      const formData = new FormData();
      const url = "https://35.198.215.67:3344/upload";
      formData.append(
        "file",
        this.file,
        this.theUserUid + "_" + this.dbname + ".json"
      );

      await axios
        .post(url, formData)
        .then(response => {
          this.complete = response.data.completed;
        })
        .catch(e => {
          this.errors.push(e);
          console.log(this.errors);
        });

      this.file = "";
      if (this.complete == "True") {
        this.message = "File Upload Complete";
        this.sendToggle();
      } else {
        this.message = "File Upload Failed";
      }
    },
    async sendToggle() {
      // const formData = new FormData();
      this.index = this.theUserUid + "_" + this.dbname;
      const url = "https://35.198.215.67/json/" + this.index;
      const getColUrl = "https://35.198.215.67/getcol";

      ElasticIndex.$emit("ElasticIndex", this.index);
      await axios.get(url);
      this.message = "Upload " + this.filename + " to Elasticsearch already";
      
      await axios
        .get(getColUrl, {
          params: {
            index: this.index
          }
        })
        .then(response => {
          this.columns = response.data["index_name"];
          this.length = response.data["index_name"].length;
          firebase
            .database()
            .ref("users/" + this.theUserUid)
            .child("MatchColumns_eng")
            .update(this.columns);
          firebase
            .database()
            .ref("users/" + this.theUserUid)
            .child("MatchColumns_thai")
            .update(this.MatchColumns_thai);
            })
          
        .catch(e => {
          this.errors.push(e);
          console.log(this.errors);
        });


      this.database();
    }
  }
};
</script>
