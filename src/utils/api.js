import axios from 'axios'
import qs from 'qs'

// api使用  this.$api.getMenuList()
const Api = {
  login (arg) {
    return axios.post('login', arg)
  },
  getMenuList () {
    return axios.get('menus')
  },
  // 列表
  getFileList: (arg) => {
    return axios.post('/list', arg)
  },
  // 详情
  getDetail: id => {
    return axios.get('/detail', {
      params: {
        id
      }
    })
  },
  // 取消
  cancelOrder: id => {
    return axios.put('/order/cancel', qs.stringify({
      id
    }))
  }
}

export default Api
