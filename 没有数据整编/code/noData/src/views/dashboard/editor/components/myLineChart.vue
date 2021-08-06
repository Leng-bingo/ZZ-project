<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { minute_weibo_data, get_top_data } from '@/api/mydata'
import resize from './mixins/resize'

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
      sum_weibo: {
        count: ''
      },
      myline_ydata: '',
      myxdata: [],
      // xdata: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'QQQ'],
      myydata: [],
      // ydata: [140, 200, 150, 80, 70, 110, 130, 123],
      echartsOption: {
        xAxis: {
          type: 'category',
          data: this.myxdata
          //   data: this.xdata
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.myydata,
          //   data: this.ydata,
          type: 'line',
          smooth: true
        }],
        // 控制上下左右间距
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.get_sumweibo()
    })
    // setInterval(this.get_sumweibo, 60000)	// 每三秒更新实时数据到折线图
  },
  created() {
    // this.getTime()
    // console.log(this.getTime(Math.round(new Date().getTime() / 1000)))
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    get_sumweibo() {
      get_top_data().then(res => {
        // console.log(res.data[3])
        this.sum_weibo.count = res.data[3][0].TABLE_ROWS
        console.log('微博数量总数', this.sum_weibo.count)
        minute_weibo_data(this.sum_weibo).then(res => {
        // console.log('返回值', res.data[1])
          this.myline_ydata = res.data[1][0].count - res.data[1][1].count
          console.log('返回值', this.myline_ydata)
          console.log('插入的x轴', this.getTime(Math.round(new Date().getTime() / 1000)))
          this.myxdata.push(this.getTime(Math.round(new Date().getTime() / 1000)))
          this.myydata.push(this.myline_ydata)
          this.echartsOption.xAxis.data = this.myxdata.slice(-10)
          console.log('我的x轴', this.myxdata)
          console.log('我的更改过的x轴', this.myxdata.slice(-6))
          console.log('我的y轴', this.myydata)
          console.log('我的更改过的y轴', this.myydata.slice(-6))
          this.echartsOption.series[0].data = this.myydata.slice(-10)
          this.initChart()
          this.chart.setOption(this.echartsOption)
        })
      })
    },
    getTime() {
      var ts = arguments[0] || 0
      var t, h, i, s
      t = ts ? new Date(ts * 1000) : new Date()
      h = t.getHours()
      i = t.getMinutes()
      s = t.getSeconds()
      // 定义时间格式
      var nowtime = (h < 10 ? '0' + h : h) + ':' + (i < 10 ? '0' + i : i) + ':' + (s < 10 ? '0' + s : s)
      console.log(nowtime)
      return nowtime
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      console.log('开始画动态折线图')
      this.chart.setOption(this.echartsOption)
    }
  }
}
</script>
