<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  // mixins: [mixins.reactiveProp],
  data() {
    return {
      graphoptionsbar: {
        responsive: true
      }
    }
  },
  props: ['graph_data', 'graph_label', 'graph_name'],
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      labels: this.graph_label,
      datasets: [
        {
          // label: 'GitHub Commits',
          label: this.graph_name,
          backgroundColor: '#f87979',
          data: this.graph_data
        }
      ]
    },{responsive: true})
  }
}
</script>