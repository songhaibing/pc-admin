import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
import HTTP from '@/libs/httpRequest'
import API from '@/libs/api'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        const componentPath = `${route.component}`
        route.component = (resolve) => require(['@/views/' + componentPath + '.vue'], resolve)
      }
    }
    if (route.children) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = filterAsyncRouter(filterMenu(JSON.parse(localStorage.getItem('router'))))
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }
    })
  }
}

function filterMenu(menu) {
  return menu.filter(data => data.type === '1').map(data => {
    data.children = filterMenu(data.children)
    return data
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
