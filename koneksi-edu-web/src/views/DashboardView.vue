<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-white to-sky-100 font-cornelia-sans">
    <NavPartial />
    <div class="flex flex-col flex-grow p-4 md:mx-3">
      <main class="w-full">
        <!-- Konten Utama Dashboard -->
        <h1 class="text-2xl py-1 ml-2 border-2 border-gray-200 absolute px-2 text-white bg-blue-400 rounded-md inline-block">Data Diri</h1>
        <div class="border-2 border-gray-200 mt-8 rounded-lg p-4 bg-blue-400 w-full shadow-brutal-blue md:max-w-3xl">
          <p class="text-white">
            <TypewriterComponent :text="[`Selamat datang petualang! Kami menyiapkan halaman khusus untuk menyimpan data diri Anda yang bisa diatur menggunakan halaman ini. Untuk melihat laman diri Anda, silahkan pergi ke: <a target='blank' href='/' class='text-sm bg-white text-blue-500 px-2 rounded-md'>www.coba.com</a>`]" />

          </p>
        </div>
        <div class="bg-blue-300 rounded-lg px-4 py-2 mt-6 text-center">
          <p class="text-white text-lg">Umum</p>
        </div>
        <div class="flex justify-center items-center mt-4">
          <div class="bg-gradient-to-t from-blue-800 to-blue-500 border-2 border-gray-300 text-white p-8 rounded-lg w-90">
            <h2 class="text-2xl text-center mb-4">Ubah Data Diri</h2>
            <form @submit.prevent="handleSubmit">
              <div class="mb-4">
                <p class="text-white text-center">Upload gambar dengan ukuran maksimal 300kb</p>
                <label for="image" class="text-3xl block mb-2 text-center font-bold">
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
      </main>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient.js';
import NavPartial from '@/components/NavPartial.vue';
import TypewriterComponent from '@/components/TypeWriterEffect.vue';
import { useAuthStore } from '@/stores/auth';
import Swal from 'sweetalert2'

export default {
  components: {
    NavPartial,
    TypewriterComponent
  },
  setup() {
    const authStore = useAuthStore();
    const fileName = ref('');
    const file = ref(null);
    const bio = ref('');
    const errorMessage = ref('');
    const uid = ref("")
    const avatarUrl = ref("")

    watch(() => authStore.currentUser, async (newVal) => {
      uid.value = newVal.id
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid.value)
        .single();
      if (profileError) {
        throw profileError;
      }
      avatarUrl.value = profile.avatar_url
      if(profile.bio !== null){
        bio.value = profile.bio
      }
    }, { immediate: true });

    function showUpdateProfileToast() {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Profil berhasil diperbarui.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });
    }

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
          showUpdateProfileToast()
          return
        }

        if (avatarUrl.value != null) {
          const { data, error } = await supabase
            .storage
            .from('avatars')
            .remove([avatarUrl.value])
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

        showUpdateProfileToast()
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return {
      fileName,
      bio,
      errorMessage,
      handleFileChange,
      handleSubmit
    };
  }
};
</script>
