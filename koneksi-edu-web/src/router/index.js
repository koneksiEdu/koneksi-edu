import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import StrartedView from '../views/StartedView.vue'
import ResetPassView from '../views/ResetPassView.vue'
import DashboardView from '../views/DashboardView.vue'
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
    }
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
        .select('id')
        .eq('id', authStore.user.id)
        .single()
      if (data !== null && authStore.user) {
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
        .select('id')
        .eq('id', authStore.user.id)
        .single()
      if (data !== null && authStore.user) {
        next()
      } else {
        next("/start")
      } 
    } else {
      next("/login")
    }
 } else {
    next()
  }
});

export default router
