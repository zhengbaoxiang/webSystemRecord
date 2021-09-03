import axios from 'axios'
// import MintUI from 'mint-ui'
import promiseFinally from 'promise.prototype.finally'
promiseFinally.shim()

const axiosUtils = {
  axiosInit: () => {
    // 1.配置全局的接口调用IP，`baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    // axios.defaults.baseURL = window.hcsConfig.axiosBaseURL
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' // 设置axios请求的根路径

    // 2.添加响应拦截器
    axios.interceptors.response.use(function (response) {
      if (response.data) {
        return response
      } else {
        console.log('响应异常')
        return Promise.reject(response)
      }
    }, function (error) {
      // 对响应错误 reject
      console.log('发生异常')
      return Promise.reject(error)
    })

    // 3.添加token放入header
    axios.interceptors.request.use(
      config => {
        let token = window.sessionStorage.getItem('token')
        // console.log(token)
        if (token) {
          config.headers.token = token
          config.headers.Authorization = token
        }
        return config
      },
      err => {
        return Promise.reject(err)
      }
    )
  },
  setInterceptors: () => {
  }
}
export default axiosUtils
