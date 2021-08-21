<template>
  <div>
    <apexchart
      height="380"
      type="bar"
      class="apex-charts"
      :series="basicColumChart.series"
      :options="basicColumChart.chartOptions"
    ></apexchart>
  </div>
</template>

<script>
export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  data() {
    return {
      basicColumChart: {
        chartOptions: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              endingShape: 'rounded',
              columnWidth: '55%',
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
          },
          colors: ['#5b315f', '#1abc9c', '#dee2e6'],
          xaxis: {
            categories: [],
          },
          legend: {
            offsetY: -10,
          },
          yaxis: {
            title: {
              text: 'Words',
            },
          },
          fill: {
            opacity: 1,
          },
          grid: {
            row: {
              colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.2,
            },
            borderColor: '#f1f3fa',
          },
          tooltip: {
            y: {
              formatter(val) {
                return val + ' Words'
              },
            },
          },
        },
        series: [
          {
            name: 'Pos Tag',
            data: [],
          },
        ],
      },
    }
  },
  methods: {
    generateDataChart(chartData) {
      console.log('ch', chartData)
      const xLabel = []
      const yLabel = []
      chartData.forEach((data) => {
        xLabel.push(data.postag)
        yLabel.push(data.words.length)
      })
      console.log('x', xLabel)
      console.log('y', yLabel)
      this.basicColumChart.chartOptions.xaxis.categories = xLabel
      this.basicColumChart.series[0].data = yLabel
      // this.basicColumChart.chartOptions.xaxis.categories = chartData.map(
      //   (data) => data.postag
      // )
      // console.log('chart', this.basicColumChart.chartOptions.xaxis.categories)
      // const volumeTag = []
      // this.basicColumChart.chartOptions.xaxis.categories.forEach((data) => {
      //   const words = chartData
      //     .filter((chart) => chart.postag === data)
      //     .reduce((chart) => chart)
      //   volumeTag.push(words.words.length)
      // })

      // this.basicColumChart.series[0].data = volumeTag
      this.basicColumChart.series[0].name = 'Pos Tag'
    },
  },
}
</script>

<style lang="scss" scoped></style>
