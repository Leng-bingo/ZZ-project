<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.text" placeholder="标题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" clearable filterable placeholder="类型" class="filter-item" style="width: 180px" @change="selectlabel">
        <el-option
          v-for="item in label_type"
          :key="item.id"
          :label="item.label1"
          :value="item.label1"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <!-- @click="handleDownload" -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="myid" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.myid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="180px" align="center">
        <!-- 取这个列表的值，然后利用选择器筛选 -->
        <template slot-scope="{row}">
          <!-- <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
          <span>{{ row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.text | wordsCount }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
          <el-tag v-if="row.item1 && row.item1.length>0" style="margin-left:5px">{{ row.item1 }}</el-tag>
          <el-tag v-if="row.item2 && row.item2.length>0" style="margin-left:5px">{{ row.item2 }}</el-tag>
          <el-tag v-if="row.item3 && row.item3.length>0" style="margin-left:5px">{{ row.item3 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            发布
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button> -->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标签1" prop="item1">
          <el-select v-model="temp.item1" clearable filterable allow-create placeholder="标签1" class="filter-item">
            <el-option
              v-for="item in label_type"
              :key="item.id"
              :label="item.label1"
              :value="item.label1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签2" prop="type2">
          <el-input
            v-model="temp.item2"
            placeholder="请输入内容"
            clearable
          />
        </el-form-item>
        <el-form-item label="标签3" prop="type3">
          <el-input
            v-model="temp.item3"
            placeholder="请输入内容"
            clearable
          />
        </el-form-item>
        <el-form-item label="日期" prop="created_at">
          <el-date-picker v-model="temp.created_at" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="内容" prop="text">
          <el-input v-model="temp.text" type="textarea" autosize />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// fetchList,这个先不引入
import { fetchPv } from '@/api/article'
import { just_duplicate, save_item1, find_label1, getWeibo_Table_Data, update_really, delete_weibo_data, create_weibo_data, search_create_weibo_data, go_spider } from '@/api/mydata'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import func from 'vue-editor-bridge'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    },
    // 自定义文章title过滤器
    wordsCount(title) {
      if (title.length > 40) {
        return title.slice(0, 40) + '...'
      }
      return title
    }
  },
  data() {
    return {
      weibo_data_item: 0,
      temp_data: 0,
      tableKey: 0,
      list: null,
      total: 0,
      label_type: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        text: undefined,
        item1: undefined,
        item2: undefined,
        item3: undefined,
        // type: undefined,
        sort: '+id'
      },
      label: [],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: true,
      showitem2: false,
      showitem3: false,
      temp: {
        myid: undefined,
        importance: 1,
        remark: '',
        created_at: '',
        time: '',
        text: '',
        // type: '',
        item1: '',
        item2: '',
        item3: '',
        status: 'published',
        table: 'complex_table_data'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        item1: [{ required: true, message: '至少有一个标签', trigger: 'change' }],
        created_at: [{ required: true, message: '时间不能为空', trigger: 'change' }],
        text: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.find_label()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log(this.listQuery)
      // 原来是fetchList函数，用getComplex_Table_Data函数替换了
      // getComplex_Table_Data(this.listQuery).then(response => {
      getWeibo_Table_Data(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.items
        this.total = response.data.total

        for (let i = 0; i < response.data.items.length; i++) {
          this.label.push({
            item1: response.data.items[i].item1,
            item2: response.data.items[i].item2,
            item3: response.data.items[i].item3
          })
        }
        console.log('label', this.label)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    find_label() {
      find_label1().then(res => {
        console.log(res.data)
        this.label_type = res.data
        console.log(this.label_type)
      })
    },
    selectlabel(val) {
      console.log(val)
      // console.log(this.listQuery)
      this.listQuery.item1 = val
    },
    handleFilter() {
      this.listQuery.page = 1
      console.log(this.listQuery)
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      // var time = +new Date()
      this.temp = {
        myid: undefined,
        importance: 1,
        remark: '',
        // timestamp: new Date(),
        // timestamp: time,
        text: '',
        item1: '',
        item2: '',
        item3: '',
        created_at: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    search_createweibo_data() {
      console.log('进入查询数据1')
      this.temp_data = 0
      search_create_weibo_data({ 'table': 'complex_table_data' }).then((res) => {
        console.log('进入查询数据2')
        this.weibo_data_item = res.data[0].id
        this.temp_data = 1
      })
    },
    rTime(date) {
      var json_date = new Date(date).toJSON()
      return new Date(+new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(valid)
          const tempData = Object.assign({}, this.temp)
          // 获取表单内容
          console.log('读取到的表单', tempData)
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // console.log(this.weibo_data_item)
          // this.search_createweibo_data()
          // console.log(this.weibo_data_item)
          // this.temp.id = this.weibo_data_item + 1
          // console.log(this.temp.id)
          this.temp.author = 'admin'
          this.temp.table = 'weibo'
          // console.log(this.temp)
          // if(this.temp_data == 0){
          //   console.log('进入等待')
          //   setTimeout(() => {
          //     this.listLoading = false
          //   }, 1.5 * 1000)
          //   console.log('等待结束')
          // }
          search_create_weibo_data({ 'table': 'weibo' }).then((res) => {
            console.log('进入查询数据2')
            this.weibo_data_item = res.data[0].myid
            this.temp.myid = this.weibo_data_item + 1
            console.log(this.temp.myid)
            console.log('赋值完成')
            console.log(this.temp)
            this.temp.created_at = this.rTime(this.temp.created_at)
            console.log(this.rTime(this.temp.created_at))
            create_weibo_data(this.temp).then(() => {
              // search_create_weibo_data(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              just_duplicate(this.temp).then((res) => {
                console.log(res.data)
                if (res.data === '1') {
                  save_item1(this.temp).then((res) => {
                    console.log(res)
                    this.find_label()
                  })
                }
              })
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // 获取表单内容
          console.log('读取到的表单', tempData)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {tempData
          // {"id": tempData.id, "title": tempData.title}
          var data = JSON.stringify({ 'name': '123' })
          // var data1 = {
          //   author: tempData.author,
          //   comment_dis: tempData.comment_dis,
          //   content: tempData.content,
          //   content_sho: tempData.content_sho,
          //   display_tim: tempData.display_tim,
          //   forecast: tempData.forecast,
          //   id: tempData.id,
          //   image_uri: tempData.image_uri,
          //   importance: tempData.importance,
          //   pageviews: tempData.pageviews,
          //   platforms: tempData.platforms,
          //   reviewer: tempData.reviewer,
          //   status: tempData.status,
          //   // timestamp: tempData.timestamp,
          //   title: tempData.title,
          //   type: tempData.type
          // }
          console.log(data)
          // var new1 = JSON.stringify(data1)
          console.log('修改后的表单', tempData)
          console.log('修改后的表单', tempData.id)
          // test_post_method(data1).then((res) => {
          console.log('转换前类型', typeof (tempData))
          console.log(tempData)
          var temporary = JSON.stringify(tempData) // 将字符串转换成json对象
          console.log('转换后类型', typeof (temporary))
          console.log(temporary)
          // var tempData1 = JSON.parse(temporary)
          // console.log('转换后类型', typeof (tempData1))
          update_really(tempData).then((res) => {
            console.log('数据：', res)
            // update(tempData.id, tempData.title).then(response => {
            // console.log('返回值', response)
            const index = this.list.findIndex(v => v.id === this.temp.id)
            // console.log(index)
            this.list.splice(index, 1, this.temp)
            // console.log('111:', this.list.splice(index, 1, this.temp))
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            console.log('tempData', tempData)
            just_duplicate(tempData).then((res) => {
              console.log(res.data)
              if (res.data === '1') {
                save_item1(tempData).then((res) => {
                  console.log(res)
                  this.find_label()
                })
              }
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      console.log(row, index)
      const delete_data = Object.assign({}, row) // copy obj
      // delete_data.table = 'complex_table_data'
      delete_data.table = 'weibo'
      console.log('读取到的表单', delete_data)
      delete_weibo_data(delete_data).then((res) => {
        console.log('数据：', res)
        // update(tempData.id, tempData.title).then(response => {
        // console.log('返回值', response)
        console.log('this.temp', this.list)
        const index = this.list.findIndex(v => v.id === this.list.myid)
        console.log('index', index)
        this.list.splice(index, 1, this.list)
        console.log('111:', this.list.splice(index, 1))
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    test() {
      var data = {
        'project': 'search',
        'spider': 'search',
        'keyword': '很不错',
        'start': '2021-06-04',
        'end': '2021-06-04'
      }
      go_spider(data).then((res) => {
        console.log('数据：', res)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['发布时间', '文章内容', '标签1', '标签2', '标签3']
        const filterVal = ['created_at', 'text', 'item1', 'item2', 'item3']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
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
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      // this.list = this.list.reverse()
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
