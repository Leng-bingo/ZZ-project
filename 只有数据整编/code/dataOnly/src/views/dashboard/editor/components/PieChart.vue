<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { find_label1, total_label1 } from '@/api/mydata'
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
      total_label: [],
      label_type: [],
      mydata: [],
      test_data: [
        { value: 320, name: 'Industries' },
        { value: 240, name: 'Technology' },
        { value: 149, name: 'Forex' },
        { value: 100, name: 'Gold' },
        { value: 59, name: 'Forecasts' }
      ],
      shanjian: [],
      test_legend: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts'],
      echartsOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          // data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
          // data: this.legend
          data: this.total_label
        },
        series: [
          {
            name: '标签占比',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '48%'],
            // data: [
            //   { value: 320, name: 'Industries' },
            //   { value: 240, name: 'Technology' },
            //   { value: 149, name: 'Forex' },
            //   { value: 100, name: 'Gold' },
            //   { value: 59, name: 'Forecasts' }
            // ],
            // data: this.test_data,
            data: this.mydata,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.find_label()
    })
    // setInterval(this.find_label, 60000)	// 每三秒更新实时数据到折线图
  },
  created() {
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    find_label() {
      find_label1().then(res => {
        // console.log(res.data)
        this.label_type = res.data
        this.find_total_label()
      })
    },
    find_total_label() {
      for (let i = 0; i < this.label_type.length; i++) {
        this.total_label.push(this.label_type[i].label1)
      }
      console.log('标签总数', this.total_label)
      console.log('标签总数', this.total_label)
      this.total_label = this.total_label.slice(-this.label_type.length)
      // this.echartsOption.legend.data = this.total_label.slice(-8)
      var new_label = JSON.stringify({
        code: 20000,
        data: this.total_label
      })
      new_label = JSON.parse(new_label)
      // console.log('我的标签', this.total_label)
      // console.log('标准标签', this.test_legend)
      total_label1(new_label).then(res => {
        console.log(res)
        var a = res.data
        var arr = a.sort(this.paixu)
        for (let i = 0; i < arr.length; i++) {
          this.shanjian.push(arr[i].name)
        }
        console.log(arr)
        console.log(this.shanjian)
        console.log(this.shanjian.reverse())
        this.echartsOption.legend.data = this.shanjian.slice(0, 8)
        this.echartsOption.series[0].data = res.data
        this.mydata = res.data
        // console.log('我的数据', this.mydata)
        // console.log('标准数据', this.test_data)
        // 数据加载完毕，在画图
        this.initChart()
        this.chart.setOption(this.echartsOption)
      })
    },
    paixu(a, b) {
      return a.value - b.value
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      console.log('开始画饼图')
      this.chart.setOption(this.echartsOption)
    }
  }
}
</script>
