import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import StrartedView from '../views/StartedView.vue'
import { useAuthStore } from '../stores/auth';

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
    // Jika memerlukan tidak autentikasi dan pengguna sudah login, redirect ke halaman home
    next("/");
  } else {
    // Jika tidak memerlukan autentikasi atau pengguna sudah login, lanjutkan ke halaman yang diminta
    next();
  }
});

export default router
