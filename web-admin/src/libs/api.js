'use strict'
const adminIp = 'http://106.75.178.9:80/admin/'
const logoutIp = 'http://106.75.178.9:80/'
const smartcardIp = 'http://106.75.178.9:80/smartcard/'
const API = {
  //首页
  findByBusiness: smartcardIp + 'serialPay/findByBusiness/',// 通过商户查询流水信息
  orderPayBusiness: smartcardIp + 'orderPay/findByBusiness/',//通过支付单ID查询订单信息
  // 退出登陆
  logout: logoutIp + 'token/logout',
  // 用户管理
  menu: adminIp + 'menu/tree/current', // 获取当前用户菜单
  userList: adminIp + 'usercontact/list', // 获取用户列表
  userExits: adminIp + 'usercontact/exits/', // 检测用户名是否存在
  addUser: adminIp + 'usercontact/add', // 添加用户
  deleteUser: adminIp + 'usercontact/delete/', // 删除用户
  editUser: adminIp + 'usercontact/edit/', // 编辑用户
  getCurrentTree: adminIp + 'dept/tree/current', // '获取用户当前部门的树状结构数据'
  userInfocontact: adminIp + 'usercontact/infocontact', // 获取当前用户信息
  addCard:smartcardIp+'smartCard/addOrUpdate',//一卡通
  // 部门管理
  deleteDept: adminIp + 'dept/delete/', // 通过ID删除部门
  addDept: adminIp + 'dept/add', // 添加部门数据
  editDept: adminIp + 'dept/edit/', // 修改部门信息
  // 角色管理
  editAvatar: adminIp + 'usercontact/edit/', // 用户头像修改
  deptTree: adminIp + 'dept/tree', // 获取树状部门结构数据
  findDept: adminIp + 'role/find/dept/', // 查询部门下全部的角色
  addRoleMsg: adminIp + 'role/addrole', // 创建角色角色
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
  getAllMenu: adminIp + 'menu/tree', // 获取所有的树状菜单
  addMenu: adminIp + 'menu/add', // 添加系统菜单
  deleteMenu: adminIp + 'menu/delete/', // 删除系统菜单
  editMenu: adminIp + 'menu/edit/', // 修改系统菜单

  /**
   *  账户中心API
   */
  // 单位管理-单位列表
  unitList: adminIp + 'dept/list', // 分页查询单位列表
  addUnit: adminIp + 'dept/add', // 添加单位
  delUnit: adminIp + 'dept/delete/', // 通过ID删除单位
  editUnit: adminIp + 'dept/edit/', // 通过ID删除单位
  // 商户管理-商户列表
  addBusiness: smartcardIp + 'business/add', // 添加商户
  businessList: smartcardIp + 'business/list', // 分页查询商户列表
  editBusiness: smartcardIp + 'business/update/', // 修改商户
  delBusiness: smartcardIp + 'business/delete/', // 删除商户
  // 商户管理-商户分类
  businesstypeList: smartcardIp + 'businesstype/tree', // 分页查询商户分类列表
  businessAllTree: smartcardIp + 'businesstype/allTree', // 查询商户所有分类
  addBusinesstype: smartcardIp + 'businesstype/add', // 添加商户分类类型
  editBusinesstype: smartcardIp + 'businesstype/update/', // 修改商户分类类型
  delBusinesstype: smartcardIp + 'businesstype/delete/', // 删除商户分类类型
  // 角色管理-管理员列表
  roleList: adminIp + 'role/list', // 分页查询管理员列表
  registryRecordList: smartcardIp + 'registryRecord/list', // 分页查询登录记录列表
  // 用户管理-用户列表
  exportTemplate: smartcardIp + 'smartCard/exportInfo', // 导出一个用户表格文档模板
  roleFindDept: adminIp + 'role/find/dept/', // 查询部门下全部的角色
  /**
   *  产品中心API
   */
  // 商品管理-商品列表
  goodsList: smartcardIp + 'goods/list', // 分页查询商品列表
  addGoods: smartcardIp + 'goods/add', // 添加一个商品
  delGoods: smartcardIp + 'goods/delete/', // 删除商品
  editGoods: smartcardIp + 'goods/update/', // 修改商品
  delMoreGoods: smartcardIp + 'goods/delete?', // 删除多个商品
  // 商品管理-商品分类
  goodsAllTree: smartcardIp + 'goodstype/allTree', // 查询商品所有分类
  goodstypeList: smartcardIp + 'goodstype/tree', // 分页查询商品分类列表
  addGoodstype: smartcardIp + 'goodstype/add', // 添加商品分类类型
  editGoodstype: smartcardIp + 'goodstype/update/', // 修改商品分类类型
  delGoodstype: smartcardIp + 'goodstype/delete/', // 删除商品分类类型
  // 终端管理-终端设备列表
  airportDeviceList: smartcardIp + 'airportDevice/list', // 分页查询设备列表
  addAirportDevice: smartcardIp + 'airportDevice/add', // 添加设备信息
  delAirportDevice: smartcardIp + 'airportDevice/delete/', // 删除设备信息
  editAirportDevice: smartcardIp + 'airportDevice/edit/', // 修改设备信息
  businessAll: smartcardIp + 'business/all', // 查询所有商户列表
  /**
   *  交易中心API
   */
  // 交易管理-交易订单
  orderPayList: smartcardIp + 'orderPay/list', // 分页查询订单列表
  orderPayPage: smartcardIp + 'orderPay/page', // 根据状态分页查询订单列表
  // 资金管理-钱包管理
  walletList: smartcardIp + 'wallet/list', // 分页查询钱包列表
  editWallet: smartcardIp + 'wallet/edit/', // 修改钱包信息
  delWallet: smartcardIp + 'wallet/delete/', // 修改钱包信息
  // 资金管理-钱包分类
  purseTypeList: smartcardIp + 'purseType/list', // 分页查询钱包类型列表
  purseTypeAll: smartcardIp + 'purseType/all', // 查询所有钱包类型列表
  addPurseType: smartcardIp + 'purseType/add', // 创建钱包类型
  editPurseType: smartcardIp + 'purseType/edit/', // 修改钱包类型信息
  delPurseType: smartcardIp + 'purseType/delete/', // 通过ID删除钱包类型
  // 资金管理-补助发放
  exportSubsidyTemplate: smartcardIp + 'subsidy/exportTemplate', // 导出一个补贴用户模板
  subsidyPage: smartcardIp + 'subsidy/page', // 分页查询未发放补助列表
  subsidyList: smartcardIp + 'subsidy/list', // 分页查询已发放补助列表
  subsidyEdit: smartcardIp + 'subsidy/edit/', // 撤回补助
  subsidySend: smartcardIp + 'subsidy/send/', // 补助分发
  subsidyExport: smartcardIp + 'subsidy/export' // 导出一个补助名单
}

export default API
