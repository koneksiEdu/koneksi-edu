import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import StrartedView from '../views/StartedView.vue'
import ResetPassView from '../views/ResetPassView.vue'
import DashboardView from '../views/DashboardView.vue'
import UserPageView from '@/views/UserPageView.vue'
import PieceView from '@/views/PieceView.vue'
import ServiceView from '@/views/ServiceView.vue'
import WidgetView from '@/views/WidgetView.vue'
import KiosView from '@/views/KiosView.vue'
import { useAuthStore } from '../stores/auth';
import {supabase} from '@/lib/supabaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresNoAuth: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { requiresNoAuth: true }
    },
    {
      path: '/start',
      name: 'start',
      component: StrartedView,
    },
    {
      path: '/reset-pass',
      name: 'resetPass',
      component: ResetPassView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/admin/piece',
      name: 'piece',
      component: PieceView,
    },
    {
      path: '/:id',
      name: 'userpage',
      component: UserPageView
    },
    {
      path: '/dashboard/service',
      name: 'service',
      component: ServiceView
    },
    {
      path: '/dashboard/widget',
      name: 'scene',
      component: WidgetView
    },
    {
      path: '/dashboard/kios',
      name: 'kios',
      component: KiosView
    },
  ]
})

// Router Guard
router.beforeEach(async(to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  // Memeriksa apakah halaman yang akan diakses memerlukan autentikasi
  if (to.meta.requiresNoAuth && authStore.user) {
    // Jika memerlukan tidak autentikasi dan pengguna sudah login, redirect ke halaman dashboard
    next("/dashboard");
  } else if (to.meta.requiresAuth && !authStore.user){
    // Jika memerlukan  autentikasi dan tidak login, redirect ke halaman home
    next('/');
  } else if (to.name === "start"){
    // Check jika user profile sudah dibuat
    if(authStore.user){
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authStore.user.id)
        .single()
      if (data.username !== null && authStore.user) {
        next("/dashboard")
      } else {
        next()
      } 
    } else {
      next("/login")
    }
 } else if(to.name === "dashboard") {
    if(authStore.user){
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authStore.user.id)
        .single()
      if (data.username !== null && authStore.user) {
        next()
      } else {
        next("/start")
      } 
    } else {
      next("/login")
    }
 } else if(to.name === "dashboard/service") {
  if(authStore.user){
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authStore.user.id)
      .single()
    if (data.username !== null && authStore.user) {
      next()
    } else {
      next("/start")
    } 
  } else {
    next("/login")
  }
} else if(to.name === "dashboard/widget") {
  if(authStore.user){
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authStore.user.id)
      .single()
    if (data.username !== null && authStore.user) {
      next()
    } else {
      next("/start")
    } 
  } else {
    next("/login")
  }
} else if(to.name === "piece") {
    if(authStore.user){
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authStore.user.id)
        .single()
      if (data.id === 'd5a45578-68ce-42d2-bb2e-59a040d3cbd6' && authStore.user) {
        next()
      } else {
        next("/dashboard")
      }
    } else {
      next("/login")
    }
  } else {
    next()
  }
});

export default router
