<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { get_top_data, find_day_sum } from '@/api/mydata'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      day_sum: {
        data: '',
        week: '',
        sum: ''
      },
      xdata: [],
      series_data: [],
      echartsOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.xdata,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '总数',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.series_data,
          itemStyle: {
            color: function(p) {
              const colorList = [
                '#91c7ae',
                '#91c7ae',
                '#91c7ae',
                '#91c7ae',
                '#91c7ae',
                '#91c7ae',
                '#749f83'
              ]
              return colorList[p.dataIndex]
            }
          },
          animationDuration
        }]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.get_weibosum_time()
      setInterval(this.get_sumweibo, 3600000)	// 每一小时更新实时数据到柱状图
    })
  },
  created() {
    // this.get_weibosum_time()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    get_weibosum_time() {
      get_top_data().then(res => {
        // console.log(res.data)
        // console.log(res.data[3][0].TABLE_ROWS)
        // console.log(res.data[4][0]['日期'])
        // console.log(res.data[5][0]['星期'])
        this.day_sum.data = res.data[4][0]['日期']
        this.day_sum.week = res.data[5][0]['星期']
        this.day_sum.sum = res.data[3][0].TABLE_ROWS
        console.log(this.day_sum)
        find_day_sum(this.day_sum).then(res => {
          console.log(res.data)
          for (let i = 0; i < res.data[1].length; i++) {
            this.xdata.push(res.data[1][i].xingqi)
            this.series_data.push(res.data[1][i].count)
          }
          this.echartsOption.series[0].data = this.series_data
          if (this.xdata[0] === 'Mon') {
            this.echartsOption.xAxis[0].data = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
          } else if (this.xdata[0] === 'Tue') {
            this.echartsOption.xAxis[0].data = ['星期二', '星期三', '星期四', '星期五', '星期六', '星期日', '星期一']
          } else if (this.xdata[0] === 'Wed') {
            this.echartsOption.xAxis[0].data = ['星期三', '星期四', '星期五', '星期六', '星期日', '星期一', '星期二']
          } else if (this.xdata[0] === 'Thu') {
            this.echartsOption.xAxis[0].data = ['星期四', '星期五', '星期六', '星期日', '星期一', '星期二', '星期三']
          } else if (this.xdata[0] === 'Fri') {
            this.echartsOption.xAxis[0].data = ['星期五', '星期六', '星期日', '星期一', '星期二', '星期三', '星期四']
          } else if (this.xdata[0] === 'Sat') {
            this.echartsOption.xAxis[0].data = ['星期六', '星期日', '星期一', '星期二', '星期三', '星期四', '星期五']
          } else if (this.xdata[0] === 'Sun') {
            this.echartsOption.xAxis[0].data = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          }
          // this.echartsOption.xAxis[0].data = this.xdata
          this.initChart()
        })
        // this.top_data[0].first = res.data[3][0].TABLE_ROWS
        // this.top_data[0].two = res.data[3][2].TABLE_ROWS
        // console.log(this.top_data)
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      console.log('开始画总数柱状图')
      this.chart.setOption(this.echartsOption)
    }
  }
}
</script>
