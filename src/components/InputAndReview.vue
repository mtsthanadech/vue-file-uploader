<template>
    <card class="border-0" hover shadow body-classes="py-5">
        <h6 class="text-warning text-uppercase">Query The Database</h6>
        <input
                v-model="payload"
                placeholder="Query your data"
                class="form-control input-group-alternative"
                aria-describedby="addon-right addon-left"/>
        <br>
        <button v-on:click="sendMessage" class="btn btn-1 btn-warning">Query</button>
    </card>
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
    };
  },
  methods: {
    sendMessage() {
      const url = "https://35.198.215.67/query";
      axios
        .post(url, {
          query: this.payload
        })
        .then(response => {
          console.log(response.data);
          this.data = response.data;
        })
        .catch(e => {
          this.errors.push(e);
          console.log(this.errors);
        });

      //show result here
      //this.data = "get data"
    }
  }
};
</script>
