
<template>
  <el-table :key="tableKey" :data="list" style="width: 100%;height: 360px;padding-top: 5px;">
    <el-table-column label="历史任务ID" prop="id" align="center" min-width="270">
      <template slot-scope="{row}">
        {{ row.id }}
      </template>
    </el-table-column>
    <el-table-column label="结束时间" prop="end_time" width="160" align="center">
      <template slot-scope="{row}">
        {{ row.end_time | orderNoFilter | run_endtime }}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status | cn_status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'
import { get_scrapyd_list } from '@/api/mydata'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        running: 'success',
        finished: ''
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      // if (str !== '') {
      //   console.log(str)
      //   return str.substring(0, 19)
      // }
      if (typeof (str) === 'undefined') {
        return 'NaN年NaN月NaN日NaN:NaN:NaN'
      }
      if (str === '') {
        return 'NaN年NaN月NaN日NaN:NaN:NaN'
      }
      return str.substring(0, 19)
    },
    run_endtime(time) {
      if (typeof (time) === 'undefined') {
        // console.log('未定义1')
        return '-   -   -'
      } else if (time === 'NaN年NaN月NaN日NaN:NaN:NaN') {
        return '-   -   -'
      } else {
        return time
      }
    },
    cn_status(status) {
      const s = {
        running: '正在运行',
        finished: '已结束'
      }
      return s[status]
    }
  },
  data() {
    return {
      list: [{
        myid: '',
        id: '',
        status: '',
        start_time: '',
        end_time: '',
        run_time: ''
      }],
      tableKey: true,
      project_name: [{
        project: 'weibo'
      },
      {
        project: 'weibo_photo'
      }]
    }
  },
  mounted() {
    this.get_scrapyd_list1()
    this.$nextTick(() => {
      setInterval(this.get_scrapyd_list1, 60000)
    })
    // setInterval(this.find_label(), 60000)
    // setInterval(this.get_scrapyd_list1, 10000)
  },
  created() {
    // this.fetchData()
    // this.get_scrapyd_list1()
    // setInterval(this.timer, 1000);
    // setInterval(this.get_scrapyd_list1, 10000)
  },
  methods: {
    fetchData() {
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    },
    get_scrapyd_list1() {
      console.log('刷新历史任务')
      this.tableKey = !this.tableKey
      get_scrapyd_list(this.project_name[0]).then(response => {
        this.tableKey = !this.tableKey
        // console.log('111', response)
        // this.list = response.data.items
        // var dateDiff = response.data.finished[0].end_time - response.data.finished[0].start_time
        this.list = response.data.finished
        // console.log(dateDiff)
        // Just to simulate the time of the request
        get_scrapyd_list(this.project_name[1]).then(res => {
          this.list = this.list.concat(res.data.finished)
          this.list = this.list.concat(response.data.running)
          this.list = this.list.concat(res.data.running)
          this.list = this.list.reverse()
          this.list = this.list.slice(1, 7)
          this.total = this.list.length
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
