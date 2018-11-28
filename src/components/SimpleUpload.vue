<template>
    <div class="row">
        <div class="col-10 col-sm-4 col-lg-4">
        </div>
        <div class="col-10 col-sm-4 col-lg-4">
            <form @submit.prevent="sendFile" enctype="multipart/form-data" >
            <div class="form-group">
                <div v-if="message">
                    {{ message }}
                </div>
                <input class="form-control" ref="dbname" v-model="dbname" placeholder="Enter Database name">
                
                
                <label id="file_upload" class="file px-sm-0 btn btn-outline-primary form-control-file m-0">
                    {{filename}} <input ref="file" type="file" @change="selectFile" hidden>
                    
                </label>

                <button class="btn btn-lg btn-outline-primary">Send</button>
                
            </div>
            
        </form>
        </div>
        
    </div>
</template>

<script>

import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
    name: "SimpleUpload",
    data() {
        return {
            file: "",
            filename: "Choose file...",
            message: "",
            dbname: "",
            error: false
        }
    },
    methods: {
        selectFile() {
            const file = this.$refs.file.files[0];
            const allowedTypes = ["application/json"];
            const MAX_SIZE = 50000000;
            const tooLarge = file.size > MAX_SIZE;

            if (allowedTypes.includes(file.type) && !tooLarge) {
                this.file = file
                this.filename = this.file.name;
                this.error = false;
                this.message = "";
            } else {
                this.error = true;
                this.message = tooLarge ? `Too large, Max size is ${MAX_SIZE/1000}kb` : "Only JSON file are allowed";
            }
        },
        sendFile() {
            const formData = new FormData();
            const url = "https://35.198.215.67:3344/upload";
            formData.append('file', this.file, this.dbname+".json");
            
            // const url = "https://localhost:3344/upload";
            // formData.append('dbnam',this.dbname+".json");

            try {
                axios.post(url, formData);
                this.message = "File has been uploaded";
                this.file = "";
                this.error = false;
            } catch(err) {
                this.message = err.response.data.error;
                this.error = true;
            }
            
            setTimeout(function(){
                const urlnew = "https://35.198.215.67/seniorproject/json/" + this.dbname;
                try {
                    axios.get(url);
                    this.message = "Toggle Seccess";
                    this.error = false;
                } catch(err) {
                    this.message = err.response.data.error;
                    this.error = true;
                }
            }, 10000);
            
        },
        sendToggle() {
            const formData = new FormData();
            console.log("Hello");
            const url = "https://35.198.215.67/seniorproject/json/" + this.dbname;

            try {
                axios.get(url);
                this.message = "Toggle Seccess";
                this.error = false;
            } catch(err) {
                this.message = err.response.data.error;
                this.error = true;
            }
        }
    }
}
</script>
