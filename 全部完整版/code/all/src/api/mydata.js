import request from '@/utils/request'

export function getData() {
  return request({
    url: 'http://127.0.0.1:8080/api',
    method: 'get'
  })
}

// 获取微博标签
export function find_label1() {
  return request({
    url: 'http://127.0.0.1:8080/find_label1',
    method: 'get'
  })
}

// 查询每个标签下有多少数据
export function total_label1(query) {
  return request({
    url: 'http://127.0.0.1:8080/total_label1',
    method: 'get',
    params: query
  })
}

// 查询weibo数据库下表名
export function weibo_table() {
  return request({
    url: 'http://127.0.0.1:8080/weibo_table',
    method: 'get'
  })
}

// 每分钟查询微博数据
export function minute_weibo_data(query) {
  return request({
    url: 'http://127.0.0.1:8080/minute_weibo_data',
    method: 'get',
    params: query
  })
}

export function video(query) {
  return request({
    url: 'http://127.0.0.1:8080/video',
    method: 'get',
    params: query
  })
}

export function video_num() {
  return request({
    url: 'http://127.0.0.1:8080/video_num',
    method: 'get'
  })
}

export function photo_num() {
  return request({
    url: 'http://127.0.0.1:8080/photo_num',
    method: 'get'
  })
}

export function save_label1(query) {
  return request({
    url: 'http://127.0.0.1:8080/save_label1',
    method: 'get',
    params: query
  })
}

export function save_item1(query) {
  return request({
    url: 'http://127.0.0.1:8080/save_item1',
    method: 'get',
    params: query
  })
}

export function get_scrapyd_list(params) {
  return request({
    url: 'http://127.0.0.1:6800/listjobs.json',
    method: 'get',
    params: params
  })
}

export function find_day_sum(params) {
  return request({
    url: 'http://127.0.0.1:8080/find_day_sum',
    method: 'get',
    params: params
  })
}

export function get_top_data() {
  return request({
    url: 'http://127.0.0.1:8080/weibo_sum',
    method: 'get'
  })
}

export function get_scrapyd_cancel(params) {
  return request({
    url: 'http://127.0.0.1:6800/cancel.json',
    method: 'post',
    params: params
  })
}

export function getComplex_Table_Data(query) {
  return request({
    url: 'http://127.0.0.1:8080/complex-table_data',
    method: 'get',
    params: query
  })
}

export function getWeibo_Table_Data(query) {
  return request({
    url: 'http://127.0.0.1:8080/weibo-table_data',
    method: 'get',
    params: query
  })
}

export function delete_weibotable_data(query) {
  return request({
    url: 'http://127.0.0.1:8080/delete_weibotable_data',
    method: 'get',
    params: query
  })
}

export function just_duplicate(query) {
  return request({
    url: 'http://127.0.0.1:8080/just_duplicate',
    method: 'get',
    params: query
  })
}

export function just_duplicate2(query) {
  return request({
    url: 'http://127.0.0.1:8080/just_duplicate2',
    method: 'get',
    params: query
  })
}

export function update(params) {
  return request({
    url: 'http://127.0.0.1:8080/modify_weibo_data',
    method: 'post',
    params
  })
}

export function update_really(params) {
  return request({
    url: 'http://127.0.0.1:8080/modify_reallyweibo_data',
    method: 'post',
    params
  })
}

export function go_spider(params) {
  return request({
    url: 'http://127.0.0.1:6800/schedule.json',
    method: 'post',
    params
  })
}

export function test_post_method(params) {
  return request({
    url: 'http://127.0.0.1:8080/test_post_method',
    method: 'post',
    params
  })
}

// 获取爬取了多少数据
export function search_weibo_data(data) {
  return request({
    url: 'http://127.0.0.1:8080/search_weibo_data',
    method: 'get',
    data
  })
}

// 获取爬取到多少数据，用于echarts
export function weibo_data_echarts(data) {
  return request({
    url: 'http://127.0.0.1:8080/weibo_data_echarts',
    method: 'get',
    data
  })
}

// 将每隔五分钟获取到数据存到数据库
// 获取爬取到多少数据，用于echarts
export function save_data(params) {
  return request({
    url: 'http://127.0.0.1:8080/save_data',
    method: 'get',
    params
  })
}

export function test_get_method(params) {
  return request({
    url: 'http://127.0.0.1:8080/test_get_method',
    method: 'get',
    params
  })
}

export function preview(params) {
  return request({
    url: 'http://127.0.0.1:8080/preview',
    method: 'get',
    params
  })
}

export function page_data(params) {
  return request({
    url: 'http://127.0.0.1:8080/page_data',
    method: 'get',
    params
  })
}

export function save_jobid(params) {
  return request({
    url: 'http://127.0.0.1:8080/save_jobid',
    method: 'get',
    params
  })
}

export function modify_jobid(params) {
  return request({
    url: 'http://127.0.0.1:8080/modify_jobid',
    method: 'get',
    params
  })
}

export function find_jobid(params) {
  return request({
    url: 'http://127.0.0.1:8080/find_jobid',
    method: 'get',
    params
  })
}

export function delete_weibo_data(params) {
  return request({
    url: 'http://127.0.0.1:8080/deletereally_weibo_data',
    method: 'get',
    params
  })
}

export function create_weibo_data(params) {
  return request({
    url: 'http://127.0.0.1:8080/create_weibo_data',
    method: 'get',
    params
  })
}

export function search_create_weibo_data(params) {
  return request({
    url: 'http://127.0.0.1:8080/search_create_weibo_data',
    method: 'get',
    params
  })
}
