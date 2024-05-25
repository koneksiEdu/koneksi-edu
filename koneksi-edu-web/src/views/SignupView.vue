<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-sm mx-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Daftar</h2>
      <form @submit.prevent="signup" class="space-y-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
          <input
            v-model="confPassword"
            type="password"
            placeholder="Konfirmasi Password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Daftar
          </button>
      </form>
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
      <div class="mt-4 text-center">
      </div>
    </div>
  </div>
</template>
  
<script>
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const confPassword = ref('')
    const authStore = useAuthStore();

    const error = computed(() => authStore.error);

    const signup = () => {
      authStore.signup(email.value, password.value, confPassword.value);
    };

    return {
      email,
      password,
      confPassword,
      signup,
      error,
    };
  },
};
</script>