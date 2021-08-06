<template>
  <div id="MyPage" style="margin: 30px 0 0 0">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item label="爬取视频关键词" prop="name">
        <el-input v-model="ruleForm.name" placeholder="至少输入一个关键词" style="width:50%" />
      </el-form-item>
      <!-- 动态增加项目 -->
      <el-form-item
        v-for="(value, index) in ruleForm.dynamicItem"
        :key="value.index"
        :label="'关键词' + (index+1)"
        :prop="'dynamicItem.' + index + '.name'"
      >
        <el-input v-model="value.name" style="width:50%" />
        <el-button style="margin-left: 8px" @click.prevent="deleteItem(value)">删除</el-button>
      </el-form-item>
      <el-form-item label="视频存储路径">
        <el-input placeholder="修改node-api/lujing.py文件" style="width:50%" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button type="primary" style="margin-left: 8px" @click="addItem">增加关键词</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { video } from '@/api/mydata'
export default {
  name: 'MyPage',
  data() {
    return {
      form: {
        imgSavePath: ''
      },
      loc: '',
      myswitch: true,
      show: true,
      ruleForm: {
        name: '',
        name2: '',
        name3: '',
        // region: '',
        region: [],
        value1: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        dynamicItem: [
          { id: '', name: '' }
        //   { id: 2, name: 'ased2' }
        ]
      },
      rules: {
        name: [
          { required: true, message: '至少输入一个关键词', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showCont() {
      this.show = !this.show
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.ruleForm)
          // console.log(tempData)
          // console.log(tempData.value1[0])
          var test = {
            content1: tempData.name
          }
          for (let i = 0; i < tempData.dynamicItem.length; i++) {
            test['content' + '' + (i + 2) + ''] = tempData.dynamicItem[i].name
          }
          var newcontent = ''
          for (var key in test) {
            // console.log(key)
            // console.log(test[key])
            newcontent = newcontent + test[key] + '\n'
          }
          var mycontent = {
            content: newcontent
          }
          // console.log(mycontent)
          video(mycontent).then(res => {
            // console.log(res)
            if (res.data === '1') {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        } else {
          // console.log('error submit!!')
          this.$notify({
            title: '失败',
            message: '创建失败',
            type: 'error',
            duration: 0
          })
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    get_data() {
      // console.log()
    },
    addItem() {
      this.ruleForm.dynamicItem.push({
        id: '',
        name: ''
      })
    },
    deleteItem(item) {
      var index = this.ruleForm.dynamicItem.indexOf(item)
      if (index !== -1) {
        this.ruleForm.dynamicItem.splice(index, 1)
      }
    }
  }
}
</script>
<style>
  /* .el-input{
    width: 50%
  } */
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }

  .el-card{
    margin: auto;
  }
</style>
