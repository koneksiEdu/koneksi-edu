<template>
  <div>
    <div v-if="existingData" class="flex items-center justify-center mt-4">
      <form @submit.prevent="saveAddress" class="flex items-center">
        <input
          v-model="address"
          type="text"
          placeholder="Masukan alamat"
          class="form-input px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          class="ml-2 bg-blue-500 font-semibold text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ubah
        </button>
      </form>
    </div>
    <button @click="setUserLocation" class="btn-location">
      <i class="bi bi-crosshair"></i>
    </button>
    <div class="rounded-md" id="map"></div>
    <div v-if="existingData" class="flex items-center justify-center mt-4">
      <span class="mr-2">Aktif:</span>
      <button
        @click="toggleActive"
        :class="isActive ? 'bg-blue-500' : 'bg-gray-500'"
        class="toggle-button relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span
          :class="isActive ? 'translate-x-6' : 'translate-x-1'"
          class="toggle-button-thumb inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out"
        ></span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import L from 'leaflet';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

export default {
  name: 'SelectLoc',
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const username = ref(null);
    const map = ref(null);
    const marker = ref(null);
    const existingData = ref(null);
    const isActive = ref(false);
    const address = ref('');

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

    const toggleActive = async () => {
      isActive.value = !isActive.value;
      try {
        const { error: updateError } = await supabase
          .from('user_location')
          .update({ is_active: isActive.value })
          .eq('username', username.value);

        if (updateError) {
          console.error('Error updating active status:', updateError);
          return;
        }

        showUpdateToast('Status aktif berhasil di-update!');
      } catch (error) {
        console.error('Error updating active status:', error);
      }
    };

    const saveAddress = async () => {
      try {
        const { error: updateError } = await supabase
          .from('user_location')
          .update({ address: address.value })
          .eq('username', username.value);

        if (updateError) {
          console.error('Error updating address:', updateError);
          return;
        }

        showUpdateToast('Alamat berhasil di-update!');
      } catch (error) {
        console.error('Error updating address:', error);
      }
    };

    watch(
      () => authStore.currentUser,
      async (newVal) => {
        if (newVal) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newVal.id)
              .single();
            if (profileError) {
              throw profileError;
            }
            username.value = profile.username;
            const { data: existingLocation } = await supabase
              .from('user_location')
              .select('*')
              .eq('username', username.value)
              .single();

            if (existingLocation) {
              existingData.value = existingLocation;
              isActive.value = existingLocation.is_active;
              address.value = existingLocation.address || '';

              // Set map view and marker based on existing location
              const { latitude, longitude } = existingLocation;
              const existingLatLng = L.latLng(latitude, longitude);
              if (marker.value) {
                map.value.removeLayer(marker.value);
              }
              marker.value = L.marker(existingLatLng).addTo(map.value);
              map.value.setView(existingLatLng, 15);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      map.value = L.map('map').setView([-2.5, 118.0], 3);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value);

      map.value.on('click', onMapClick);
    });

    const showUpdateToast = (title) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          title: 'font-cornelia-sans text-blue-800 font-light',
          timerProgressBar: 'bg-blue-800',
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });
      Toast.fire({
        title: title
      });
    };

    const showErrorModal = (icon, text) => {
      Swal.fire({
        title: 'Error',
        html: `<span class="text-blue-600">${text}</span>`,
        icon: icon,
        iconColor: "#3b82f6",
        showCancelButton: false,
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'Oke',
        customClass: {
          title: 'text-blue-700',
        }
      })
    };

    const saveLocation = async (selectedLocation) => {
      if (!selectedLocation) {
        showErrorModal("error", "Tolong pilih lokasi terlebih dahulu!")
        return;
      }

      const { lat: latitude, lng: longitude } = selectedLocation;

      try {
        if (existingData.value) {
          // Update existing location
          const { error: updateError } = await supabase
            .from('user_location')
            .update({ latitude, longitude })
            .eq('username', username.value);

          if (updateError) {
            console.error('Error updating location:', updateError);
            return;
          }
        } else {
          // Insert new location
          const { error: insertError } = await supabase
            .from('user_location')
            .insert([{ username: username.value, latitude, longitude, is_active: false, address: null }]);

          if (insertError) {
            console.error('Error inserting location:', insertError);
            return;
          }
        }
        showErrorModal("success", "Lokasi berhasil disimpan/diupdate, jika toggle belum muncul silahkan refresh halaman untuk aktifkan widget!")
      } catch (error) {
        console.error('Error saving location:', error);
      }
    };

    return {
      map,
      marker,
      setUserLocation,
      saveLocation,
      existingData,
      isActive,
      toggleActive,
      address,
      saveAddress
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
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
}

.btn-location:hover {
  background-color: #0056b3;
}

.toggle-button {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
}

.toggle-button-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s ease-in-out;
}

.bg-gray-500 {
  background-color: #a0aec0;
}

.bg-blue-500 {
  background-color: #4299e1;
}

.form-input {
  color: #3a3aa3;
  width: 200px;
  padding: 8px;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.bg-blue-500 {
  background-color: #4299e1;
}

.bg-blue-700 {
  background-color: #2b6cb0;
}
</style>