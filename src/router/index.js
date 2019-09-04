// 导包
import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueRouter)
// 导入组件
import login from '../view/login'
import home from '../view/home'
import acticle from '../view/home/acticle'
import publich from '../view/home/publich'

const routes = [
  { path: '/login', component: login },
  { path:'/', redirect: '/login'},
  { path: '/home', component: home,
  children:[
    { path:'/acticle', component: acticle },
    { path:'/publich', component: publich }
  ] }
]


// 创建路由对象
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
// 设置全局守卫
router.beforeEach((to, from, next) => {
  // to:到哪去
  // from:从哪来
  // next:通行
  // 只要不是到login页面,都需要判断是否符合
  // console.log(to);
  NProgress.start();
  next();
  // if (to.path != '/login') {
  //   let userInfo = window.sessionStorage.getItem('user_info');
  //   // 判断本地中user_info是否为空
  //   if (userInfo) {
  //     // 阻止跳转
  //     next();
  //   }else{
  //     next('/login');
  //   }
  // }else{
  //   next();
  // }
})

router.afterEach((to,from)=>{
  NProgress.done();
})
// 暴露出去
export default router;