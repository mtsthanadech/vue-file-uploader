<template>
    <section class="section section-lg">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12">
            <div class="row row-grid" v-if="show === true">
              <div class="col-lg-4"></div>
              <div class="col-lg-4"><simple-upload></simple-upload></div>
              <div class="col-lg-4"></div>
            </div>
            <div class="row row-grid" v-else>
              <div class="col-lg-12"><match-column :db="db" :length_col="collength"></match-column></div>
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

export default {
  name: "adddatabase",
  created: function() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.db = snapshot.val();
          this.collength = this.db.MatchColumns_eng.length;
          this.verified = snapshot.child("Verified").val();
          this.uploaded = snapshot.child("Uploaded").val();
            if (this.verified === false) {
                this.show = true;
            } else {
                this.show = false;
            }
        });

      return this.show;
  },
  data() {
    return {
      index: "",
      verified: "",
      theUserUid: firebase.auth().currentUser.uid,
      uploaded: "",
      show: "",
      db: [],
      collength: ""
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
