<template>
    <div class="flex flex-col md:flex-row md:w-64">
      <nav class="flex flex-col w-full md:w-64 md:fixed md:h-full bg-gray-800 text-white">
        <div class="flex flex-row md:flex-col">
          <a v-for="item in navItems" :key="item.name" class="p-4 hover:bg-gray-700" href="#">
            {{ item.name }}
          </a>
        </div>
        <div class="mt-auto p-4">
          <a href="#" class="hover:bg-gray-700 p-2 rounded-full">
            Profile
          </a>
        </div>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        navItems: [
          { name: '1' },
          { name: '2' },
          { name: '3' }
        ]
      };
    }
  }
  </script>
  
  <style scoped>
  /* Tambahkan style khusus jika diperlukan */
  </style>
  