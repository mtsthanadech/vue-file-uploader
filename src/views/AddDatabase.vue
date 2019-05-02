<template>
    <section class="section section-lg">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12">
            <div class="row row-grid" v-if="fromdb === true">
              <div class="col-lg-4"></div>
              <div class="col-lg-4"><simple-upload></simple-upload></div>
              <div class="col-lg-4"></div>
            </div>
            <div class="row row-grid" v-if="fromdb === false">
              <div class="col-lg-5"><match-column></match-column></div>
              <div class="col-lg-7"><query-graph></query-graph></div>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
import Upload from "@/components/Upload.vue";
import MatchColumn from "@/components/Mappage_com.vue";
import QueryGraph from "@/components/QueryGraph.vue";
import firebase from "firebase";
import { Wordcut } from "wordcut-ts/lib/wordcut";

export default {
  name: "adddatabase",
  computed: {
    fromdb: function() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.verified = snapshot.child("Verified").val();
          this.uploaded = snapshot.child("Uploaded").val();
        });
      if (this.verified == false) {
        this.show = true;
      } else {
        this.show = false;
      }
      return this.show;
    }
  },
  data() {
    return {
      index: "",
      verified: "",
      theUserUid: firebase.auth().currentUser.uid,
      uploaded: "",
      show: ""
    };
  },
  methods: {
  },
  components: {
    "simple-upload": Upload,
    "match-column": MatchColumn,
    "query-graph": QueryGraph
  }
};
</script>
