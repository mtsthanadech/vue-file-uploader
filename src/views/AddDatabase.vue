<template>
    <div>

        <div class="position-relative">
            <!-- shape Hero -->
            <section class="section-shaped my-0">
                <div class="shape shape-style-1 shape-default shape-skew">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="container shape-container d-flex">
                    <div class="col px-0">
                        <div class="row">
                            <div class="col-lg-6">
                                <h1 class="display-3  text-white">A beautiful Design System
                                    <span>completed with examples</span>
                                </h1>
                                <p v-if="theUserUid" class="lead  text-white">The uid is <strong style="color:red;">{{ theUserUid }}</strong></p>
                                <div class="btn-wrapper">
                                    <base-button tag="a"
                                                 href="https://demos.creative-tim.com/argon-design-system/docs/components/alerts.html"
                                                 class="mb-3 mb-sm-0"
                                                 type="info"
                                                 icon="fa fa-code">
                                        Components
                                    </base-button>
                                    <base-button tag="a"
                                                 href="https://www.creative-tim.com/product/argon-design-system"
                                                 class="mb-3 mb-sm-0"
                                                 type="white"
                                                 icon="ni ni-cloud-download-95">
                                        Download HTML
                                    </base-button>
                                </div>
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
                    <div class="col-lg-12">
                        <div class="row row-grid">
                            <div class="col-lg-4">
                                <simple-upload/>
                            </div>
                            <div class="col-lg-4">
                                <match-column/>
                            </div>
                            <div class="col-lg-4">
                                <input-review/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>

import Upload from '@/components/Upload.vue';
import MatchColumn from '@/components/MatchColumn.vue';
import InputAndReview from '@/components/InputAndReview.vue';

export default {
  name: "adddatabase",
  data(){
      return {
          user: "",
      }
  },
  computed: {
      theUserUid () {
          return this.$store.getters.getUid;
      }
  },
  components: {
    "simple-upload": Upload,
    "match-column": MatchColumn,
    "input-review": InputAndReview
  }
};
</script>
