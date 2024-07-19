import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient';
import Swal from 'sweetalert2'
import router from '@/router';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: {}
  }),
  getters: {
    itemCount: (state) => {
      return state.cart?.barang?.length || 0;
    }
  },
  actions: {
    getItemFromCart( username ) {
      const cart = JSON.parse(localStorage.getItem('cart')) || {};
      if (cart[username] && cart[username].barang) {
        return  cart[username].barang.length;
      } else {
        return 0
      }
    },
  }
});

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
    async signup(mail, pass, npass) {
      if (pass === npass){
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
            html: "<span class='text-blue-600'>Pendaftaran berhasil, silahkan cek email kamu untuk konfirmasi!</span>",
            icon: "success",
            iconColor: "#3b82f6",
            showCancelButton: false,
            confirmButtonColor: '#3b82f6',
            customClass: {
              title: 'text-blue-700',
            }
          });
        }
      } else{
        this.error = "Pastikan password dan konfirmasi sama!"
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
          html: `<span class="text-blue-600">Email atur ulang password telah dikirim ke ${email}.</span>`,
          icon: "success",
          iconColor: "#3b82f6",
          showCancelButton: false,
          confirmButtonColor: '#3b82f6',
          customClass: {
            title: 'text-blue-700',
          }
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
          title: 'Login berhasil! Kamu akan diarahkan ke dashboard'
        })
        router.push("/dashboard")
      }
    },
    async logout() {
      await supabase.auth.signOut();
      this.user = null;
    },
  },
});