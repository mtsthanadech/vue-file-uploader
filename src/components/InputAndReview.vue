<template>
    <div class="row">
        <div class="col-10 col-sm-4 col-lg-4">
        </div>
        <div class="col-10 col-sm-4 col-lg-4">

            <b-card title="Input text in Thai">
                <b-input type="text" v-model="payload" @change="onChange"/>
                <b-button @click="sendMessage" variant="primary">Preview</b-button>
                <p>eiei : {{ message }} - {{ payload }}</p>
                <b-card>
                    <div v-if="data">{{ data }}</div>
                </b-card>
            </b-card>
        </div>
        
    </div>
</template>
<script>
import axios from 'axios'; 
export default {

    name: "InputAndReview",
    data() {
        return {
            payload: "",
            message: "",
            data: ""
        }
    },
    methods: {
        onChange: function() {

            this.message = this.payload;
        },
        sendMessage(){
            const message = this.payload;
            this.data = "get data"
            // get data to this.data
        }
    }
}
</script>
