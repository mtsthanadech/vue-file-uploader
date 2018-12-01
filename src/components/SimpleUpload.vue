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
	    errors: [],
	    complete: ""
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
                this.message = "";
            } else {
                this.message = tooLarge ? `Too large, Max size is ${MAX_SIZE/1000}kb` : "Only JSON file are allowed";
            }
        },
        async sendFile() {
            const formData = new FormData();
            const url = "https://35.198.215.67:3344/upload";
            formData.append('file', this.file, this.dbname+".json");

            await axios.post(url, formData).then(response => {
                this.complete = response.data.completed;
            }).catch(e => {
                this.errors.push(e);
                console.log(this.errors);
            });
	    
            this.file = "";
	    if(complete == "True) {
	    	this.message = "File Upload Complete";
            	this.sendToggle();
	    }
	    else {
	    	this.message = "File Upload Failed";
	    }
        },
        async sendToggle() {
            const formData = new FormData();
            const url = "https://35.198.215.67/json/" + this.dbname;

            await axios.get(url);
            this.message = "Upload to Elasticsearch already";
        }
    }
}
</script>
