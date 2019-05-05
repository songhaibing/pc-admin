import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'

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
 const accessedRouters=asyncRouterMap.filter(route=>{
   if(route.component){
     if(route.component === 'Layout'){
       route.component=Layout
     }else{
       let componentPath=`${route.component}`
       route.component=(resolve)=>require(["@/views/"+componentPath+".vue"],resolve)
     }
   }
   if(route.children){
     route.children=filterAsyncRouter(route.children)
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
        let router=JSON.parse(localStorage.getItem('router'))
        accessedRoutes = filterAsyncRouter([{
          path: '/management',
          component: 'Layout',
          redirect: '/management/authority/user',
          alwaysShow: true,
          name: 'company',
          meta: { title: '系统管理', icon: 'example' },
          children: [
            {
              path: 'authority',
              name: 'Authority',
              component:'management/index',
              meta: { title: '权限管理', icon: 'table' },
              children:[
                {
                  path: 'user',
                  name: 'User',
                  component: 'management/authority/user',
                  meta: { title: '用户管理', icon: 'table' },
                },
                {
                  path: 'department',
                  name: 'Department',
                  component: 'management/authority/department',
                  meta: { title: '部门管理', icon: 'table' },
                },
                {
                  path: 'role',
                  name: 'Role',
                  component: 'management/authority/role',
                  meta: { title: '角色管理', icon: 'table' },
                },
                {
                  path: 'jurisdiction',
                  name: 'Jurisdiction',
                  component: 'management/authority/jurisdiction',
                  meta: { title: '权限管理', icon: 'table' },
                }
              ]
            },
            {
              path: 'Settings',
              name: 'Settings',
              meta: { title: '共用设置', icon: 'tree' },
              children:[
                {
                  path: 'homepage',
                  name: 'Homepage',
                  component: 'management/Settings/homepage',
                  meta: { title: '主页设置', icon: 'table' },
                },
                {
                  path: 'parameter',
                  name: 'Parameter',
                  component: 'management/Settings/parameter',
                  meta: { title: '参数设置', icon: 'table' },
                },
              ]
            },
            {
              path: 'SystemQuery',
              name: 'SystemQuery',
              component: 'management/SystemQuery/SystemQuery',
              meta: { title: '系统日志', icon: 'tree' }
            }
          ]
        }
        ])
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
