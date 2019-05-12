<script>
import { Bar } from 'vue-chartjs'

export default {
  // data_x = ["January", "February"]
  // data_y = [40, 20]
  // label_x = "XXXXXXX"
  // label_y = "YYYYYYY"
  // graph_label = "Data One"
  extends: Bar,
  props: ["graph_label", "data_x", "data_y", "label_x", "label_y"],
  data() {
    return {
      chartData: {
        labels: this.data_x,
        datasets: [
          {
            label: this.label_y,
            backgroundColor: "#f87979",
            data: this.data_y
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: this.graph_label
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                labelString: this.label_y,
                display: true
              },
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                labelString: this.label_x,
                display: true
              }
            }
          ]
        }
      }
    }
  },
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, this.options);
  }
};
</script>