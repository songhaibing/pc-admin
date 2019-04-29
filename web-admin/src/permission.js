import router from './router'
import store from './store'
import Layout from '@/layout'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import axios from 'axios'
const _import = require('./router/_import_' + process.env.NODE_ENV)
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
var getRouter;
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  if(!getObjArr('router')){
    getRouter=''
  }
  if (!getRouter) {
    if (!getObjArr('router')) {
      axios.get('http://106.75.178.9:8080/admin/menu/tree/current').then(res => {
        console.log(res.data.data)
        console.log(res)
        getRouter = res.data.data
        saveObjArr('router', getRouter)
        routerGo(to, next)
      })
    } else {
      getRouter = getObjArr('router')
      routerGo(to, next)
    }
  } else {
    next()
  }

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})
function saveObjArr(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

function getObjArr(name) {
  return JSON.parse(window.localStorage.getItem(name))
}
function routerGo(to, next) {
  getRouter = filterAsyncRouter(getObjArr('router'))
  const unFound = { path: '*', redirect: '/404', hidden: true}//404页面最后添加
  getRouter.push(unFound)
  router.addRoutes(getRouter)
  global.antRouter = getRouter
  next({ ...to, replace: true })
}
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
