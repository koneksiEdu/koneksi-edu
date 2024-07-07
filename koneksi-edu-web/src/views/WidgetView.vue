<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-white to-sky-100">
    <NavPartial/>
    <div class="flex flex-col flex-grow p-4 md:mx-3">
      <main class="w-full">
        <h1 class="font-bold text-2xl py-1 ml-2 px-2 text-blue-800">Widget</h1>
        <div class="border-2 border-gray-200 mt-1 rounded-lg p-4 bg-blue-400 w-full shadow-brutal-blue md:max-w-3xl">
          <p class="text-white">
            Halaman widget hanya bisa diakses oleh user premium
          </p>
        </div>
        <div class="flex justify-center items-center mt-6">
          <div class="bg-gradient-to-t from-blue-800 to-blue-500 border-2 border-gray-300 text-white p-8 rounded-lg w-90">
            <h2 class="text-2xl text-center mb-4 font-bold">Tetapkan Lokasi</h2>
            <SelectLoc @location-selected="handleLocationSelected"></SelectLoc>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import NavPartial from '@/components/NavPartial.vue';
import SelectLoc from '@/components/WidgetView/SelectLocation.vue';

const handleLocationSelected = (location) => {
  // Handle location selected logic here
};
</script>