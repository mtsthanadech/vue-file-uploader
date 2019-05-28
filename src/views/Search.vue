<template>
    <section class="section section-lg">
      <div class="container">
        <div class="row justify-content-center">
          <!-- <div class="col-lg-2"></div> -->
          <!--<div class="col-lg-12"><search-data></search-data></div>-->
          <!-- <div class="col-lg-2"></div> -->
        </div>
          <div class="row justify-content-center">
              <card class="col-lg-12" shadow>
                  <b-tabs content-class="mt-3" >
                      <b-tab key="addTab" title="+" @click="addTab()"></b-tab>
                      <b-tab :key="index" :title="tab" @click="changeTabName(index,1)" active v-for="(tab, index) in tabs">
                          <div v-if="tab !== '+' && tab !== 'Instruction Tab'">
                              <button type="button" class="btn btn-1 btn-danger btn-close" @click="delTabs(index)">
                                  <i class="fa fa-trash" aria-hidden="true"></i> ปิด Tab
                              </button>
                              <button type="button" class="btn btn-1 btn-primary btn-edit" @click="changeTabName(index,999)">
                                  <i class="fa fa-pencil" aria-hidden="true"></i> แก้ไขชื่อ Tab
                              </button>
                              <search-data :tabindex="index" :title="tabs[index]"></search-data>
                              <modal :show.sync="modals">
                                  <template slot="header">
                                      <h5 class="modal-title">ตั้งชื่อ Tab</h5>
                                  </template>
                                  <div>
                                  </div>
                                  <input
                                          v-model="tabName"
                                          placeholder="ตั้งชื่อ Tab"
                                          class="form-control input-group-alternative"
                                  />
                                  <template slot="footer">
                                      <base-button type="primary" @click="saveTabName(index)">Save changes</base-button>
                                  </template>
                              </modal>
                          </div>
                          <div v-else-if="tab === 'Instruction Tab'">
                              <card>
                                  <div class="text-intro">1. กด + เพื่อสร้าง Tab ใหม่เพื่อที่จะใช้งานระบบ Search</div>
                                  <div class="text-intro">2. ตั้งชื่อ Tab โดยที่ในแต่ละ Tab จะต้องมีชื่อไม่ซ้่ำกัน</div>
                                  <div class="text-intro">3. ค้นหาข้อมูลด้วยคำสั่ง "ภาษาไทย" เท่านั้น โดยมีประโยคแบ่งเป็น 3 ช่วง(โดยไม่ต้องเว้นวรรค)</div>
                                  <div class="text-intro">4. ช่วงแรกคือ คำสั่งในการค้นหา(สมารถเพิ่มคำสั่ง Aggregate ได้) เช่น หา, ค้นหา, หาค่าเฉลี่ย, หาค่าที่มากที่สุด เป็นต้น</div>
                                  <div class="text-intro">5. ช่วงที่ 2 คือชื่อ Field ภาษาไทย ที่ตั้งชิ่อหลังจากการ Upload ข้อมูลเสร็จ</div>
                                  <div class="text-intro">6. ช่วงที่ 3 คือใส่ข้อความที่จะช่วยกรองข้อมูลที่จะนำมาแสดง</div>
                                  <card>
                                      <div class="text-intro h6">ตัวอย่าง : หาค่าเปอร์เซ็นต์ไทล์ของค่าใช้จ่ายทั้งหมดของคนแก่และมีผู้อยู่ในการอุปการะหรือเป็นผู้หญิง</div>
                                      <img class="example-img" src="./../../public/img/brand/example_search.png">
                                  </card>
                              </card>
                          </div>
                          <div v-else>

                          </div>
                      </b-tab>
                  </b-tabs>
              </card>

          </div>

      </div>
    </section>
</template>

<script>
import SearchData from "@/components/SearchData.vue";
import firebase from "firebase";
import Modal from "../components/Modal";

