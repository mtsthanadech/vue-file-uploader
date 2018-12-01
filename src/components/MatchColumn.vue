<template>
    <div class="row">
        <div class="col-10 col-sm-4 col-lg-4">
        </div>
        <div class="col-10 col-sm-4 col-lg-4">

            <b-card title="Match Column">
                <b-form>
                    <li v-for="column in columns" style="list-style-type:none;">
                        <b-input-group>
                            <b-input-group-text slot="append">
                            <li v-for="index in 21" :key="index">
                                <strong>{{ column['index_name'][index]}}</strong>
                            </li>
                            </b-input-group-text>
                            <b-form-input></b-form-input>
                        </b-input-group>
                        </br>
                    </li>
                </b-form>
            </b-card>
	    <button v-on:click="sendToggle" class="btn btn-lg btn-outline-primary">Get Column</button>
        </div>
        
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: "MatchColumn",
    data() {
        return {
            columns: [],
	    length: 0,
            matchColumns: [],
            error: false,
            errors: [],
        }
    },
    methods: {
        //async getTest() {
	   // var result;
           // await axios.get('https://35.198.215.67:3344/testapi').then(response => {
                // JSON responses are automatically parsed.
	   //	result = response.data;
           // })
           // .catch(e => {
           //     this.errors.push(e);
	   //	console.log(this.errors);
           // });
	   // console.log(result);
	   // console.log(Object.keys(result).length);
        //},
        async sendToggle() {
            const url = "https://35.198.215.67/getcol";
            await axios.get(url).then(response => {
                this.columns.push(response.data);
                console.log(this.columns);
		this.length = Object.keys(this.columns['index_name']).length;
		console.log(length);
		console.log(Object.keys(this.columns['index_name']).length);
            }).catch(e => {
                this.errors.push(e);
                console.log(this.errors);
            });
        }
    }
}
</script>
