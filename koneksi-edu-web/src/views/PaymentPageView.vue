<template>
  <div :style="cssVariables" class="flex justify-center min-h-screen bg-gray-100 py-6">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 class="my-text text-2xl font-semibold mb-4">Pembayaran</h2>
      <form @submit.prevent="submitPayment">
        <div class="mb-4">
          <label for="nama" class="my-text block font-bold mb-2">Nama</label>
          <input
            type="text"
            id="nama"
            v-model="nama"
            @blur="validateNama"
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.nama" class="text-sm mt-1">{{ errors.nama }}</p>
        </div>
        <div class="mb-4">
          <label for="alamat" class="my-text block font-bold mb-2">Alamat</label>
          <input
            type="text"
            id="alamat"
            v-model="alamat"
            @blur="validateAlamat"
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.alamat" class="text-sm mt-1">{{ errors.alamat }}</p>
        </div>
        <div class="mb-4">
          <label for="keterangan" class="my-text block font-bold mb-2">Keterangan Tambahan</label>
          <textarea
            id="keterangan"
            v-model="keterangan"
            class="resize-vertical w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div class="mb-6">
          <h3 class="my-text text-xl font-semibold mb-2">Informasi Item</h3>
          <ul>
            <li v-for="(item, index) in cartItems" :key="index" class="flex my-text font-semibold justify-between items-center bg-gray-200 p-2 rounded-lg mb-2">
              <span>{{ item.judul }} x {{ item.jumlah }}</span>
              <span>{{ formatPrice(item.harga) }}</span>
            </li>
          </ul>
          <div class="flex justify-between items-center mt-4">
            <span class="text-lg font-semibold">Total: {{ formatPrice(totalPrice) }}</span>
          </div>
        </div>
        <button type="submit" class="myBtn text-white px-4 py-2 rounded-lg">
          Beli
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabaseClient.js';
import axios from 'axios';
import Swal from 'sweetalert2'

const route = useRoute();
const username = ref(route.params.id);

const nama = ref('');
const alamat = ref('');
const keterangan = ref('');
const cartItems = ref([]);
const totalPrice = ref(0);
const errors = ref({ nama: '', alamat: '' });
const phone = ref("")
const token = import.meta.env.VITE_TELEGRAM_BOT;
const bgColor = ref({});
const textColor = ref("")
const btnBgColor = ref({})

const fetchDisplay = async (user) => {
  try {
    const { data: display, error: displayError } = await supabase
      .from('display')
      .select('*')
      .eq('username', user)
      .single();
    if (displayError) {
      throw displayError;
    }
    bgColor.value = {
      bgColor1: display.bg_color1,
      bgColor2: display.bg_color2,
    };
    textColor.value = display.text_color
    btnBgColor.value = {
      color1: display.bg_button,
      color2: display.bg_hover
    }
  } catch (displayError) {
    console.log('Error:', displayError);
  }
};

onMounted( async () =>  {
  getCartData();
  fetchDisplay(username.value)
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username.value)
      .single();
    if (profileError) {
      throw profileError;
    }
    phone.value = profile.chat_id
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
});

const validateNama = () => {
  errors.value.nama = !nama.value ? 'Nama harus diisi' : '';
};

const validateAlamat = () => {
  errors.value.alamat = !alamat.value ? 'Alamat harus diisi' : '';
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price);
}

const getCartData = () => {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || {};
  cartItems.value = storedCart[username.value]?.barang || [];
  totalPrice.value = cartItems.value.reduce((total, item) => total + item.harga * item.jumlah, 0);
};

const submitPayment = async () => {
  validateNama();
  validateAlamat();

  if (!nama.value || !alamat.value) {
    return;
  }

  const itemsDescription = cartItems.value
    .map(item => `${item.judul} x ${item.jumlah} - ${formatPrice(item.harga)}`)
    .join('\n'); // Menggunakan '\n' untuk baris baru

  const message = `Nama: ${nama.value}\nAlamat: ${alamat.value}\nKeterangan: ${keterangan.value}\nItem:\n${itemsDescription}\nTotal: ${formatPrice(totalPrice.value)}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: phone.value,
      text: message
    });
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
      title: 'Pesanan terkirim, tunggu konfirmasi dari penjual!'
    })
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const cssVariables = computed(() => ({
  '--bg-color1': bgColor.value.bgColor1,
  '--bg-color2': bgColor.value.bgColor2,
  '--text-color': textColor.value,
  '--btn-main': btnBgColor.value.color1,
  '--btn-hover': btnBgColor.value.color2
}));
</script>

<style scoped>
.my-text {
  color: var(--text-color)
}

.myBtn {
  background-color: var(--btn-main);
}

.myBtn:hover {
  background-color: var(--btn-hover);
}
</style>