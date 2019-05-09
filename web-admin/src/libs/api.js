'use strict'

const API = {
  // 用户管理
  menu: 'menu/tree/current', // 获取当前用户菜单
  userList: '/user/list', // 获取用户列表
  userExits: '/user/exits/', // 检测用户名是否存在
  addUser: '/user/add', // 添加用户
  deleteUser: '/user/delete/', // 删除用户
  editUser: '/user/edit/', // 编辑用户
  // 角色管理
  editAvatar: '/user/edit/', // 用户头像修改
  deptTree: 'dept/tree', // 获取树状部门结构数据
  findDept: 'role/find/dept/', // 查询部门下全部的角色
  addRole: 'role/add', // 创建用户角色
  editRole: 'role/edit/', // 修改用户角色信息
  deleteRole: '/role/delete/'// 通过ID删除角色
}

export default API
