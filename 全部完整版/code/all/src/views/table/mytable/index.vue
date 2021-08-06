<template>
  <div id="Mytable">
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        prop="time"
        label="时间"
        width="180"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
      <el-table-column
        prop="count"
        label="爬取数量"
        width="180"
      />
    </el-table>
  </div>
</template>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>

import { search_weibo_data, save_data, test_get_method, preview } from '@/api/mydata'
export default {
  name: 'Mytable',
  data() {
    return {
    //   tableData: [{
    //     date: '2016-05-02',
    //     name: '王小虎',
    //     address: '上海市普陀区金沙江路 1518 弄'
    //   }, {
    //     date: '2016-05-04',
    //     name: '王小虎',
    //     address: '上海市普陀区金沙江路 1518 弄'
    //   }, {
    //     date: '2016-05-01',
    //     name: '王小虎',
    //     address: '上海市普陀区金沙江路 1518 弄'
    //   }, {
    //     date: '2016-05-03',
    //     name: '王小虎',
    //     address: '上海市普陀区金沙江路 1518 弄'
    //   }],
      tableData: {},
      list: [{}],
      time: null,
      nowTime: '',
      city: '云南',
      a: 123,
      b: 456,
      temp: {
        a: 123,
        b: 456
      },
      num: 0
    }
  },
  created() {
    this.nowTime = this.getTime()
    // window.setInterval(() => {
    //   setTimeout(this.getData(), 0)
    // }, 300000)
    this.getData()
    window.setInterval(() => {
      setTimeout(this.getData(), 0)
    }, 300*1000)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    // getData1() {
    //   search_weibo_data().then(response => {
    //     console.log('第一次获取到的返回值：', response.data)
    //     console.log('第一次获取到的时间：', response.time)
    //     // console.log('插入前的tableData：', this.tableData)
    //     this.tableData = response.data
    //     // 讲对象转换为数组
    //     for (const i in this.tableData) {
    //       this.$set(this.list[0], i, this.tableData[i])
    //     }
    //     this.tableData = this.list
    //     this.tableData[0].city = this.city
    //     this.tableData[0].time = this.nowTime
    //     console.log('插入后的tableData：', this.tableData)
    //     // console.log('插入后的tableData：', this.tableData[0].myid)
    //     console.log('时间：', this.getTime())
    //     console.log('现在的时间：', this.getTime1())
    //     // this.tableData[0].time = nowData
    //     var temp = {
    //       nowTime: response.time,
    //       city: this.city,
    //       myid: this.tableData[0].myid
    //     }
    //     this.saveData(temp)
    //     // console.log(this.temp.a, this.temp.b)
    //     // this.test_get(this.temp)
    //   })
    // },
    getData() {
      search_weibo_data().then(response => {
        var temp = {
          nowTime: response.time,
          city: this.city,
          myid: response.data.myid
        }
        this.saveData(temp)
        this.get_preview(temp)
        preview(temp).then(response => {
          console.log(temp.city)
          console.log(response)
          this.tableData = response.data
          console.log(this.tableData)
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    get_preview(data) {
      console.log('获取到的数据', data)
      console.log('获取到的数据', data.city)
      preview(data).then(response => {
        console.log(data.city)
        console.log(response)
      })
    },
    test_get(data) {
      // var time = 123
      // var psw = 333
      test_get_method(data).then(response => {
        console.log(response)
      })
    },
    saveData(data) {
      data.city = '储存_' + data.city
      console.log(data.city)
      console.log(data.nowTime)
      console.log(data)
      save_data(data).then(response => {
        // console.log('nowTime', nowTime)
        console.log('第一次获取到的返回值：', response.data)
      })
    },
    getTime() {
      var _this = this
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() + 1
      const dd = new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      _this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      console.log(this.gettime)
      return this.gettime
    },
    getTime1() {
      var _this1 = this
      const yy1 = new Date().getFullYear()
      const mm1 = new Date().getMonth() + 1
      const dd1 = new Date().getDate()
      const hh1 = new Date().getHours()
      const mf1 = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss1 = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      _this1.gettime1 = yy1 + mm1 + dd1 + hh1 + mf1 + ss1
      console.log(this.gettime1)
      return this.gettime1
    },
    // 请求是否有新消息
    getNewMessage() {
      console.log('请求' + this.num++ + '次')
    }
  }
}
</script>
