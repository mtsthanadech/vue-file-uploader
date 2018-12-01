<template>
    <div class="row">
        <div class="col-10 col-sm-4 col-lg-4">
        </div>
        <div class="col-10 col-sm-4 col-lg-4">

            <b-card title="Match Column">
                <b-form>
                    <li v-for="column in columns" style="list-style-type:none;">
                        <b-input-group>
			 <li v-for="index in length" :key="index">
                            <b-input-group-text slot="append">
                                <strong>{{ column['index_name'][index - 1]}}</strong>
                            </b-input-group-text>
                            <b-form-input v-model="matchColumns[index - 1]"></b-form-input>
			    </li>
                        </b-input-group>
                        </br>
                    </li>
                </b-form>
            </b-card>
	    <button v-on:click="sendToggle" class="btn btn-lg btn-outline-primary">Get Column</button>
	    <button v-on:click="saveColumn" class="btn btn-lg btn-outline-primary">Save</button>
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
	async saveColumn() {
            const url = "https://35.198.215.67/savecol";
            await axios.get(url, {
            params: {
                colthai: JSON.stringify(this.matchColumns)
            }
            });
	},
        async sendToggle() {
            const url = "https://35.198.215.67/getcol";
            await axios.get(url).then(response => {
                this.columns.push(response.data);
		this.length = response.data['index_name'].length;
            }).catch(e => {
                this.errors.push(e);
                console.log(this.errors);
            });
        }
    }
}
</script>
