<template>
  <div v-if="carousells.length" class="relative animate__animated animate__fadeIn carousel-container">
    <h1 class="text-2xl font-bold text-center text-blue-700 mb-2">
      Galeri
    </h1>
    <div ref="carousel" class="carousel flex overflow-x-scroll snap-x snap-mandatory">
      <div v-for="carousell in carousells" :key="carousell.id" class="carousel-item flex-shrink-0 w-full snap-start">
        <img :src="carousell.url" :alt="`Image ${carousell.id}`" class="w-full h-auto object-cover"/>
      </div>
    </div>
    <button @click="prev" class="absolute font-bold left-0 top-1/2 transform -translate-y-1/2 text-blue-800 p-2 rounded-full">
      <i class="bi bi-chevron-left"></i>
    </button>
    <button @click="next" class="absolute font-bold right-0 top-1/2 transform -translate-y-1/2 text-blue-500 p-2 rounded-full">
      <i class="bi bi-chevron-right"></i>
    </button>
  </div>
  <div v-else class="text-center text-blue-500 font-semibold">
    No active carousell items found.
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient.js';

const carousells = ref([]);
const error = ref(null);
const carousel = ref(null);

const loadCarousell = async (username) => {
  try {
    const { data: existingCarousel, error: fetchError } = await supabase
      .from('carousell_list')
      .select('*')
      .eq('username', username);

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (existingCarousel) {
      // Filter hanya yang is_active bernilai true
      const activeCarousells = existingCarousel.filter(carousell => carousell.is_active);
      carousells.value = activeCarousells;
    }
  } catch (err) {
    error.value = `Error fetching carousell: ${err.message}`;
    console.error('Error fetching carousell:', err);
  }
};

const prev = () => {
  if (carousel.value) {
    carousel.value.scrollBy({
      left: -carousel.value.clientWidth,
      behavior: 'smooth'
    });
  }
};

const next = () => {
  if (carousel.value) {
    carousel.value.scrollBy({
      left: carousel.value.clientWidth,
      behavior: 'smooth'
    });
  }
};

defineExpose({ loadCarousell });
</script>

<style scoped>
.carousel-container {
  max-width: 600px;
  margin: auto;
}

.carousel {
  scroll-behavior: smooth;
}

.carousel-item {
  min-width: 100%;
}
</style>