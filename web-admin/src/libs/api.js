'use strict'
const adminIp = 'http://106.75.178.9:8080/admin/'
const logoutIp = 'http://106.75.178.9:8080/'
const API = {
  // 退出登陆
  logout: logoutIp + 'token/logout',
  // 用户管理
  menu: adminIp + 'menu/tree/current', // 获取当前用户菜单
  userList: adminIp + 'user/list', // 获取用户列表
  userExits: adminIp + 'user/exits/', // 检测用户名是否存在
  addUser: adminIp + 'user/add', // 添加用户
  deleteUser: adminIp + 'user/delete/', // 删除用户
  editUser: adminIp + 'user/edit/', // 编辑用户
  // 角色管理
  editAvatar: adminIp + 'user/edit/', // 用户头像修改
  deptTree: adminIp + 'dept/tree', // 获取树状部门结构数据
  findDept: adminIp + 'role/find/dept/', // 查询部门下全部的角色
  addRole: adminIp + 'role/add', // 创建用户角色
  editRole: adminIp + 'role/edit/', // 修改用户角色信息
  deleteRole: adminIp + 'role/delete/', // 通过ID删除角色
  // 字典管理
  dictList: adminIp + 'dict/list', // 分页查询字典
  addDict: adminIp + 'dict/add', // 添加字典
  editDict: adminIp + 'dict/edit/', // 编辑字典信息
  deleteDict: adminIp + 'dict/delete/', // 删除字典信息
  // 菜单管理
  getMenu: adminIp + 'menu/tree/current'// 获取当前用户的树状菜单

}

export default API
