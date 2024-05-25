<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md mx-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="login" class="space-y-4">
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
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Login
          </button>
      </form>
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
      <div class="mt-4 text-center">
        <button @click="toSingnUp" class="text-blue-500 hover:underline">Belum punya akun?</button>
      </div>
      <div class="mt-4 text-center">
        <button @click="toForgot" class="text-blue-500 hover:underline">Lupa password?</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import router from '@/router';
import Swal from 'sweetalert2'
  
export default {
  setup() {
      const email = ref('');
      const password = ref('');
      const authStore = useAuthStore();

      const error = computed(() => authStore.error);

      const login = async () => {
        authStore.login(email.value, password.value);
      };

      const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
      };
      
      const toForgot = async () => {
        const { value: email } = await Swal.fire({
          title: 'Reset Password',
          input: 'email',
          inputLabel: 'Masukan email kamu',
          inputPlaceholder: 'contoh@mail.com',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'Email tidak boleh kosong!';
            }
            if (!isValidEmail(value)) {
              return 'Masukan email yang valid!';
            }
          }
        });
        if (email) {
          await authStore.resetPassword(email);
        }
      };

      const toSingnUp = () => {
        authStore.error = ""
        router.push("/signup")        
      }

      return {
        email,
        password,
        login,
        error,
        toSingnUp,
        toForgot
      };
  },
};
</script>