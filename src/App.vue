<template>

  <!-- <div class="section"> -->
    <div class="container">

      <div>
        <simple-upload />
      </div>
      
      <div>
        <match-column />
      </div>
      
    </div>
  <!-- </div> -->

</template>

<script>
// import SimpleUpload from './components/SimpleUpload.vue'
import MatchColumn from './components/MatchColumn.vue'

export default {
  name: 'app',
  components: { 
    'simple-upload': SimpleUpload,
    'match-column': MatchColumn
  }
}
</script>
