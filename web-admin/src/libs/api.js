'use strict';

let API = {
  menu:'menu/tree/current',//获取当前用户菜单
  userList:'/user/list',//获取用户列表
  userExits:'/user/exits/',//检测用户名是否存在
  addUser:'/user/add',//添加用户
  deleteUser:'/user/delete/',//删除用户
  editUser:'/user/edit/',//编辑用户
  editAvatar:'/user/edit/',//用户头像修改
    deptTree:'dept/tree'//获取树状部门结构数据

};

export default API;