export default {
  name: "querydatabase",
  created() {
    firebase
        .database()
        .ref("users/" + this.theUserUid)
        .on("value", snapshot => {
            this.db = snapshot.val();
            this.alltabs = snapshot.child("Tabs").val();
            this.storetab();
        });
    // this.storetab();
  },
  data() {
    return {
      alltabs: [],
      index: "",
      verified: "",
      theUserUid: firebase.auth().currentUser.uid,
      uploaded: "",
      tabs: ["Instruction Tab"],
      db: [],
      tabName: "",
      modals: false,
    };
  },
  methods: {
    storetab() {
        this.tabs = ["Instruction Tab"];
        this.alltabs.forEach(tab => {
            if (tab !== "Instruction Tab"){
                this.tabs.push(tab);
            }
        })
    },
    addTab() {
        this.tabs.push("-");
    },
    changeTabName(index,stage) {
        if (this.tabs[index] === "-" && stage === 1) {
            this.modals = true;
        } else if (stage === 999) {
            this.tabName = this.tabs[index]
            this.modals = true;
        } else {
            this.modals = false;
        }

        for (let i = 0; i < this.db.Usagetab.length; i++) {
            // console.log("before if")
            if (this.db.Usagetab[i].Tabname === this.tabs[index]) {
                console.log("1 " + this.db.Usagetab);
                this.db.Usagetab.splice(i,1);
                firebase
                    .database()
                    .ref("users/" + this.theUserUid)
                    .update({
                        Usagetab: this.db.Usagetab
                    });
                console.log("2 " + this.db.Usagetab);
            }
        }

    },
    saveTabName(index) {
        this.tabs[index] = this.tabName;
        this.tabName = "";
        this.modals = false;

        firebase
            .database()
            .ref("users/" + this.theUserUid)
            .update({
                Tabs: this.tabs
            });
    },
    delTabs(index) {
      if (this.tabs.length !== 1) {
        for (let i = 0; i < this.db.Usagetab.length; i++) {
            // console.log("before if")
            if (i === index) {
                console.log("1 " + this.db.Usagetab[i]);
                this.db.Usagetab[i] = null;
                firebase
                    .database()
                    .ref("users/" + this.theUserUid)
                    .update({
                        Usagetab: this.db.Usagetab
                    });
                console.log("2 " + this.db.Usagetab);
            }
        }
        if(index !== 0){
            this.tabs.splice(index, 1, null);
            this.tabs.splice(index, 1);
        }
        firebase
            .database()
            .ref("users/" + this.theUserUid)
            .update({
                Tabs: this.tabs,
            })

      } else {
          alert("ไม่สามารถปิด Tab นี้ได้ ต้องเหลืออย่างน้อย 1 Tab")
      }
    },
  },
  components: {
     Modal,
     SearchData
  }
};
</script>

<style>
    div.card-body div.tabs div.tab-content {
        margin-top: 0 !important;
    }
    ul[role='tablist'] {
        border-bottom: 0;
    }

    ul[role='tablist'] li.nav-item:nth-child(1) {
        order: 10 !important;
        /*background-color: #5e72e4;*/
        /*border-color: #5e72e4;*/
    }

    ul[role='tablist'] li.nav-item:nth-child(1) a {
        /*color: #FFFFFF;*/
    }

    .nav-tabs .nav-link:first-child:hover, .nav-tabs .nav-link:first-child:focus {
        border-color: transparent;
    }

    ul[role='tablist'] li {
        /*padding: 0.75rem 1rem;*/
        display: inline-block;
        font-weight: 600;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: 1px solid transparent;
        font-size: 1rem;
        line-height: 2;
        border-radius: 0.25rem;
        /*-webkit-transition: color 0.2 ease-in-out, background-color 0.2 ease-in-out, border-color 0.2 ease-in-out, -webkit-box-shadow 0.2 ease-in-out;*/
        /*transition: color 0.2 ease-in-out, background-color 0.2 ease-in-out, border-color 0.2 ease-in-out, -webkit-box-shadow 0.2 ease-in-out;*/
        /*transition: color 0.2 ease-in-out, background-color 0.2 ease-in-out, border-color 0.2 ease-in-out, box-shadow 0.2 ease-in-out;*/
        /*transition: color 0.2 ease-in-out, background-color 0.2 ease-in-out, border-color 0.2 ease-in-out, box-shadow 0.2 ease-in-out, -webkit-box-shadow 0.2 ease-in-out;*/
    }

    ul[role='tablist'] li a.nav-link.active {
        color: #fff;
        background-color: #5e72e4;
        border-color: #5e72e4;
        -webkit-box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    ul[role='tablist'] li a.nav-link {
        color: #000000;
        -webkit-box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .btn-close {
        position: absolute !important;
        right: 65px;
        top: 115px;
        z-index: 1;
        margin-top: 0;
    }
    .btn-edit {
        position: absolute !important;
        right: 180px;
        top: 115px;
        z-index: 1;
    }
    .text-intro.h6 {
        margin-top: 15px;
    }
    img.example-img {
        max-width: 100%;
    }
</style>
