<template>
  <div id="app-4">
    <el-table
      :data="tableData"        
      style="width: 100%">
      <el-table-column 
        v-for="items in tableDataType" 
        :key="items" 
        :prop="items.nameProp" 
        :label="items.nameLable" 
        width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tableDataType: [{
          nameLable: '姓名',
          nameProp: 'name'
        }, {
          nameLable: '日期',
          nameProp: 'date'

        }, {
          nameLable: '地址',
          nameProp: 'address'
        }],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',

        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    }
  }
</script>
