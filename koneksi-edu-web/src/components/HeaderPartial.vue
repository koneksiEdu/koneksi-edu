<template>
  <header class="fixed top-0 w-full bg-white shadow-md z-50">
    <div class="container mx-auto p-4 flex justify-between items-center">
      <div class="flex items-center">
        <img src="../assets/logoipsum-325.svg" alt="Logo" class="w-32">
      </div>
      <div class="hidden md:flex items-center space-x-4">
        <!-- Search Bar -->
        <!-- <input
          type="text"
          placeholder="Search"
          class="bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:bg-white focus:border-gray-500"
        /> -->
        <!-- Desktop Nav -->
        <nav class="space-x-4">
          <!-- <a href="#" class="text-gray-700 hover:text-gray-900">Home</a>
          <a href="#" class="text-gray-700 hover:text-gray-900">About</a>
          <a href="#" class="text-gray-700 hover:text-gray-900">Contact</a> -->
        </nav>
      </div>
      <div class="flex items-center space-x-4">
        <!-- Menu Toggle Button -->
        <button @click="toggleMenu" class="text-gray-700 focus:outline-none md:hidden">
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg v-if="isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <button v-if="isLogin" @click="logout" class="hidden md:block block bg-blue-700 text-white p-2 hover:bg-blue-800 transition-colors duration-200 rounded font-semibold">Logout</button>
        <button v-else class="hidden md:block block bg-blue-500 text-white p-2 hover:bg-blue-600 transition-colors duration-200 rounded font-semibold"><router-link to="/login">Login</router-link></button>
        <router-link v-if="imgHasAvatar" to="/login"><img :src="imgUrl" alt="User" class="h-10 animate__animated animate__fadeIn rounded-full"></router-link>
        <router-link v-else to="/signup"><img src="../assets/user.svg" alt="User" class="h-10 rounded-full animate__animated animate__fadeIn"></router-link>
      </div>
    </div>
    <!-- Mobile Menu -->
    <transition name="slide-fade">
      <div v-if="isMenuOpen" class="md:hidden">
        <div class="mt-3 px-2">
          <!-- <input
            type="text"
            placeholder="Search"
            class="block w-full bg-gray-100 border border-gray-300 rounded-md py-2 pl-3 pr-3 focus:outline-none focus:bg-white focus:border-gray-500 mb-3"
          /> -->
        </div>
        <nav class="bg-white ">
          <!-- <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">Home</a>
          <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">About</a>
          <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">Contact</a> -->
          <!-- Search bar for mobile -->
          <div class="my-3 px-2">
            <button v-if="isLogin" @click="logout" class="w-full block bg-blue-700 text-white p-2 hover:bg-blue-800 transition-colors duration-200 rounded font-semibold">Logout</button>
            <button v-else class="w-full block bg-blue-500 text-white p-2 hover:bg-blue-600 transition-colors duration-200 rounded font-semibold"><router-link to="/login">Login</router-link></button>
          </div>
        </nav>
      </div>
    </transition>
  </header>
</template>
  
<script>
import { ref, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/stores';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabaseClient';

export default {
  setup() {
    const isMenuOpen = ref(false);
    const isLogin = ref(false);
    const authStore = useAuthStore();
    const router = useRouter();
    const imgUrl = ref("");
    const imgHasAvatar = ref(false);
    const uid = ref("");

    const fetchProfile = async (id) => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        if (profileError) {
          throw profileError;
        }
        if (profile.avatar_url) {
          imgUrl.value = `https://lkyubyoimdryxsrpsbli.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`;
          imgHasAvatar.value = true;
        } else {
          imgHasAvatar.value = false;
        }
      } catch (fetchError) {
        imgUrl.value = "";
        imgHasAvatar.value = false;
      }
    };

    watch(() => authStore.currentUser, (newVal) => {
      isLogin.value = !!newVal;
      uid.value = newVal ? newVal.id : null;
      if (uid.value) {
        fetchProfile(uid.value);
      }
    }, { immediate: true });

    onMounted(async () => {
      await authStore.fetchUser();
    });

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const logout = async () => {
      await authStore.logout();
      router.push("/login");
    };

    return {
      isMenuOpen,
      toggleMenu,
      logout,
      isLogin,
      imgHasAvatar,
      imgUrl
    };
  },
};
</script>
