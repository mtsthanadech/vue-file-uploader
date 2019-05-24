<template>
    <section class="section section-lg">
      <div class="container">
        <div class="row justify-content-center">
          <!-- <div class="col-lg-2"></div> -->
          <!--<div class="col-lg-12"><query-graph></query-graph></div>-->
          <!-- <div class="col-lg-2"></div> -->
        </div>
          <div class="row justify-content-center">
              <card class="col-lg-12" shadow>
                  <b-tabs content-class="mt-3" >
                      <b-tab key="addTab" title="+" @click="addTab()"></b-tab>
                      <b-tab :key="index" :title="tab" @click="changeTabName(index,1)" active v-for="(tab, index) in tabs">
                          <div v-if="tab !== '+'">
                              <button type="button" class="btn btn-1 btn-danger btn-close" @click="delTabs(index)">
                                  <i class="fa fa-trash" aria-hidden="true"></i>Delete
                              </button>
                              <button type="button" class="btn btn-1 btn-primary btn-edit" @click="changeTabName(index,999)">
                                  <i class="fa fa-pencil" aria-hidden="true"></i>Edit
                              </button>
                              <query-graph :title="tabs[index]"></query-graph>
                              <modal :show.sync="modals">
                                  <template slot="header">
                                      <h5 class="modal-title">Set tab's name</h5>
                                  </template>
                                  <div>
                                  </div>
                                  <input
                                          v-model="tabName"
                                          placeholder="Query your data"
                                          class="form-control input-group-alternative"
                                  />
                                  <template slot="footer">
                                      <base-button type="primary" @click="saveTabName(index)">Save changes</base-button>
                                  </template>
                              </modal>
                          </div>
                          <div v-else>
                            <!--{{ addTab(index) }}-->
                          </div>
                      </b-tab>
                  </b-tabs>
              </card>

          </div>

      </div>
    </section>
</template>

<script>
import QueryGraph from "@/components/QueryGraph.vue";
import firebase from "firebase";
import Modal from "../components/Modal";

export default {
  name: "querydatabase",
  data() {
    return {
      index: "",
      verified: "",
      theUserUid: firebase.auth().currentUser.uid,
      uploaded: "",
      tabs: ["-"],
      tabName: "",
      modals: false,
    };
  },
  methods: {
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
    },
    saveTabName(index) {
        this.tabs[index] = this.tabName;
        this.tabName = "";
        this.modals = false;
    },
    delTabs(index) {
      if (this.tabs.length !== 1) {
        this.tabs.splice(index, 1, null);
        this.tabs.splice(index, 1);
      } else {
          alert("Can't close this tab, because must have at least 1 tab")
      }
    },
  },
  components: {
      Modal,
    "query-graph": QueryGraph
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
    }
    .btn-edit {
        position: absolute !important;
        right: 180px;
        top: 115px;
        z-index: 1;
    }
</style>
