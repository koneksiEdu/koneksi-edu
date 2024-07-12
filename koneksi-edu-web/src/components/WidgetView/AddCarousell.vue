<template>
  <button
    class="mt-2 font-semibold w-full bg-white text-blue-500 hover:bg-blue-100 py-2 px-4 rounded-md focus:outline-none"
    @click="openModal(null)"
  >
    Tambah Carousell
  </button>

  <!-- List of Carousel Links -->
  <div v-for="(link, index) in carouselLinks" :key="link.id" class="mt-4 p-6 bg-white shadow-md p-4 mb-4 rounded">   
      <div class="bg-gray-200 rounded-lg p-1">
        <a :href="link.url" target="_blank" class="font-semibold text-sm px-1 text-blue-500 mt-2">{{ link.url }}</a>
      </div>
      <div class="mt-2 flex justify-between">
        <div class="space-x-1">
          <button @click="openModal(link)" class="bg-blue-500 text-white px-2 py-1 rounded"><i class="bi bi-pencil-square"></i></button>
          <button @click="showDeleteModal(link.url)" class="bg-blue-500 text-white px-2 py-1 rounded"><i class="bi bi-trash"></i></button>
        </div>
        <span v-if="link.is_active" class="bg-blue-500 text-white px-2 py-1 rounded-full"><i class="bi bi-lightbulb-fill"></i></span>  
        <span v-else class="bg-blue-300 text-white px-2 py-1 rounded-full"><i class="bi bi-lightbulb-off-fill"></i></span>
      </div>
  </div>

  <!-- Modal -->
  <div v-if="isModalOpen" style="z-index: 1000;" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-4 rounded-lg w-80">
      <h2 class="text-blue-800 text-xl mb-4 font-semibold text-center">Carousell</h2>
      <form @submit.prevent="handleModalSubmit">
        <div class="mb-4">
          <label for="modalUrl" class="block mb-2 text-blue-800">URL</label>
          <input placeholder="https://contoh.com/contoh.jpg" type="text" id="modalUrl" v-model="modalUrl" class="w-full text-blue-800 px-4 py-2 rounded-md bg-gray-100 focus:outline-none">
          <p>Masukan url direct gambar</p>
        </div>
        <input id="modalCheckisActive" type="checkbox" class="hidden" v-model="modalCheckisActive">
        <label for="modalCheckisActive" class="flex items-center cursor-pointer">
          <div class="relative">
            <div :class="['block w-14 h-8 rounded-full', modalCheckisActive ? 'bg-indigo-600' : 'bg-gray-300']"></div>
            <div :class="['dot absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition transform', modalCheckisActive ? 'translate-x-6' : '']"></div>
          </div>
        </label>
        <div v-if="modalError" class="text-blue-500 mb-4">{{ modalError }}</div>
        <button type="submit" class="font-semibold w-full bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none mt-2">Simpan</button>
        <button @click="closeModal" type="button" class="font-semibold w-full mt-2 bg-blue-800 text-blue-100 py-2 px-4 rounded-md focus:outline-none">Batal</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient.js';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';

export default {
  name: 'AddCarousell',
  setup() {
    const isModalOpen = ref(false);
    const modalUrl = ref('');
    const modalError = ref('');
    const modalCheckisActive = ref(false);
    const editingIndex = ref(null);
    const carouselLinks = ref([]);
    const uid = ref(null);
    const authStore = useAuthStore();

    const fetchCarouselLinks = async () => {
      try {
        let { data, error } = await supabase
          .from('carousell_list')
          .select('*')
          .eq('user_id', uid.value.id);

        if (error) throw error;

        carouselLinks.value = data;
      } catch (error) {
        console.error('Error fetching carousel links:', error);
      }
    };

    watch(() => authStore.currentUser, async (newVal) => {
      if (newVal) {
        let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newVal.id)
          .single();

        if(error) throw error;
        uid.value = data
        await fetchCarouselLinks();
      }
    }, { immediate: true });

    const openModal = (element) => {
      if (element) {
        modalUrl.value = element.url;
        modalCheckisActive.value = element.is_active;
        editingIndex.value = element.id;
      } else {
        modalUrl.value = '';
        modalCheckisActive.value = false;
        editingIndex.value = null;
      }
      modalError.value = '';
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      modalUrl.value = '';
      modalCheckisActive.value = false;
      modalError.value = '';
    };

    const validateModal = () => {
      if (!modalUrl.value.trim()) {
        modalError.value = 'URL tidak boleh kosong.';
        return false;
      }
      if (!isValidUrl(modalUrl.value)) {
        modalError.value = 'URL format tidak valid.';
        return false;
      }
      modalError.value = '';
      return true;
    };

    const isValidUrl = (url) => {
      const urlPattern = new RegExp(/^(https?:\/\/)(www\.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(\/[a-zA-Z0-9#_.-]+)*(\/[a-zA-Z0-9#_.-]*)?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)*$/);
      return !!urlPattern.test(url);
    };

    const handleModalSubmit = async () => {
      if (!validateModal()) return;

      const newLink = {
        user_id: uid.value.id,
        is_active: modalCheckisActive.value,
        url: modalUrl.value,
        username: uid.value.username,
      };

      try {
        if (editingIndex.value) {
          const { error } = await supabase
            .from('carousell_list')
            .update(newLink)
            .eq('id', editingIndex.value);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('carousell_list')
            .insert([newLink]);

          if (error) throw error;
        }

        await fetchCarouselLinks();
        closeModal();
      } catch (error) {
        console.error('Error saving link:', error);
      }
    };

    const showDeleteModal = (url) => {
      Swal.fire({
        title: 'Konfirmasi Hapus',
        html: '<span class="text-blue-600">Apakah Anda yakin ingin menghapus item ini?</span>',
        icon: 'warning',
        iconColor: "#3b82f6",
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#1e40af',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
        customClass: {
            title: 'text-blue-700',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          deleteLink(url)
        }
      });
    };

    const deleteLink = async (url) => {
      try {
        const { error } = await supabase
          .from('carousell_list')
          .delete()
          .eq('url', url);

        if (error) throw error;

        await fetchCarouselLinks();
      } catch (error) {
        console.error('Error deleting link:', error);
      }
    };

    return {
      isModalOpen,
      modalUrl,
      modalCheckisActive,
      handleModalSubmit,
      closeModal,
      openModal,
      modalError,
      carouselLinks,
      deleteLink,
      showDeleteModal
    };
  },
};
</script>

<style>
.dot {
  transition: transform 0.3s ease;
}
</style>
