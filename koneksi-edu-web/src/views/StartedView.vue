<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md mx-6">
      <h2 class="text-2xl font-bold mb-6">Buat Halamanmu</h2>
      <form @submit.prevent="createProfile">
        <div class="mb-4">
          <label class="block text-gray-700">Pilih username untuk pixelink kamu:</label>
          <p class="break-words text-sm font-semibold text-blue-300 p-2 bg-gray-100">{{ webUrl }}/{{ username }}</p>
          <input 
            v-model="username" 
            type="text" 
            class="w-full mt-2 p-2 border border-gray-300 rounded"
            required
            @blur="checkUsername"
          />
        </div>
        <button 
          type="submit" 
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Buat Halaman
        </button>
        <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient.js'
import { useAuthStore } from '@/stores/stores';
import Swal from 'sweetalert2'
import router from '@/router';

export default {
  setup() {
    const username = ref('')
    const errorMessage = ref('')
    const user = ref([])
    const authStore = useAuthStore();
    const isUsernameTaken = ref(false)

    const checkUsername = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.value)
      
      if (error) {
        console.error('Error check username:', error)
      } else {
        isUsernameTaken.value = data.length > 0
      }
    }

    const createProfile = async () => {
      user.value = authStore.currentUser

      // Validasi username sebelum mengirim ke backend
      const usernameRegex = /^[a-zA-Z0-9]+$/
      if (!usernameRegex.test(username.value)) {
        errorMessage.value = "Username hanya boleh terdiri dari huruf dan angka tanpa spasi."
        return
      }


      const { data, error } = await supabase
        .from('profiles')
        .update([
          {
            username: username.value,
            email: user.value.email
          }
        ])
        .eq('id', user.value.id)

      if (error) {
        errorMessage.value = error.message
        
        if (isUsernameTaken.value) {
          errorMessage.value = 'Username sudah ada silahkan bikin yang lain!'
          return
        }
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            title: 'text-blue-800 font-light',
            timerProgressBar: 'bg-blue-800',
          },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
        });
        Toast.fire({
          title: 'Ubah password berhasil! Kamu akan diarahkan ke halaman dashboard'
        })
        router.push("/dashboard")
      }
    }
    return {
      username,
      errorMessage,
      user,
      createProfile,
      isUsernameTaken,
      checkUsername,
      webUrl: import.meta.env.VITE_WEB_URL
    }
  }
}
</script>