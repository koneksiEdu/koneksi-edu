<template>
  <div v-if="isImagesLoaded" class="relative animate__animated animate__fadeIn carousel-container">
    <h1 class="text-2xl font-bold text-center text-blue-700 mb-2">
      Galeri
    </h1>
    <div ref="carousel" class="carousel flex overflow-x-scroll snap-x snap-mandatory">
      <div v-for="carousell in carousells" :key="carousell.id" class="carousel-item flex-shrink-0 w-full snap-start">
        <img 
          :src="carousell.url" 
          :alt="`Image ${carousell.id}`" 
          class="w-full h-auto object-cover"
        />
      </div>
    </div>
    <button @click="prev" class="absolute font-bold left-0 top-1/2 transform -translate-y-1/2 text-blue-800 p-2 rounded-full">
      <i class="bi bi-chevron-left"></i>
    </button>
    <button @click="next" class="absolute font-bold right-0 top-1/2 transform -translate-y-1/2 text-blue-500 p-2 rounded-full">
      <i class="bi bi-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabaseClient.js';

const carousells = ref([]);
const error = ref(null);
const carousel = ref(null);
const isImagesLoaded = ref(false);

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
      const activeCarousells = existingCarousel.filter(carousell => carousell.is_active);
      carousells.value = activeCarousells;
      if (activeCarousells.length === 0) {
        isImagesLoaded.value = true;
      } else {
        preloadImages(activeCarousells);
      }
    }
  } catch (err) {
    error.value = `Error fetching carousell: ${err.message}`;
    console.error('Error fetching carousell:', err);
  }
};

const preloadImages = (images) => {
  const promises = images.map(image => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = image.url;
      img.onload = resolve;
      img.onerror = reject;
    });
  });

  Promise.all(promises)
    .then(() => {
      isImagesLoaded.value = true;
    })
    .catch((err) => {
      console.error('Error preloading images:', err);
    });
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