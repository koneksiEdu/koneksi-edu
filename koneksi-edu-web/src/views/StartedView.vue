<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">Create Profile</h2>
    <form @submit.prevent="createProfile">
      <div class="mb-4">
        <label class="block text-gray-700">Username</label>
        <input 
          v-model="username" 
          type="text" 
          class="w-full mt-2 p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <button 
        type="submit" 
        class="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      >
        Create Profile
      </button>
      <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient.js'
import { useAuthStore } from '@/stores/auth';


export default {
  setup() {
    const username = ref('')
    const errorMessage = ref('')
    const user = ref([])
    const authStore = useAuthStore();

    const createProfile = async () => {
      user.value = authStore.currentUser
      if (!user.value) {
        errorMessage.value = "You need to be logged in to create a profile."
        return
      }

      // Validasi username sebelum mengirim ke backend
      const usernameRegex = /^[a-zA-Z0-9]+$/
      if (!usernameRegex.test(username.value)) {
        errorMessage.value = "Username can only contain letters and numbers without spaces."
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.value.id,
            username: username.value,
          }
        ])

      if (error) {
        errorMessage.value = error.message
      } else {
        // Handle successful profile creation (e.g., redirect or show success message)
      }
    }

    return {
      username,
      errorMessage,
      user,
      createProfile
    }
  }
}
</script>