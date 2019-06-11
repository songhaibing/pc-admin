'use strict'
import axios from 'axios'
import Vue from 'vue'
import router from '@/router'
const $Vue = new Vue()

const HTTP = {}
// 使用由axios库提供的配置的默认值来创建axios实例
const instance = axios.create()

// 添加请求拦截器
instance.interceptors.request.use(function(config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // 在发送请求之前做些什么
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function(config) {
  return config
}, function(error) {
  if (error && error.response.status) {
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      $Vue.$message.error({
        message: '登陆信息失效，请重新登陆',
        duration: 4000
      })
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    }
  }
  return Promise.reject(error)
})

/**
 * 发送post请求
 *
 * @param url 接口url
 * @param data 传递给后端的数据
 * @param callback 回调函数,参数 res.data.data 为主要数据部分
 * @returns {{resData}} 成功就返回具体数据
 */
HTTP.post = function(url, data, callback) {
  const params = data
  instance.post(url, params)
    .then(function(res) {
      // 响应成功回调
      if (res.data.code == '1') {
        callback(res.data)
      } else if(res.data.code == '2'){
        callback(res.data)
      }else{
        $Vue.$message.error('网络异常请刷新')
      }
    })
    .catch(function(err) {
      $Vue.$message.error(err)
    })
}

/**
 * 发送get请求
 *
 * @param url 接口url
 * @param data 传递给后端的数据
 * @param callback
 */
HTTP.get = function(url, data, callback) {
  const params = { params: data }
  instance.get(url, params)
    .then(function(res) {
      // 响应成功回调
      if (res.data.code === 1) {
        callback(res.data.data)
      } else {
        $Vue.$message.error('网络异常请刷新')
      }
    })
    .catch(function(err) {
      $Vue.$message.error(err)
    })
}
HTTP.get1 = function(url, data, callback) {
  const params = { params: data }
  instance.get(url, params)
    .then(function(res) {
      // 响应成功回调
      callback(res)
      // if (res.data.code === 1) {
      //   callback(res.data.data)
      // } else {
      //   $Vue.$message.error('网络异常请刷新')
      // }
    })
    .catch(function(err) {
      $Vue.$message.error(err)
    })
}
/**
 * 发送delete请求
 *
 * @param url 接口url
 * @param data 传递给后端的数据
 * @param callback
 */
HTTP.delete = function(url, data, callback) {
  const params = { params: data }
  instance.delete(url, params)
    .then(function(res) {
      // 响应成功回调
      if (res.data.code === 1) {
        callback(res.data)
      } else {
        $Vue.$message.error('网络异常请刷新')
      }
    })
    .catch(function(err) {
      $Vue.$message.error(err)
    })
}
/**
 * 发送put请求
 *
 * @param url 接口url
 * @param data 传递给后端的数据
 * @param callback
 */
HTTP.put = function(url, data, callback) {
  instance.put(url, data)
    .then(function(res) {
      // 响应成功回调
      if (res.data.code === 1) {
        callback(res.data)
      } else {
        $Vue.$message.error('网络异常请刷新')
      }
    })
    .catch(function(err) {
      $Vue.$message.error('网络异常请刷新')
    })
}
export default HTTP
