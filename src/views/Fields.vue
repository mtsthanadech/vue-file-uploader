<template>
    <section class="section section-lg" v-if="db !== []">
      <div class="container">
        <div class="row">
              <div class="col-lg-6" v-if="show === true"><simple-upload></simple-upload></div>
              <div class="col-lg-12" v-else><match-column :length_col="collength"></match-column></div>
        </div>
      </div>
      <div class="row" v-if="logstash === true">
        <router-link to="/search" class="btn btn-1 btn-primary">Go to search</router-link>
        <button @click="del = true" class="btn btn-1 btn-danger">Delete all data</button>
      </div>

      <modal :show.sync="modals">
        <template slot="header">
          <h5 class="modal-title">Instruction</h5>
        </template>
        <div>
          <div class="text-intro">1. ตั้งชื่อ Index เป็นภาษาอังกฤษ</div>
          <div class="text-intro">2. เลือกไฟล์ข้อมูลจากเครื่องคอมพิวเตอร์ รูปแบบไฟล์ .csv ขนาดไม่เกิน 100 mb.</div>
          <div class="text-intro">3. เมื่ออัพโหลดสำเร็จ ระบบจะ list รายชื่อ Fields ที่เป็น ภาษาอังกฤษ ของข้อมูลที่ Upload เข้ามา</div>
          <div class="text-intro">4. ตั้งชื่อภาษาไทยให้กับ Fields ต่างๆ โดยชื่อที่ชื่อในแต่ละ Fields ไม่ซ้ำกัน พร้อมกับตั้ง Datatype ให้กับแต่ละ Fields ด้วย</div>
          <div class="text-intro">5. กด Save Field แล้วยืนยันอีกรอบ</div>
          <div class="text-intro">6. เมื่อ Save สำเร็จ จะมีปุ่ม Go to search ปรากฎขึ้น</div>
          <div class="text-intro">7. กด Go to search เพื่อไปยังหน้า Search</div>
        </div>
        <template slot="footer">
          <div>
            <base-button type="primary" @click="modals=false">Close</base-button>
            <base-button type="primary" @click="neverShowIntro()">Don’t show this again</base-button>
          </div>
        </template>
      </modal>
      <modal :show.sync="del">
        <template slot="header">
          <h5 class="modal-title">Do you want to delete data?</h5>
        </template>
        <div>
          <div class="text-intro">Do you want to delete data?</div>
        </div>
        <template slot="footer">
          <div>
            <base-button type="primary" @click="del=false">No</base-button>
            <base-button style="margin-top: 0" type="danger" @click="deleteDB()">Delete</base-button>
          </div>
        </template>
      </modal>
    </section>
</template>

<script>
import Upload from "@/components/Upload.vue";
import MatchColumn from "@/components/Mappage_com.vue";
import axios from "axios";
import firebase from "firebase";
import Modal from "../components/Modal";

export default {
  name: "fields",
  created() {
      firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
          this.db = snapshot.val();
          this.verified = snapshot.child("Verified").val();
          this.uploaded = snapshot.child("Uploaded").val();
          this.modals = snapshot.child("ShowIntroduction").val();
          this.logstash = snapshot.child("Logstash").val();
          this.index = snapshot.child("Index").val();

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
      del: false,
      logstash: false,
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
      neverShowIntro() {
          this.modals = false;
          firebase
              .database()
              .ref("users/"+ this.theUserUid)
              .update({
                  ShowIntroduction: false
              });
      },
      deleteDB(){
          const url = "https://35.198.215.67/delindex/"+this.index;
          axios.get(url)
              .then(response => {
                  if (response.check === true) {
                      firebase
                          .database()
                          .ref("users/"+this.theUserUid)
                          .set({
                              Name: this.db.name,
                              Email: this.db.name,
                              Uploaded: false,
                              ShowIntroduction: true,
                              Usagetab: [{Tabname: "Instruction Tab"}],
                              Logstash: false,
                              Tabs: ["Instruction Tab"],
                          })
                  }
              })
              .catch(error => {
                  console.log(error);
                  alert("Delete failed");
              });
      }
  },
  components: {
    "simple-upload": Upload,
    "match-column": MatchColumn,
    // "query-graph": SearchData,
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
  .btn-danger {
    margin-top: 30px;
  }
</style>