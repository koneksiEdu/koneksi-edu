<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-white to-sky-100 font-cornelia-sans">
    <NavPartial />
    <div class="flex flex-col flex-grow p-4 md:mx-3">
      <main class="w-full">
        <!-- Konten Utama Dashboard -->
        <h1 class="text-2xl py-1 ml-2 border-2 border-gray-200 absolute px-2 text-white bg-blue-400 rounded-md inline-block">Data Diri</h1>
        <div class="border-2 border-gray-200 mt-8 rounded-lg p-4 bg-blue-400 w-full shadow-brutal-blue md:max-w-3xl">
          <p class="text-white">
            <TypewriterComponent :text="[`Selamat datang petualang! Kami menyiapkan halaman khusus untuk menyimpan data diri Anda yang bisa diatur menggunakan halaman ini. Anda juga bisa menambahkan tautan di halaman ini, bisa digunakan untuk landing page atau portofolio instan. Untuk melihat laman diri Anda, silahkan pergi ke: <a target='blank' href='/' class='text-sm bg-white text-blue-500 px-2 rounded-md'>www.coba.com</a>`]" />
          </p>
        </div>
        <div class="flex justify-center items-center mt-6">
          <div class="bg-gradient-to-t from-blue-800 to-blue-500 border-2 border-gray-300 text-white p-8 rounded-lg w-90">
            <h2 class="text-2xl text-center mb-4">Ubah Data Diri</h2>
            <form @submit.prevent="handleSubmit">
              <div class="mb-4">
                <p class="text-white text-center">Upload gambar dengan ukuran maksimal 300kb untuk foto profil</p>
                <label for="image" class="text-3xl block mb-2 text-center font-bold animate__animated animate__pulse animate__slow animate__infinite">
                  <i class="bi bi-box-arrow-in-down"></i>
                </label>
                <input type="file" id="image" name="image" class="hidden" @change="handleFileChange">
                <p v-if="fileName" class="text-white text-center mt-2">{{ fileName }}</p>
              </div>
              <div class="mb-4">
                <label for="bio" class="block mb-2">Update Bio</label>
                <textarea id="bio" name="bio" v-model="bio" class="w-full text-blue-800 px-4 py-2 rounded-md bg-white focus:outline-none focus:bg-blue-100" rows="4"></textarea>
              </div>
              <button type="submit" class="w-full bg-white text-blue-500 hover:bg-blue-100 py-2 px-4 rounded-md focus:outline-none">Simpan</button>
              <p v-if="errorMessage" class="text-white mt-2">{{ errorMessage }}</p>
            </form>
          </div>
        </div>
        <div class="container mx-auto">
          <div class="mt-6 text-center space-x-1 space-y-1">
            <button @click="openModal('button')" class="border-2 rounded-full border-gray-200 bg-blue-800 text-white px-4 py-2">Tambah Link <i class="bi bi-plus text-white"></i></button>
            <button @click="openModal('header')" class="border-2 rounded-full border-gray-200 bg-blue-800 text-white px-4 py-2">Tambah Header <i class="bi bi-plus text-white"></i></button>
          </div>
          <draggable class="mt-4" v-if="links.length > 0" v-model="links" @end="updatePositions" :itemKey="'id'">
            <template #item="{ element, index }">
              <div class="card bg-white shadow-md p-4 mb-4 rounded">
                <div v-if="element.type === 'button'">
                  <h3 class="text-blue-800">{{ element.title }}</h3>
                  <p class="bg-gray-100 rounded-md text-center text-blue-500 mt-2">{{ element.url }}</p>
                </div>
                <div v-else-if="element.type === 'header'">
                  <h3 class="text-blue-800">{{ element.title }}</h3>
                </div>
                <div class="flex justify-between items-center mt-2">
                  <div class="space-x-1">
                    <button @click="openModal(element.type, element, index)" class="bg-blue-500 text-white px-2 py-1 rounded"><i class="bi bi-pencil-square"></i></button>
                    <button @click="deleteLink(index)" class="bg-blue-800 text-blue-100 px-2 py-1 rounded"><i class="bi bi-trash"></i></button>
                  </div>
                  <div>
                    <input :id="'toggle-' + element.id" type="checkbox" class="hidden" v-model="element.isActive">
                    <label :for="'toggle-' + element.id" class="flex items-center cursor-pointer">
                      <div class="relative">
                        <div :class="['block w-14 h-8 rounded-full', element.isActive ? 'bg-indigo-600' : 'bg-gray-300']"></div>
                        <div :class="['dot absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition transform', element.isActive ? 'translate-x-6' : '']"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
          <p v-else class="text-center mt-4 text-blue-500">Belum ada tautan maupun header. Tambahkan dengan klik tombol di atas.</p>
        </div>
        <!-- Modal Form -->
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-white p-4 rounded-lg w-80">
            <h2 class="text-blue-800 text-xl mb-4">{{ modalType === 'button' ? 'Tambah Link' : 'Tambah Header' }}</h2>
            <form @submit.prevent="handleModalSubmit">
              <div class="mb-4">
                <label for="modalTitle" class="block text-blue-800 mb-2">Judul</label>
                <input type="text" id="modalTitle" v-model="modalTitle" class="w-full text-blue-800 px-4 py-2 rounded-md bg-gray-100 focus:outline-none">
              </div>
              <div v-if="modalType === 'button'" class="mb-4">
                <label for="modalUrl" class="block mb-2 text-blue-800">URL</label>
                <input placeholder="https://contoh.com" type="text" id="modalUrl" v-model="modalUrl" class="w-full text-blue-800 px-4 py-2 rounded-md bg-gray-100 focus:outline-none">
              </div>
              <div v-if="modalError" class="text-blue-500 mb-4">{{ modalError }}</div>
              <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none mt-2">Simpan</button>
              <button @click="closeModal" type="button" class="w-full mt-2 bg-blue-800 text-blue-100 py-2 px-4 rounded-md focus:outline-none">Batal</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>


