<template>
  <div>
    <div class="position-relative">
      <!-- shape Hero -->
      <section class="section-shaped my-0">
        <div class="shape shape-style-1 shape-default shape-skew">
          <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        </div>
        <div class="container shape-container d-flex">
          <div class="col px-0">
            <div class="row">
              <div class="col-lg-6">
                <h1 class="display-3 text-white">
                  A beautiful Design System<span>completed with examples</span>
                </h1>
                <p v-if="theUserUid" class="lead text-white">
                  The uid is
                  <strong style="color:red;">
                    {{ theUserUid }}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 1st Hero Variation -->
    </div>
    <section class="section section-lg pt-lg-0 mt--200">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12"><input-review></input-review></div>
          <div class="col-lg-12"><query-chart></query-chart></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import InputAndReview from "@/components/InputAndReview.vue";
import QueryChart from "@/components/QueryChart.vue"
import firebase from "firebase";

export default {
  name: "adddatabase",
  data() {
    return {
      index: "",
      verified: "",
      theUserUid: firebase.auth().currentUser.uid,
      uploaded: ""
    };
  },
  components: {
    "input-review": InputAndReview,
    "query-chart": QueryChart
  }
};
</script>
