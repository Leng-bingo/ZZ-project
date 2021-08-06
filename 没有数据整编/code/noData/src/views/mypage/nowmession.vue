<template>
  <div class="app-container">
    <div style="margin:0 0 20px 20px;font-size: 25px">
      当前任务
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="messionlist"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- <el-table-column label="序号" prop="myid" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.myid }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="序号" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ (scope.$index + 1) }} </span>
        </template>
      </el-table-column>
      <el-table-column label="爬虫ID" prop="id" align="center" min-width="280px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" prop="status" align="center" width="90px">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | cn_status }}
          </el-tag>
          <!-- <span>{{ row.status }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="start_time" width="250px" align="center">
        <!-- 取这个列表的值，然后利用选择器筛选 -->
        <template slot-scope="{row}">
          <span>{{ row.start_time | shijian(row.start_time) }}</span>
          <!-- <span>{{ row.start_time }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="end_time" width="250px" align="center">
        <!-- 取这个列表的值，然后利用选择器筛选 -->
        <template slot-scope="{row}">
          <span>{{ row.end_time | shijian(row.end_time) | run_endtime(row.end_time) }}</span>
          <!-- <span>{{ row.end_time }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="持续时间" prop="run_time" width="200px" align="center">
        <!-- 取这个列表的值，然后利用选择器筛选 -->
        <template slot-scope="{row}">
          <span>{{ row.end_time | chazhi(row.start_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="取消爬虫" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="canel_mession(row.id)">
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="get_scrapyd_list1" />
  </div>
</template>

<script>
// fetchList,这个先不引入
import { get_scrapyd_list, get_scrapyd_cancel, modify_jobid } from '@/api/mydata'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        running: 'success',
        finished: ''
      }
      return statusMap[status]
    },
    cn_status(status) {
      const s = {
        running: '正在运行',
        finished: '已结束'
      }
      return s[status]
    },
    shijian(time) {
      var dateEnd = new Date(time)
      var year = dateEnd.getFullYear()
      var month = dateEnd.getMonth() + 1
      var day = dateEnd.getDate()
      var hours = dateEnd.getHours()
      var minutes = dateEnd.getMinutes()
      var seconds = dateEnd.getSeconds()
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      // console.log(year+"年"+month+"月"+day+"日"+hours+":"+minutes+":"+seconds)
      return year + '年' + month + '月' + day + '日' + hours + ':' + minutes + ':' + seconds
    },
    chazhi(end_time, start_time) {
      //   var end_time = '2021-07-05 14:30:50.099485'
      //   var start_time = '2021-07-05 14:30:08.380023'
      if (typeof (end_time) === 'undefined') {
        // console.log('1')
        var dateEnd2 = new Date()
        var dateStart2 = new Date(start_time)
        var dateDiff2 = dateEnd2 - dateStart2
        var dayDiff2 = Math.floor(dateDiff2 / (24 * 3600 * 1000))
        var leave12 = dateDiff2 % (24 * 3600 * 1000)
        var hours2 = Math.floor(leave12 / (3600 * 1000))
        var leave22 = leave12 % (3600 * 1000)
        var minutes2 = Math.floor(leave22 / (60 * 1000))
        var leave32 = leave22 % (60 * 1000)
        var seconds2 = Math.round(leave32 / 1000)
        return dayDiff2 + '天' + hours2 + '小时' + minutes2 + '分钟' + seconds2 + '秒'
      }
      if (end_time === 'NaN天NaN小时NaN分钟NaN秒') {
        // console.log('2')
        var dateEnd = new Date()
        var dateStart = new Date(start_time)
        var dateDiff = dateEnd - dateStart
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))
        var leave1 = dateDiff % (24 * 3600 * 1000)
        var hours = Math.floor(leave1 / (3600 * 1000))
        var leave2 = leave1 % (3600 * 1000)
        var minutes = Math.floor(leave2 / (60 * 1000))
        var leave3 = leave2 % (60 * 1000)
        var seconds = Math.round(leave3 / 1000)
        // console.log(dayDiff + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒')
        return dayDiff + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒'
      }
      // console.log('3')
      var dateEnd3 = new Date(end_time)
      var dateStart3 = new Date(start_time)
      var dateDiff3 = dateEnd3 - dateStart3
      var dayDiff3 = Math.floor(dateDiff3 / (24 * 3600 * 1000))
      var leave13 = dateDiff3 % (24 * 3600 * 1000)
      var hours3 = Math.floor(leave13 / (3600 * 1000))
      var leave23 = leave13 % (3600 * 1000)
      var minutes3 = Math.floor(leave23 / (60 * 1000))
      var leave33 = leave23 % (60 * 1000)
      var seconds3 = Math.round(leave33 / 1000)
      return dayDiff3 + '天' + hours3 + '小时' + minutes3 + '分钟' + seconds3 + '秒'
    },
    run_endtime(time) {
      if (typeof (time) === 'undefined') {
        // console.log('111')
        return '正在运行'
      } else if (time === 'NaN年NaN月NaN日NaN:NaN:NaN') {
        return '正在运行'
      } else {
        return time
      }
    },
    run_chazhi(time) {
      if (typeof (time) === 'undefined') {
        // console.log('111')
        return '正在运行'
      } else if (time === 'NaN天NaN小时NaN分钟NaN秒') {
        // var Nowdate = new Date()
        // console.log(Nowdate)
        return '正在运行'
      } else {
        // console.log(time)
        // console.log(typeof (time))
        return time
      }
    }
  },
  data() {
    return {
      messionlist: [{
        myid: 1,
        id: 'c1b41da4dd2b11ebb126c82158fe7413',
        status: 'finished',
        start_time: '2021-07-05 08:56:00',
        end_time: '2021-07-05 08:56:14',
        run_time: '0:00:14'
      }],
      weibo_data_item: 0,
      temp_data: 0,
      tableKey: true,
      list: null,
      total: 0,
      listLoading: true,
      project_name: [{
        project: 'weibo'
      },
      {
        project: 'weibo_photo'
      }],
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        time: '',
        title: '',
        type: '',
        status: 'published',
        table: 'complex_table_data'
      },
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.get_scrapyd_list1()
  },
  methods: {
    get_scrapyd_list1() {
      // console.log(this.project_name[0])
      get_scrapyd_list(this.project_name[0]).then(response => {
        // console.log('111', response)
        // this.list = response.data.items
        // var dateDiff = response.data.finished[0].end_time - response.data.finished[0].start_time
        this.messionlist = response.data.finished
        // console.log(dateDiff)
        // Just to simulate the time of the request
        get_scrapyd_list(this.project_name[1]).then(res => {
          this.messionlist = this.messionlist.concat(res.data.finished)
          this.messionlist = this.messionlist.concat(response.data.running)
          this.messionlist = this.messionlist.concat(res.data.running)
          this.messionlist = this.messionlist.reverse()
          // console.log(this.messionlist)
          this.total = this.messionlist.length
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      return this.messionlist
    },
    canel_mession(myid) {
      var cancel_data = {
        project: 'weibo',
        job: myid,
        jobid: myid
      }
      // console.log(cancel_data)
      get_scrapyd_cancel(cancel_data).then(res => {
        this.tableKey = !this.tableKey
        // console.log(res)
        this.messionlist = this.get_scrapyd_list1()
        modify_jobid(cancel_data).then(res => {
          if (res.data === '1') {
            this.$notify({
              title: '成功',
              message: '取消成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
