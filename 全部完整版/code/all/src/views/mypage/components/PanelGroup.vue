<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            数据总量(文本/视频/图像)
          </div>
          <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
          <div class="card-panel-num">{{ top_data.first }}/{{ top_data.first_video }}/{{ top_data.first_photo }} </div>
          <!-- <count-to :start-val="0" :end-val="top_data[0].first" :duration="3000" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            关键词个数(文本/视频/图像)
          </div>
          <!-- <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" /> -->
          <div class="card-panel-num">{{ top_data.two }}/{{ top_data.two_video }}/{{ top_data.two_photo }}</div>
          <!-- <count-to :start-val="0" :end-val="top_data[0].two" :duration="3000" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <!-- <svg-icon icon-class="money" class-name="card-panel-icon" /> -->
          <svg-icon icon-class="star" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当前任务状态
          </div>
          <div class="card-panel-num">{{ status }}</div>
          <!-- <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <!-- <svg-icon icon-class="shopping" class-name="card-panel-icon" /> -->
          <svg-icon icon-class="example" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            容量(文本/视频/图像)
          </div>
          <div class="card-panel-num">{{ top_data.size }}/{{ top_data.size_video }}/{{ top_data.size_photo }}</div>
          <!-- <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
// import CountTo from 'vue-count-to'
import { get_top_data, get_scrapyd_list, video_num, photo_num } from '@/api/mydata'

export default {
  components: {
    // CountTo
  },
  data() {
    return {
      top_data: {
        first: '',
        first_video: '',
        first_photo: '',
        two: '',
        two_video: '',
        two_photo: '',
        status: '',
        size: '',
        size_video: '',
        size_photo: ''
      },
      status: '',
      project_name: [{
        project: 'weibo'
      }],
      messionlist: [{
        myid: 1,
        id: 'c1b41da4dd2b11ebb126c82158fe7413',
        status: 'finished',
        start_time: '2021-07-05 08:56:00',
        end_time: '2021-07-05 08:56:14',
        run_time: '0:00:14'
      }]
    }
  },
  mounted() {
    this.top_shuju()
    setInterval(this.top_shuju, 60000)	// 每60秒更新实时数据
    this.get_scrapyd_list1()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    top_shuju() {
      console.log('刷新第一栏基础数据')
      get_top_data().then(res => {
        // console.log(res.data)
        // console.log('111111', res.data[6][0])
        // console.log('改之前的数据', this.top_data)
        this.top_data = {}
        video_num().then(resp => {
          // console.log(resp)
          this.top_data.first_video = resp.sum
          this.top_data.two_video = resp.data.length
          this.top_data.size_video = resp.size
          this.top_data.first = res.data[6][0].count_weibo
          this.top_data.two = res.data[7][0].count_label
          this.top_data.size = res.data[8][0].data_size
          photo_num().then(response => {
            this.top_data.first_photo = response.sum
            this.top_data.two_photo = response.data.length
            this.top_data.size_photo = response.size
            this.get_scrapyd_list1()
          })
        })
      })
    },
    get_scrapyd_list1() {
      // console.log(this.project_name[0])
      get_scrapyd_list(this.project_name[0]).then(response => {
        // console.log('111', response)
        // this.list = response.data.items
        // var dateDiff = response.data.finished[0].end_time - response.data.finished[0].start_time
        this.messionlist = response.data.finished
        this.messionlist = this.messionlist.concat(response.data.running)
        this.messionlist = this.messionlist.concat(response.data.pending)
        this.messionlist = this.messionlist.reverse()
        this.status = ''
        if (response.data.running.length !== 0) {
          // Vue.set(this.top_data, this.top_data[0].status, '正在运行')
          this.status = '正在运行'
        } else {
          // Vue.set(this.top_data, this.top_data[0].status, '已结束')
          this.status = '已结束'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
