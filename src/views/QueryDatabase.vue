<template>
    <section class="section section-lg">
      <div class="container">
        <div class="row justify-content-center">
          <!-- <div class="col-lg-2"></div> -->
          <div class="col-lg-12"><query-graph></query-graph></div>
          <!-- <div class="col-lg-2"></div> -->
        </div>
      </div>
    </section>
</template>

<script>
import QueryGraph from "@/components/QueryGraph.vue";
import firebase from "firebase";

export default {
  name: "querydatabase",
  data() {
    return {
      index: "",
      verified: "",
      theUserUid: firebase.auth().currentUser.uid,
      uploaded: "",
    };
  },
  components: {
    "query-graph": QueryGraph
  }
};
</script>
