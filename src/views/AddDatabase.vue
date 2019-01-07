<template>
    <section class="section section-lg">
      <div class="container">
        {{ getCheck() }}
        <div class="row justify-content-center">
          <div class="col-lg-12">
            <div class="row row-grid" v-if="show === true">

              <div class="col-lg-4"></div>

              <div class="col-lg-4"><simple-upload></simple-upload></div>

              <div class="col-lg-4"></div>

            </div>
            <div class="row row-grid" v-if="show === false">
              <div class="col-lg-4"><match-column></match-column></div>

              <div class="col-lg-8"><input-review></input-review></div>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
import Upload from "@/components/Upload.vue";
import MatchColumn from "@/components/Mappage_com.vue";
import InputAndReview from "@/components/InputAndReview.vue";
import firebase from "firebase";

export default {
  name: "adddatabase",
  data() {
    return {
      index: "",
      verified: "",
      theUserUid: firebase.auth().currentUser.uid,
      uploaded: "",
      show: ""
    };
  },
  computed: {
    // fromDB() {
    //   this.getCheck();
    // }
  },
  methods: {
    getCheck() {
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
    }
  },
  components: {
    "simple-upload": Upload,
    "match-column": MatchColumn,
    "input-review": InputAndReview
  }
};
</script>
