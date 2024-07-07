<template>
  <div>
    <button @click="setUserLocation" class="btn-location">Lokasi Saya</button>
    <div class="rounded-md" id="map"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import L from 'leaflet';

export default {
  name: 'SelectLoc',
  setup(props, { emit }) {
    const map = ref(null);
    const marker = ref(null);

    const onMapClick = (e) => {
      if (marker.value) {
        map.value.removeLayer(marker.value);
      }
      marker.value = L.marker(e.latlng).addTo(map.value);
      emit('location-selected', e.latlng);
    };

    const setUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const userLatLng = L.latLng(latitude, longitude);
            if (marker.value) {
              map.value.removeLayer(marker.value);
            }
            marker.value = L.marker(userLatLng).addTo(map.value);
            map.value.setView(userLatLng, 15);
            emit('location-selected', userLatLng);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    onMounted(() => {
      map.value = L.map('map').setView([-2.5, 118.0], 4);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);

      map.value.on('click', onMapClick);
    });

    return {
      map,
      marker,
      setUserLocation,
    };
  },
};
</script>

<style scoped>
#map {
  height: 240px;
  width: 240px;
  margin: 0 auto;
}

.btn-location {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: 2px solid white;
  border-radius: 5px;
  cursor: pointer;
}

.btn-location:hover {
  background-color: #0056b3;
}
</style>