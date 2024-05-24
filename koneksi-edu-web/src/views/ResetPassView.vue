<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-sm mx-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Ubah Password</h2>
      <form @submit.prevent="changePass" class="space-y-4">
        <div>
          <input
            v-model="newPassword"
            type="password"
            placeholder="Password Baru"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div>
          <input
            v-model="confirmationPassword"
            type="password"
            placeholder="Konfirmasi Password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Ubah
          </button>
        </div>
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
    const newPassword = ref('');
    const confirmationPassword = ref('');
    const authStore = useAuthStore();

    const error = computed(() => authStore.error);

    const changePass = async () => {
    authStore.cgPass(confirmationPassword.value, newPassword.value)
    };

    return {
      newPassword,
      confirmationPassword,
      changePass,
      error,
    };
  },
};
</script>