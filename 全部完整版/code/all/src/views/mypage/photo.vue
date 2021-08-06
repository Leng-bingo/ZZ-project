<template>
  <div id="MyPage" style="margin: 30px 0 0 0">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item label="爬取图片关键词" prop="name">
        <el-input v-model="ruleForm.name" placeholder="爬取图片关键词" style="width:50%" />
      </el-form-item>
      <!-- <el-form-item label="标签2" prop="name2">
        <el-input v-model="ruleForm.name2" placeholder="请输入标签2" style="width:50%" />
      </el-form-item>
      <el-form-item label="标签3" prop="name3">
        <el-input v-model="ruleForm.name3" placeholder="请输入标签3" style="width:50%" />
      </el-form-item> -->
      <!-- <el-form-item label="标签4" prop="name4">
        <el-switch
          v-model="myswitch"
          @change="showCont"
          active-text="自定义输入"
          inactive-text="按年付费">
        </el-switch>
        <el-button @click="showCont">点击隐藏</el-button>
        <div v-if="show">hello</div>
        <el-form-item label="爬取城市" prop="region" >
        <div class="block">
          <el-cascader
            v-model="ruleForm.region"
            size="large"
            :options="options"
            :props="{ expandTrigger: 'hover', checkStrictly: true }"
            placeholder="请选择地区"
            clearable
            @change="handleChange"
          />
        </div>
      </el-form-item>
      </el-form-item> -->
      <!-- <el-form-item label="爬取城市" prop="region">
        <div class="block">
          <el-cascader
            v-model="ruleForm.region"
            size="large"
            :options="options"
            :props="{ expandTrigger: 'hover', checkStrictly: true }"
            placeholder="请选择地区"
            clearable
            @change="handleChange"
          />
        </div>
      </el-form-item> -->
      <el-form-item label="爬取时间" prop="value1" required>
        <div class="block">
          <el-date-picker
            v-model="ruleForm.value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
          />
        </div>
      </el-form-item>
      <el-form-item label="图像存储路径">
        <el-input placeholder="修改weibo_photo/settings.py文件中IMAGES_STORE选项" style="width:50%" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { go_spider, save_jobid } from '@/api/mydata'
import { regionData, CodeToText } from 'element-china-area-data'
export default {
  name: 'MyPage',
  data() {
    return {
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
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入搜索图片名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请爬取区域', trigger: 'change' }
        ],
        value1: [
          { required: true, message: '请输入时间', trigger: 'blur' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      options: regionData
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
            project: 'weibo_photo',
            spider: 'search',
            start: tempData.value1[0],
            end: tempData.value1[1],
            label1: tempData.name,
            label2: tempData.name2,
            label3: tempData.name3,
            keyword: tempData.name
            // keyword: this.loc
          }
          // console.log(test)
          go_spider(test).then((res) => {
            // console.log(res)
            var job = {
              label: tempData.name,
              jobid: res.data.jobid,
              status: res.data.status
            }
            save_jobid(job).then((res) => {
              // console.log(res.data)
              if (res.data === '1') {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              }
            })
            // console.log(job)
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
    handleChange() {
      for (let i = 0; i < this.ruleForm.region.length; i++) {
        this.loc += CodeToText[this.ruleForm.region[i]]
      }
      alert(this.loc)
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
