<template>
    <div class="flex flex-col md:flex-row min-h-screen">
      <NavPartial />
      <div class="flex flex-col flex-grow p-4">
        <header class="flex justify-end p-4 md:hidden">
          <a href="#" class="hover:bg-gray-700 p-2 rounded-full text-white">
            Profile
          </a>
        </header>
        <main class="flex-grow">
          <!-- Konten Utama Dashboard -->
          <h1 class="text-2xl">Dashboard</h1>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import NavPartial from '@/components/NavPartial.vue';
  
  export default {
    components: {
      NavPartial
    }
  }
  </script>
  
  <style scoped>
  /* Tambahkan style khusus jika diperlukan */
  </style>
  