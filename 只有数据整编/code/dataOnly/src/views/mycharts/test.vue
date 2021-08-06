<template>
  <div>
    <!-- 统计图容器 -->
    <div id="main" style="width: 50%;height: 350px;" />
  </div>
</template>

<script>
import { weibo_data_echarts } from '@/api/mydata'
// 引入echarts
var echarts = require('echarts')
export default {
  data() {
    return {
      echarts2: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        series: {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          data: ['123', '123', '456']
        }
      }
    }
  },
  mounted() {
    this.drawLine2()
    this.getData()
  },
  methods: {
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
        // x轴
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.echarts2.xAxis.data
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: this.echarts2.series.data
          }
        ]
      }
      // this.getData(),
      myChart2.setOption(option2)
    },
    getData() {
      var myChart2 = echarts.init(document.getElementById('main'))
      weibo_data_echarts().then(res => {
        if (res.code === 20000) {
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
        } else if (!res) {
          messager('danger', '暂无数据')
        } else {
          messager('danger', res.msg)
        }
        console.log(res)
        this.echarts2.xAxis.data = res.time
        console.log(this.echarts2.xAxis.data)
      })
    }
  }
}
</script>
