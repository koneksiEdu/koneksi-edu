import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient';
import Swal from 'sweetalert2'
import router from '@/router';

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
          emailRedirectTo: `${import.meta.env.VITE_WEB_URL}/start`,
        },
      });
      if (error) {
        this.error = error.message;
      } else {
        this.error = null;
        this.user = user;
        Swal.fire({
          title: "Daftar",
          text: "Pendaftaran berhasil, silahkan cek email kamu untuk konfirmasi!",
          icon: "success"
        });
      }
    },
    async resetPassword(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_WEB_URL}/reset-pass`
      });
      if (error) {
        this.error = error.message;
      } else {
        Swal.fire({
          title: "Ubah Password",
          text: `Email atur ulang password telah dikirim ke ${email}.`,
          icon: "success"
        });
      }
    },
    async cgPass(pass, npass) {
      if (pass === npass){
        const { error } = await supabase.auth.updateUser({
          password: npass
        })
        if (error) {
          this.error = error.message;
        } else {
          Swal.fire({
            title: "Ubah Password",
            text: "Ubah password berhasil! Kamu akan diarahkan ke halaman login",
            icon: "success"
          });
          router.push("/login")
        }
      } else {
        this.error = "Pastikan password baru dan konfirmasi sama!"
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
        Swal.fire({
          title: "Login",
          text: "Login berhasil! Kamu akan diarahkan ke dashboard",
          icon: "success"
        });
        router.push("/")
      }
    },
    async logout() {
      await supabase.auth.signOut();
      this.user = null;
    },
  },
});
