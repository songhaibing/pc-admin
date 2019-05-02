'use strict'
import axios from 'axios'
import ip from './address'
import qs from 'qs'




let HTTP = {}
// 使用由axios库提供的配置的默认值来创建axios实例
let instance = axios.create()


/**
 * 发送post请求
 *
 * @param url 接口url
 * @param data 传递给后端的数据
 * @param callback 回调函数,参数 res.data.data 为主要数据部分
 * @returns {{resData}} 成功就返回具体数据
 */
HTTP.post = function (url, data, callback) {
  let params = qs.stringify(data)
  instance.post(ip + url, params)
    .then(function (res) {
      // 响应成功回调
      if (res.data.code == '1') {
        callback(res)
      }
    })
    .catch(function (err) {

    })
}

/**
 * 发送get请求
 *
 * @param url 接口url
 * @param data 传递给后端的数据
 * @param callback
 */
HTTP.get = function (url, data, callback) {
  let params = {params: data}
  instance.get(ip + url, params)
    .then(function (res) {
      // 响应成功回调
      console.log('res',res)
      if (res.data.code === 1) {
        callback(res.data.data)
      }else {


      }
    })
    .catch(function (err) {
      if(err){

      }

    });
}
export default HTTP
