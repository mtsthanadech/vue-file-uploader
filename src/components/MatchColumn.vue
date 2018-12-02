<template>
    <card class="border-0" hover shadow body-classes="py-5">
        <h6 class="text-success text-uppercase">Match Column</h6>

            <li v-for="(column, indexs) in columns" :key="indexs" style="list-style-type:none; margin-top: 10px;">
                <!--<li v-for="index in length" :key="index" style="list-style-type:none;">-->

                    <strong>{{ column }}</strong>
                    <input
                            v-model="matchColumns[indexs]"
                            placeholder="Enter Thai name"
                            class="form-control input-group-alternative"
                            aria-describedby="addon-right addon-left"/>
                </li>
            </li>

            <button v-on:click="sendToggle" class="btn btn-1 btn-success">Get Column</button>
            <button v-on:click="saveColumn" class=" btn btn-1 btn-success">Save</button>

    </card>

</template>

<script>
import axios from "axios";
export default {
  name: "MatchColumn",
  data() {
    return {
      columns: [],
      length: 0,
      matchColumns: [],
      errors: []
    };
  },
  methods: {
    saveColumn() {
      const url = "https://35.198.215.67/savecol";
      axios.post(url, {
        colthai: this.matchColumns
      });
      //.then(response => {
      //    console.log(typeof(response.data));
      //}).catch(e => {
      //    this.errors.push(e);
      //    console.log(this.errors);
      //});
      //console.log(this.matchColumns);
      //console.log(typeof(this.matchColumns));
    },
    async sendToggle() {
      const url = "https://35.198.215.67/getcol";
      await axios
        .get(url)
        .then(response => {
          this.columns = response.data["index_name"];
          this.length = response.data["index_name"].length;
        })
        .catch(e => {
          this.errors.push(e);
          console.log(this.errors);
        });
    }
  }
};
</script>