<script>
import { ref, watch, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient.js';
import NavPartial from '@/components/NavPartial.vue';
import TypewriterComponent from '@/components/TypeWriterEffect.vue';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2';
import draggable from 'vuedraggable';

export default {
  components: {
    NavPartial,
    TypewriterComponent,
    draggable
  },
  setup() {
    const authStore = useAuthStore();
    const fileName = ref('');
    const file = ref(null);
    const bio = ref('');
    const errorMessage = ref('');
    const uid = ref('');
    const avatarUrl = ref('');
    const links = ref([]);

    const isModalOpen = ref(false);
    const modalType = ref('');
    const modalTitle = ref('');
    const modalUrl = ref('');
    const editingIndex = ref(null);
    const modalError = ref('');

    watch(() => authStore.currentUser, async (newVal) => {
      if (newVal) {
        uid.value = newVal.id;
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', uid.value)
            .single();
          if (profileError) {
            throw profileError;
          }
          avatarUrl.value = profile.avatar_url;
          bio.value = profile.bio || '';
          fetchLinks(); // Fetch links after user ID is set
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    }, { immediate: true });

    const fetchLinks = async () => {
      const { data, error } = await supabase
        .from('links')
        .select('link_values')
        .eq('user_id', uid.value);
      if (error) {
        console.error("Error fetching links:", error);
      } else {
        if (data.length > 0) {
          links.value = data.map((item) => item.link_values).flat();
        } else {
          console.warn("No links found for the given user ID.");
        }
      }
    };

    const openModal = (type, element = null, index = null) => {
      modalType.value = type;
      if (element) {
        modalTitle.value = element.title;
        modalUrl.value = element.url || '';
        editingIndex.value = index;
      } else {
        modalTitle.value = '';
        modalUrl.value = '';
        editingIndex.value = null;
      }
      modalError.value = ''; // Reset modal error
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      modalTitle.value = '';
      modalUrl.value = '';
      editingIndex.value = null;
      modalError.value = '';
    };

    const validateModal = () => {
      if (!modalTitle.value.trim()) {
        modalError.value = 'Title cannot be empty.';
        return false;
      }
      if (modalType.value === 'button' && !modalUrl.value.trim()) {
        modalError.value = 'URL cannot be empty.';
        return false;
      }
      if (modalType.value === 'button' && !isValidUrl(modalUrl.value)) {
        modalError.value = 'URL format is invalid.';
        return false;
      }
      modalError.value = '';
      return true;
    };

    const isValidUrl = (url) => {
      const urlPattern = new RegExp(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/);
      return !!urlPattern.test(url);
    };

    const handleModalSubmit = () => {
      if (!validateModal()) {
        return;
      }
      const newLink = {
        id: editingIndex.value !== null ? links.value[editingIndex.value].id : Date.now(),
        title: modalTitle.value,
        type: modalType.value,
        ...(modalType.value === 'button' && { url: modalUrl.value }),
      };
      if (editingIndex.value !== null) {
        links.value.splice(editingIndex.value, 1, newLink);
      } else {
        links.value.push(newLink);
      }
      saveLinks();
      closeModal();
    };

    const deleteLink = (index) => {
      links.value.splice(index, 1);
      saveLinks();
    };

    const updatePositions = () => {
      saveLinks();
    };

    const saveLinks = async () => {
      try {
        const { error } = await supabase
          .from('links')
          .upsert({ user_id: uid.value, link_values: links.value }, { onConflict: ['user_id'] });
        if (error) {
          console.error("Error saving links:", error);
        }
      } catch (error) {
        console.error("Unexpected error saving links:", error);
      }
    };

    onMounted(fetchLinks);

    const showUpdateProfileToast = () => {
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
        title: 'Profil berhasil diperbarui'
      });
    };

    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.size <= 300 * 1024) { // 300kb
        fileName.value = selectedFile.name;
        file.value = selectedFile;
        errorMessage.value = '';
      } else {
        errorMessage.value = 'Ukuran file melebihi 300kb.';
      }
    };

    const handleSubmit = async () => {
      try {
        if (!file.value) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ bio: bio.value })
            .eq('id', uid.value);
          if (updateError) {
            throw updateError;
          }
          showUpdateProfileToast();
          return;
        }

        if (avatarUrl.value) {
          const { error } = await supabase
            .storage
            .from('avatars')
            .remove([avatarUrl.value]);
          if (error) {
            throw error;
          }
        }

        const fileExt = file.value.name.split('.').pop();
        const filePath = `${uid.value}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file.value, {
            upsert: false,
            cacheControl: '3600',
          });

        if (uploadError) {
          throw uploadError;
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ bio: bio.value, avatar_url: filePath })
          .eq('id', uid.value);

        if (updateError) {
          throw updateError;
        }

        showUpdateProfileToast();
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return {
      fileName,
      bio,
      errorMessage,
      handleFileChange,
      handleSubmit,
      links,
      deleteLink,
      updatePositions,
      isModalOpen,
      modalType,
      modalTitle,
      modalUrl,
      handleModalSubmit,
      closeModal,
      openModal,
      modalError
    };
  }
};
</script>


<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
.card {
  cursor: grab;
}
</style>
saat toggle dihidupkan hanya mengubah nilai isActive.value di local saja,tidak mengubah di supabase