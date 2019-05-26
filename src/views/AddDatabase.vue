<template>
    <section class="section section-lg" v-if="db !== []">
      <div class="container">
        <div class="row">
              <div class="col-lg-6" v-if="show === true"><simple-upload></simple-upload></div>
              <div class="col-lg-12" v-else><match-column :length_col="collength"></match-column></div>
        </div>
      </div>
      <div class="row" v-if="Matched === true">
        <router-link to="/query" class="btn btn-1 btn-primary">Go to search</router-link>
      </div>

      <modal :show.sync="modals">
        <template slot="header">
          <h5 class="modal-title">Introduction</h5>
        </template>
        <div>
          <div class="text-intro">1. ตั้งชื่อ Database เป็นภาษาอังกฤษ</div>
          <div class="text-intro">2. เลือกไฟล์ Database จากเครื่องคอมพิวเตอร์ รูปแบบไฟล์ .csv ขนาดไม่เกิน 100 mb.</div>
          <div class="text-intro">3. เมื่ออัพโหลดสำเร็จ ระบบจะ list รายชื่อ Columns ที่เป็น ภาษาอังกฤษ ของ Database ที่ Upload เข้ามา</div>
          <div class="text-intro">4. ตั้งชื่อภาษาไทยให้กับ Columns ต่างๆ โดยชื่อไม่ซ้ำกัน พร้อมกับตั้ง Datatype ให้กับแต่ละ Columns</div>
          <div class="text-intro">5. กด Save Data แล้วยืนยันอีกรอบ</div>
          <div class="text-intro">6. เมื่อ Save สำเร็จ จะมีปุ่ม Go to search ปรากฎขึ้น</div>
          <div class="text-intro">7. กด Go to search เพื่อไปยังหน้า search</div>
        </div>
        <template slot="footer">
          <div>
            <base-button type="primary" @click="modals=false">Close</base-button>
            <base-button type="primary" @click="neverShowIntro()">Never show again</base-button>
          </div>
        </template>
      </modal>
    </section>
</template>

<script>
import Upload from "@/components/Upload.vue";
import MatchColumn from "@/components/Mappage_com.vue";
import QueryGraph from "@/components/QueryGraph.vue";
import firebase from "firebase";
import Modal from "../components/Modal";

export default {
  name: "adddatabase",
  created() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.db = snapshot.val();
          this.verified = snapshot.child("Verified").val();
          this.uploaded = snapshot.child("Uploaded").val();
          this.modals = snapshot.child("ShowIntroduction").val();

            if (this.verified === false) {
                this.show = true;
            } else {
                this.show = false;
            }

            if (this.uploaded === true) {
                this.collength = snapshot.child("MatchColumns_eng").val().length;
                if (this.collength === snapshot.child("MatchColumns_thai").val().length) {
                    this.Matched = true;
                }
            }
        });

      return this.show;
  },
  data() {
    return {
      index: "",
      verified: false,
      theUserUid: firebase.auth().currentUser.uid,
      uploaded: false,
      Matched: false,
      show: true,
      db: [],
      collength: "",
      modals: true,
    };
  },
  methods: {
      neverShowIntro(){
          this.modals = false;
          firebase.database().ref("users/"+ this.theUserUid).update({ShowIntroduction: false});
      }
  },
  components: {
    "simple-upload": Upload,
    "match-column": MatchColumn,
    "query-graph": QueryGraph,
    Modal
  }
};
</script>
<style>
  section.section.section-lg div.container div.row, section.section.section-lg div.row {
    justify-content: center;
  }
  div.row a.btn.btn-1.btn-primary {
    margin-top: 30px;
  }
</style>