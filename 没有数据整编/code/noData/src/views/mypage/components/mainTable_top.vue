
<template>
  <el-table :key="tableKey" :data="list" style="width: 100%;height: 120px;padding-top: 5px;">
    <el-table-column label="最新任务ID" prop="id" align="center" min-width="270">
      <template slot-scope="{row}">
        {{ row.id }}
      </template>
    </el-table-column>
    <el-table-column label="标签" prop="label" align="center" width="200">
      <template slot-scope="{row}">
        {{ row.label }}
      </template>
    </el-table-column>
    <el-table-column label="开始时间" prop="start_time" min-width="200" align="center">
      <template slot-scope="{row}">
        {{ row.start_time | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="结束时间" prop="end_time" min-width="200" align="center">
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
import { get_scrapyd_list, find_jobid } from '@/api/mydata'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        ok: 'success',
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
        ok: '正在运行',
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
        run_time: '',
        label: ''
      }],
      nowdata: {
        label: '',
        status: ''
      },
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
      console.log('刷新最新任务')
      this.tableKey = !this.tableKey
      find_jobid().then(res => {
        // console.log('第一个', res)
        this.nowdata.label = res.data[0].label
        this.nowdata.status = res.data[0].status
        // console.log('nowdata', this.nowdata)
        get_scrapyd_list(this.project_name[0]).then(response => {
          this.tableKey = !this.tableKey
          // console.log('111', response)
          // this.list = response.data.items
          // var dateDiff = response.data.finished[0].end_time - response.data.finished[0].start_time
          this.list = response.data.finished
          // console.log(dateDiff)
          // Just to simulate the time of the request
          // console.log('111', this.list)
          get_scrapyd_list(this.project_name[1]).then(resp => {
            // console.log(resp)
            this.list = this.list.concat(resp.data.finished)
            this.list = this.list.concat(response.data.running)
            this.list = this.list.concat(resp.data.running)
            this.list = this.list.reverse()
            // console.log('111', this.list)
            this.list = this.list.slice(0, 1)
            this.total = this.list.length
            // console.log(this.list)
            this.list[0].label = this.nowdata.label
            // console.log(this.nowdata)
            // console.log(resp.data.running.length, response.data.running.length)
            if (resp.data.running.length === 0 && response.data.running.length === 0) {
              this.list[0].status = 'finished'
            } else {
              this.list[0].status = this.nowdata.status
              // this.list[0].status = 'success'
            }
          })
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      })
    }
  }
}
</script>
