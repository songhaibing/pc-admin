'use strict'
import axios from 'axios'
import ip from './address'
import Vue from 'vue'

let $Vue = new Vue();


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
  let params = data
  instance.post(ip + url, params)
    .then(function (res) {
      // 响应成功回调
      if (res.data.code == '1') {
        callback(res.data)
      }else{
        $Vue.$message.error('网络异常请刷新');
      }
    })
    .catch(function (err) {
      $Vue.$message.error('网络异常请刷新');
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
      if (res.data.code === 1) {
        callback(res.data.data)
      }else {
        $Vue.$message.error('网络异常请刷新');

      }
    })
    .catch(function (err) {
      $Vue.$message.error('网络异常请刷新');
    });
}
/**
 * 发送delete请求
 *
 * @param url 接口url
 * @param data 传递给后端的数据
 * @param callback
 */
HTTP.delete = function (url, data, callback) {
  let params = {params: data}
  instance.delete(ip + url, params)
    .then(function (res) {
      // 响应成功回调
      if (res.data.code === 1) {
        callback(res.data)
      }else {
        $Vue.$message.error('网络异常请刷新');

      }
    })
    .catch(function (err) {
      $Vue.$message.error('网络异常请刷新');

    });
}
/**
 * 发送put请求
 *
 * @param url 接口url
 * @param data 传递给后端的数据
 * @param callback
 */
HTTP.put = function (url, data, callback) {
  instance.put(ip + url, data)
    .then(function (res) {
      // 响应成功回调
      if (res.data.code === 1) {
        callback(res.data)
      }else {
        $Vue.$message.error('网络异常请刷新');

      }
    })
    .catch(function (err) {
      $Vue.$message.error('网络异常请刷新');

    });
}
export default HTTP
