import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
        path: '/redirect/:path(.*)',
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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/mypage/zhuye'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },

  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // 调试自己接口
  // tableRouter,
  // 新增页面测试
  // {
  //   path: '/test',
  //   component: Layout,
  //   redirect: '/test/test01',
  //   name: 'Test',
  //   alwaysShow: true,
  //   meta: { title: '系统管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'test01',
  //       name: 'Test01',
  //       component: () => import('@/views/test01/index'),
  //       meta: { title: '账号管理', icon: 'example' }
  //     }
  //   ]
  // },
  // {
  //   path: '/mytable',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'myTable',
  //       component: () => import('@/views/table/complex-table'),
  //       meta: { title: '数据整编', icon: 'table' }
  //     }
  //   ]
  // },
  {
    path: '/mypage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'myMage1',
        component: () => import('@/views/mypage/index'),
        meta: { title: '创建文本任务', icon: 'form' }
      }
    ]
  },
  {
    path: '/mypage4',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'myMage4',
        component: () => import('@/views/mypage/photo'),
        meta: { title: '创建图像任务', icon: 'form' }
      }
    ]
  },
  {
    path: '/mypage3',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'myMage3',
        component: () => import('@/views/mypage/video'),
        meta: { title: '创建视频任务', icon: 'form' }
      }
    ]
  },
  {
    path: '/mypage2',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'myMage2',
        component: () => import('@/views/mypage/nowmession'),
        meta: { title: '当前爬虫任务', icon: 'form' }
      }
    ]
  },
  // {
  //   path: '/mypage4',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'myMage4',
  //       component: () => import('@/views/mypage/video_mession'),
  //       meta: { title: '当前视频任务', icon: 'form' }
  //     }
  //   ]
  // },
  // {
  //   path: '/table',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'mytable/index',
  //       name: 'myTable1',
  //       component: () => import('@/views/table/mytable/index'),
  //       meta: { title: '我的表格', icon: 'table' }
  //     }
  //   ]
  // },
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
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   // alwaysShow: true, // will always show the root menu
  //   // name: 'Permission',
  //   // meta: {
  //   //   title: '权限管理',
  //   //   icon: 'lock',
  //   //   roles: ['admin', 'editor'] // you can set roles in root nav
  //   // },
  //   children: [
  //     {
  //       path: 'role',
  //       name: 'RolePermission',
  //       component: () => import('@/views/permission/role'),
  //       meta: { title: '角色管理', roles: ['admin'], icon: 'lock' }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

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
