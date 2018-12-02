<template>
    <div class="row">
        <div class="col-10 col-sm-4 col-lg-4">
        </div>
        <div class="col-10 col-sm-4 col-lg-4">

            <b-card title="Input text in Thai">
                <b-input type="text" v-model="payload"/>
                <b-button @click="sendMessage" variant="primary">Query!</b-button>
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
            data: "",
            errors: []
        }
    },
    methods: {
        sendMessage(){
            const url = "https://35.198.215.67/query/" + this.payload;
            axios.post(url, {
                query: this.payload
            }).then(response => {
                console.log(response.data);
                this.data = response.data;
            }).catch(e => {
                this.errors.push(e);
                console.log(this.errors);
            });           
            
            //show result here
            //this.data = "get data"
            
        }
    }
}
</script>
