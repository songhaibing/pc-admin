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
        meta: {title: 'dashboard', icon: 'dashboard', affix: true}
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
        meta: {title: 'profile', icon: 'user', noCache: true}
      }
    ]
  },
  ///
  {
    path: '/account',
    component: Layout,
    redirect: '/account/unit/list',
    alwaysShow: true,
    name: 'account',
    meta: { title: '账户中心', icon: 'example' },
    children: [
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '单位管理', icon: 'table'},
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/account/unit/list'),
            meta: {title: '单位列表', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '单位类型', icon: 'table'}
          },
          {
            path: 'entering',
            name: 'Entering',
            component: import('@/views/account/unit/entering'),
            meta: {title: '单位入驻', icon: 'table'}
          },
          {
            path: 'expiring',
            name: 'Expiring',
            component: import('@/views/account/unit/expiring'),
            meta: {title: '即将到期单位', icon: 'table'}
          },
          {
            path: 'expired',
            name: 'expired',
            component: import('@/views/account/unit/expired'),
            meta: {title: '已到期单位', icon: 'table'}
          }
        ]
      }
      ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/authority/user',
    alwaysShow: true,
    name: 'product',
    meta: { title: '产品中心', icon: 'edit' },
    children: [
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '商品管理', icon: 'table'},
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/account/unit/list'),
            meta: {title: '商品列表', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '商品分类', icon: 'table'}
          },
        ]
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '数据分析', icon: 'table'},
      },
    ]
  },
  {
    path: '/transaction',
    component: Layout,
    redirect: '/transaction/authority/user',
    alwaysShow: true,
    name: 'transaction',
    meta: { title: '交易中心', icon: 'example' },
    children: [
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '交易管理', icon: 'table'},
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/account/unit/list'),
            meta: {title: '交易订单', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '退款订单', icon: 'table'}
          },
        ]
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '资金管理', icon: 'table'},
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/account/unit/list'),
            meta: {title: '充值记录', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '退款订单', icon: 'table'}
          },
        ]
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '账单管理', icon: 'table'},
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/account/unit/list'),
            meta: {title: '交易账单', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '资金账单', icon: 'table'}
          },
        ]
      },
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/authority/user',
    alwaysShow: true,
    name: 'data',
    meta: { title: '数据中心', icon: 'example' },
    children: [
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '单位分析', icon: 'table'},
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/account/unit/list'),
            meta: {title: '单个分析', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '行业分析', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '交易分析', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '流水分析', icon: 'table'}
          },
        ]
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '商户分析', icon: 'table'},
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '用户分析', icon: 'table'},
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '交易分析', icon: 'table'},
      },
    ]

  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/authority/user',
    alwaysShow: true,
    name: 'setting',
    meta: { title: '设置', icon: 'example' },
    children: [
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '系统设置', icon: 'table'},
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/account/unit/list'),
            meta: {title: '子系统后台名称', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '子系统后台logo', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '主题色', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '域名配置', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '缓存清理', icon: 'table'}
          },
        ]
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '公众号设置', icon: 'table'},
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/account/unit/list'),
            meta: {title: '菜单设置', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '关注自动回复设置', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '消息推送', icon: 'table'}
          },
        ]
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/account/index'),
        meta: {title: '支付设置', icon: 'table'},
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/account/unit/list'),
            meta: {title: '微信支付设置', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '支付宝支付设置', icon: 'table'}
          },
          {
            path: 'type',
            name: 'Type',
            component:  () => import('@/views/account/unit/type'),
            meta: {title: '银联支付设置', icon: 'table'}
          },
        ]
      },
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
