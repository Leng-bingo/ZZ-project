<template>
  <div>
    <!-- 统计图容器 -->
    <div id="main" style="width: 50%;height: 350px;" />
    <div id="main1" style="width: 50%;height: 350px;" />
  </div>
</template>
<script>
import { weibo_data_echarts } from '@/api/mydata'
// 引入echarts
var echarts = require('echarts')
export default {
  data() {
    return {
      echarts1: {
        title: {
          text: '兑换情况'
        },
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      },
      echarts2: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: null
        },
        series: {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          data: null
        }
      }
    }
  },
  mounted() {
    this.drawLine1()
    this.drawLine2()
  },
  methods: {
    drawLine1() {
      // 初始化echarts实例
      var myChart1 = echarts.init(document.getElementById('main1'))
      // 配置参数
      var option1 = {
        title: this.echarts1.title,
        tooltip: {},
        legend: this.echarts1.legend,
        xAxis: this.echarts1.xAxis,
        yAxis: {},
        series: this.echarts1.series
      }
      myChart1.setOption(option1)
    },
    drawLine2() {
      // 初始化echarts实例
      
      console.log('开始绘图')
      var myChart2 = echarts.init(document.getElementById('main'))
      // 配置参数
      var option2 = {
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
        // 跟随鼠标显示数值
          trigger: 'axis'
        },
        legend: {
          // , '联盟广告', '视频广告', '直接访问', '搜索引擎'
          data: ['邮件营销']
        },
        // 距离边界位置
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // 保存图片
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        // // x轴
        // xAxis: {
        //   type: 'category',
        //   boundaryGap: false,
        //   data: this.echarts2.xAxis.data
        // },
        yAxis: {
          type: 'value'
        },
        // series: [
        //   {
        //     name: '邮件营销',
        //     type: 'line',
        //     stack: '总量',
        //     data: [120, 240]
        //   }
          // {
          //   name: '联盟广告',
          //   type: 'line',
          //   stack: '总量',
          //   data: [220, 182, 191, 234, 290, 330, 310]
          // },
          // {
          //   name: '视频广告',
          //   type: 'line',
          //   stack: '总量',
          //   data: [150, 232, 201, 154, 190, 330, 410]
          // },
          // {
          //   name: '直接访问',
          //   type: 'line',
          //   stack: '总量',
          //   data: [320, 332, 301, 334, 390, 330, 320]
          // },
          // {
          //   name: '搜索引擎',
          //   type: 'line',
          //   stack: '总量',
          //   data: [820, 932, 901, 934, 1290, 1330, 1320]
          // }
        // ]
      }
      this.getData(),
      myChart2.setOption(option2)
    },
    getData() {
      var myChart2 = echarts.init(document.getElementById('main'))
      weibo_data_echarts().then(res => {
        if(res.code === 20000){
          myChart2.setOption({
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: res.time
            },
            series: {
              name: '邮件营销',
              type: 'line',
              stack: '总量',
              data: res.data.myid
            }
          })
        }else if(!res){
          messager('danger', '暂无数据')
        }else{
          messager('danger', res.msg)
        };
        console.log(res)
        this.echarts2.xAxis.data = res.time
        console.log(this.echarts2.xAxis.data)
      })
    }
  }
}
</script>
