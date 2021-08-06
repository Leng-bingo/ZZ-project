import request from '@/utils/request'

export function getCustomerDetail(data) {
    return request({
      url: '/vue-element-admin/customer/detail',
      method: 'post',
      data
    })
  }
