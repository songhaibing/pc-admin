'use strict'
const adminIp = 'http://106.75.178.9:8080/admin/'
const logoutIp = 'http://106.75.178.9:8080/'
const smartcardIp = 'http://106.75.178.9:8080/smartcard/'
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
  // 部门管理
  deleteDept: adminIp + 'dept/delete/', // 通过ID删除部门
  addDept: adminIp + 'dept/add', // 添加部门数据
  editDept: adminIp + 'dept/edit/', // 修改部门信息
  // 角色管理
  editAvatar: adminIp + 'user/edit/', // 用户头像修改
  deptTree: adminIp + 'dept/tree', // 获取树状部门结构数据
  findDept: adminIp + 'role/find/dept/', // 查询部门下全部的角色
  addRole: adminIp + 'role/add', // 创建用户角色
  editRole: adminIp + 'role/edit/', // 修改用户角色信息
  deleteRole: adminIp + 'role/delete/', // 通过ID删除角色
  getAuthorities: adminIp + 'role/authorities', // 获取当前用户权限信息
  findRole: adminIp + 'role/find/', // 通过ID查询用户角色信息
  // 字典管理
  dictList: adminIp + 'dict/list', // 分页查询字典
  addDict: adminIp + 'dict/add', // 添加字典
  editDict: adminIp + 'dict/edit/', // 编辑字典信息
  deleteDict: adminIp + 'dict/delete/', // 删除字典信息
  // 菜单管理
  getMenu: adminIp + 'menu/tree/current', // 获取当前用户的树状菜单
  addMenu: adminIp + 'menu/add', // 添加系统菜单
  deleteMenu: adminIp + 'menu/delete/', // 删除系统菜单
  editMenu: adminIp + 'menu/edit/', // 修改系统菜单

  /**
   *  账户中心API
   */
  // 商户管理-商户列表
  addBusiness: smartcardIp + 'business/add', // 添加商户
  businessList: smartcardIp + 'business/list',// 分页查询商户列表
  editBusiness:smartcardIp +'business/update',//修改商户
  delBusiness:smartcardIp +'business/delete/',//删除商户
  // 商户管理-商户分类
  businesstypeList:smartcardIp +'businesstype/list',//分页查询商户分类列表
  addBusinesstype:smartcardIp +'businesstype/add',//添加商户分类类型
  editBusinesstype:smartcardIp +'businesstype/update/',//修改商户分类类型
  delBusinesstype:smartcardIp +'businesstype/delete/',//删除商户分类类型
  // 终端管理-终端设备列表
  airportDeviceList:smartcardIp +'airportDevice/list',//分页查询设备列表
  addAirportDevice:smartcardIp +'airportDevice/add',//添加设备信息
  delAirportDevice:smartcardIp +'airportDevice/delete/',//删除设备信息
  editAirportDevice:smartcardIp +'airportDevice/edit/',//修改设备信息
  /**
   *  产品中心API
   */
  //商品管理-商品列表
  goodsList:smartcardIp +'goods/list',//分页查询商品列表
}

export default API
