import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'component', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
  // /
  // {
  //   path: '/account',
  //   component: Layout,
  //   redirect: '/account/unit/list',
  //   alwaysShow: true,
  //   name: 'account',
  //   meta: { title: '账户中心', icon: 'example' },
  //   children: [
  //     {
  //       path: 'unit',
  //       name: 'Unit',
  //       component: () => import('@/views/account/unit/index'),
  //       meta: {title: '单位管理', icon: 'shop'},
  //       children: [
  //         {
  //           path: 'list',
  //           name: 'List',
  //           component: () => import('@/views/account/unit/list'),
  //           meta: {title: '单位列表', icon: 'table'}
  //         },
  //         {
  //           path: 'type',
  //           name: 'Type',
  //           component:  () => import('@/views/account/unit/type'),
  //           meta: {title: '单位类型', icon: 'table'}
  //         },
  //         {
  //           path: 'entering',
  //           name: 'Entering',
  //           component:() =>import('@/views/account/unit/entering'),
  //           meta: {title: '单位入驻', icon: 'table'}
  //         },
  //         {
  //           path: 'expiring',
  //           name: 'Expiring',
  //           component:() => import('@/views/account/unit/expiring'),
  //           meta: {title: '即将到期单位', icon: 'table'}
  //         },
  //         {
  //           path: 'expired',
  //           name: 'expired',
  //           component:() => import('@/views/account/unit/expired'),
  //           meta: {title: '已到期单位', icon: 'table'}
  //         }
  //       ]
  //     },
  //     {
  //       path: 'merchant',
  //       name: 'merchant',
  //       component: () => import('@/views/account/merchant/index'),
  //       meta: {title: '商户管理', icon: 'table'},
  //       children: [
  //         {
  //           path: 'list',
  //           name: 'List',
  //           component: () => import('@/views/account/merchant/list'),
  //           meta: {title: '商户列表', icon: 'table'}
  //         },
  //         {
  //           path: 'type',
  //           name: 'Type',
  //           component:  () => import('@/views/account/merchant/type'),
  //           meta: {title: '商户分类', icon: 'table'}
  //         }
  //       ]
  //     },
  //     {
  //       path: 'user',
  //       name: 'user',
  //       component: () => import('@/views/account/user/index'),
  //       meta: {title: '用户管理', icon: 'table'},
  //       children: [
  //         {
  //           path: 'list',
  //           name: 'list',
  //           component: () => import('@/views/account/user/list'),
  //           meta: {title: '用户列表', icon: 'table'}
  //         },
  //         {
  //           path: 'wallet',
  //           name: 'wallet',
  //           component:  () => import('@/views/account/user/wallet'),
  //           meta: {title: '钱包管理', icon: 'table'}
  //         },
  //         {
  //           path: 'blacklist',
  //           name: 'blacklist',
  //           component:  () => import('@/views/account/user/blacklist'),
  //           meta: {title: '黑名单', icon: 'table'}
  //         }
  //       ]
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       component: () => import('@/views/account/role/index'),
  //       meta: {title: '角色管理', icon: 'table'},
  //       children: [
  //         {
  //           path: 'setting',
  //           name: 'setting',
  //           component: () => import('@/views/account/role/setting/index'),
  //           meta: {title: '角色设置', icon: 'table'},
  //           children: [
  //             {
  //               path: 'super',
  //               name: 'super',
  //               component: () => import('@/views/account/role/setting/super'),
  //               meta: {title: '超级管理员', icon: 'table'}
  //             },
  //             {
  //               path: 'administrator',
  //               name: 'administrator',
  //               component: () => import('@/views/account/role/setting/administrator'),
  //               meta: {title: '管理员', icon: 'table'},
  //             }
  //           ]
  //         },
  //         {
  //           path: 'list',
  //           name: 'List',
  //           component: () => import('@/views/account/role/list'),
  //           meta: {title: '管理员列表', icon: 'table'},
  //
  //         },
  //         {
  //           path: 'permission',
  //           name: 'permission',
  //           component: () => import('@/views/account/role/permission'),
  //           meta: {title: '权限分配', icon: 'table'},
  //         },
  //       ]
  //     },
  //     {
  //       path: 'terminal',
  //       name: 'terminal',
  //       component: () => import('@/views/account/terminal/index'),
  //       meta: {title: '终端管理', icon: 'table'},
  //       children: [
  //         {
  //           path: 'list',
  //           name: 'List',
  //           component: () => import('@/views/account/terminal/list/index'),
  //           meta: {title: '终端设备列表', icon: 'table'},
  //           children: [
  //             {
  //               path: 'system',
  //               name: 'system',
  //               component: () => import('@/views/account/terminal/list/system'),
  //               meta: {title: '系统', icon: 'table'}
  //             },
  //             {
  //               path: 'unit',
  //               name: 'unit',
  //               component: () => import('@/views/account/terminal/list/unit'),
  //               meta: {title: '单位', icon: 'table'},
  //             }
  //           ]
  //         },
  //         {
  //           path: 'setting',
  //           name: 'setting',
  //           component: () => import('@/views/account/terminal/setting'),
  //           meta: {title: '报修设置', icon: 'table'},
  //         },
  //         {
  //           path: 'unused',
  //           name: 'unused',
  //           component: () => import('@/views/account/terminal/unused'),
  //           meta: {title: '未使用设备', icon: 'table'},
  //         },
  //         {
  //           path: 'scrapped',
  //           name: 'scrapped',
  //           component: () => import('@/views/account/terminal/scrapped'),
  //           meta: {title: '报废设置', icon: 'table'},
  //         },
  //       ]
  //     },
  //     ]
  // },
  // {
  //   path: '/product',
  //   component: Layout,
  //   redirect: '/product/commodity/commodity-list',
  //   alwaysShow: true,
  //   name: 'product',
  //   meta: { title: '产品中心', icon: 'edit' },
  //   children: [
  //     {
  //       path: 'commodity-management',
  //       name: 'commodity-management',
  //       component: () => import('@/views/product/commodity/index'),
  //       meta: {title: '商品管理', icon: 'table'},
  //       children: [
  //         {
  //           path: 'commodity-list',
  //           name: 'commodity-list',
  //           component: () => import('@/views/product/commodity/commodity-list'),
  //           meta: {title: '商品列表', icon: 'table'}
  //         },
  //         {
  //           path: 'commodity-type',
  //           name: 'commodity-type',
  //           component:  () => import('@/views/product/commodity/commodity-type'),
  //           meta: {title: '商品分类', icon: 'table'}
  //         },
  //       ]
  //     },
  //     {
  //       path: 'data-analysis',
  //       name: 'data-analysis',
  //       component: () => import('@/views/product/analysis/data-analysis'),
  //       meta: {title: '数据分析', icon: 'table'},
  //     },
  //   ]
  // },
  // {
  //   path: '/transaction',
  //   component: Layout,
  //   redirect: '/transaction/management/transaction-order',
  //   alwaysShow: true,
  //   name: 'transaction',
  //   meta: { title: '交易中心', icon: 'international' },
  //   children: [
  //     {
  //       path: 'management',
  //       name: 'management',
  //       component: () => import('@/views/transaction/management/index'),
  //       meta: {title: '交易管理', icon: ''},
  //       children: [
  //         {
  //           path: 'transaction-order',
  //           name: 'transaction-order',
  //           component: () => import('@/views/transaction/management/transaction-order'),
  //           meta: {title: '交易订单', icon: ''}
  //         },
  //         {
  //           path: 'refund-order',
  //           name: 'refund-order',
  //           component:  () => import('@/views/transaction/management/refund-order'),
  //           meta: {title: '退款订单', icon: ''}
  //         },
  //       ]
  //     },
  //     {
  //       path: 'money',
  //       name: 'money',
  //       alwaysShow: true,
  //       component: () => import('@/views/transaction/money/index'),
  //       meta: {title: '资金管理', icon: ''},
  //       children: [
  //         {
  //           path: 'recharge-record',
  //           name: 'recharge-record',
  //           component: () => import('@/views/transaction/money/recharge-record'),
  //           meta: {title: '充值记录', icon: ''}
  //         }
  //       ]
  //     },
  //     {
  //       path: 'bill',
  //       name: 'bill',
  //       component: () => import('@/views/transaction/bill/index'),
  //       meta: {title: '账单管理', icon: ''},
  //       children: [
  //         {
  //           path: 'transaction-bill',
  //           name: 'transaction-bill',
  //           component: () => import('@/views/transaction/bill/transaction-bill'),
  //           meta: {title: '交易账单', icon: ''}
  //         },
  //         {
  //           path: 'fund-bill',
  //           name: 'fund-bill',
  //           component:  () => import('@/views/transaction/bill/fund-bill'),
  //           meta: {title: '资金账单', icon: ''}
  //         },
  //       ]
  //     },
  //   ]
  // },
  // {
  //   path: '/data',
  //   component: Layout,
  //   redirect: '/data/unit/single-analysis',
  //   alwaysShow: true,
  //   name: 'data',
  //   meta: { title: '数据中心', icon: 'chart' },
  //   children: [
  //     {
  //       path: 'unit',
  //       name: 'unit',
  //       component: () => import('@/views/data/unit/index'),
  //       meta: {title: '单位分析', icon: ''},
  //       children: [
  //         {
  //           path: 'single-analysis',
  //           name: 'single-analysis',
  //           component: () => import('@/views/data/unit/single-analysis'),
  //           meta: {title: '单个分析', icon: ''}
  //         },
  //         {
  //           path: 'industry-analysis',
  //           name: 'industry-analysis',
  //           component:  () => import('@/views/data/unit/industry-analysis'),
  //           meta: {title: '行业分析', icon: ''}
  //         },
  //         {
  //           path: 'transaction-analysis',
  //           name: 'transaction-analysis',
  //           component:  () => import('@/views/data/unit/transaction-analysis'),
  //           meta: {title: '交易分析', icon: ''}
  //         },
  //         {
  //           path: 'flow-analysis',
  //           name: 'flow-analysis',
  //           component:  () => import('@/views/data/unit/flow-analysis'),
  //           meta: {title: '流水分析', icon: ''}
  //         },
  //       ]
  //     },
  //     {
  //       path: 'merchant-analysis',
  //       name: 'merchant-analysis',
  //       component: () => import('@/views/data/merchant-analysis'),
  //       meta: {title: '商户分析', icon: ''},
  //     },
  //     {
  //       path: 'user-analysis',
  //       name: 'user-analysis',
  //       component: () => import('@/views/data/user-analysis'),
  //       meta: {title: '用户分析', icon: ''},
  //     },
  //     {
  //       path: 'transaction-analysis',
  //       name: 'transaction-analysis',
  //       component: () => import('@/views/data/transaction-analysis'),
  //       meta: {title: '交易分析', icon: ''},
  //     },
  //   ]
  //
  // },
  // {
  //   path: '/setting',
  //   component: Layout,
  //   redirect: '/setting/system-settings/menu-management',
  //   alwaysShow: true,
  //   name: 'setting',
  //   meta: { title: '设置', icon: 'cog' },
  //   children: [
  //     {
  //       path: 'system-settings',
  //       name: 'system-settings',
  //       component: () => import('@/views/setting/system/index'),
  //       meta: {title: '系统设置', icon: ''},
  //       children: [
  //         {
  //           path: 'subsystem-name',
  //           name: 'subsystem-name',
  //           component: () => import('@/views/setting/system/subsystem-name'),
  //           meta: {title: '子系统后台名称', icon: ''}
  //         },
  //         {
  //           path: 'subsystem-logo',
  //           name: 'subsystem-logo',
  //           component:  () => import('@/views/setting/system/subsystem-logo'),
  //           meta: {title: '子系统后台logo', icon: ''}
  //         },
  //         {
  //           path: 'theme-color',
  //           name: 'theme-color',
  //           component:  () => import('@/views/setting/system/theme-color'),
  //           meta: {title: '主题色', icon: ''}
  //         },
  //         {
  //           path: 'domain-configuration',
  //           name: 'domain-configuration',
  //           component:  () => import('@/views/setting/system/domain-configuration'),
  //           meta: {title: '域名配置', icon: ''}
  //         },
  //         {
  //           path: 'cache-cleanup',
  //           name: 'cache-cleanup',
  //           component:  () => import('@/views/setting/system/cache-cleanup'),
  //           meta: {title: '缓存清理', icon: ''}
  //         },
  //       ]
  //     },
  //     {
  //       path: 'public',
  //       name: 'public',
  //       component: () => import('@/views/setting/public/index'),
  //       meta: {title: '公众号设置', icon: ''},
  //       children: [
  //         {
  //           path: 'menu-settings',
  //           name: 'menu-settings',
  //           component: () => import('@/views/setting/public/menu-settings'),
  //           meta: {title: '菜单设置', icon: ''}
  //         },
  //         {
  //           path: 'focus-settings',
  //           name: 'focus-settings',
  //           component:  () => import('@/views/setting/public/focus-settings'),
  //           meta: {title: '关注自动回复设置', icon: ''}
  //         },
  //         {
  //           path: 'message-push',
  //           name: 'message-push',
  //           component:  () => import('@/views/setting/public/message-push'),
  //           meta: {title: '消息推送', icon: ''}
  //         },
  //       ]
  //     },
  //     {
  //       path: 'pay',
  //       name: 'pay',
  //       component: () => import('@/views/setting/pay/index'),
  //       meta: {title: '支付设置', icon: ''},
  //       children: [
  //         {
  //           path: 'weChat-pay',
  //           name: 'weChat-pay',
  //           component: () => import('@/views/setting/pay/weChat-payment'),
  //           meta: {title: '微信支付设置', icon: ''}
  //         },
  //         {
  //           path: 'alipay-pay',
  //           name: 'alipay-pay',
  //           component:  () => import('@/views/setting/pay/alipay-pay'),
  //           meta: {title: '支付宝支付设置', icon: ''}
  //         },
  //         {
  //           path: 'unionPay-pay',
  //           name: 'unionPay-pay',
  //           component:  () => import('@/views/setting/pay/unionPay-pay'),
  //           meta: {title: '银联支付设置', icon: ''}
  //         }
  //       ]
  //     },
  //   ]
  // },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
