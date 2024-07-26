<template>
  <div class="mt-2 animate__animated animate__fadeIn relative" v-if="isExist">
    <h1 class="text-2xl font-bold text-center my-text mb-2">
      Lokasi Kami
    </h1>
    <div class="absolute bottom-0 w-full text-center bg-white p-1 font-semibold my-text rounded-lg" style="z-index:100000;">
      {{ address }}
    </div>
    <div class="rounded-lg" id="map" style="height:240px"></div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import L from 'leaflet';
import { supabase } from '@/lib/supabaseClient.js';

defineProps({
  props:{
    cssVariables: Object
  }
})

const map = ref(null);
const isExist = ref(false);
const address = ref(null);

const checkMap = async (username) => {
  const { data: existingLocation } = await supabase
    .from('user_location')
    .select('*')
    .eq('username', username)
    .single();

  if (existingLocation) {
    if (existingLocation.is_active) {
      isExist.value = true;
      address.value = existingLocation.address;
      await nextTick(); // Wait for the DOM to update
      const userLatLng = L.latLng(existingLocation.latitude, existingLocation.longitude);
      map.value = L.map('map').setView(userLatLng, 16);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);
      L.marker(userLatLng).addTo(map.value);
    }
  }
};

defineExpose({ checkMap });
</script>

<style scoped>
#map {
  height: 240px;
  position: relative;
}
.my-text {
  color: var(--text-color)
}
</style>