<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-white to-sky-100">
    <NavPartial/>  
    <div class="flex flex-col flex-grow p-4 md:mx-3">
        <main class="w-full">
          <h1 class="font-bold text-2xl py-1 ml-2 px-2 text-blue-800">Jasa & Produk Kami</h1>
          <div class="border-2 border-gray-200 mt-1 rounded-lg p-4 bg-blue-400 w-full shadow-brutal-blue md:max-w-3xl">
            <p class="text-white">
              <span class="font-semibold">Perhatian!</span> Harap konsultasikan terlebih dahulu sebelum melakukan pembayaran layanan kami, terutama jika Anda kurang paham mengenai teknis dari layanan yang ingin ada pesan
            </p>
        </div>
        </main>
      </div>
    </div>
</template>

<script setup>
import NavPartial from '@/components/NavPartial.vue';
</script>