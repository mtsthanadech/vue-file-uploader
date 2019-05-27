<script>
    import { Pie } from 'vue-chartjs'

    export default {
        extends: Pie,
        data() {
            return {
                chartData: {
                    labels: ["piepiepie","chartchartchart"],
                    datasets: [
                        {
                            label: "PIE",
                            backgroundColor: ["#f87979","#dddddd"],
                            data: [50,100]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: ["piepiepie","chartchartchart"]
                    },
                    tooltips: {
                        mode: "index",
                        intersect: false,
                    },
                    legend: {
                        display: true,
                    },

                }
            }
        },
        mounted() {
            // Overwriting base render method with actual data.
            this.renderChart(this.chartData, this.options);
        }
    };
</script>