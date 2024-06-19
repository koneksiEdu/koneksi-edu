<template>
  <div class="flex flex-col md:flex-row md:w-64">
    <nav class="flex opacity-75 flex-col w-full md:w-64 md:fixed md:h-full bg-gradient-to-t from-blue-800 to-blue-500 text-white">
      <div class="flex justify-between p-4 md:hidden">
        <span class="text-lg font-bold">Menu</span>
        <button @click="toggleMenu" class="focus:outline-none">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <div :class="['md:flex flex-col md:relative', { 'hidden': !isMenuOpen, 'animate__animated animate__fadeIn': isMenuOpen }]">
        <div class="flex flex-col mt-2">
          <RouterLink v-for="item in items" :key="item.name" class="font-bold p-4 hover:bg-blue-700 hover:rounded-md hover:mx-2" :to="item.link">
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    const imgUrl = ref("");
    const items = [
      { name: "DATA DIRI & TAUTAN", link: "/dashboard" },
      { name: "WIDGET", link: "#" },
      { name: "TAMPILAN", link: "#" },
      { name: "APLIKASI", link: "/dashboard/service" },
      { name: "PERAN", link: "#" },
      { name: "KELUAR", link: "/" }
    ];
    const name = ref("")
    const isMenuOpen = ref(false);

    const profileUser = async (id) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      imgUrl.value = data.avatar_url;
      name.value = data.username.slice(0,2).toUpperCase();
    };

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    watch(() => authStore.currentUser, (newVal) => {
      if (newVal) {
        profileUser(newVal.id);
      }
    }, { immediate: true });

    return {
      items,
      imgUrl,
      name,
      isMenuOpen,
      toggleMenu,
    };
  },
}
</script>

<style scoped>
/* Tambahkan style khusus jika diperlukan */
</style>
