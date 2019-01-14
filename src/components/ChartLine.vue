<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  mixins: [mixins.reactiveProp],
  data() {
    return {
      graphoptionsline: {
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25,
            }
          }]
        }
      }
    }
  },
  props: ['graph_data_y', 'graph_label_y'],
  mounted () {
    // this.renderChart(this.chartdata, this.options)
    this.renderChart({
        labels: this.graph_label_y,
        datasets: [
          {
            label: this.graph_label_y,
            backgroundColor: 'rgba(248, 121, 121, .5)',
            data: this.graph_data_y,
          }
        ]
      },this.graphoptionsline)
  }
}
</script>