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
      default: '350px'
    }
  },
  data() {
    return {
      chart: null,
      sum_weibo: {
        count: '',
        mintue_count: '',
        nowtime: '',
        length: ''
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        title: {
          text: '数据变化/分钟',
          textStyle: {
            color: '#333',
            fontSize: '15'
          }
        },
        series: [{
          name: '分钟变化数',
          data: this.myydata,
          //   data: this.ydata,
          type: 'line',
          smooth: true
        }],
        // 控制上下左右间距
        grid: {
          top: '8%',
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        }
      }
    }
  },
  mounted() {
    this.initChart()
    this.$nextTick(() => {
      setInterval(this.initChart, 60000)
    })
    // setInterval(this.initChart, 30000)
    // setInterval(this.get_sumweibo, 60000)	// 每三秒更新实时数据到折线图
    // setInterval(this.get_sumweibo, 60000)	// 每30秒更新实时数据到折线图
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
        // console.log(res.data[9])
        // weibo表中数据总数
        this.sum_weibo.count = res.data[6][0].count_weibo
        // weibo_minute表中倒数第二条数量
        this.sum_weibo.mintue_count = res.data[9][1].count
        this.sum_weibo.length = res.data[9].length
        // console.log('微博数量总数', this.sum_weibo.length)
        // console.log('微博数量总数', res.data[9])
        for (let i = res.data[9].length - 1; i > 0; i--) {
          this.myxdata.push(res.data[9][i].nowtime)
          // this.myydata.push(res.data[9][res.data[9].length - i - 1].count - res.data[9][res.data[9].length - i].count)
          this.myydata.push(res.data[9][i - 1].count - res.data[9][i].count)
        }
        // this.myxdata = this.myxdata
        // console.log(this.myxdata)
        // console.log(this.myydata)
        this.sum_weibo.nowtime = this.getTime(Math.round(new Date().getTime() / 1000))
        // console.log(this.sum_weibo)
        // console.log('改之前x轴', this.myxdata)
        // console.log('签之前y轴', this.myydata)
        if (this.sum_weibo.count !== this.sum_weibo.mintue_count) {
          minute_weibo_data(this.sum_weibo).then(res => {
            setTimeout(() => {
              // console.log('返回的两个数', res.data)
              this.myline_ydata = res.data[1][0].count - res.data[1][1].count
              // console.log('返回值', this.myline_ydata)
              // console.log('插入的x轴', this.getTime(Math.round(new Date().getTime() / 1000)))
              this.myxdata.push(this.sum_weibo.nowtime)
              this.myydata.push(this.myline_ydata)
            }, 1 * 1000)
          })
        } else {
          this.myxdata.push(this.sum_weibo.nowtime)
          this.myydata.push(0)
        }
        this.echartsOption.xAxis.data = this.myxdata.slice(-9)
        this.myxdata = this.myxdata.slice(-9)
        // console.log('我的x轴', this.myxdata)
        // console.log('我的更改过的x轴', this.myxdata.slice(-6))
        // console.log('我的y轴', this.myydata)
        // console.log('我的更改过的y轴', this.myydata.slice(-6))
        this.echartsOption.series[0].data = this.myydata.slice(-9)
        this.myydata = this.myydata.slice(-9)
        this.chart.setOption(this.echartsOption)
        // console.log('动态折线图已经画完')
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
      // console.log(nowtime)
      return nowtime
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      console.log('刷新折线图')
      this.get_sumweibo()
      // this.chart.setOption(this.echartsOption)
    }
  }
}
</script>
