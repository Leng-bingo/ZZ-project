import request from '@/utils/request'

export function getComplex_Table_Data(query) {
    return request({
      url: 'http://127.0.0.1:8080/complex-table_data',
      method: 'get',
      params: query
    })
}