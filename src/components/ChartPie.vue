<script>
    import { Pie } from 'vue-chartjs'

    export default {
        extends: Pie,
        props: ["data", "labels", "title"],
        data() {
            return {
                chartData: {
                    labels: [this.labels,"ไม่ใช่"+this.labels],
                    datasets: [
                        {
                            label: this.title,
                            backgroundColor: ["#f87979","#dddddd"],
                            data: this.data
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: this.title
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