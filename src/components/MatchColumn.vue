<template>
    <div class="row">
        <div class="col-10 col-sm-4 col-lg-4">
        </div>
        <div class="col-10 col-sm-4 col-lg-4">

            <b-card title="Match Column">
                <b-form>
                    <li v-for="(column,index) in columns" :key="index" style="list-style-type:none;">
                        <b-input-group>
                            <b-input-group-text slot="append">
                                <strong>{{ column }}</strong>
                            </b-input-group-text>
                            <b-form-input></b-form-input>
                        </b-input-group>
                        </br>

                    </li>
                    
		    <b-button v-on:click="sendToggle" type="submit" variant="primary">Submit</b-button>
                </b-form>
            </b-card>
	    <button v-on:click="sendToggle" class="btn btn-lg btn-outline-primary">Get Column</button>
        </div>
        
    </div>
</template>

<script>

export default {
    name: "MatchColumn",
    data() {
        return {
            columns: ['ant', 'bird', 'cat', 'dog', 'egg'],
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
            const url = "https://35.198.215.67/getlcol";
            var result;
            await axiot.get(url).then(response => {
                result = response.data;
                console.log(result);
            }).catch(e => {
                this.errors.push(e);
                console.log(this.errors);
            });
        }
    }
}
</script>
