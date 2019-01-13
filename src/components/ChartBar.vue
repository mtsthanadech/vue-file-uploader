<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  data() {
    return {
      old_graph_data_y: "",
      old_graph_label_y: ""
    }
  },
  props: ['graph_data_y', 'graph_label_y'],
  mounted () {
    // Overwriting base render method with actual data.
    if (this.old_graph_data_y != this.graph_data_y || this.old_graph_label_y != this.graph_label_y) {
      this.old_graph_data_y = this.graph_data_y;
      this.old_graph_label_y = this.graph_label_y;
      this.renderChart({
        // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        labels: this.graph_label_y,
        datasets: [
          {
            // label: 'GitHub Commits',
            label: this.graph_label_y,
            backgroundColor: '#f87979',
            data: this.graph_data_y
          }
        ]
      })
    }

    // 
    // this.dataG = this.graphdatabar;
    // this.graphdatabar = {};
    // this.renderChart(this.dataG)
  }
}
</script>