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
                      <div v-for="(tab, index) in tabs" :key="index">
                          <b-tab v-bind:title="tab" active><query-graph></query-graph></b-tab>
                      </div>
                      <b-tab title="+" @click="tabs.push(tabs.length+1)"></b-tab>
                  </b-tabs>
              </card>
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
      tabs: ["1"]
    };
  },
  components: {
    "query-graph": QueryGraph
  }
};
</script>

<style>
    ul[role='tablist'] {
        border-bottom: 0;
    }

    ul[role='tablist'] li.nav-item:nth-child(2) {
        order: 5 !important;
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
        -webkit-transition: color 0.2 ease-in-out, background-color 0.2 ease-in-out, border-color 0.2 ease-in-out, -webkit-box-shadow 0.2 ease-in-out;
        transition: color 0.2 ease-in-out, background-color 0.2 ease-in-out, border-color 0.2 ease-in-out, -webkit-box-shadow 0.2 ease-in-out;
        transition: color 0.2 ease-in-out, background-color 0.2 ease-in-out, border-color 0.2 ease-in-out, box-shadow 0.2 ease-in-out;
        transition: color 0.2 ease-in-out, background-color 0.2 ease-in-out, border-color 0.2 ease-in-out, box-shadow 0.2 ease-in-out, -webkit-box-shadow 0.2 ease-in-out;
    }

    ul[role='tablist'] li a.nav-link.active {
        color: #fff;
        background-color: #fb6340;
        border-color: #fb6340;
        -webkit-box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    ul[role='tablist'] li a.nav-link {
        color: #000000;
        -webkit-box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    }
</style>
