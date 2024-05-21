import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
  }),
  getters: {
    currentUser(state) {
      return state.user;
    },
  },
  actions: {
    async fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      this.user = data?.user || null;
      if(error){
        console.log(error.message)
      }
    },
    async signup(mail, pass) {
      const { user, error } = await supabase.auth.signUp({
        email: mail,
        password: pass,
        options: {
          emailRedirectTo: 'http://localhost:5173/start',
        },
      });
      if (error) {
        this.error = error.message;
      } else {
        this.error = null;
        this.user = user;
        alert('Pendaftaran berhasil, silahkan cek email kamu untuk konfirmasi! Mohon jangan tutup halaman ini saat konfirmasi email.');
      }
    },
    async resetPassword(email) {
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);
      if (error) {
        this.error = error.message;
      } else {
        alert(`Email atur ulang password telah dikirim ke ${email}.`);
      }
    },
    async login(mail, pass) {
      const { user, error } = await supabase.auth.signInWithPassword({ 
        email: mail, 
        password: pass, 
      });
      if (error) {
        this.error = error.message;
        console.log(error.message);
      } else {
        this.error = null;
        this.user = user;
        alert('Login berhasil!');
      }
    },
    async logout() {
      await supabase.auth.signOut();
      this.user = null;
    },
  },
});
