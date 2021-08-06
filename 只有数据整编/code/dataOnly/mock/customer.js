module.exports = [
    {
      url: '/vue-element-admin/customer/detail',
      type: 'post',
      response: config => {
        return {
          code: 20000,
          data: {
            aa: '123'
          }
        }
      }
    }
  ]
